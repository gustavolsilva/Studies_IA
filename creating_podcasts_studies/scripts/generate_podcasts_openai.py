#!/usr/bin/env python3
"""Gera podcasts usando OpenAI TTS a partir de markdown (ou fallback para PDF)."""

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

from podcast_generator.openai_tts import synthesize_chunks


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


def chunk_text(text: str, max_chars: int = 3000) -> Iterable[str]:
    """Divide texto em blocos menores para segurança de comprimento."""
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
    """Aplica pequenas melhorias de pontuação para fala natural."""
    return text.replace(";", ".")


def generate(script_path: Path | None, prefer_pdf: bool, voice: str, model: str) -> None:
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
        synthesize_chunks(chunks, base_filename=f"chapter_{idx:02d}", voice=voice, model=model)
        print("✓ Concluído\n")

    print("✓ Todos os áudios (MP3) foram gerados em output/podcast_audios/")


def main() -> None:
    # Garante que src esteja no path quando chamado diretamente
    if str(SRC_DIR) not in sys.path:
        sys.path.insert(0, str(SRC_DIR))

    parser = argparse.ArgumentParser(description="Gerador de podcasts com OpenAI TTS")
    parser.add_argument("--script", type=Path, default=None, help="Caminho para markdown do roteiro (opcional)")
    parser.add_argument("--voice", default="alloy", help="Voz TTS (ex: alloy, verse)")
    parser.add_argument("--model", default="gpt-4o-mini-tts", help="Modelo TTS (ex: gpt-4o-mini-tts, tts-1)")
    parser.add_argument("--prefer-pdf", action="store_true", help="Tentar usar PDF como fonte principal")
    args = parser.parse_args()

    generate(script_path=args.script, prefer_pdf=args.prefer_pdf, voice=args.voice, model=args.model)


if __name__ == "__main__":
    main()