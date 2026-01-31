# Podcast Generator - Databricks & Engenharia de Dados

## 📋 Visão Geral
Transforma um roteiro em Markdown em áudios (WAV) por capítulo usando eSpeak e oferece uma interface web para ouvir e baixar cada capítulo.

## 📂 Estrutura (organizada)
```
creating_podcasts_studies/
├── src/podcast_generator/
│   ├── __init__.py
│   ├── generate.py          # Núcleo de geração com CLI
│   ├── openai_tts.py        # Wrapper para OpenAI TTS
│   └── list_voices.py       # Lista vozes do eSpeak
│
├── scripts/
│   ├── generate_podcasts.py # Executável para gerar áudios
│   ├── generate_podcasts_openai.py # Executável usando OpenAI TTS (MP3)
│   ├── serve.py             # Servidor HTTP apontando para web/
│   └── quickstart.sh        # Menu rápido (gera/serve/lista vozes)
│
├── web/                     # Front-end
│   ├── index.html           # Interface principal
│   └── podcast_player.html  # Player alternativo simples
│
├── content/                 # Fontes de conteúdo
│   ├── podcast_script.md    # Roteiro do podcast
│   └── Exam_Guide_*.pdf     # Referência original
│
├── output/                  # Artefatos gerados
│   └── podcast_audios/
│       └── chapter_XX.mp3   # (quando gerado com OpenAI TTS)
│
├── docs/                    # Documentação adicional
└── .venv/                   # Ambiente virtual (isolado)
```

## 🚀 Uso Rápido
```bash
cd /home/gustavo/Projects/Studies_IA/creating_podcasts_studies
source .venv/bin/activate
python scripts/generate_podcasts.py          # Gera capítulos (WAV)
python scripts/serve.py                      # Sobe servidor em http://localhost:8000/
# Abra no navegador: http://localhost:8000/
```

Ou execute o menu rápido:
```bash
./scripts/quickstart.sh
```

Para vozes mais naturais com OpenAI TTS (gera MP3):
```bash
export OPENAI_API_KEY="sua_chave"
python scripts/generate_podcasts_openai.py --voice alloy --model gpt-4o-mini-tts
python scripts/serve.py
```

## 🔧 Comandos Úteis
- Gerar áudios com opções:
  ```bash
  python scripts/generate_podcasts.py --voice pt --speed 150 --script content/podcast_script.md
  ```
- Listar vozes disponíveis (eSpeak):
  ```bash
  PYTHONPATH=src python -m podcast_generator.list_voices
  ```
- Gerar áudios com OpenAI TTS (MP3):
  ```bash
  OPENAI_API_KEY=... python scripts/generate_podcasts_openai.py --prefer-pdf
  ```

## 🌐 Interface Web
- Servida a partir de `web/` (pelo `scripts/serve.py`).
- Áudios referenciados em `../output/podcast_audios/`.
- Cada capítulo tem player e botão de download.
- Espera arquivos MP3 (OpenAI). Se usar WAV, ajuste os `<source>` ou gere MP3.

## 🛠️ Tecnologias
- Python 3.13, eSpeak (TTS via CLI)
- HTML5, CSS3, JavaScript
- `http.server` nativo para servir o front-end

## 📌 Observações
- Os caminhos são relativos ao diretório do projeto; não é preciso ajustar `PYTHONPATH` ao usar os scripts em `scripts/`.
- Certifique-se de ter o eSpeak instalado (`sudo apt-get install espeak`).

## ✅ Status
Funcional e testado em Janeiro/2026.
```bash
