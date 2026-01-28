#!/usr/bin/env python3
"""
Template para adicionar novas perguntas de alta qualidade ao banco
Siga o padrão para manter consistência
"""

import json
from typing import Dict, List, Any

# TEMPLATE DE PERGUNTA - Use como referência
TEMPLATE = {
    "id": "AUTO_INCREMENT",
    "category": "Categoria apropriada",  # Uma das 5 categories existentes
    "difficulty": "intermediate",  # foundational, intermediate, ou advanced
    "question": "Pergunta clara e objetiva com cenário real quando possível?",
    "options": {
        "A": "Opção incorreta 1",
        "B": "Opção incorreta 2", 
        "C": "Opção incorreta 3",
        "D": "Resposta correta com contexto"
    },
    "correctAnswer": "D",
    "rationale": "Explicação DETALHADA (200-400 caracteres) que inclua: (1) Definição clara, (2) Por que outras respostas estão erradas, (3) Contexto técnico, (4) Comparações com alternativas quando relevante",
    "tip": "Dica mnemônica ou frase-chave para memorizar. Max 100 caracteres.",
    "officialReference": {
        "title": "Título da documentação oficial Databricks",
        "url": "https://docs.databricks.com/en/..."
    },
    "contextScenario": "Descrição de um cenário real em produção onde esse conhecimento é aplicado. 1-2 frases."
}

# CATEGORIAS VÁLIDAS
CATEGORIES = [
    "Databricks Intelligence Platform",
    "Development and Ingestion", 
    "Data Processing & Transformations",
    "Data Governance & Quality",
    "Productionizing Data Pipelines"
]

# PADRÕES DE QUALIDADE
QUALITY_REQUIREMENTS = {
    "rationale_min_length": 150,
    "rationale_max_length": 450,
    "tip_max_length": 120,
    "context_scenario_min_length": 50,
    "options_required": 4,
    "fields_required": [
        "id", "category", "difficulty", "question", "options", 
        "correctAnswer", "rationale", "tip", "officialReference", "contextScenario"
    ]
}

def validate_question(question: Dict[str, Any]) -> List[str]:
    """Valida uma pergunta contra padrões de qualidade"""
    errors = []
    
    # Check campos obrigatórios
    for field in QUALITY_REQUIREMENTS['fields_required']:
        if field not in question:
            errors.append(f"❌ Campo ausente: {field}")
    
    # Check categoria
    if question.get('category') not in CATEGORIES:
        errors.append(f"❌ Categoria inválida. Use uma de: {CATEGORIES}")
    
    # Check dificuldade
    if question.get('difficulty') not in ['foundational', 'intermediate', 'advanced']:
        errors.append(f"❌ Dificuldade inválida. Use: foundational, intermediate ou advanced")
    
    # Check rationale
    rationale = question.get('rationale', '')
    if len(rationale) < QUALITY_REQUIREMENTS['rationale_min_length']:
        errors.append(f"⚠️  Rationale muito curta ({len(rationale)} chars). Mínimo: {QUALITY_REQUIREMENTS['rationale_min_length']}")
    if len(rationale) > QUALITY_REQUIREMENTS['rationale_max_length']:
        errors.append(f"⚠️  Rationale muito longa ({len(rationale)} chars). Máximo: {QUALITY_REQUIREMENTS['rationale_max_length']}")
    
    # Check tip
    tip = question.get('tip', '')
    if len(tip) > QUALITY_REQUIREMENTS['tip_max_length']:
        errors.append(f"⚠️  Tip muito longa ({len(tip)} chars). Máximo: {QUALITY_REQUIREMENTS['tip_max_length']}")
    
    # Check context scenario
    scenario = question.get('contextScenario', '')
    if len(scenario) < QUALITY_REQUIREMENTS['context_scenario_min_length']:
        errors.append(f"⚠️  Context Scenario muito curto ({len(scenario)} chars). Mínimo: {QUALITY_REQUIREMENTS['context_scenario_min_length']}")
    
    # Check options
    options = question.get('options', {})
    if len(options) != QUALITY_REQUIREMENTS['options_required']:
        errors.append(f"❌ Deve ter exatamente {QUALITY_REQUIREMENTS['options_required']} opções")
    
    # Check correct answer
    correct = question.get('correctAnswer')
    if correct not in options:
        errors.append(f"❌ Resposta correta '{correct}' não está nas opções")
    
    # Check official reference
    ref = question.get('officialReference', {})
    if 'url' not in ref or 'title' not in ref:
        errors.append(f"❌ officialReference deve ter 'title' e 'url'")
    
    return errors

def add_new_questions(new_questions: List[Dict[str, Any]]):
    """Adiciona novas perguntas ao banco existente"""
    # Carregar banco atual
    with open('client/public/questions_expanded.json', 'r', encoding='utf-8') as f:
        current = json.load(f)
    
    max_id = max(q['id'] for q in current)
    
    # Validar e adicionar novas
    validated_count = 0
    errors_found = False
    
    for i, q in enumerate(new_questions, 1):
        print(f"\n📋 Validando pergunta {i}...")
        errors = validate_question(q)
        
        if errors:
            print(f"   ❌ Erros encontrados:")
            for error in errors:
                print(f"      {error}")
            errors_found = True
        else:
            q['id'] = max_id + validated_count + 1
            current.append(q)
            validated_count += 1
            print(f"   ✅ Válida! ID: {q['id']}")
    
    if not errors_found and validated_count > 0:
        # Salvar
        with open('client/public/questions_expanded.json', 'w', encoding='utf-8') as f:
            json.dump(current, f, ensure_ascii=False, indent=2)
        print(f"\n✅ {validated_count} pergunta(s) adicionada(s) com sucesso!")
    else:
        print(f"\n⚠️  Nenhuma pergunta foi adicionada. Corrija os erros acima.")
    
    return validated_count

# EXEMPLO DE NOVA PERGUNTA
EXAMPLE_NEW_QUESTION = {
    "category": "Databricks Intelligence Platform",
    "difficulty": "advanced",
    "question": "Em um lakehouse com múltiplas workspaces, qual é a forma de compartilhar dados entre workspaces mantendo governança centralizada?",
    "options": {
        "A": "Usar volumes compartilhados no DBFS; permissões por arquivo no OS",
        "B": "Unity Catalog com Metastore compartilhado; permissões centralizadas no UC",
        "C": "Copiar dados entre workspaces; sincronizar via cron job",
        "D": "Usar Delta Shares para compartilhamento externo apenas, workspace exigem cópia"
    },
    "correctAnswer": "B",
    "rationale": "Unity Catalog oferece metastore centralizado que pode ser compartilhado entre múltiplos workspaces. Todos os workspaces acessam o mesmo Metastore, permitindo governança centralizada via permissões unificadas, data lineage global e PII detection em toda a organização. Delta Shares é para compartilhamento externo com parceiros. Copiar dados duplica storage e quebra governança. DBFS compartilhado não oferece enforcement de segurança no nível de dados.",
    "tip": "UC Metastore compartilhado = governança global para multi-workspace. Delta Shares = compartilhamento externo.",
    "officialReference": {
        "title": "Unity Catalog for Multi-Workspace Governance",
        "url": "https://docs.databricks.com/en/data-governance/unity-catalog/multi-workspace.html"
    },
    "contextScenario": "Empresa com 5 workspaces: Dev, Test, Prod, Analytics, Science. Todos devem acessar tabelas de clientes com permissões diferentes. UC metastore compartilhado centraliza tudo."
}

if __name__ == '__main__':
    print("=" * 80)
    print("🔧 HELPER PARA ADICIONAR NOVAS PERGUNTAS")
    print("=" * 80)
    
    print("\n📝 TEMPLATE DISPONÍVEL EM: TEMPLATE dict")
    print("✓ CATEGORIAS VÁLIDAS:", CATEGORIES)
    print("✓ DIFICULDADES: foundational, intermediate, advanced")
    print(f"✓ RATIONALE: {QUALITY_REQUIREMENTS['rationale_min_length']}-{QUALITY_REQUIREMENTS['rationale_max_length']} caracteres")
    
    print("\n" + "=" * 80)
    print("📋 VALIDANDO EXEMPLO DE PERGUNTA...")
    print("=" * 80)
    
    errors = validate_question(EXAMPLE_NEW_QUESTION)
    if errors:
        print("❌ Erros encontrados:")
        for error in errors:
            print(f"   {error}")
    else:
        print("✅ Exemplo válido!")
        print(f"   Categoria: {EXAMPLE_NEW_QUESTION['category']}")
        print(f"   Dificuldade: {EXAMPLE_NEW_QUESTION['difficulty']}")
        print(f"   Rationale length: {len(EXAMPLE_NEW_QUESTION['rationale'])} chars")
    
    print("\n" + "=" * 80)
    print("💡 PARA ADICIONAR NOVAS PERGUNTAS:")
    print("=" * 80)
    print("""
1. Copie EXAMPLE_NEW_QUESTION como base
2. Preencha todos os campos seguindo TEMPLATE
3. Execute: add_new_questions([sua_pergunta])
4. Sistema valida automaticamente e adiciona com ID único

Exemplo de uso:
    new_q = {
        "category": "Data Governance & Quality",
        "difficulty": "intermediate",
        ...
    }
    add_new_questions([new_q])
""")
