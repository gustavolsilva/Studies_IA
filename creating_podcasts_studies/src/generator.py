"""
Podcast Generator Module
========================

Generates audio files from text content using TTS.
"""

import os
import subprocess
from typing import Optional, Tuple
from pathlib import Path


class PodcastGenerator:
    """Generates podcast audio files from text content."""

    def __init__(self, language: str = "pt", speed: int = 150, output_dir: str = "podcast_audios"):
        """
        Initialize the podcast generator.

        Args:
            language: Language code (default: "pt" for Portuguese)
            speed: Speech speed (default: 150)
            output_dir: Output directory for audio files
        """
        self.language = language
        self.speed = speed
        self.output_dir = output_dir
        self._ensure_output_dir()

    def _ensure_output_dir(self) -> None:
        """Create output directory if it doesn't exist."""
        Path(self.output_dir).mkdir(parents=True, exist_ok=True)

    def generate_audio(self, text: str, chapter_number: int) -> Optional[str]:
        """
        Generate audio from text using eSpeak.

        Args:
            text: Text to convert to audio
            chapter_number: Chapter number for file naming

        Returns:
            Path to generated audio file, or None if failed
        """
        output_file = os.path.join(self.output_dir, f'chapter_{chapter_number:02d}.wav')
        
        # Clean text for shell command
        text_clean = text.replace('"', "'").replace('\n', ' ')
        
        # Build eSpeak command
        cmd = f'espeak -v {self.language} -s {self.speed} -w "{output_file}" "{text_clean}"'
        
        try:
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            
            if result.returncode == 0:
                return output_file
            else:
                print(f"Error generating audio for chapter {chapter_number}: {result.stderr}")
                return None
        except Exception as e:
            print(f"Exception generating audio: {e}")
            return None

    def generate_from_chapters(self, chapters: list) -> Tuple[int, int]:
        """
        Generate audio files from a list of chapters.

        Args:
            chapters: List of chapter dictionaries with 'title' and 'content'

        Returns:
            Tuple of (successful_count, total_count)
        """
        successful = 0
        total = len(chapters)
        
        for i, chapter in enumerate(chapters, 1):
            print(f"Generating chapter {i}: {chapter['title']}")
            
            audio_file = self.generate_audio(chapter['content'], i)
            if audio_file:
                print(f"✓ Audio generated: {audio_file}")
                successful += 1
            else:
                print(f"✗ Failed to generate audio for chapter {i}")
            print()
        
        return successful, total

    def set_language(self, language: str) -> None:
        """
        Change the language for speech synthesis.

        Args:
            language: Language code
        """
        self.language = language

    def set_speed(self, speed: int) -> None:
        """
        Change the speech speed.

        Args:
            speed: Speed value
        """
        self.speed = speed

    def get_generated_files(self) -> list:
        """
        Get list of all generated audio files.

        Returns:
            List of audio file paths
        """
        if not os.path.exists(self.output_dir):
            return []
        
        return sorted([
            os.path.join(self.output_dir, f)
            for f in os.listdir(self.output_dir)
            if f.endswith('.wav')
        ])
