#!/usr/bin/env python3
"""
Balanceamento agressivo: adiciona contexto técnico às respostas incorretas
para igualar o tamanho com a resposta correta.
"""

import json
import random
from pathlib import Path

# Fragmentos genéricos para expandir respostas incorretas mantendo-as incorretas
EXPANSION_PATTERNS = [
    ", mas essa abordagem não atende requisitos de produção",
    ", porém não resolve o problema de forma completa",
    " (solução parcial que não escala adequadamente)",
    ", entretanto não garante consistência em ambientes distribuídos",
    " - abordagem simplista inadequada para casos reais",
    ", mas não fornece as garantias ACID necessárias",
    " (não recomendado para dados críticos em produção)",
    ", porém apresenta limitações em cenários de alta concorrência",
    " - solução que não considera requisitos de governança",
    ", mas não oferece auditoria e rastreabilidade completas",
]

def expand_short_option(text, target_length):
    """Expande uma opção curta adicionando contexto técnico"""
    if len(text) >= target_length * 0.8:
        return text
    
    # Remover reticências
    text = text.rstrip('.')
    
    # Adicionar expansão apropriada
    expansion = random.choice(EXPANSION_PATTERNS)
    expanded = text + expansion
    
    # Se ainda curto, adicionar mais contexto
    if len(expanded) < target_length * 0.7:
        expanded += " em ambientes corporativos"
    
    return expanded

def balance_question_options(q):
    """Balanceia tamanho das 4 opções de uma questão"""
    options = {
        'A': q['options_A'],
        'B': q['options_B'],
        'C': q['options_C'],
        'D': q['options_D'],
    }
    
    correct = q['correctAnswer']
    
    # Calcular tamanho alvo (média ou tamanho da correta)
    lengths = [len(options[k]) for k in options]
    target = max(lengths)  # Usar o maior como referência
    
    # Expandir opções incorretas curtas
    for key in ['A', 'B', 'C', 'D']:
        if key != correct and len(options[key]) < target * 0.75:
            options[key] = expand_short_option(options[key], target)
    
    # Atualizar questão
    q['options_A'] = options['A']
    q['options_B'] = options['B']
    q['options_C'] = options['C']
    q['options_D'] = options['D']
    
    return q

def main():
    input_path = Path('client/public/questions_enhanced.json')
    
    with open(input_path, 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    print(f'📦 Processando {len(questions)} questões...\n')
    
    # Análise antes
    before_diffs = []
    for q in questions:
        correct = q['correctAnswer']
        correct_len = len(q[f'options_{correct}'])
        avg_len = sum(len(q[f'options_{opt}']) for opt in ['A', 'B', 'C', 'D']) / 4
        diff_pct = ((correct_len - avg_len) / avg_len) * 100
        before_diffs.append(diff_pct)
    
    print(f'📏 ANTES: Diferença média = {sum(before_diffs)/len(before_diffs):+.1f}%')
    
    # Aplicar balanceamento
    print('⚖️  Balanceando tamanhos...\n')
    questions = [balance_question_options(q) for q in questions]
    
    # Análise depois
    after_diffs = []
    for q in questions:
        correct = q['correctAnswer']
        correct_len = len(q[f'options_{correct}'])
        avg_len = sum(len(q[f'options_{opt}']) for opt in ['A', 'B', 'C', 'D']) / 4
        diff_pct = ((correct_len - avg_len) / avg_len) * 100
        after_diffs.append(diff_pct)
    
    print(f'📏 DEPOIS: Diferença média = {sum(after_diffs)/len(after_diffs):+.1f}%')
    
    # Mostrar exemplos
    print('\n📋 Exemplos de questões balanceadas:\n')
    for i, q in enumerate(questions[:2], 1):
        print(f'Questão {i}: Correta = {q["correctAnswer"]}')
        for opt in ['A', 'B', 'C', 'D']:
            text = q[f'options_{opt}']
            marker = '✓' if opt == q['correctAnswer'] else ' '
            print(f'  {marker} {opt}: {len(text):3d} chars')
        print()
    
    # Salvar
    with open(input_path, 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    
    print(f'✅ Salvo em {input_path}')

if __name__ == '__main__':
    main()
