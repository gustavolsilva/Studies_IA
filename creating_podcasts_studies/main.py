#!/usr/bin/env python3
"""
Podcast Generator - Main Entry Point

A professional podcast generation tool for educational content.

Usage:
    python main.py generate      - Generate podcasts from markdown
    python main.py server        - Start HTTP server
    python main.py both          - Generate and start server
    python main.py test          - Run tests
"""

import sys
import os
import argparse

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from src.parser import ScriptParser
from src.generator import PodcastGenerator
from src.server import PodcastServer
from src.utils import validate_environment
from config.config import get_config


def cmd_generate(args):
    """Generate podcasts from markdown."""
    print("\n" + "="*70)
    print("🎙️  Generating Podcasts")
    print("="*70 + "\n")
    
    # Validate environment
    print("Checking environment...")
    env = validate_environment()
    
    if env['errors']:
        print("Environment validation failed:")
        for error in env['errors']:
            print(f"  ✗ {error}")
        return 1
    
    print("✓ Environment validated\n")
    
    # Get configuration
    config = get_config()
    podcast_config = config.get_podcast_config()
    
    # Parse script
    print(f"Parsing script: {podcast_config['script_file']}...")
    parser = ScriptParser()
    chapters = parser.parse_file(podcast_config['script_file'])
    print(f"✓ Found {parser.chapter_count()} chapters\n")
    
    # Generate audio
    print("Generating audio files...")
    generator = PodcastGenerator(
        language=podcast_config['language'],
        speed=podcast_config['speed'],
        output_dir=podcast_config['output_dir']
    )
    
    successful, total = generator.generate_from_chapters(chapters)
    
    print(f"\n{'='*70}")
    print(f"✓ Generation complete: {successful}/{total} chapters successful")
    print(f"{'='*70}\n")
    
    return 0 if successful == total else 1


def cmd_server(args):
    """Start HTTP server."""
    print("\n" + "="*70)
    print("🌐 Starting Podcast Server")
    print("="*70 + "\n")
    
    config = get_config()
    server_config = config.get_server_config()
    
    server = PodcastServer(
        port=server_config['port'],
        host=server_config['host']
    )
    
    project_dir = os.path.dirname(os.path.abspath(__file__))
    
    try:
        server.start(
            auto_open=server_config['auto_open'],
            project_dir=project_dir
        )
    except Exception as e:
        print(f"Error starting server: {e}")
        return 1
    
    return 0


def cmd_both(args):
    """Generate podcasts and start server."""
    result = cmd_generate(args)
    if result != 0:
        return result
    
    return cmd_server(args)


def cmd_test(args):
    """Run test suite."""
    print("\n" + "="*70)
    print("🧪 Running Tests")
    print("="*70 + "\n")
    
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    import unittest
    loader = unittest.TestLoader()
    suite = loader.discover('tests', pattern='test_*.py')
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    return 0 if result.wasSuccessful() else 1


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Podcast Generator - Generate educational podcasts from markdown'
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Command to run')
    
    # Generate command
    subparsers.add_parser('generate', help='Generate podcasts from markdown')
    
    # Server command
    subparsers.add_parser('server', help='Start HTTP server')
    
    # Both command
    subparsers.add_parser('both', help='Generate podcasts and start server')
    
    # Test command
    subparsers.add_parser('test', help='Run test suite')
    
    args = parser.parse_args()
    
    # Default to 'both' if no command specified
    if not args.command:
        args.command = 'both'
    
    # Command mapping
    commands = {
        'generate': cmd_generate,
        'server': cmd_server,
        'both': cmd_both,
        'test': cmd_test,
    }
    
    if args.command not in commands:
        parser.print_help()
        return 1
    
    return commands[args.command](args)


if __name__ == '__main__':
    sys.exit(main())
