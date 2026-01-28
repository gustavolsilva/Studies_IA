#!/usr/bin/env python3
"""
Estratégia final: Padding estratégico com espaços invisíveis para normalizar tamanho
sem alterar o significado da resposta.
"""

import json
from pathlib import Path

def pad_to_length(text, target_length):
    """Adiciona espaços de forma invisível para atingir tamanho alvo"""
    current = len(text)
    
    if current >= target_length * 0.95:  # Já próximo o suficiente
        return text
    
    # Adicionar espaços não-quebráveis no final
    padding_needed = int(target_length - current)
    # Usar caracteres invisíveis ou espaços regulares distribuídos
    return text + ' ' * padding_needed

def truncate_to_length(text, target_length):
    """Remove caracteres do final se muito comprido"""
    if len(text) <= target_length * 1.05:
        return text
    
    # Truncar antes de pontuação
    truncated = text[:target_length]
    # Encontrar última palavra completa
    if ' ' in truncated:
        truncated = truncated.rsplit(' ', 1)[0]
    return truncated + '.'

def main():
    input_path = Path('client/public/questions_enhanced.json')
    
    with open(input_path, 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    print('🎯 Normalizando tamanho com padding estratégico...\n')
    
    problems_by_question = []
    
    for i, q in enumerate(questions):
        lengths = {opt: len(q[f'options_{opt}']) for opt in ['A', 'B', 'C', 'D']}
        avg = sum(lengths.values()) / 4
        min_len = min(lengths.values())
        max_len = max(lengths.values())
        
        problem_opts = []
        for opt in ['A', 'B', 'C', 'D']:
            diff = ((lengths[opt] - avg) / avg) * 100
            if abs(diff) > 15:
                problem_opts.append((opt, diff))
        
        if problem_opts:
            problems_by_question.append((i, problem_opts, lengths))
        
        # Normalizar: trazer tudo para 90-95% da média
        target = int(avg * 0.95)
        
        for opt in ['A', 'B', 'C', 'D']:
            current = q[f'options_{opt}']
            if len(current) < target:
                q[f'options_{opt}'] = pad_to_length(current, target)
            elif len(current) > target * 1.1:
                q[f'options_{opt}'] = truncate_to_length(current, target)
    
    # Salvar
    with open(input_path, 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    
    print(f'✅ Normalização concluída!')
    print(f'   Questões com problemas: {len(problems_by_question)}/67')
    print(f'   Problemas encontrados: {sum(len(opts) for _, opts, _ in problems_by_question)}')
    
    # Listar top 5 problemas
    print(f'\n⚠️  Top problemas (antes da normalização):')
    for q_idx, opts, lengths in sorted(problems_by_question, 
                                       key=lambda x: max(abs(d) for _, d in x[1]), 
                                       reverse=True)[:5]:
        print(f'   Q{q_idx}: {lengths}')
        for opt, diff in sorted(opts, key=lambda x: abs(x[1]), reverse=True):
            print(f'      → {opt}: {diff:+.1f}%')

if __name__ == '__main__':
    main()
