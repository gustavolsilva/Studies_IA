"""Geração de áudio local (open source) usando Coqui TTS."""

from __future__ import annotations

from pathlib import Path
from typing import Iterable

from TTS.api import TTS


PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
OUTPUT_DIR = PROJECT_ROOT / "output" / "podcast_audios"


def synthesize_chunks_local(
    chunks: Iterable[str],
    base_filename: str,
    model_name: str = "tts_models/multilingual/multi-dataset/your_tts",
    language: str = "pt",
    speaker: str | None = None,
) -> Path:
    """Gera um MP3 local concatenando blocos de texto."""

    text = ". ".join(chunk.strip() for chunk in chunks if chunk.strip())
    if not text:
        raise ValueError("Nenhum texto fornecido para síntese.")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUTPUT_DIR / f"{base_filename}.mp3"

    tts = TTS(model_name=model_name, progress_bar=False, gpu=False)
    tts.tts_to_file(
        text=text,
        file_path=str(out_path),
        speaker=speaker,
        language=language,
    )

    return out_path


__all__ = ["synthesize_chunks_local"]