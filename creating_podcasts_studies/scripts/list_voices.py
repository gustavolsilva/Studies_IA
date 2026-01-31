#!/usr/bin/env python3
"""
List available voices for TTS.

Usage:
    python -m scripts.list_voices
"""

import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


def main():
    """Main function to list voices."""
    
    try:
        import pyttsx3
        engine = pyttsx3.init()
        voices = engine.getProperty('voices')
        
        print("Available voices:")
        print("=" * 70)
        for i, voice in enumerate(voices, 1):
            print(f"{i}. ID: {voice.id}")
            print(f"   Name: {voice.name}")
            print(f"   Languages: {voice.languages}")
            print()
    except Exception as e:
        print(f"Error listing voices: {e}")
        return 1
    
    return 0


if __name__ == '__main__':
    sys.exit(main())
