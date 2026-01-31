"""
HTTP Server Module
==================

Simple HTTP server for serving podcast files.
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path


class PodcastHTTPHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP request handler for podcast server."""

    def end_headers(self):
        """Add custom headers and end response headers."""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    def log_message(self, format, *args):
        """Log HTTP requests."""
        print(f"[{self.log_date_time_string()}] {format % args}")


class PodcastServer:
    """HTTP Server for serving podcast interface and audio files."""

    def __init__(self, port: int = 8000, host: str = "127.0.0.1"):
        """
        Initialize the podcast server.

        Args:
            port: Server port (default: 8000)
            host: Host address (default: 127.0.0.1)
        """
        self.port = port
        self.host = host
        self.server = None

    def start(self, auto_open: bool = True, project_dir: str = None) -> None:
        """
        Start the HTTP server.

        Args:
            auto_open: Automatically open browser (default: True)
            project_dir: Project directory for serving (default: current)
        """
        if project_dir:
            os.chdir(project_dir)
        
        self.server = socketserver.TCPServer((self.host, self.port), PodcastHTTPHandler)
        
        print(f"✓ Server started successfully!")
        print(f"✓ Access http://{self.host}:{self.port} in your browser")
        print(f"✓ Press Ctrl+C to stop the server\n")
        
        if auto_open:
            try:
                webbrowser.open(f'http://{self.host}:{self.port}')
            except Exception as e:
                print(f"Could not open browser automatically: {e}")
        
        try:
            self.server.serve_forever()
        except KeyboardInterrupt:
            print("\n✓ Server stopped successfully!")
            self.stop()

    def stop(self) -> None:
        """Stop the HTTP server."""
        if self.server:
            self.server.shutdown()
            self.server.server_close()
