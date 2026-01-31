"""
Test suite for Podcast Generator.
"""

import unittest
import os
import sys

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.parser import ScriptParser
from src.utils import format_file_size, validate_environment


class TestScriptParser(unittest.TestCase):
    """Test cases for ScriptParser."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.parser = ScriptParser()
    
    def test_parse_simple_content(self):
        """Test parsing simple markdown content."""
        content = """## Chapter 1
This is chapter 1 content.

## Chapter 2
This is chapter 2 content."""
        
        chapters = self.parser.parse_content(content)
        
        self.assertEqual(len(chapters), 2)
        self.assertEqual(chapters[0]['title'], 'Chapter 1')
        self.assertIn('chapter 1', chapters[0]['content'].lower())
    
    def test_chapter_count(self):
        """Test chapter count."""
        content = "## Ch1\nContent 1\n\n## Ch2\nContent 2"
        self.parser.parse_content(content)
        
        self.assertEqual(self.parser.chapter_count(), 2)
    
    def test_get_all_chapters(self):
        """Test getting all chapters."""
        content = "## Test\nContent"
        self.parser.parse_content(content)
        
        chapters = self.parser.get_all_chapters()
        self.assertIsInstance(chapters, list)
        self.assertTrue(len(chapters) > 0)


class TestUtilities(unittest.TestCase):
    """Test cases for utility functions."""
    
    def test_format_file_size_bytes(self):
        """Test formatting file size in bytes."""
        result = format_file_size(512)
        self.assertIn('B', result)
    
    def test_format_file_size_kilobytes(self):
        """Test formatting file size in kilobytes."""
        result = format_file_size(1024 * 10)
        self.assertIn('KB', result)
    
    def test_validate_environment(self):
        """Test environment validation."""
        result = validate_environment()
        
        self.assertIn('espeak', result)
        self.assertIn('python', result)
        self.assertIn('errors', result)


if __name__ == '__main__':
    unittest.main()
