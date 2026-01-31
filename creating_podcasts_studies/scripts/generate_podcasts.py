#!/usr/bin/env python3

import sys
from pathlib import Path

# Garante que o pacote em src/ esteja no path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = PROJECT_ROOT / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from podcast_generator.generate import main  # noqa: E402


if __name__ == "__main__":
    main()
