# Distribuição Oficial do Exame Databricks

## Visão Geral
Este documento descreve a distribuição de questões conforme o **Guia de Estudos Oficial da Certificação Databricks** para o exame de *Databricks Associate Data Engineer*.

## Distribuição por Categoria (20% cada)

O exame oficial Databricks é composto por 5 categorias principais, cada uma representando **20%** das questões:

| Categoria | Percentual | Questões (em 45) | Questões (em 454) |
|-----------|-----------|-----------------|-----------------|
| Databricks Intelligence Platform | 20% | 9 | ~91 |
| Development and Ingestion | 20% | 9 | ~91 |
| Data Processing & Transformations | 20% | 9 | ~91 |
| Data Governance & Quality | 20% | 9 | ~91 |
| Productionizing Data Pipelines | 20% | 9 | ~91 |
| **TOTAL** | **100%** | **45** | **454** |

## Distribuição por Dificuldade

A dificuldade das questões também segue uma distribuição equilibrada:

| Nível | Percentual | Questões (em 45) | Questões (em 454) |
|-------|-----------|-----------------|-----------------|
| Foundational | ~33% | 15 | ~150 |
| Intermediate | ~33% | 15 | ~150 |
| Advanced | ~33% | 15 | ~152 |
| **TOTAL** | **100%** | **45** | **452-454** |

## Distribuição por Tipo de Questão

As questões variam em tipo, testando diferentes skills:

| Tipo | Exemplos | Questões (em 454) |
|------|----------|-----------------|
| Conceptual | Definições, teória, conceitos | ~120 |
| Code Interpretation | Analisar código e prever output | ~121 |
| Architecture | Design de soluções, arquitetura | ~111 |
| Troubleshooting | Identificar e resolver problemas | ~102 |
| **TOTAL** | | **454** |

## Implementação no Simulador

### Modo Prova Oficial (Exam Mode)
- **Duração**: 90 minutos
- **Quantidade**: 45 questões
- **Seleção**: Estratificada por categoria (20% cada)
- **Aleatoriedade**: Questões embaralhadas, mas mantendo proporções
- **Repetição**: Garantida sem repetição de questões ID dentro de uma mesma prova

### Modo Pergunta-a-Pergunta (Practice Mode)
- **Controle total**: Usuário seleciona categorias, quantidade e tempo
- **Seleção**: Aleatória dentro dos critérios selecionados
- **Flexibilidade**: Permite focar em áreas específicas

## Algoritmo de Seleção

A função `selectBalancedQuestions()` em `ExamMode.tsx` implementa:

1. **Alocação Proporcional**: Calcula quantas questões de cada categoria são necessárias
2. **Embaralhamento por Categoria**: Embaralha questões de cada categoria independentemente
3. **Seleção Estratificada**: Pega o número exato de cada categoria
4. **Preenchimento**: Se necessário, preenche gaps com questões aleatórias
5. **Embaralhamento Final**: Embaralha a ordem final para não aparecer por categoria

```typescript
selectBalancedQuestions(allQuestions, 45) → [Q1, Q45, Q23, ...] (balanceado, embaralhado)
```

## Validação

Após cada prova, os estatísticos são calculados:
- ✅ Distribuição por categoria (deve ser ~20% cada)
- ✅ Distribuição por dificuldade (deve ser ~33% cada)
- ✅ Sem duplicatas de questão ID
- ✅ Total de 45 questões

## Referências

- [Databricks Certification Guide](https://www.databricks.com/learn/certification)
- [Associate Data Engineer Exam Details](https://www.databricks.com/learn/certification/associate-data-engineer)
- Estrutura de categorias baseada no programa oficial de estudos

## Histórico de Atualizações

| Data | Alteração |
|------|-----------|
| 2024 | Implementação de seleção estratificada por categoria |
| 2024 | Adição de validação de distribuição |
| 2024 | Documento criado com distribuições oficiais |
