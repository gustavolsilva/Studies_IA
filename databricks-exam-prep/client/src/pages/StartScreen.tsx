import { Button } from '@/components/ui/button';
import { BookOpen, Target, Zap } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  totalQuestions: number;
}

export default function StartScreen({ onStart, totalQuestions }: StartScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
            Databricks Certified
          </h1>
          <h2 className="text-3xl font-semibold text-foreground mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>Data Engineer Associate</h2>
          <p className="text-lg text-muted-foreground">Simulado Preparatório Interativo</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Target className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Questões Técnicas</h3>
            <p className="text-sm text-muted-foreground">{totalQuestions} questões de múltipla escolha</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <BookOpen className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Explicações Detalhadas</h3>
            <p className="text-sm text-muted-foreground">Racional completo para cada resposta</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Dicas Práticas</h3>
            <p className="text-sm text-muted-foreground">Insights para melhorar seu desempenho</p>
          </div>
        </div>

        {/* Topics Covered */}
        <div className="bg-card border border-border rounded-lg p-8 mb-12">
          <h3 className="text-xl font-semibold text-foreground mb-6">Tópicos Cobertos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium text-foreground">Delta Lake</h4>
                <p className="text-sm text-muted-foreground">Transações ACID, Time Travel, Comandos de otimização</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium text-foreground">Arquitetura Medallion</h4>
                <p className="text-sm text-muted-foreground">Camadas Bronze, Silver e Gold</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium text-foreground">Unity Catalog</h4>
                <p className="text-sm text-muted-foreground">Governança, permissões, linhagem de dados</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium text-foreground">Processamento de Dados</h4>
                <p className="text-sm text-muted-foreground">Spark SQL, Auto Loader, Delta Live Tables</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium text-foreground">Orquestração e DevOps</h4>
                <p className="text-sm text-muted-foreground">Databricks Jobs, Git Repos, DABs</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium text-foreground">Nível Intermediário/Avançado</h4>
                <p className="text-sm text-muted-foreground">Cenários práticos de engenharia de dados</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            onClick={onStart}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold transition-all duration-200"
          >
            Começar Simulado
          </Button>
          <p className="text-sm text-muted-foreground mt-4">Você pode pausar e retomar a qualquer momento</p>
        </div>
      </div>
    </div>
  );
}
