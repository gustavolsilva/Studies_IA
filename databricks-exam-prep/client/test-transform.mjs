// Simula exatamente o que o questionsLoader faz
async function loadFromJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  
  const data = await response.json();
  console.log(`📦 JSON carregado:`, data.length, 'questões');
  console.log(`Primeiro item tem options_A?`, !!data[0]?.options_A);
  
  // Se dados vêm do gerador de Parquet, reconstruir options
  if (data[0]?.options_A) {
    console.log('🔄 Transformando de options_A/B/C/D para options.A/B/C/D');
    return data.map((q) => ({
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
  
  console.log('⏭️  JSON já em formato correto, retornando como está');
  return data;
}

async function test() {
  try {
    const questions = await loadFromJSON('file:///home/gustavo/Projects/Studies_IA/databricks-exam-prep/client/public/questions_enhanced.json');
    console.log(`\n✅ Transformação completa!`);
    console.log(`✅ Total: ${questions.length} questões`);
    console.log(`\nPrimeira questão após transformação:`);
    console.log(`  ID: ${questions[0].id}`);
    console.log(`  Pergunta: ${questions[0].question.substring(0, 50)}...`);
    console.log(`  Tem options.A? ${!!questions[0].options?.A}`);
    console.log(`  Tem options.B? ${!!questions[0].options?.B}`);
    console.log(`  Options.A = "${questions[0].options.A.substring(0, 40)}..."`);
    console.log(`  officialReference.title = "${questions[0].officialReference?.title}"`);
  } catch (e) {
    console.error('❌ Erro:', e.message);
  }
}

test();
