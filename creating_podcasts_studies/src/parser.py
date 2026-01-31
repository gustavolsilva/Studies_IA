"""
Script Parser Module
====================

Parses markdown scripts into chapters for podcast generation.
"""

import re
from typing import List, Dict, Tuple


class ScriptParser:
    """Parses markdown content into structured chapters."""

    def __init__(self):
        """Initialize the script parser."""
        self.chapters: List[Dict[str, str]] = []

    def parse_file(self, filepath: str) -> List[Dict[str, str]]:
        """
        Read and parse a markdown file.

        Args:
            filepath: Path to the markdown file

        Returns:
            List of chapter dictionaries with title and content
        """
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        return self.parse_content(content)

    def parse_content(self, content: str) -> List[Dict[str, str]]:
        """
        Parse markdown content into chapters.

        Args:
            content: Raw markdown content

        Returns:
            List of chapter dictionaries
        """
        # Split by headers (## or #)
        chapters = re.split(r'^(#{1,2}\s+.*?)$', content, flags=re.MULTILINE)
        
        # Filter empty strings
        chapters = [ch.strip() for ch in chapters if ch.strip()]
        
        # Group title with content
        result = []
        for i in range(0, len(chapters), 2):
            if i + 1 < len(chapters):
                title = chapters[i].replace('#', '').strip()
                chapter_content = chapters[i + 1].strip()
                result.append({
                    'title': title,
                    'content': chapter_content
                })
            elif i < len(chapters):
                result.append({
                    'title': f'Chapter {len(result) + 1}',
                    'content': chapters[i]
                })
        
        self.chapters = result
        return result

    def get_chapter(self, index: int) -> Dict[str, str]:
        """
        Get a specific chapter by index.

        Args:
            index: Chapter index (0-based)

        Returns:
            Chapter dictionary
        """
        if 0 <= index < len(self.chapters):
            return self.chapters[index]
        raise IndexError(f"Chapter {index} not found")

    def get_all_chapters(self) -> List[Dict[str, str]]:
        """
        Get all parsed chapters.

        Returns:
            List of all chapters
        """
        return self.chapters

    def chapter_count(self) -> int:
        """
        Get total number of chapters.

        Returns:
            Number of chapters
        """
        return len(self.chapters)
