/**
 * Carrega questões a partir do banco oficial (questions_enhanced.json).
 * Mantém embaralhamento das alternativas por questão.
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
 * Embaralha as opções de uma questão, mantendo rastreamento da resposta correta
 */
export function shuffleQuestionOptions(question: Question): Question {
  const letters: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  const originalOptions = {
    A: question.options.A,
    B: question.options.B,
    C: question.options.C,
    D: question.options.D,
  };
  
  // Fisher-Yates shuffle
  const shuffled = [...letters];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Mapear opções embaralhadas
  const newOptions = {
    A: originalOptions[shuffled[0]],
    B: originalOptions[shuffled[1]],
    C: originalOptions[shuffled[2]],
    D: originalOptions[shuffled[3]],
  };
  
  // Encontrar nova posição da resposta correta
  const correctIndex = shuffled.indexOf(question.correctAnswer);
  const newCorrectAnswer = letters[correctIndex];
  
  return {
    ...question,
    options: newOptions,
    correctAnswer: newCorrectAnswer,
  };
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
  
  let questions: Question[];
  
  // Se dados vêm do gerador de Parquet, reconstruir options
  if (data[0]?.options_A) {
    console.log('🔄 [questionsLoader] Transformando options_A/B/C/D → options.A/B/C/D');
    questions = data.map((q: any) => ({
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
  } else {
    console.log('⏭️  [questionsLoader] JSON já em formato correto');
    questions = data;
  }
  
  // Embaralhar opções de cada questão
  console.log('🎲 [questionsLoader] Embaralhando opções de resposta...');
  questions = questions.map(shuffleQuestionOptions);
  
  return questions;
}

/**
 * Carrega questões do banco oficial (questions_enhanced.json)
 */
export async function loadQuestions(): Promise<Question[]> {
  try {
    console.log('📄 Carregando banco oficial: questions_enhanced.json');
    const questions = await loadFromJSON('/questions_enhanced.json');
    console.log(`✅ Carregadas ${questions.length} questões de JSON enhanced`);
    return questions;
  } catch (error) {
    console.error('❌ Falha ao carregar banco de questões', error);
    throw new Error('Não foi possível carregar questions_enhanced.json em client/public');
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
