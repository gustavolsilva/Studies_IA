import pyttsx3
import os

# Inicializa o mecanismo de TTS
engine = pyttsx3.init(driverName='espeak')
engine.setProperty('voice', 'en-us')

# Função para criar áudio a partir de texto

def create_audio_from_text(text, chapter_name):
    # Define o nome do arquivo de áudio
    audio_file = f"{chapter_name}.mp3"
    
    # Gera o áudio
    engine.save_to_file(text, audio_file)
    engine.runAndWait()
    print(f"Áudio criado: {audio_file}")

# Função principal para gerar os áudios dos capítulos

def generate_podcast():
    # Lê o conteúdo do roteiro
    with open('files/podcast_script.md', 'r') as file:
        content = file.read()

    # Divide o conteúdo em capítulos (aqui, usando uma simples divisão por linhas)
    chapters = content.split('\n\n')  # Supondo que capítulos são separados por duas quebras de linha
    
    # Cria um diretório para os áudios, se não existir
    if not os.path.exists('podcast_audios'):
        os.makedirs('podcast_audios')

    # Gera áudio para cada capítulo
    for i, chapter in enumerate(chapters):
        chapter_name = f"podcast_audios/chapter_{i + 1}"
        create_audio_from_text(chapter, chapter_name)

# Executa a geração do podcast
if __name__ == '__main__':
    generate_podcast()