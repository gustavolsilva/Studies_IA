"""
Configuration module for Podcast Generator.
"""

import configparser
import os
from pathlib import Path


class Config:
    """Load and manage configuration."""
    
    def __init__(self, config_file='config/config.ini'):
        """
        Initialize configuration.
        
        Args:
            config_file: Path to configuration file
        """
        self.config = configparser.ConfigParser()
        self.config_file = config_file
        self.load()
    
    def load(self):
        """Load configuration from file."""
        if os.path.exists(self.config_file):
            self.config.read(self.config_file)
    
    def get_podcast_config(self):
        """Get podcast configuration."""
        return {
            'language': self.config.get('podcast', 'language', fallback='pt'),
            'speed': self.config.getint('podcast', 'speed', fallback=150),
            'output_dir': self.config.get('podcast', 'output_dir', fallback='podcast_audios'),
            'script_file': self.config.get('podcast', 'script_file', fallback='data/podcast_script.md'),
        }
    
    def get_server_config(self):
        """Get server configuration."""
        return {
            'port': self.config.getint('server', 'port', fallback=8000),
            'host': self.config.get('server', 'host', fallback='127.0.0.1'),
            'auto_open': self.config.getboolean('server', 'auto_open', fallback=True),
        }
    
    def get_paths_config(self):
        """Get paths configuration."""
        return {
            'web_dir': self.config.get('paths', 'web_dir', fallback='web'),
            'data_dir': self.config.get('paths', 'data_dir', fallback='data'),
            'logs_dir': self.config.get('paths', 'logs_dir', fallback='logs'),
            'docs_dir': self.config.get('paths', 'docs_dir', fallback='docs'),
        }


# Global configuration instance
_config = None


def get_config():
    """Get global configuration instance."""
    global _config
    if _config is None:
        _config = Config()
    return _config
