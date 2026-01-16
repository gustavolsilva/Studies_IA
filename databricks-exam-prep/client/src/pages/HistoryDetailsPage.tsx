import { useQuizHistory } from '@/hooks/useQuizHistory';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Calendar, Clock, Target } from 'lucide-react';
import { useLocation, useRoute } from 'wouter';
import { useEffect, useState } from 'react';

export default function HistoryDetailsPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/history/:id');
  const { getAttemptDetails } = useQuizHistory();
  const [attempt, setAttempt] = useState(getAttemptDetails(params?.id || ''));

  useEffect(() => {
    if (params?.id) {
      const details = getAttemptDetails(params.id);
      setAttempt(details);
    }
  }, [params?.id, getAttemptDetails]);

  if (!attempt) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">Simulado não encontrado</p>
          <Button onClick={() => setLocation('/history')}>Voltar ao Histórico</Button>
        </div>
      </div>
    );
  }

  const accuracy = Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100);
  const modeLabel = {
    exam: 'Prova Oficial',
    practice: 'Pergunta-a-Pergunta',
    free: 'Modo Livre',
  }[attempt.mode];

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const categoryStats = Object.entries(attempt.categoryStats).map(([cat, stat]) => ({
    category: cat,
    correct: stat.correct,
    total: stat.total,
    accuracy: Math.round((stat.correct / stat.total) * 100),
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation('/history')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Histórico
          </Button>
          <h1 className="text-4xl font-bold text-primary mb-2">Detalhes do Simulado</h1>
          <p className="text-muted-foreground">{modeLabel}</p>
        </div>

        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card p-6 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Acurácia</p>
                <p className="text-3xl font-bold text-primary">{accuracy}%</p>
              </div>
              <Target className="h-8 w-8 text-primary opacity-50" />
            </div>
          </Card>

          <Card className="bg-card p-6 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Questões Corretas</p>
                <p className="text-3xl font-bold text-primary">
                  {attempt.correctAnswers}/{attempt.totalQuestions}
                </p>
              </div>
              <Target className="h-8 w-8 text-primary opacity-50" />
            </div>
          </Card>

          <Card className="bg-card p-6 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tempo Gasto</p>
                <p className="text-3xl font-bold text-primary">{formatTime(attempt.timeSpent)}</p>
              </div>
              <Clock className="h-8 w-8 text-primary opacity-50" />
            </div>
          </Card>

          <Card className="bg-card p-6 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Data</p>
                <p className="text-lg font-bold text-primary">
                  {new Date(attempt.startTime).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(attempt.startTime).toLocaleTimeString('pt-BR')}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-primary opacity-50" />
            </div>
          </Card>
        </div>

        {/* Desempenho por Categoria */}
        <Card className="bg-card p-6 border-border mb-8">
          <h2 className="text-xl font-bold mb-4">Desempenho por Categoria</h2>
          <div className="space-y-4">
            {categoryStats.map((stat) => (
              <div key={stat.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{stat.category}</span>
                  <span className="text-sm text-muted-foreground">
                    {stat.correct}/{stat.total} ({stat.accuracy}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${stat.accuracy}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Questões Erradas */}
        {attempt.answers.filter(a => !a.isCorrect).length > 0 && (
          <Card className="bg-card p-6 border-border">
            <h2 className="text-xl font-bold mb-4">Questões Erradas</h2>
            <div className="space-y-4">
              {attempt.answers
                .filter((a) => !a.isCorrect)
                .map((answer, idx) => (
                  <div key={idx} className="border-l-4 border-red-500 pl-4 py-2">
                    <p className="font-semibold mb-2">Questão {answer.questionId}</p>
                    <div className="text-sm space-y-1 mb-3">
                      <p className="text-red-500">
                        ❌ Sua resposta: <strong>{answer.selected}</strong>
                      </p>
                      <p className="text-green-500">
                        ✅ Resposta correta: <strong>{answer.correct}</strong>
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Categoria: {answer.category} | Dificuldade: {answer.difficulty}
                    </p>
                  </div>
                ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
