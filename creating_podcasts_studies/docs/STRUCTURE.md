# Project Structure Guide

## Directory Organization

### `/src`
Contains all source code organized into logical modules:

- **`podcast/`** - Podcast generation logic
  - `generator.py` - Audio generation from text
  - `parser.py` - Markdown parsing
  - `__init__.py` - Module exports

- **`server/`** - HTTP server module
  - `server.py` - Server implementation
  - `__init__.py` - Module exports

- **`utils/`** - Utility functions
  - `helpers.py` - Helper functions
  - `__init__.py` - Module exports

### `/scripts`
Executable scripts for common tasks:

- `generate_podcast.py` - Generate podcasts
- `start_server.py` - Start HTTP server
- `list_voices.py` - List available voices
- `quickstart.py` - Quick start script

### `/tests`
Test suite with unit tests:

- `test_parser.py` - Tests for parser module
- `__init__.py` - Test package

### `/config`
Configuration and settings:

- `config.ini` - Main configuration file
- `config.py` - Configuration loader

### `/data`
Data files and content:

- `podcast_script.md` - Podcast script in markdown

### `/web`
Web interface files:

- `index.html` - Main interface
- `podcast_player.html` - Player interface
- Assets (CSS, JS, images)

### `/docs`
Documentation:

- `README_DEV.md` - Developer guide
- API documentation
- Architecture docs

## Execution Flow

```
main.py
  ├─ cmd_generate()
  │   ├─ ScriptParser.parse_file()
  │   └─ PodcastGenerator.generate_from_chapters()
  │
  ├─ cmd_server()
  │   └─ PodcastServer.start()
  │
  └─ cmd_both()
      ├─ cmd_generate()
      └─ cmd_server()
```

## Code Organization Principles

1. **Single Responsibility** - Each module has one clear purpose
2. **Modularity** - Loosely coupled, highly cohesive
3. **Documentation** - Docstrings and comments
4. **Testing** - Unit tests for critical components
5. **Configuration** - External configuration management
6. **Entry Points** - Clear main entry point

## Adding New Features

1. Create module in appropriate `src/` subdirectory
2. Add tests in `tests/`
3. Update configuration if needed
4. Add script in `scripts/` if user-facing
5. Update documentation

## Development Workflow

```bash
# Setup
source .venv/bin/activate
pip install -r requirements.txt

# Development
# Edit files in src/, scripts/, etc.

# Testing
python main.py test

# Running
python main.py both

# Distribution
python setup.py sdist bdist_wheel
```
