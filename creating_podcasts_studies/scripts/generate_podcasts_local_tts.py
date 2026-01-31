#!/usr/bin/env python3
"""Gera podcasts usando TTS open source (Coqui TTS) a partir de markdown ou PDF."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from typing import Iterable

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = PROJECT_ROOT / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from podcast_generator.tts_local import synthesize_chunks_local

CONTENT_DIR = PROJECT_ROOT / "content"
DEFAULT_MD = CONTENT_DIR / "podcast_script.md"
DEFAULT_PDF = CONTENT_DIR / "Exam_Guide_Databricks_Data_Engineer_Associate_without_pdfs.pdf"


def read_markdown(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def read_pdf(path: Path) -> str:
    try:
        import pypdf
    except ModuleNotFoundError as exc:
        raise RuntimeError("pypdf não instalado; use markdown ou instale pypdf.") from exc

    reader = pypdf.PdfReader(str(path))
    pages = [page.extract_text() or "" for page in reader.pages]
    return "\n".join(pages)


def extract_chapters(content: str) -> list[dict]:
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


def chunk_text(text: str, max_chars: int = 3000) -> Iterable[str]:
    words = text.split()
    chunk, size = [], 0
    for w in words:
        if size + len(w) + 1 > max_chars and chunk:
            yield " ".join(chunk)
            chunk, size = [w], len(w) + 1
        else:
            chunk.append(w)
            size += len(w) + 1
    if chunk:
        yield " ".join(chunk)


def build_spoken_style(text: str) -> str:
    return text.replace(";", ".")


def generate(script_path: Path | None, prefer_pdf: bool, model_name: str, language: str, speaker: str | None) -> None:
    if script_path is None:
        script_path = DEFAULT_MD if DEFAULT_MD.exists() else None
    content_text = ""

    if prefer_pdf and DEFAULT_PDF.exists():
        print("Usando PDF como fonte de conteúdo...")
        content_text = read_pdf(DEFAULT_PDF)
    if not content_text:
        if script_path and script_path.exists():
            print(f"Usando markdown: {script_path}")
            content_text = read_markdown(script_path)
        elif DEFAULT_PDF.exists():
            print("Markdown não encontrado; tentando PDF...")
            content_text = read_pdf(DEFAULT_PDF)
        else:
            raise FileNotFoundError("Nenhum arquivo de conteúdo encontrado (markdown ou PDF).")

    chapters = extract_chapters(content_text)
    print(f"Total de capítulos: {len(chapters)}\n")

    for idx, ch in enumerate(chapters, start=1):
        print(f"Gerando capítulo {idx}: {ch['title']}")
        spoken = build_spoken_style(ch["content"])
        chunks = list(chunk_text(spoken))
        synthesize_chunks_local(
            chunks,
            base_filename=f"chapter_{idx:02d}",
            model_name=model_name,
            language=language,
            speaker=speaker,
        )
        print("✓ Concluído\n")

    print("✓ Todos os áudios (MP3) foram gerados em output/podcast_audios/")


def main() -> None:
    parser = argparse.ArgumentParser(description="Gerador de podcasts com TTS open source (Coqui TTS)")
    parser.add_argument("--script", type=Path, default=None, help="Caminho para markdown do roteiro (opcional)")
    parser.add_argument("--prefer-pdf", action="store_true", help="Tentar usar PDF como fonte principal")
    parser.add_argument(
        "--model",
        default="tts_models/multilingual/multi-dataset/your_tts",
        help="Modelo TTS (ex: tts_models/multilingual/multi-dataset/your_tts ou tts_models/pt/cv/vits)",
    )
    parser.add_argument("--language", default="pt", help="Código de idioma, ex: pt")
    parser.add_argument("--speaker", default=None, help="Identificador de speaker se o modelo suportar")
    args = parser.parse_args()

    generate(
        script_path=args.script,
        prefer_pdf=args.prefer_pdf,
        model_name=args.model,
        language=args.language,
        speaker=args.speaker,
    )


if __name__ == "__main__":
    main()