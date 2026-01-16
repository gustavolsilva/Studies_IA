import { useQuizHistory } from '@/hooks/useQuizHistory';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, ChevronRight, BarChart3, Calendar, Clock, Target } from 'lucide-react';
import { Link } from 'wouter';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { PerformanceChart } from '@/components/PerformanceChart';
import { CategoryPerformanceChart } from '@/components/CategoryPerformanceChart';

export default function HistoryPage() {
  const { history, loading, deleteAttempt, clearHistory } = useQuizHistory();

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando histórico...</p>
        </div>
      </div>
    );
  }

  if (!history) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p>Erro ao carregar histórico</p>
      </div>
    );
  }

  const categoryStats = history.attempts.length > 0 ? Object.entries(
    history.attempts.reduce((acc: Record<string, { correct: number; total: number }>, attempt) => {
      Object.entries(attempt.categoryStats).forEach(([cat, stat]) => {
        if (!acc[cat]) acc[cat] = { correct: 0, total: 0 };
        acc[cat].correct += stat.correct;
        acc[cat].total += stat.total;
      });
      return acc;
    }, {})
  ).map(([name, stats]) => ({
    name,
    acertos: stats.correct,
    total: stats.total,
    taxa: Math.round((stats.correct / stats.total) * 100),
  })) : [];

  const timelineData = history.attempts.slice().reverse().map((attempt, idx) => ({
    simuladoNumber: idx + 1,
    taxaAcerto: Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100),
    questoesRespondidas: attempt.totalQuestions,
    acertos: attempt.correctAnswers,
    data: new Date(attempt.startTime).toLocaleDateString('pt-BR'),
  }));

  // Dados por categoria ao longo do tempo
  const categoryTimelineData = history.attempts.slice().reverse().map((attempt, idx) => {
    const categoryData: any = { simuladoNumber: idx + 1 };
    Object.entries(attempt.categoryStats).forEach(([cat, stat]) => {
      categoryData[cat] = Math.round((stat.correct / stat.total) * 100);
    });
    return categoryData;
  });

  const categories = categoryTimelineData.length > 0 
    ? Object.keys(categoryTimelineData[0]).filter(key => key !== 'simuladoNumber')
    : [];

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-primary hover:underline mb-4 inline-block">← Voltar</Link>
          <h1 className="text-4xl font-bold text-primary mb-2">Histórico de Simulados</h1>
          <p className="text-muted-foreground">Acompanhe seu progresso e desempenho</p>
        </div>

        {/* Estatísticas Gerais */}
        {history.totalAttempts > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card p-6 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total de Simulados</p>
                  <p className="text-3xl font-bold text-primary">{history.totalAttempts}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary opacity-50" />
              </div>
            </Card>

            <Card className="bg-card p-6 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Acurácia Geral</p>
                  <p className="text-3xl font-bold text-primary">{Math.round(history.overallAccuracy)}%</p>
                </div>
                <Target className="h-8 w-8 text-primary opacity-50" />
              </div>
            </Card>

            <Card className="bg-card p-6 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Melhor Score</p>
                  <p className="text-3xl font-bold text-primary">{Math.round(history.bestScore)}%</p>
                </div>
                <Target className="h-8 w-8 text-primary opacity-50" />
              </div>
            </Card>

            <Card className="bg-card p-6 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tempo Total</p>
                  <p className="text-3xl font-bold text-primary">{formatTime(history.totalTimeSpent)}</p>
                </div>
                <Clock className="h-8 w-8 text-primary opacity-50" />
              </div>
            </Card>
          </div>
        )}

        {/* Gráficos */}
        {history.totalAttempts > 0 && (
          <div className="space-y-8 mb-8">
            {/* Gráfico de Taxa de Acerto ao Longo do Tempo */}
            {timelineData.length > 0 && (
              <PerformanceChart 
                data={timelineData} 
                title="📈 Evolução da Taxa de Acerto"
              />
            )}

            {/* Gráfico de Desempenho por Categoria ao Longo do Tempo */}
            {categoryTimelineData.length > 0 && categories.length > 0 && (
              <CategoryPerformanceChart 
                data={categoryTimelineData} 
                categories={categories}
                title="📊 Desempenho por Categoria ao Longo do Tempo"
              />
            )}

            {/* Gráfico de Desempenho Geral por Categoria */}
            {categoryStats.length > 0 && (
              <Card className="bg-card p-6 border-border">
                <h2 className="text-xl font-bold mb-4">📋 Desempenho Geral por Categoria</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--foreground)'
                      }}
                      formatter={(value) => `${value}%`}
                    />
                    <Bar dataKey="taxa" fill="var(--primary)" name="Taxa de Acerto (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
        )}

        {/* Lista de Simulados */}
        <Card className="bg-card border-border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Simulados Realizados</h2>
              {history.totalAttempts > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
                      clearHistory();
                    }
                  }}
                >
                  Limpar Histórico
                </Button>
              )}
            </div>

            {history.totalAttempts === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">Nenhum simulado realizado ainda</p>
                <Link href="/">
                  <Button variant="default">Começar Simulado</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {history.attempts.map((attempt) => {
                  const accuracy = Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100);
                  const modeLabel = {
                    exam: 'Prova Oficial',
                    practice: 'Pergunta-a-Pergunta',
                    free: 'Modo Livre',
                  }[attempt.mode];

                  return (
                    <div
                      key={attempt.id}
                      className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-primary transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-semibold text-primary">{modeLabel}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(attempt.startTime).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span>
                            {attempt.correctAnswers}/{attempt.totalQuestions} corretas
                          </span>
                          <span className="text-primary font-semibold">{accuracy}%</span>
                          <span className="text-muted-foreground">
                            {formatTime(attempt.timeSpent)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/history/${attempt.id}`}>
                          <Button variant="outline" size="sm" className="gap-2">
                            Detalhes
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('Tem certeza que deseja deletar este simulado?')) {
                              deleteAttempt(attempt.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
