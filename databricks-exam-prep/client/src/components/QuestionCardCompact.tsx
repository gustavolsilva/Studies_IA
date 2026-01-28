import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import type { Question, UserAnswer } from '@/hooks/useQuizState';

interface QuestionCardCompactProps {
  question: Question;
  userAnswer: UserAnswer;
  showExplanation: boolean;
  onAnswerSelect: (answer: 'A' | 'B' | 'C' | 'D') => void;
  currentIndex: number;
  totalQuestions: number;
}

export default function QuestionCardCompact({
  question,
  userAnswer,
  showExplanation,
  onAnswerSelect,
  currentIndex,
  totalQuestions,
}: QuestionCardCompactProps) {
  const getDifficultyColor = (difficulty: string) => {
    return difficulty === 'advanced' ? 'bg-destructive/10 text-destructive' : 'bg-accent/10 text-accent';
  };

  const getDifficultyLabel = (difficulty: string) => {
    if (difficulty === 'advanced') return 'Avançado';
    if (difficulty === 'foundational') return 'Fundamental';
    return 'Intermediário';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Delta Lake': 'bg-blue-50 text-blue-700 border-blue-200',
      'Arquitetura Medallion': 'bg-purple-50 text-purple-700 border-purple-200',
      'Unity Catalog': 'bg-green-50 text-green-700 border-green-200',
      'Processamento de Dados': 'bg-orange-50 text-orange-700 border-orange-200',
      'Orquestração e DevOps': 'bg-pink-50 text-pink-700 border-pink-200',
    };
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="flex flex-col h-full space-y-2 md:space-y-4">
      {/* Progress Bar - Compact */}
      <div className="bg-card border border-border rounded-lg p-2 md:p-3 shrink-0">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs md:text-sm font-medium text-foreground">
            {currentIndex + 1}/{totalQuestions}
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.round(((currentIndex + 1) / totalQuestions) * 100)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-2 md:space-y-3">
        {/* Question Header */}
        <div className="bg-card border border-border rounded-lg p-3 md:p-4 shrink-0">
          <div className="flex items-start justify-between mb-2 gap-2 flex-wrap">
            <div className="flex gap-1 flex-wrap">
              <Badge variant="outline" className={`${getCategoryColor(question.category)} text-xs md:text-sm px-2 py-0.5`}>
                {question.category}
              </Badge>
              <Badge variant="outline" className={`${getDifficultyColor(question.difficulty)} text-xs md:text-sm px-2 py-0.5`}>
                {getDifficultyLabel(question.difficulty)}
              </Badge>
            </div>
          </div>
          <h2 className="text-base md:text-lg font-semibold text-foreground leading-tight">
            {question.question}
          </h2>
        </div>

        {/* Answer Options - Compact */}
        <div className="space-y-2">
          {(['A', 'B', 'C', 'D'] as const).map((option) => {
            const isSelected = userAnswer.answer === option;
            const isCorrect = option === question.correctAnswer;
            const isIncorrect = isSelected && userAnswer.isCorrect === false;

            let borderColor = 'border-border';
            let bgColor = 'bg-card hover:bg-muted/50';
            let icon = null;

            if (showExplanation) {
              if (isCorrect) {
                borderColor = 'border-green-500';
                bgColor = 'bg-green-50';
                icon = <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />;
              } else if (isIncorrect) {
                borderColor = 'border-destructive';
                bgColor = 'bg-destructive/5';
                icon = <XCircle className="w-4 h-4 md:w-5 md:h-5 text-destructive" />;
              }
            }

            return (
              <button
                key={option}
                onClick={() => !showExplanation && onAnswerSelect(option)}
                disabled={showExplanation}
                className={`w-full border-l-4 rounded-lg p-2.5 md:p-3 text-left transition-all duration-200 ${borderColor} ${bgColor} ${
                  showExplanation ? 'cursor-default' : 'cursor-pointer'
                } ${isSelected && !showExplanation ? 'ring-2 ring-primary ring-offset-2' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-foreground text-sm md:text-base inline">{option}. </span>
                    <span className="text-foreground text-sm md:text-base break-words">{question.options[option]}</span>
                  </div>
                  {showExplanation && icon && <div className="ml-2 flex-shrink-0 mt-0.5">{icon}</div>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation Section - Only if Answer Shown */}
        {showExplanation && (
          <div className="space-y-2 md:space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Rationale */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
              <div className="flex items-start gap-2 md:gap-3">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h3 className="font-semibold text-blue-900 mb-1 text-sm md:text-base">Explicação</h3>
                  <p className="text-blue-800 text-xs md:text-sm leading-snug">{question.rationale}</p>
                </div>
              </div>
            </div>

            {/* Tip */}
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 md:p-4">
              <div className="flex items-start gap-2 md:gap-3">
                <Lightbulb className="w-4 h-4 md:w-5 md:h-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground mb-1 text-sm md:text-base">Dica</h3>
                  <p className="text-foreground text-xs md:text-sm leading-snug">{question.tip}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
