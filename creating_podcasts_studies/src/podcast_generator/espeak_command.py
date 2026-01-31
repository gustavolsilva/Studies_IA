import os

text = "Seu texto aqui para o podcast."
output_file = "podcast.wav"

# Comando para gerar o áudio usando espeak
os.system(f'espeak -w {output_file} "{text}"')
