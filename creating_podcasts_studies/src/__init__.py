"""
Podcast Generator Module
=========================

Main module for podcast generation from markdown content.
"""

__version__ = "1.0.0"
__author__ = "Podcast Generator Team"

from .generator import PodcastGenerator
from .parser import ScriptParser

__all__ = ["PodcastGenerator", "ScriptParser"]
