#!/usr/bin/env python3
"""
Perguntas EXPANDIDAS com foco em SINTAXE PYSPARK
Baseado no guia oficial do exame Databricks Certified Data Engineer Associate
"""

import json

# Perguntas com SINTAXE REAL de PySpark/SQL
PYSPARK_SYNTAX_QUESTIONS = [
    # ========== DATABRICKS LAKEHOUSE PLATFORM ==========
    {
        "category": "Databricks Intelligence Platform",
        "difficulty": "intermediate",
        "question": "Qual comando SQL você usaria para criar uma tabela Delta gerenciada (managed table) a partir de um DataFrame chamado 'df'?",
        "options": {
            "A": "df.write.format('delta').saveAsTable('my_table')",
            "B": "df.write.format('parquet').mode('overwrite').save('/mnt/data/my_table')",
            "C": "CREATE TABLE my_table USING delta AS SELECT * FROM df",
            "D": "df.createOrReplaceTempView('my_table')"
        },
        "correctAnswer": "A",
        "rationale": "Para criar tabela Delta gerenciada, use df.write.format('delta').saveAsTable('table_name'). Isso cria managed table no metastore com dados e metadata gerenciados pelo Databricks. Opção B cria tabela externa (external). Opção C é sintaxe SQL mas 'df' não funciona diretamente. Opção D cria temp view, não tabela persistente. Managed tables armazenam dados em location padrão do Databricks.",
        "tip": "saveAsTable() = managed table. save() = external table",
        "officialReference": {
            "title": "Create Delta Tables",
            "url": "https://docs.databricks.com/en/delta/tutorial.html"
        },
        "contextScenario": "ETL que processa vendas diárias e precisa salvar resultado em tabela Delta managed para consultas analíticas posteriores."
    },
    
    {
        "category": "Databricks Intelligence Platform",
        "difficulty": "advanced",
        "question": "Qual é a sintaxe correta para ler dados de uma tabela Delta e fazer time travel para uma versão específica em PySpark?",
        "options": {
            "A": "spark.read.format('delta').option('versionAsOf', 10).load('/path/to/table')",
            "B": "spark.read.delta('/path/to/table').version(10)",
            "C": "spark.table('my_table').timeTravel(version=10)",
            "D": "SELECT * FROM my_table@v10"
        },
        "correctAnswer": "A",
        "rationale": "Time Travel em PySpark usa option('versionAsOf', version_number) ou option('timestampAsOf', 'timestamp'). Sintaxe: spark.read.format('delta').option('versionAsOf', 10).load(path). Para SQL: SELECT * FROM table VERSION AS OF 10 ou TIMESTAMP AS OF '2024-01-01'. Opção B não existe. Opção C não é sintaxe válida. Opção D não é sintaxe correta (seria VERSION AS OF, não @v10).",
        "tip": "Time Travel PySpark: option('versionAsOf', num). SQL: VERSION AS OF num",
        "officialReference": {
            "title": "Delta Lake Time Travel",
            "url": "https://docs.databricks.com/en/delta/history.html"
        },
        "contextScenario": "Investigação de bug: dados foram deletados sexta-feira. Precisando acessar estado da tabela de quinta (versão 145) para restaurar registros."
    },

    # ========== ELT WITH SPARK SQL AND PYTHON ==========
    {
        "category": "Data Processing & Transformations",
        "difficulty": "intermediate",
        "question": "Qual função você usaria para explodir (explode) um array column em múltiplas linhas em PySpark?",
        "options": {
            "A": "df.select('order_id', F.explode('items').alias('item'))",
            "B": "df.select('order_id', 'items').flatMap(lambda x: x)",
            "C": "df.select('*').split('items')",
            "D": "df.selectExpr('order_id', 'UNNEST(items) as item')"
        },
        "correctAnswer": "A",
        "rationale": "F.explode() cria uma linha por elemento em array. Sintaxe: from pyspark.sql import functions as F; df.select('order_id', F.explode('items').alias('item')). Opção B usa flatMap mas não é idiomatic PySpark. Opção C não existe. Opção D usa UNNEST que não é função Spark (é SQL padrão mas não suportado). Explode mantém outras colunas se usar select('*', F.explode(col)).",
        "tip": "F.explode(col) = 1 linha por elemento. Use com .alias() para nomear coluna resultante.",
        "officialReference": {
            "title": "PySpark explode function",
            "url": "https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.functions.explode.html"
        },
        "contextScenario": "Tabela orders com coluna 'items' (array de produtos). Precisando gerar relatório com 1 linha por produto vendido."
    },
    
    {
        "category": "Data Processing & Transformations",
        "difficulty": "advanced",
        "question": "Qual é a sintaxe correta para fazer MERGE (UPSERT) em uma tabela Delta usando SQL?",
        "options": {
            "A": "MERGE INTO target USING source ON target.id = source.id WHEN MATCHED THEN UPDATE SET * WHEN NOT MATCHED THEN INSERT *",
            "B": "INSERT INTO target SELECT * FROM source ON DUPLICATE KEY UPDATE",
            "C": "UPSERT INTO target FROM source WHERE id = id",
            "D": "UPDATE target SET * FROM source WHERE target.id = source.id; INSERT INTO target SELECT * FROM source WHERE id NOT IN (SELECT id FROM target)"
        },
        "correctAnswer": "A",
        "rationale": "MERGE é comando SQL padrão em Delta Lake. Sintaxe: MERGE INTO target USING source ON condition WHEN MATCHED THEN UPDATE SET * WHEN NOT MATCHED THEN INSERT *. SET * atualiza todas as colunas. Pode especificar colunas: SET col1 = source.col1. WHEN NOT MATCHED BY SOURCE THEN DELETE é opcional. Opção B é MySQL syntax. Opção C não existe. Opção D é manual e ineficiente.",
        "tip": "MERGE INTO ... USING ... ON ... WHEN MATCHED/NOT MATCHED. SET * para todas as colunas.",
        "officialReference": {
            "title": "Delta Lake MERGE",
            "url": "https://docs.databricks.com/en/sql/language-manual/delta-merge-into.html"
        },
        "contextScenario": "CDC (Change Data Capture) diário: novos registros INSERT, existentes UPDATE. MERGE garante idempotência sem duplicação."
    },
    
    {
        "category": "Data Processing & Transformations",
        "difficulty": "intermediate",
        "question": "Como adicionar uma coluna calculada 'price_with_tax' (price * 1.1) em um DataFrame PySpark?",
        "options": {
            "A": "df.withColumn('price_with_tax', F.col('price') * 1.1)",
            "B": "df.select('*', 'price * 1.1 as price_with_tax')",
            "C": "df['price_with_tax'] = df['price'] * 1.1",
            "D": "df.addColumn('price_with_tax', lambda row: row.price * 1.1)"
        },
        "correctAnswer": "A",
        "rationale": "withColumn() adiciona/substitui coluna. Sintaxe: df.withColumn('new_col', expression). Usa F.col() ou df['col'] para referenciar colunas. Exemplo: df.withColumn('price_with_tax', F.col('price') * 1.1). Opção B precisa selectExpr para strings SQL. Opção C não funciona (DataFrame immutable). Opção D não existe. Para múltiplas colunas, melhor usar select() que withColumn() encadeado (performance).",
        "tip": "withColumn('name', expression) adiciona coluna. Use F.col() para referenciar existentes.",
        "officialReference": {
            "title": "DataFrame.withColumn",
            "url": "https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.withColumn.html"
        },
        "contextScenario": "Processamento de vendas: adicionar coluna 'price_with_tax' para relatórios financeiros que incluem impostos."
    },

    # ========== INCREMENTAL DATA PROCESSING ==========
    {
        "category": "Development and Ingestion",
        "difficulty": "intermediate",
        "question": "Qual é a sintaxe correta para usar Auto Loader para ler arquivos JSON de S3 com schema inference?",
        "options": {
            "A": "spark.readStream.format('cloudFiles').option('cloudFiles.format', 'json').option('cloudFiles.schemaLocation', '/tmp/schema').load('s3://bucket/path/')",
            "B": "spark.read.format('json').option('inferSchema', 'true').load('s3://bucket/path/')",
            "C": "spark.readStream.format('autoloader').option('format', 'json').load('s3://bucket/path/')",
            "D": "spark.readStream.json('s3://bucket/path/').option('cloudFiles', 'true')"
        },
        "correctAnswer": "A",
        "rationale": "Auto Loader usa format('cloudFiles') em readStream. Opções necessárias: cloudFiles.format (tipo de arquivo), cloudFiles.schemaLocation (onde guardar schema inferido). Sintaxe completa: spark.readStream.format('cloudFiles').option('cloudFiles.format', 'json').option('cloudFiles.schemaLocation', '/schema/path').load('s3://...'). Opção B é batch read, não streaming. Opção C format é 'cloudFiles', não 'autoloader'. Opção D não tem cloudFiles.format.",
        "tip": "Auto Loader = readStream + format('cloudFiles') + cloudFiles.format + cloudFiles.schemaLocation",
        "officialReference": {
            "title": "Auto Loader Python syntax",
            "url": "https://docs.databricks.com/en/ingestion/auto-loader/python.html"
        },
        "contextScenario": "Ingestão incremental: 1000 arquivos JSON chegam diariamente em S3. Auto Loader detecta novos, infere schema, e processa."
    },
    
    {
        "category": "Development and Ingestion",
        "difficulty": "advanced",
        "question": "Qual sintaxe SQL você usaria para criar uma streaming table em Delta Live Tables que lê de uma source table?",
        "options": {
            "A": "CREATE OR REFRESH STREAMING TABLE bronze_orders AS SELECT * FROM STREAM(cloud_files('/data/orders/', 'json'))",
            "B": "CREATE STREAMING TABLE bronze_orders AS SELECT * FROM read_stream('/data/orders/')",
            "C": "CREATE TABLE bronze_orders STREAMING=true AS SELECT * FROM orders_source",
            "D": "CREATE LIVE TABLE bronze_orders STREAM AS SELECT * FROM orders"
        },
        "correctAnswer": "A",
        "rationale": "Delta Live Tables usa CREATE OR REFRESH STREAMING TABLE para tabelas streaming. cloud_files() é função DLT para Auto Loader. STREAM() transforma batch source em stream. Sintaxe: CREATE OR REFRESH STREAMING TABLE name AS SELECT * FROM STREAM(cloud_files(path, format)). Opção B não tem REFRESH. Opção C STREAMING=true não existe. Opção D CREATE LIVE TABLE é sintaxe antiga/incorreta.",
        "tip": "DLT: CREATE OR REFRESH STREAMING TABLE. Use STREAM() para converter batch em stream.",
        "officialReference": {
            "title": "Delta Live Tables SQL",
            "url": "https://docs.databricks.com/en/delta-live-tables/sql-ref.html"
        },
        "contextScenario": "Pipeline bronze layer em DLT: ler CSVs de S3 incrementalmente e criar streaming table para transformações downstream."
    },

    {
        "category": "Development and Ingestion",
        "difficulty": "advanced",
        "question": "Em Delta Live Tables Python, qual decorador você usa para definir uma tabela com expectation de qualidade de dados?",
        "options": {
            "A": "@dlt.table(name='sales_clean') @dlt.expect('valid_amount', 'amount > 0')",
            "B": "@dlt.create_table('sales_clean', quality_check='amount > 0')",
            "C": "@dlt.table() @dlt.quality('amount > 0')",
            "D": "@dlt.table(name='sales_clean', constraint='amount > 0')"
        },
        "correctAnswer": "A",
        "rationale": "DLT Python usa @dlt.table() para definir tabela e @dlt.expect() para quality expectations. Sintaxe: @dlt.table(name='table_name') seguido de @dlt.expect('description', 'SQL_condition') antes da função. Expectation modes: 'warn' (padrão), 'drop', 'fail'. Exemplo completo: @dlt.table(name='clean') @dlt.expect('positive', 'amount > 0') def clean_sales(): return spark.table('raw_sales'). Opções B/C/D não são sintaxe válida.",
        "tip": "@dlt.table() + @dlt.expect('name', 'condition'). Modes: warn, drop, fail",
        "officialReference": {
            "title": "DLT Python expectations",
            "url": "https://docs.databricks.com/en/delta-live-tables/expectations.html"
        },
        "contextScenario": "Pipeline DLT: validar vendas têm amount > 0. Expect com mode 'drop' remove registros inválidos automaticamente."
    },

    # ========== DATA GOVERNANCE ==========
    {
        "category": "Data Governance & Quality",
        "difficulty": "intermediate",
        "question": "Qual comando SQL você usaria para conceder permissão SELECT em uma tabela no Unity Catalog?",
        "options": {
            "A": "GRANT SELECT ON TABLE catalog.schema.table TO user@domain.com",
            "B": "GRANT READ ON catalog.schema.table TO user@domain.com",
            "C": "ALTER TABLE catalog.schema.table SET PERMISSIONS SELECT FOR user@domain.com",
            "D": "GRANT ALL PRIVILEGES ON TABLE catalog.schema.table TO user@domain.com"
        },
        "correctAnswer": "A",
        "rationale": "Unity Catalog usa sintaxe SQL padrão: GRANT privilege ON object TO principal. Sintaxe: GRANT SELECT ON TABLE catalog.schema.table TO `user@domain.com`. Nota: email com backticks. Privileges: SELECT, INSERT, MODIFY, CREATE, USE, EXECUTE. Para group: GRANT SELECT ON TABLE ... TO `group_name`. Para REVOKE: REVOKE SELECT ON TABLE ... FROM `user`. Opção B usa READ (não existe). Opção C não é sintaxe SQL. Opção D dá ALL (muito permissivo).",
        "tip": "GRANT SELECT/INSERT/MODIFY ON TABLE catalog.schema.table TO `principal`",
        "officialReference": {
            "title": "Unity Catalog GRANT",
            "url": "https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-aux-security-grant.html"
        },
        "contextScenario": "Dar acesso SELECT para analytics team em tabela de vendas: GRANT SELECT ON TABLE prod.sales.orders TO `analytics_team`"
    },
    
    {
        "category": "Data Governance & Quality",
        "difficulty": "advanced",
        "question": "Como criar uma view no Unity Catalog que filtra dados baseado no usuário atual?",
        "options": {
            "A": "CREATE VIEW secure_view AS SELECT * FROM customers WHERE region = current_user()",
            "B": "CREATE SECURE VIEW secure_view AS SELECT * FROM customers WHERE region = (SELECT region FROM user_regions WHERE user = current_user())",
            "C": "CREATE VIEW secure_view WITH SECURITY AS SELECT * FROM customers WHERE region = SESSION_USER",
            "D": "CREATE OR REPLACE VIEW secure_view AS SELECT * FROM customers WHERE is_authorized(current_user(), region)"
        },
        "correctAnswer": "B",
        "rationale": "Para row-level security com views, use subquery que filtra baseado em current_user(). current_user() retorna email do usuário. Exemplo: CREATE VIEW secure_view AS SELECT * FROM data WHERE region IN (SELECT region FROM permissions WHERE user = current_user()). Para column masking, use CASE: SELECT id, CASE WHEN is_admin() THEN ssn ELSE 'REDACTED' END. Opção A assume region = email (improvável). Opção C SESSION_USER não existe. Opção D is_authorized() não é função built-in.",
        "tip": "Use current_user() em subquery para filtrar. Para masking: CASE WHEN condition THEN real ELSE masked",
        "officialReference": {
            "title": "Row and Column filters in UC",
            "url": "https://docs.databricks.com/en/data-governance/unity-catalog/row-and-column-filters.html"
        },
        "contextScenario": "View que mostra apenas dados da região do usuário: user em US vê dados US, user em EU vê dados EU."
    },

    # ========== PRODUCTION PIPELINES ==========
    {
        "category": "Productionizing Data Pipelines",
        "difficulty": "intermediate",
        "question": "Qual comando SQL você usaria para otimizar uma tabela Delta e aplicar Z-ORDER em duas colunas?",
        "options": {
            "A": "OPTIMIZE table_name ZORDER BY (date, customer_id)",
            "B": "OPTIMIZE table_name WITH ZORDER ON (date, customer_id)",
            "C": "ALTER TABLE table_name OPTIMIZE ZORDER (date, customer_id)",
            "D": "OPTIMIZE table_name SET ZORDER = 'date, customer_id'"
        },
        "correctAnswer": "A",
        "rationale": "OPTIMIZE compacta small files e aplica Z-ORDER. Sintaxe: OPTIMIZE table_name ZORDER BY (col1, col2, ...). Z-ORDER organiza dados para data skipping em múltiplas dimensões. Máximo recomendado: 2-4 colunas. Ordem importa: colunas mais filtradas primeiro. Após OPTIMIZE, rode VACUUM para remover versões antigas: VACUUM table_name RETAIN 168 HOURS (default 7 dias). Opções B/C/D não são sintaxe correta.",
        "tip": "OPTIMIZE table ZORDER BY (cols). Depois VACUUM para limpar. Max 2-4 colunas.",
        "officialReference": {
            "title": "OPTIMIZE and Z-ORDER",
            "url": "https://docs.databricks.com/en/sql/language-manual/delta-optimize.html"
        },
        "contextScenario": "Tabela 500GB com queries que filtram por date AND customer_id. OPTIMIZE ZORDER BY (date, customer_id) melhora scan 10x."
    },
    
    {
        "category": "Productionizing Data Pipelines",
        "difficulty": "advanced",
        "question": "Qual é a sintaxe para criar um Databricks Job via API REST para rodar um notebook com parameters?",
        "options": {
            "A": "POST /api/2.1/jobs/create com JSON: {\"name\": \"my_job\", \"tasks\": [{\"task_key\": \"task1\", \"notebook_task\": {\"notebook_path\": \"/path/notebook\", \"base_parameters\": {\"date\": \"2024-01-01\"}}}]}",
            "B": "POST /api/2.0/jobs/run com {\"notebook_path\": \"/path\", \"parameters\": {\"date\": \"2024-01-01\"}}",
            "C": "POST /api/2.1/jobs/submit com {\"run_name\": \"job\", \"notebook\": \"/path\", \"args\": [\"date=2024-01-01\"]}",
            "D": "POST /api/jobs/create com {\"job_name\": \"my_job\", \"notebook\": \"/path\", \"params\": {\"date\": \"2024-01-01\"}}"
        },
        "correctAnswer": "A",
        "rationale": "Jobs API 2.1 usa POST /api/2.1/jobs/create. JSON structure: {\"name\": \"job_name\", \"tasks\": [{\"task_key\": \"key\", \"notebook_task\": {\"notebook_path\": \"/path\", \"base_parameters\": {\"param\": \"value\"}}, \"job_cluster_key\": \"cluster\"}], \"job_clusters\": [...]}. Para rodar job criado: POST /api/2.1/jobs/run-now com {\"job_id\": id}. Opção B é /run-now, não /create. Opção C /submit é one-time run. Opção D não é sintaxe correta.",
        "tip": "Jobs API 2.1: /jobs/create para criar, /jobs/run-now para executar, /jobs/list para listar",
        "officialReference": {
            "title": "Databricks Jobs API 2.1",
            "url": "https://docs.databricks.com/api/workspace/jobs/create"
        },
        "contextScenario": "Automatizar criação de jobs via CI/CD: criar job que roda notebook ETL com parameter 'date' passado dinamicamente."
    },
]

def add_pyspark_questions():
    """Adiciona perguntas de sintaxe PySpark ao banco existente"""
    with open('client/public/questions_expanded.json', 'r', encoding='utf-8') as f:
        current = json.load(f)
    
    max_id = max(q['id'] for q in current)
    
    for i, q in enumerate(PYSPARK_SYNTAX_QUESTIONS):
        q['id'] = max_id + i + 1
        current.append(q)
    
    with open('client/public/questions_expanded.json', 'w', encoding='utf-8') as f:
        json.dump(current, f, ensure_ascii=False, indent=2)
    
    categories = {}
    for q in current:
        categories[q['category']] = categories.get(q['category'], 0) + 1
    
    print("=" * 80)
    print("✅ PERGUNTAS DE SINTAXE PYSPARK ADICIONADAS")
    print("=" * 80)
    print(f"\n📊 Total de perguntas: {len(current)}")
    print(f"➕ Perguntas PySpark adicionadas: {len(PYSPARK_SYNTAX_QUESTIONS)}")
    print(f"\n📁 Distribuição por Categoria:")
    for cat in sorted(categories.keys()):
        print(f"  {cat}: {categories[cat]}")
    
    # Análise de qualidade
    rationale_lengths = [len(q.get('rationale', '')) for q in current]
    print(f"\n📈 Qualidade de Respostas:")
    print(f"  Média: {sum(rationale_lengths)//len(rationale_lengths)} caracteres")
    print(f"  Mínimo: {min(rationale_lengths)} caracteres")
    print(f"  Máximo: {max(rationale_lengths)} caracteres")
    
    # Contar perguntas com sintaxe
    syntax_count = sum(1 for q in current if any(keyword in q['question'].lower() or keyword in str(q['options']).lower() 
                                                   for keyword in ['sintaxe', 'comando', 'código', 'spark', 'sql', 'df.', 'select', 'create', 'merge', '@dlt']))
    print(f"\n🔧 Perguntas com Sintaxe/Código: {syntax_count} ({100*syntax_count//len(current)}%)")

if __name__ == '__main__':
    add_pyspark_questions()
