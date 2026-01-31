#!/usr/bin/env python3

import argparse
import re
import subprocess
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
CONTENT_DIR = PROJECT_ROOT / "content"
OUTPUT_DIR = PROJECT_ROOT / "output" / "podcast_audios"


def read_script(filepath: Path) -> str:
    """Lê o arquivo de roteiro em markdown."""
    return filepath.read_text(encoding="utf-8")


def extract_chapters(content: str) -> list[dict]:
    """Extrai capítulos a partir de títulos markdown (# ou ##)."""
    chapters = re.split(r"^(#{1,2}\s+.*?)$", content, flags=re.MULTILINE)
    chapters = [ch.strip() for ch in chapters if ch.strip()]

    grouped: list[dict] = []
    for i in range(0, len(chapters), 2):
        if i + 1 < len(chapters):
            title = chapters[i].lstrip("#").strip()
            grouped.append({"title": title, "content": chapters[i + 1].strip()})
        else:
            grouped.append({"title": f"Capítulo {len(grouped) + 1}", "content": chapters[i]})
    return grouped


def generate_audio_chapter(text: str, chapter_number: int, voice: str, speed: int) -> Path | None:
    """Gera um arquivo de áudio WAV para um capítulo usando eSpeak."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_file = OUTPUT_DIR / f"chapter_{chapter_number:02d}.wav"

    text_clean = text.replace('"', "'").replace("\n", " ")
    cmd = [
        "espeak",
        "-v",
        voice,
        "-s",
        str(speed),
        "-w",
        str(output_file),
        text_clean,
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        print(f"✓ Áudio gerado: {output_file.relative_to(PROJECT_ROOT)}")
        return output_file

    print(f"✗ Erro ao gerar capítulo {chapter_number}: {result.stderr}")
    return None


def generate_podcast(script_path: Path | None = None, voice: str = "pt", speed: int = 150) -> list[Path]:
    """Orquestra a geração de áudios a partir do roteiro markdown."""
    script = script_path or (CONTENT_DIR / "podcast_script.md")
    content = read_script(script)
    chapters = extract_chapters(content)

    print(f"Total de capítulos encontrados: {len(chapters)}\n")

    generated: list[Path] = []
    for idx, chapter in enumerate(chapters, start=1):
        print(f"Gerando capítulo {idx}: {chapter['title']}")
        audio = generate_audio_chapter(chapter["content"], idx, voice=voice, speed=speed)
        if audio:
            generated.append(audio)
        print()

    print("✓ Todos os áudios foram gerados.")
    return generated


def main() -> None:
    parser = argparse.ArgumentParser(description="Gerador de podcasts via eSpeak")
    parser.add_argument("--script", type=Path, default=None, help="Caminho para o markdown do roteiro")
    parser.add_argument("--voice", default="pt", help="Voz do eSpeak (ex: pt, pt+f2, en)")
    parser.add_argument("--speed", type=int, default=150, help="Velocidade da fala (padrão: 150)")
    args = parser.parse_args()

    generate_podcast(script_path=args.script, voice=args.voice, speed=args.speed)


if __name__ == "__main__":
    main()
