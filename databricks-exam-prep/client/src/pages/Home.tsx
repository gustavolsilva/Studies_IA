import { useQuizState } from '@/hooks/useQuizState';
import StartScreen from './StartScreen';
import ResultsScreen from './ResultsScreen';
import QuestionCard from '@/components/QuestionCard';
import Sidebar from '@/components/Sidebar';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2, Menu } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Home() {
  const [, setLocation] = useLocation();
  const {
    questions,
    currentQuestion,
    currentQuestionIndex,
    userAnswers,
    showExplanation,
    quizStarted,
    quizFinished,
    loading,
    handleAnswerSelect,
    handleNextQuestion,
    handlePreviousQuestion,
    handleStartQuiz,
    handleRestartQuiz,
    getStats,
  } = useQuizState();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Carregando questões...</p>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return <StartScreen onStart={handleStartQuiz} totalQuestions={questions.length} />;
  }

  if (quizFinished) {
    return <ResultsScreen stats={getStats()} onRestart={handleRestartQuiz} />;
  }

  if (!currentQuestion) {
    return null;
  }

  const stats = getStats();
  const currentUserAnswer = userAnswers[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Databricks Brand */}
      <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
                Databricks Exam Prep
              </h1>
              <p className="text-sm text-muted-foreground">Simulado Interativo</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  Progresso: {stats.answered}/{stats.totalQuestions}
                </p>
                <p className="text-sm text-muted-foreground">Taxa de Acerto: {Math.round((stats.correct / stats.totalQuestions) * 100)}%</p>
              </div>
              <Button
                onClick={() => setLocation("/history")}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                📊 Histórico
              </Button>
              <Button
                onClick={() => setLocation("/mode-selection")}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Menu className="w-4 h-4" />
                Modalidades
              </Button>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Question Section */}
          <div className="lg:col-span-2">
            <QuestionCard
              question={currentQuestion}
              userAnswer={currentUserAnswer}
              showExplanation={showExplanation}
              onAnswerSelect={handleAnswerSelect}
              currentIndex={currentQuestionIndex}
              totalQuestions={questions.length}
            />

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8 justify-between">
              <Button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>
              <Button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                Próxima
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Sidebar - Progress Tracking */}
          <aside className="lg:col-span-1">
            <Sidebar
              stats={stats}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={questions.length}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
