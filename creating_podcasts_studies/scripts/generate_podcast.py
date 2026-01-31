#!/usr/bin/env python3
"""
Main entry point for podcast generation.

Usage:
    python -m scripts.generate_podcast
"""

import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.parser import ScriptParser
from src.generator import PodcastGenerator
from src.utils import validate_environment


def main():
    """Main function to generate podcasts."""
    
    # Validate environment
    print("Checking environment...")
    env = validate_environment()
    
    if env['errors']:
        print("Environment validation failed:")
        for error in env['errors']:
            print(f"  ✗ {error}")
        return 1
    
    print("✓ Environment validated\n")
    
    # Parse script
    print("Parsing podcast script...")
    parser = ScriptParser()
    chapters = parser.parse_file('data/podcast_script.md')
    print(f"✓ Found {parser.chapter_count()} chapters\n")
    
    # Generate audio
    print("Generating audio files...")
    generator = PodcastGenerator(
        language="pt",
        speed=150,
        output_dir="podcast_audios"
    )
    
    successful, total = generator.generate_from_chapters(chapters)
    
    print(f"\n{'='*70}")
    print(f"Generation complete: {successful}/{total} chapters successful")
    print(f"{'='*70}\n")
    
    return 0 if successful == total else 1


if __name__ == '__main__':
    sys.exit(main())
