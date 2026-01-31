#!/usr/bin/env python3

import http.server
import socketserver
import webbrowser
from functools import partial
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent
WEB_DIR = PROJECT_ROOT / "web"


class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        super().end_headers()

    def log_message(self, fmt, *args):
        print(f"[{self.log_date_time_string()}] {fmt % args}")


def start_server(port: int = 8000) -> None:
    """Inicia o servidor HTTP a partir da raiz do projeto."""
    handler = partial(MyHTTPRequestHandler, directory=str(PROJECT_ROOT))

    with socketserver.TCPServer(("", port), handler) as httpd:
        print("✓ Servidor iniciado com sucesso!")
        print(f"✓ Acesse http://localhost:{port}/web/index.html no seu navegador")
        print("✓ Pressione Ctrl+C para parar o servidor\n")

        try:
            webbrowser.open(f"http://localhost:{port}/web/index.html")
        except Exception:
            pass

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n✓ Servidor encerrado com sucesso!")


if __name__ == "__main__":
    start_server()
