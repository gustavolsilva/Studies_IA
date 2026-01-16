/**
 * Carrega questões de múltiplas fontes com fallback:
 * 1. Parquet (compactado, otimizado)
 * 2. JSON (fallback, compatibilidade)
 */

export interface Question {
  id: number;
  category: string;
  difficulty: 'intermediate' | 'advanced' | 'foundational';
  questionType?: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  rationale: string;
  tip: string;
  officialReference?: {
    title: string;
    url: string;
  };
  contextScenario?: string;
}

/**
 * Carrega dados de Parquet (não implementado em navegador)
 */
async function loadFromParquet(url: string): Promise<Question[]> {
  console.warn('Parquet não suportado em navegador');
  throw new Error('Use loadFromJSON como fallback');
}

/**
 * Carrega dados de JSON
 */
async function loadFromJSON(url: string): Promise<Question[]> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  
  const data = await response.json();
  console.log('📦 [questionsLoader] Dados carregados:', data.length, 'questões');
  console.log('📦 [questionsLoader] Primeiro item tem options_A?', !!data[0]?.options_A);
  console.log('📦 [questionsLoader] Primeiro item tem options?', !!data[0]?.options);
  
  // Se dados vêm do gerador de Parquet, reconstruir options
  if (data[0]?.options_A) {
    console.log('🔄 [questionsLoader] Transformando options_A/B/C/D → options.A/B/C/D');
    return data.map((q: any) => ({
      ...q,
      options: {
        A: q.options_A,
        B: q.options_B,
        C: q.options_C,
        D: q.options_D,
      },
      officialReference: {
        title: q.reference_title,
        url: q.reference_url,
      },
    }));
  }
  
  console.log('⏭️  [questionsLoader] JSON já em formato correto, retornando como está');
  return data;
}

/**
 * Carrega questões com fallback automático
 */
export async function loadQuestions(): Promise<Question[]> {
  // Tentar Parquet primeiro (se DuckDB disponível)
  try {
    console.log('📊 Tentando carregar Parquet (otimizado)...');
    const questions = await loadFromParquet('/questions_enhanced.parquet');
    console.log(`✅ Carregadas ${questions.length} questões de Parquet`);
    return questions;
  } catch (error) {
    console.warn('⚠️  Parquet não disponível, tentando JSON...', error);
  }

  // Fallback para JSON enhanced
  try {
    console.log('📄 Tentando carregar JSON enhanced...');
    const questions = await loadFromJSON('/questions_enhanced.json');
    console.log(`✅ Carregadas ${questions.length} questões de JSON enhanced`);
    console.log(`✅ [DEBUG] Primeira questão tem options?`, !!questions[0]?.options);
    console.log(`✅ [DEBUG] Primeira questão tem options.A?`, !!questions[0]?.options?.A);
    return questions;
  } catch (error) {
    console.warn('⚠️  JSON enhanced não disponível, tentando expanded...', error);
  }

  // Fallback para JSON expanded (compatibilidade)
  try {
    console.log('📄 Tentando carregar JSON expanded...');
    const questions = await loadFromJSON('/questions_expanded.json');
    console.log(`✅ Carregadas ${questions.length} questões de JSON expanded`);
    console.log(`✅ [DEBUG] Primeira questão tem options?`, !!questions[0]?.options);
    console.log(`✅ [DEBUG] Primeira questão tem options.A?`, !!questions[0]?.options?.A);
    return questions;
  } catch (error) {
    console.error('❌ Nenhuma fonte de questões disponível!', error);
    throw new Error('Falha ao carregar banco de questões. Verifique se os arquivos estão em client/public/');
  }
}

/**
 * Valida integridade dos dados
 */
export function validateQuestions(questions: Question[]): boolean {
  if (questions.length === 0) {
    console.error('❌ Nenhuma questão carregada');
    return false;
  }

  const errors: string[] = [];

  questions.forEach((q, idx) => {
    if (!q.id) errors.push(`Q${idx}: falta id`);
    if (!q.category) errors.push(`Q${idx}: falta category`);
    if (!['foundational', 'intermediate', 'advanced'].includes(q.difficulty)) {
      errors.push(`Q${idx}: difficulty inválida (${q.difficulty})`);
    }
    if (!q.question) errors.push(`Q${idx}: falta question`);
    if (!q.options?.A || !q.options?.B || !q.options?.C || !q.options?.D) {
      errors.push(`Q${idx}: faltam options completas`);
    }
    if (!['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
      errors.push(`Q${idx}: correctAnswer inválida (${q.correctAnswer})`);
    }
    if (!q.rationale || q.rationale.length < 50) {
      errors.push(`Q${idx}: rationale muito curta`);
    }
  });

  if (errors.length > 0) {
    console.error(`❌ ${errors.length} erros de validação:`);
    errors.slice(0, 10).forEach(e => console.error(`   ${e}`));
    if (errors.length > 10) console.error(`   ... e ${errors.length - 10} mais`);
    return false;
  }

  console.log(`✅ Validação passou: ${questions.length} questões OK`);
  return true;
}
