#!/usr/bin/env python3
"""
Script para normalizar o tamanho das alternativas incorretas no banco de questões.
As alternativas incorretas devem ter tamanho semelhante à correta para não dar pistas visuais.
"""

import json
import re
from pathlib import Path
from typing import Dict, List


def remove_extra_spaces(text: str) -> str:
    """Remove espaços extras e normaliza o texto"""
    # Remove espaços no final
    text = text.rstrip()
    # Remove múltiplos espaços
    text = re.sub(r'\s+', ' ', text)
    return text


def normalize_option_length(correct: str, incorrect: str, target_diff: int = 15) -> str:
    """
    Normaliza o tamanho de uma alternativa incorreta para ficar próximo da correta.
    
    Args:
        correct: Texto da alternativa correta
        incorrect: Texto da alternativa incorreta
        target_diff: Diferença máxima aceitável de caracteres
    
    Returns:
        Texto normalizado
    """
    correct = remove_extra_spaces(correct)
    incorrect = remove_extra_spaces(incorrect)
    
    correct_len = len(correct)
    incorrect_len = len(incorrect)
    diff = abs(correct_len - incorrect_len)
    
    # Se a diferença já é aceitável, retorna
    if diff <= target_diff:
        return incorrect
    
    # Se a incorreta é muito curta, adiciona texto explicativo
    if incorrect_len < correct_len - target_diff:
        # Adicionar frases comuns para preencher
        fillers = [
            ", mas essa abordagem não atende aos requisitos de produção",
            ", porém não resolve o problema de forma completa",
            " - solução que não considera requisitos de governança",
            ", embora seja uma opção válida em alguns cenários específicos",
            " (não recomendado para dados críticos em produção)",
        ]
        
        # Calcular quanto falta
        needed = correct_len - incorrect_len - target_diff
        
        # Escolher o filler mais apropriado
        for filler in fillers:
            if len(filler) >= needed * 0.7:  # Pelo menos 70% do necessário
                if not any(phrase in incorrect.lower() for phrase in ['mas essa', 'porém não', 'não resolve', 'não recomendado']):
                    incorrect += filler
                    break
        
        return incorrect[:correct_len + target_diff]  # Limitar ao máximo
    
    # Se a incorreta é muito longa, cortar
    elif incorrect_len > correct_len + target_diff:
        # Tentar cortar em uma vírgula ou ponto
        target_len = correct_len + target_diff
        
        # Procurar por vírgula ou ponto próximo ao target
        for i in range(target_len - 10, min(target_len + 10, len(incorrect))):
            if incorrect[i] in [',', '.', ';']:
                return incorrect[:i].rstrip()
        
        # Se não encontrou, cortar no espaço mais próximo
        text = incorrect[:target_len]
        last_space = text.rfind(' ')
        if last_space > target_len * 0.8:  # Pelo menos 80% do texto
            return text[:last_space].rstrip()
        
        return text.rstrip()
    
    return incorrect


def normalize_question(question: Dict) -> Dict:
    """
    Normaliza todas as alternativas de uma questão.
    
    Args:
        question: Dicionário da questão
    
    Returns:
        Questão com alternativas normalizadas
    """
    correct_key = question['correctAnswer']
    correct_option_key = f"options_{correct_key}"
    
    # Se já está no formato correto (options.A, options.B, etc)
    if 'options' in question and isinstance(question['options'], dict):
        correct_text = question['options'][correct_key]
        
        for key in ['A', 'B', 'C', 'D']:
            if key != correct_key:
                question['options'][key] = normalize_option_length(
                    correct_text,
                    question['options'][key]
                )
        return question
    
    # Se está no formato antigo (options_A, options_B, etc)
    if correct_option_key in question:
        correct_text = question[correct_option_key]
        
        for key in ['A', 'B', 'C', 'D']:
            option_key = f"options_{key}"
            if key != correct_key and option_key in question:
                question[option_key] = normalize_option_length(
                    correct_text,
                    question[option_key]
                )
    
    return question


def analyze_questions(questions: List[Dict]) -> Dict:
    """Analisa as questões e retorna estatísticas"""
    stats = {
        'total': len(questions),
        'with_size_issues': 0,
        'max_diff': 0,
        'avg_diff': 0,
        'issues': []
    }
    
    total_diff = 0
    
    for q in questions:
        correct_key = q['correctAnswer']
        
        # Detectar formato
        if 'options' in q and isinstance(q['options'], dict):
            correct_text = q['options'][correct_key]
            options = {k: v for k, v in q['options'].items()}
        else:
            correct_option_key = f"options_{correct_key}"
            correct_text = q.get(correct_option_key, '')
            options = {
                'A': q.get('options_A', ''),
                'B': q.get('options_B', ''),
                'C': q.get('options_C', ''),
                'D': q.get('options_D', '')
            }
        
        correct_len = len(remove_extra_spaces(correct_text))
        
        for key, text in options.items():
            if key != correct_key:
                text_len = len(remove_extra_spaces(text))
                diff = abs(correct_len - text_len)
                total_diff += diff
                
                if diff > stats['max_diff']:
                    stats['max_diff'] = diff
                
                if diff > 20:  # Threshold de problema
                    stats['with_size_issues'] += 1
                    stats['issues'].append({
                        'id': q['id'],
                        'question': q['question'][:50] + '...',
                        'correct_len': correct_len,
                        'option': key,
                        'option_len': text_len,
                        'diff': diff
                    })
    
    if questions:
        stats['avg_diff'] = total_diff / (len(questions) * 3)  # 3 incorretas por questão
    
    return stats


def main():
    input_path = Path('client/public/questions_enhanced.json')
    output_path = Path('client/public/questions_enhanced_normalized.json')
    
    print("=" * 80)
    print("NORMALIZANDO TAMANHO DAS ALTERNATIVAS")
    print("=" * 80)
    print()
    
    # Carregar questões
    with open(input_path, 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    print(f"📊 Total de questões: {len(questions)}")
    print()
    
    # Análise antes
    print("📈 Análise ANTES da normalização:")
    stats_before = analyze_questions(questions)
    print(f"   Questões com problemas: {stats_before['with_size_issues']}")
    print(f"   Diferença máxima: {stats_before['max_diff']} caracteres")
    print(f"   Diferença média: {stats_before['avg_diff']:.1f} caracteres")
    
    if stats_before['issues']:
        print(f"\n   Top 5 problemas:")
        for issue in stats_before['issues'][:5]:
            print(f"   - Q{issue['id']}: opção {issue['option']} tem {issue['diff']} chars de diferença")
    
    print()
    
    # Normalizar
    print("🔧 Normalizando alternativas...")
    normalized_questions = [normalize_question(q) for q in questions]
    
    # Análise depois
    print()
    print("📈 Análise DEPOIS da normalização:")
    stats_after = analyze_questions(normalized_questions)
    print(f"   Questões com problemas: {stats_after['with_size_issues']}")
    print(f"   Diferença máxima: {stats_after['max_diff']} caracteres")
    print(f"   Diferença média: {stats_after['avg_diff']:.1f} caracteres")
    print()
    
    # Salvar
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(normalized_questions, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Questões normalizadas salvas em: {output_path}")
    print()
    print("📋 Próximos passos:")
    print("   1. Revisar o arquivo gerado")
    print("   2. Se estiver OK, substituir o original:")
    print(f"      mv {output_path} {input_path}")
    print()


if __name__ == '__main__':
    main()
