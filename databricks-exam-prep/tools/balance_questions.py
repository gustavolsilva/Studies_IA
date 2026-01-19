#!/usr/bin/env python3
"""
Balanceia o banco de questões:
1. Redistribui respostas corretas (não mais 82% na B)
2. Equilibra tamanho das respostas (adiciona contexto nas incorretas)
"""

import json
import random
from pathlib import Path

def balance_option_lengths(options, correct_answer):
    """
    Equilibra o tamanho das opções adicionando contexto/detalhes nas incorretas
    se a resposta correta for muito mais longa.
    """
    correct_text = options[correct_answer]
    correct_len = len(correct_text)
    
    # Se resposta correta for muito mais longa que a média, equilibrar
    avg_len = sum(len(options[k]) for k in options) / 4
    
    if correct_len > avg_len * 1.5:  # Resposta correta é 50% maior que média
        for key in options:
            if key != correct_answer and len(options[key]) < correct_len * 0.7:
                # Adicionar contexto/detalhes às respostas incorretas curtas
                text = options[key]
                
                # Estratégias de expansão mantendo sentido incorreto
                if len(text) < 40:
                    if "apenas" in text.lower() or "só" in text.lower():
                        options[key] = text.replace("...", " (abordagem incompleta)")
                    elif not text.endswith("."):
                        options[key] = text + ", mas não resolve o problema completo"
                    else:
                        options[key] = text[:-1] + ", porém inadequado para produção"
                elif len(text) < 60:
                    if not any(p in text for p in ["mas", "porém", "entretanto"]):
                        options[key] = text.replace("...", " - abordagem simplista")
    
    return options

def shuffle_correct_answers(questions):
    """
    Redistribui respostas corretas uniformemente entre A, B, C, D
    """
    target_per_letter = len(questions) // 4
    letter_pool = ['A', 'B', 'C', 'D']
    
    # Criar pool balanceado
    balanced_answers = []
    for letter in letter_pool:
        balanced_answers.extend([letter] * target_per_letter)
    
    # Adicionar restos aleatoriamente
    remainder = len(questions) - len(balanced_answers)
    balanced_answers.extend(random.choices(letter_pool, k=remainder))
    
    # Embaralhar pool
    random.shuffle(balanced_answers)
    
    # Redistribuir
    for i, q in enumerate(questions):
        old_correct = q['correctAnswer']
        new_correct = balanced_answers[i]
        
        if old_correct != new_correct:
            # Trocar as opções
            old_key_a = f'options_{old_correct}'
            old_key_b = f'options_{new_correct}'
            new_key_a = f'options_{new_correct}'
            new_key_b = f'options_{old_correct}'
            
            # Swap nas chaves options_X
            temp = q[old_key_a]
            q[old_key_a] = q[old_key_b]
            q[old_key_b] = temp
            
            # Atualizar correctAnswer
            q['correctAnswer'] = new_correct
    
    return questions

def main():
    input_path = Path('client/public/questions_enhanced.json')
    output_path = Path('client/public/questions_enhanced.json')
    backup_path = Path('client/public/questions_enhanced.backup.json')
    
    # Backup
    with open(input_path, 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    
    print(f'📦 Carregadas {len(questions)} questões')
    
    # Análise inicial
    from collections import Counter
    initial_dist = Counter(q['correctAnswer'] for q in questions)
    print('\n📊 Distribuição ANTES:')
    for letter in ['A', 'B', 'C', 'D']:
        count = initial_dist[letter]
        pct = (count / len(questions)) * 100
        print(f'  {letter}: {count:2d} ({pct:5.1f}%)')
    
    # Balancear tamanhos
    print('\n⚖️  Balanceando tamanho das respostas...')
    for q in questions:
        options = {
            'A': q['options_A'],
            'B': q['options_B'],
            'C': q['options_C'],
            'D': q['options_D'],
        }
        
        balanced_options = balance_option_lengths(options, q['correctAnswer'])
        
        q['options_A'] = balanced_options['A']
        q['options_B'] = balanced_options['B']
        q['options_C'] = balanced_options['C']
        q['options_D'] = balanced_options['D']
    
    # Redistribuir respostas corretas
    print('🎲 Redistribuindo respostas corretas...')
    questions = shuffle_correct_answers(questions)
    
    # Análise final
    final_dist = Counter(q['correctAnswer'] for q in questions)
    print('\n📊 Distribuição DEPOIS:')
    for letter in ['A', 'B', 'C', 'D']:
        count = final_dist[letter]
        pct = (count / len(questions)) * 100
        print(f'  {letter}: {count:2d} ({pct:5.1f}%)')
    
    # Salvar
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    
    print(f'\n✅ Questões balanceadas salvas em {output_path}')
    print(f'💾 Backup original em {backup_path}')

if __name__ == '__main__':
    main()
