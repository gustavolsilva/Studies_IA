#!/usr/bin/env python3
"""
Normalização agressiva de tamanho de respostas.
Objetivo: garantir que nenhuma resposta seja >20% diferente da média.
"""

import json
import random
from pathlib import Path

def normalize_option_length(text, target_length, make_longer=False):
    """Ajusta tamanho da opção mantendo sentido correto/incorreto"""
    current = len(text)
    
    if current == target_length:
        return text
    
    if current > target_length and current > target_length * 1.15:
        # Reduzir: remover detalhes, manter essência
        if " - " in text:
            text = text.split(" - ")[0]
        elif ", mas " in text:
            text = text.split(", mas ")[0]
        elif ", porém " in text:
            text = text.split(", porém ")[0]
        elif " (sobrevivência" not in text and "(" in text:
            text = text.split("(")[0].strip()
    
    elif current < target_length and current < target_length * 0.85:
        # Expandir: adicionar contexto mas mantendo incorreto
        expansions = [
            " (embora essa abordagem tenha limitações)",
            " em alguns casos",
            " (solução parcial)",
            " conforme documentação",
            " (não recomendado para produção)",
            " em ambiente de teste",
        ]
        
        for exp in expansions:
            if len(text + exp) <= target_length * 1.1:
                text = text + exp
                break
    
    return text

def main():
    input_path = Path('client/public/questions_enhanced.json')
    
    with open(input_path, 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    print('🔍 Normalizando tamanho de respostas...\n')
    
    before_problems = 0
    after_problems = 0
    
    for q in questions:
        # Calcular tamanhos atuais
        lengths = {opt: len(q[f'options_{opt}']) for opt in ['A', 'B', 'C', 'D']}
        avg = sum(lengths.values()) / 4
        
        # Verificar problemas antes
        for opt in ['A', 'B', 'C', 'D']:
            diff = ((lengths[opt] - avg) / avg) * 100
            if abs(diff) > 15:
                before_problems += 1
        
        # Normalizar
        for opt in ['A', 'B', 'C', 'D']:
            current_len = len(q[f'options_{opt}'])
            if current_len < avg * 0.8 or current_len > avg * 1.2:
                q[f'options_{opt}'] = normalize_option_length(
                    q[f'options_{opt}'],
                    int(avg),
                    make_longer=current_len < avg * 0.8
                )
        
        # Verificar problemas depois
        lengths = {opt: len(q[f'options_{opt}']) for opt in ['A', 'B', 'C', 'D']}
        avg = sum(lengths.values()) / 4
        for opt in ['A', 'B', 'C', 'D']:
            diff = ((lengths[opt] - avg) / avg) * 100
            if abs(diff) > 15:
                after_problems += 1
    
    # Salvar
    with open(input_path, 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    
    print(f'✅ Questões normalizadas:')
    print(f'   Problemas antes: {before_problems}')
    print(f'   Problemas depois: {after_problems}')
    print(f'   Melhoria: {before_problems - after_problems} resolvidos')

if __name__ == '__main__':
    main()
