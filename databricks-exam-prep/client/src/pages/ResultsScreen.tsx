import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { QuizStats } from '@/hooks/useQuizState';
import { BarChart3, TrendingUp, Trophy, RefreshCw, Home } from 'lucide-react';
import { useLocation } from 'wouter';

interface ResultsScreenProps {
  stats: QuizStats;
  onRestart: () => void;
}

export default function ResultsScreen({ stats, onRestart }: ResultsScreenProps) {
  const [, setLocation] = useLocation();
  const correctPercentage = Math.round((stats.correct / stats.totalQuestions) * 100);
  const isPassed = correctPercentage >= 70;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center ${
                isPassed ? 'bg-green-100' : 'bg-orange-100'
              }`}
            >
              <Trophy className={`w-10 h-10 ${isPassed ? 'text-green-600' : 'text-orange-600'}`} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            Simulado Concluído!
          </h1>
          <p className="text-lg text-muted-foreground">
            {isPassed
              ? 'Parabéns! Você atingiu uma excelente pontuação.'
              : 'Continue praticando para melhorar seu desempenho.'}
          </p>
        </div>

        {/* Main Score */}
        <Card className="bg-card border border-border rounded-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-primary mb-2">{correctPercentage}%</div>
            <p className="text-lg text-muted-foreground">Taxa de Acerto</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-border">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.correct}</div>
              <p className="text-sm text-muted-foreground mt-1">Corretas</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-destructive">{stats.incorrect}</div>
              <p className="text-sm text-muted-foreground mt-1">Incorretas</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats.totalQuestions}</div>
              <p className="text-sm text-muted-foreground mt-1">Total</p>
            </div>
          </div>

          {/* Performance Message */}
          <div
            className={`rounded-lg p-4 text-center ${
              isPassed
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-orange-50 text-orange-700 border border-orange-200'
            }`}
          >
            {isPassed
              ? 'Você está bem preparado para o exame! Continue revisando os tópicos com menor desempenho.'
              : 'Revise os tópicos com menor desempenho e tente novamente.'}
          </div>
        </Card>

        {/* Performance by Category */}
        <Card className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Desempenho por Categoria
          </h2>
          <div className="space-y-4">
            {Object.entries(stats.byCategory).map(([category, data]) => {
              const categoryPercentage = Math.round((data.correct / data.total) * 100);
              return (
                <div key={category}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-foreground">{category}</span>
                    <span className="text-sm text-muted-foreground">
                      {data.correct}/{data.total} ({categoryPercentage}%)
                    </span>
                  </div>
                  <Progress value={categoryPercentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Performance by Difficulty */}
        <Card className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Desempenho por Dificuldade
          </h2>
          <div className="space-y-4">
            {Object.entries(stats.byDifficulty).map(([difficulty, data]) => {
              const difficultyPercentage = Math.round((data.correct / data.total) * 100);
              return (
                <div key={difficulty}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-foreground capitalize">
                      {difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {data.correct}/{data.total} ({difficultyPercentage}%)
                    </span>
                  </div>
                  <Progress value={difficultyPercentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recommendations */}
        <Card className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Recomendações</h2>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Revise as categorias com menor taxa de acerto</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Pratique questões de dificuldade avançada para consolidar conhecimento</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Estude a documentação oficial de Databricks para tópicos desafiadores</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Faça este simulado novamente em 1-2 semanas para acompanhar progresso</span>
            </li>
          </ul>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => setLocation("/")}
              variant="outline"
              size="lg"
              className="px-8 py-6 text-base font-semibold flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Voltar para Home
            </Button>
            <Button
              onClick={onRestart}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Refazer Simulado
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
