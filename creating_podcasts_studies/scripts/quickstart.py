#!/usr/bin/env python3
"""
Quick start script for podcast generation and server.

Usage:
    python scripts/quickstart.py
"""

import sys
import os
import subprocess

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.parser import ScriptParser
from src.generator import PodcastGenerator
from src.server import PodcastServer


def main():
    """Main function for quickstart."""
    
    print("\n" + "="*70)
    print("🎙️  Podcast Generator - Quick Start")
    print("="*70 + "\n")
    
    # Step 1: Generate podcasts
    print("Step 1: Generating podcasts...\n")
    
    parser = ScriptParser()
    chapters = parser.parse_file('data/podcast_script.md')
    
    generator = PodcastGenerator(
        language="pt",
        speed=150,
        output_dir="podcast_audios"
    )
    
    successful, total = generator.generate_from_chapters(chapters)
    
    if successful != total:
        print(f"\n⚠️  Warning: Only {successful}/{total} chapters generated")
        return 1
    
    print(f"\n✓ All {total} chapters generated successfully!\n")
    
    # Step 2: Start server
    print("Step 2: Starting server...\n")
    
    server = PodcastServer(port=8000, host="127.0.0.1")
    project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    try:
        server.start(auto_open=True, project_dir=project_dir)
    except KeyboardInterrupt:
        print("\n✓ Goodbye!")
        return 0
    except Exception as e:
        print(f"Error: {e}")
        return 1
    
    return 0


if __name__ == '__main__':
    sys.exit(main())
