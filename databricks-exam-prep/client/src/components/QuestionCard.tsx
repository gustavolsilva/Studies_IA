import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, XCircle, Lightbulb, ExternalLink } from 'lucide-react';
import type { Question, UserAnswer } from '@/hooks/useQuizState';

interface QuestionCardProps {
  question: Question;
  userAnswer: UserAnswer;
  showExplanation: boolean;
  onAnswerSelect: (answer: 'A' | 'B' | 'C' | 'D') => void;
  currentIndex: number;
  totalQuestions: number;
}

export default function QuestionCard({
  question,
  userAnswer,
  showExplanation,
  onAnswerSelect,
  currentIndex,
  totalQuestions,
}: QuestionCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    return difficulty === 'advanced' ? 'bg-destructive/10 text-destructive' : 'bg-accent/10 text-accent';
  };

  const getDifficultyLabel = (difficulty: string) => {
    return difficulty === 'advanced' ? 'Avançado' : 'Intermediário';
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
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-foreground">
            Questão {currentIndex + 1} de {totalQuestions}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(((currentIndex + 1) / totalQuestions) * 100)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge variant="outline" className={getCategoryColor(question.category)}>
                {question.category}
              </Badge>
              <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
                {getDifficultyLabel(question.difficulty)}
              </Badge>
            </div>
            <h2 className="text-xl font-semibold text-foreground leading-relaxed">
              {question.question}
            </h2>
          </div>
        </div>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
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
              icon = <CheckCircle className="w-5 h-5 text-green-600" />;
            } else if (isIncorrect) {
              borderColor = 'border-destructive';
              bgColor = 'bg-destructive/5';
              icon = <XCircle className="w-5 h-5 text-destructive" />;
            }
          }

          return (
            <button
              key={option}
              onClick={() => !showExplanation && onAnswerSelect(option)}
              disabled={showExplanation}
              className={`w-full border-l-4 rounded-lg p-4 text-left transition-all duration-200 ${borderColor} ${bgColor} ${
                showExplanation ? 'cursor-default' : 'cursor-pointer'
              } ${isSelected && !showExplanation ? 'ring-2 ring-primary ring-offset-2' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="font-semibold text-foreground mr-3">{option}.</span>
                  <span className="text-foreground">{question.options[option]}</span>
                </div>
                {showExplanation && icon && <div className="ml-3 flex-shrink-0">{icon}</div>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation Section */}
      {showExplanation && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Rationale */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Explicação Detalhada</h3>
                <p className="text-blue-800 text-sm leading-relaxed">{question.rationale}</p>
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Dica</h3>
                <p className="text-foreground text-sm leading-relaxed">{question.tip}</p>
              </div>
            </div>
          </div>

          {/* Official Reference */}
          {question.officialReference && (
            <div className="bg-primary/5 border border-primary/30 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <ExternalLink className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">Referência Oficial</h3>
                  <a
                    href={question.officialReference.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm font-medium flex items-center gap-1 w-fit"
                  >
                    {question.officialReference.title}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Result Message */}
          {userAnswer.isCorrect !== null && (
            <div
              className={`rounded-lg p-4 text-center font-semibold ${
                userAnswer.isCorrect
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-destructive/10 text-destructive border border-destructive/20'
              }`}
            >
              {userAnswer.isCorrect ? '✓ Resposta Correta!' : '✗ Resposta Incorreta'}
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      {!showExplanation && userAnswer.answer !== null && (
        <div className="text-center">
          <Button
            onClick={() => {
              // Trigger explanation display via parent
              onAnswerSelect(userAnswer.answer as 'A' | 'B' | 'C' | 'D');
            }}
            disabled
            className="opacity-50 cursor-not-allowed"
          >
            Resposta Selecionada
          </Button>
        </div>
      )}
    </div>
  );
}
