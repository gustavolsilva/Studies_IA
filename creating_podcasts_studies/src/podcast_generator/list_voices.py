import subprocess


def list_voices() -> None:
    """Lista vozes disponíveis via eSpeak."""
    result = subprocess.run(["espeak", "--voices"], capture_output=True, text=True)
    if result.returncode != 0:
        print("✗ Não foi possível listar as vozes. Verifique a instalação do eSpeak.")
        return

    print("Vozes disponíveis (eSpeak):")
    print(result.stdout)

if __name__ == '__main__':
    list_voices()