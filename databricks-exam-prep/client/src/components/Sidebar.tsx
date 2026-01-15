import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { QuizStats } from '@/hooks/useQuizState';
import { BarChart3, Target, TrendingUp } from 'lucide-react';

interface SidebarProps {
  stats: QuizStats;
  currentQuestionIndex: number;
  totalQuestions: number;
}

export default function Sidebar({ stats, currentQuestionIndex, totalQuestions }: SidebarProps) {
  const correctPercentage = stats.totalQuestions > 0 ? Math.round((stats.correct / stats.totalQuestions) * 100) : 0;

  return (
    <div className="w-full lg:w-80 space-y-6">
      {/* Overall Progress */}
      <Card className="bg-card border border-border p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Progresso Geral
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-muted-foreground">Questões Respondidas</span>
              <span className="text-sm font-semibold text-foreground">
                {stats.answered}/{stats.totalQuestions}
              </span>
            </div>
            <Progress value={(stats.answered / stats.totalQuestions) * 100} className="h-2" />
          </div>

          <div className="pt-2 border-t border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-muted-foreground">Taxa de Acerto</span>
              <span className="text-sm font-semibold text-foreground">{correctPercentage}%</span>
            </div>
            <Progress value={correctPercentage} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{stats.correct}</div>
              <div className="text-xs text-muted-foreground">Corretas</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-destructive">{stats.incorrect}</div>
              <div className="text-xs text-muted-foreground">Incorretas</div>
            </div>
          </div>
        </div>
      </Card>

      {/* By Category */}
      <Card className="bg-card border border-border p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          Por Categoria
        </h3>
        <div className="space-y-3">
          {Object.entries(stats.byCategory).map(([category, data]) => (
            <div key={category}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-foreground">{category}</span>
                <span className="text-xs text-muted-foreground">
                  {data.correct}/{data.total}
                </span>
              </div>
              <Progress value={(data.correct / data.total) * 100} className="h-1.5" />
            </div>
          ))}
        </div>
      </Card>

      {/* By Difficulty */}
      <Card className="bg-card border border-border p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Por Dificuldade
        </h3>
        <div className="space-y-3">
          {Object.entries(stats.byDifficulty).map(([difficulty, data]) => (
            <div key={difficulty}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-foreground capitalize">
                  {difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {data.correct}/{data.total}
                </span>
              </div>
              <Progress value={(data.correct / data.total) * 100} className="h-1.5" />
            </div>
          ))}
        </div>
      </Card>

      {/* Current Position */}
      <Card className="bg-muted/50 border border-border p-4">
        <p className="text-xs text-muted-foreground text-center">
          Questão <span className="font-semibold text-foreground">{currentQuestionIndex + 1}</span> de{' '}
          <span className="font-semibold text-foreground">{totalQuestions}</span>
        </p>
      </Card>
    </div>
  );
}
