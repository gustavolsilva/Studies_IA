#!/usr/bin/env python3
import json

ADDITIONAL_QUESTIONS = [
    {"id": 101, "category": "Databricks Intelligence Platform", "difficulty": "foundational", "question": "Qual é a hierarquia correta de objetos no Unity Catalog para organização de dados multi-tenant?", "options": {"A": "Workspace > Catalog > Schema > Table", "B": "Metastore > Catalog > Schema > Table", "C": "Cluster > Workspace > Database > Table", "D": "Account > Workspace > Catalog > Database"}, "correctAnswer": "B", "rationale": "A hierarquia correta do Unity Catalog é: Metastore (organização/conta) > Catalog (projeto/departamento) > Schema (namespace lógico) > Table/View/Volume. Cada nível permite aplicação de permissões granulares e isolamento de dados. Para ambiente multi-tenant com 3 departamentos, você criaria 3 Catalogs dentro do mesmo Metastore, com ACLs específicas para cada um. Workspace é conceitual acima, não faz parte da hierarquia UC.", "tip": "Metastore é o topo na UC. Catalogs = departamentos/projetos.", "officialReference": {"title": "Unity Catalog Structure and Hierarchy", "url": "https://docs.databricks.com/en/data-governance/unity-catalog/index.html"\}, "contextScenario": "Banco com Finance, Marketing e Operations. Cada departamento tem dados sensíveis. UC com 3 Catalogs oferece isolamento."},
    {"id": 102, "category": "Databricks Intelligence Platform", "difficulty": "intermediate", "question": "Como otimizar performance de queries usando Z-ORDER by para múltiplas colunas?", "options": {"A": "Z-ORDER BY (col1, col2, col3) - todas em uma operação", "B": "Executar Z-ORDER separadamente", "C": "Z-ORDER não suporta múltiplas colunas", "D": "Usar clustering por tabela via ALTER"}, "correctAnswer": "A", "rationale": "Z-ORDER reorganiza dados usando space-filling curves. Comando: OPTIMIZE table_name ZORDER BY (date, region, product). Isso melhora data skipping em queries com filtros em múltiplas colunas. Ordem importa: colunas mais frequentes nos WHERE clauses devem vir primeiro. É diferente de particionamento (que organiza em diretórios separados).", "tip": "Z-ORDER é para data skipping multi-dimensional.", "officialReference": {"title": "Delta Lake Z-ORDER Optimization", "url": "https://docs.databricks.com/en/delta/data-skipping.html"\}, "contextScenario": "Tabela de vendas 500GB. Queries filtram por DATE AND REGION AND PRODUCT. Z-ORDER pula 95% dos arquivos."},
]

def expand():
    with open('client/public/questions_expanded.json', 'r', encoding='utf-8') as f:
        current = json.load(f)
    
    max_id = max(q['id'] for q in current)
    for i, q in enumerate(ADDITIONAL_QUESTIONS):
        q['id'] = max_id + i + 1
    
    all_questions = current + ADDITIONAL_QUESTIONS
    
    with open('client/public/questions_expanded.json', 'w', encoding='utf-8') as f:
        json.dump(all_questions, f, ensure_ascii=False, indent=2)
    
    categories = {}
    for q in all_questions:
        categories[q['category']] = categories.get(q['category'], 0) + 1
    
    print(f"✅ Total: {len(all_questions)} perguntas")
    for cat in sorted(categories.keys()):
        print(f"  {cat}: {categories[cat]}")

if __name__ == '__main__':
    expand()
