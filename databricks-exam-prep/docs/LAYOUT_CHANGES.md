// Stylesheet simplificado para visualizar a alteração estrutural de layout
// Este é um resumo da estrutura mudada:
// 
// ANTES (layout original):
// - Header grande com "Modo Pergunta-a-Pergunta"
// - Grid 3 colunas: 2 col para questão, 1 col para sidebar
// - Questão com muito padding (p-8)
// - Explicação visível sempre
// 
// DEPOIS (layout responsivo):
// - Header compacto (apenas questão X de Y + timer)
// - Grid responsivo: mobile = 1 col, desktop = 3 cols (2 col questão + 1 col sidebar)
// - Questão com padding menor (p-4 md:p-6)
// - Explicação OCULTA até responder (showFeedback)
// - Sidebar OCULTA em mobile (hidden md:flex)
// - Opções com padding reduzido (p-3 vs p-4)
// - Todo conteúdo dentro do viewport em mobile sem scroll
//
// MUDANÇAS CSS APLICADAS:
// 1. Header: py-8 → py-2 md:py-3, text-2xl → text-lg md:text-xl
// 2. Card: p-8 → p-4 md:p-6
// 3. Opções: p-4 → p-3, space-y-3 → space-y-2
// 4. Feedback: max-h-40 md:max-h-48 overflow-y-auto
// 5. Botões: flex-1 com space-y-2 em mobile
// 6. Sidebar: hidden md:flex (visível apenas desktop)
// 7. Fonts: text-base md:text-lg (responsivo)
// 8. Container: uso de flex flex-col md:grid para layout responsivo
