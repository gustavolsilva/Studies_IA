"""Geração de áudio usando OpenAI Text-to-Speech (tts-1 ou gpt-4o-mini-tts)."""

from __future__ import annotations

import os
from pathlib import Path
from typing import Iterable

from openai import OpenAI


PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
OUTPUT_DIR = PROJECT_ROOT / "output" / "podcast_audios"


def synthesize_chunks(chunks: Iterable[str], base_filename: str, voice: str = "alloy", model: str = "gpt-4o-mini-tts") -> Path:
    """Gera um único MP3 a partir de vários trechos de texto."""

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("Defina OPENAI_API_KEY no ambiente para usar o TTS da OpenAI.")

    client = OpenAI(api_key=api_key)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUTPUT_DIR / f"{base_filename}.mp3"

    # Concatena os trechos com pausas curtas (ponto + espaço) para manter naturalidade
    text = ". ".join(chunk.strip() for chunk in chunks if chunk.strip())
    if not text:
        raise ValueError("Nenhum texto fornecido para síntese.")

    speech = client.audio.speech.create(
        model=model,
        voice=voice,
        input=text,
        response_format="mp3",
    )

    with open(out_path, "wb") as f:
        f.write(speech.read())

    return out_path


__all__ = ["synthesize_chunks"]