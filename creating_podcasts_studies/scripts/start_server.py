#!/usr/bin/env python3
"""
Start the podcast HTTP server.

Usage:
    python -m scripts.start_server
"""

import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.server import PodcastServer


def main():
    """Main function to start the server."""
    
    server = PodcastServer(port=8000, host="127.0.0.1")
    project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    try:
        server.start(auto_open=True, project_dir=project_dir)
    except Exception as e:
        print(f"Error starting server: {e}")
        return 1
    
    return 0


if __name__ == '__main__':
    sys.exit(main())
