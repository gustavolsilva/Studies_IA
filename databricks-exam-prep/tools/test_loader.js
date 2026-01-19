// Testa se o JSON pode ser carregado e transformado
async function test() {
  try {
    const response = await fetch('file:///home/gustavo/Projects/Studies_IA/databricks-exam-prep/client/public/questions_enhanced.json');
    const data = await response.json();
    console.log('✅ JSON carregado:', data.length, 'questões');
    
    // Simular a transformação
    if (data[0]?.options_A) {
      const transformed = data.map(q => ({
        ...q,
        options: {
          A: q.options_A,
          B: q.options_B,
          C: q.options_C,
          D: q.options_D,
        },
      }));
      console.log('✅ Transformação simulada');
      console.log('Primeira questão transformada:', transformed[0].question);
      console.log('Opção A:', transformed[0].options.A);
    }
  } catch (e) {
    console.error('❌ Erro:', e.message);
  }
}

test();
