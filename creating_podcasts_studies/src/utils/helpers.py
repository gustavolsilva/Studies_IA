"""
Utilities Module
================

Utility functions for the podcast generator.
"""

import os
from typing import List


def get_generated_chapters(output_dir: str = "podcast_audios") -> List[dict]:
    """
    Get list of generated chapter metadata.

    Args:
        output_dir: Directory containing audio files

    Returns:
        List of chapter information
    """
    if not os.path.exists(output_dir):
        return []
    
    chapters = []
    files = sorted([f for f in os.listdir(output_dir) if f.endswith('.wav')])
    
    for i, filename in enumerate(files, 1):
        filepath = os.path.join(output_dir, filename)
        size = os.path.getsize(filepath)
        chapters.append({
            'number': i,
            'filename': filename,
            'path': filepath,
            'size': size
        })
    
    return chapters


def format_file_size(bytes: int) -> str:
    """
    Format file size in human-readable format.

    Args:
        bytes: File size in bytes

    Returns:
        Formatted size string
    """
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes < 1024.0:
            return f"{bytes:.1f} {unit}"
        bytes /= 1024.0
    return f"{bytes:.1f} TB"


def validate_environment() -> dict:
    """
    Validate that required tools are installed.

    Returns:
        Dictionary with validation results
    """
    import subprocess
    
    results = {
        'espeak': False,
        'python': True,
        'errors': []
    }
    
    # Check eSpeak
    try:
        subprocess.run(['espeak', '--version'], capture_output=True)
        results['espeak'] = True
    except FileNotFoundError:
        results['errors'].append("eSpeak not found. Install with: sudo apt-get install espeak")
    
    return results
