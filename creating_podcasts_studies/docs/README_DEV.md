# Podcast Generator

A professional podcast generation tool for creating educational content from markdown.

## Features

- **Automatic podcast generation** from markdown files
- **Professional web interface** for listening and downloading
- **Modular architecture** following best practices
- **Configuration management** for easy customization
- **Test suite** included
- **RESTful API** ready

## Quick Start

```bash
# Activate virtual environment
source .venv/bin/activate

# Generate podcasts
python main.py generate

# Start server
python main.py server

# Both in one command
python main.py both

# Run tests
python main.py test
```

## Project Structure

```
creating_podcasts_studies/
├── src/                 # Source code
│   ├── podcast/        # Podcast generation module
│   ├── server/         # HTTP server module
│   └── utils/          # Utility functions
├── scripts/            # Executable scripts
├── tests/              # Test suite
├── config/             # Configuration files
├── data/               # Data files (markdown, etc.)
├── web/                # Web interface files
├── docs/               # Documentation
├── main.py             # Main entry point
├── setup.py            # Package setup
└── requirements.txt    # Dependencies
```

## Configuration

Edit `config/config.ini` to customize:
- Language and speech speed
- Server port and host
- Input/output directories

## API Usage

```python
from src.parser import ScriptParser
from src.generator import PodcastGenerator

# Parse markdown
parser = ScriptParser()
chapters = parser.parse_file('data/podcast_script.md')

# Generate audio
generator = PodcastGenerator()
successful, total = generator.generate_from_chapters(chapters)
```

## Testing

```bash
python main.py test
```

## Requirements

- Python 3.7+
- eSpeak (for text-to-speech)
- pyttsx3

## License

MIT License

## Authors

Podcast Generator Team
