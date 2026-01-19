#!/usr/bin/env python3
"""
Teste de embaralhamento: simula o algoritmo JavaScript Fisher-Yates
para verificar se o embaralhamento funciona corretamente
"""

import json
import random
from collections import Counter, defaultdict

# Ler JSON
with open('client/public/questions_enhanced.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

print("🔄 SIMULANDO EMBARALHAMENTO (como faz o JavaScript):\n")

def shuffle_question_options(question):
    """Simula o embaralhamento do JavaScript"""
    letters = ['A', 'B', 'C', 'D']
    original_options = {
        'A': question['options_A'],
        'B': question['options_B'],
        'C': question['options_C'],
        'D': question['options_D'],
    }
    
    # Fisher-Yates shuffle (como o código)
    shuffled = letters.copy()
    for i in range(len(shuffled) - 1, 0, -1):
        j = random.randint(0, i)
        shuffled[i], shuffled[j] = shuffled[j], shuffled[i]
    
    # Nova posição da resposta correta
    correct_index = shuffled.index(question['correctAnswer'])
    new_correct = letters[correct_index]
    
    return new_correct

# Executar 5 rodadas de embaralhamento e ver onde a resposta correta fica
print("Testando com 5 carregamentos simulados (50 questões cada):")
print("Primeira questão (Q1):")

for load_num in range(5):
    random.seed()  # Reset seed a cada carregamento
    results = []
    for q in questions[:20]:  # 20 questões por teste
        new_correct = shuffle_question_options(q)
        results.append(new_correct)
    
    distribution = Counter(results)
    print(f"  Carregamento {load_num + 1}: {dict(distribution)}")

print("\n" + "="*60)
print("⚠️  PROBLEMA IDENTIFICADO:\n")
print("""
Se você está vendo SEMPRE a mesma distribuição em cada carregamento,
significa que:

1. A seed do random está sendo resetada com o MESMO valor
2. OU o embaralhamento não está sendo chamado
3. OU o navegador está cacheando o resultado

SOLUÇÃO: Adicionar timestamp ao URL para forçar recarga do JSON,
ou usar crypto.getRandomValues() em vez de Math.random()
""")

# Testar grande amostra
print("\n📊 TESTE FINAL: Embaralhando 10000 vezes (todas as questões):")
all_positions = defaultdict(Counter)

for load_num in range(100):  # 100 carregamentos
    random.seed()
    for q_idx, q in enumerate(questions):
        new_correct = shuffle_question_options(q)
        all_positions[q_idx][new_correct] += 1

print("Distribuição média de respostas corretas após embaralhamento:")
total_counts = Counter()
for q_idx in range(len(questions)):
    for letter in ['A', 'B', 'C', 'D']:
        count = all_positions[q_idx][letter]
        total_counts[letter] += count

for letter in ['A', 'B', 'C', 'D']:
    pct = (total_counts[letter] / sum(total_counts.values())) * 100
    print(f"  {letter}: {total_counts[letter]} ({pct:.1f}%)")

print("\n✅ Se distribuição ≈ 25% cada, embaralhamento está FUNCIONANDO")
print("❌ Se há bias (ex: B tem 40%), embaralhamento NÃO está funcionando")
