import { useQuizState } from '@/hooks/useQuizState';
import StartScreen from './StartScreen';
import ResultsScreen from './ResultsScreen';
import QuestionCard from '@/components/QuestionCard';
import Sidebar from '@/components/Sidebar';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Loader2, Menu, Clock, BookOpen, Zap, Target } from 'lucide-react';
import { useLocation } from 'wouter';
import { useEffect, useRef, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Home() {
  const [, setLocation] = useLocation();
  const [showExitDialog, setShowExitDialog] = useState(false);
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
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
                  Databricks Exam Prep
                </h1>
                <p className="text-sm text-muted-foreground">Simulado Interativo</p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setLocation("/history")}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  📊 Histórico
                </Button>
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Seleção de Modo */}
        <main className="max-w-7xl mx-auto px-4 py-12">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
              Databricks Certified
            </h2>
            <h3 className="text-3xl font-semibold text-foreground mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Data Engineer Associate
            </h3>
            <p className="text-lg text-muted-foreground">Escolha o modo de simulado que deseja iniciar</p>
          </div>

          {/* Mode Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Modo Prova Oficial */}
            <Card className="p-8 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
              <div onClick={() => setLocation("/exam-mode")} className="space-y-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Modo Prova Oficial</h2>
                <p className="text-sm text-muted-foreground">
                  Simule a prova oficial do Databricks com 45 questões em 90 minutos. Sem feedback imediato.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">📋</span>
                    <span>45 questões</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">⏱️</span>
                    <span>90 minutos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">🔒</span>
                    <span>Sem feedback imediato</span>
                  </div>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 mt-4">
                  Começar Prova
                </Button>
              </div>
            </Card>

            {/* Modo Pergunta-a-Pergunta */}
            <Card className="p-8 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
              <div onClick={() => setLocation("/practice-mode")} className="space-y-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Modo Pergunta-a-Pergunta</h2>
                <p className="text-sm text-muted-foreground">
                  Pratique com feedback imediato. Customize a quantidade de questões e tempo.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">⚙️</span>
                    <span>Customizável</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">⚡</span>
                    <span>Feedback imediato</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">📚</span>
                    <span>Com explicações</span>
                  </div>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 mt-4">
                  Começar Prática
                </Button>
              </div>
            </Card>

            {/* Modo Livre */}
            <Card className="p-8 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
              <div onClick={handleStartQuiz} className="space-y-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Modo Livre</h2>
                <p className="text-sm text-muted-foreground">
                  Estude no seu próprio ritmo. Navegue entre questões com explicações detalhadas.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">🎓</span>
                    <span>Sem limite de tempo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">📖</span>
                    <span>Explicações completas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">🔗</span>
                    <span>Referências oficiais</span>
                  </div>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 mt-4">
                  Começar Estudo
                </Button>
              </div>
            </Card>
          </div>

          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <Target className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Questões Técnicas</h3>
              <p className="text-sm text-muted-foreground">{questions.length} questões de múltipla escolha</p>
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
          <Card className="bg-card border border-border p-8">
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
          </Card>
        </main>
      </div>
    );
  }

  if (quizFinished) {
    return <ResultsScreen stats={getStats()} onRestart={handleRestartQuiz} />;
  }

  if (!currentQuestion) {
    return null;
  }

  const stats = getStats();
  const currentUserAnswer = userAnswers[currentQuestionIndex];

  const questionTopRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (questionTopRef.current) {
      questionTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentQuestionIndex]);

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
                <p className="text-sm text-muted-foreground">Taxa de Acerto: {stats.totalQuestions > 0 ? Math.round((stats.correct / stats.totalQuestions) * 100) : 0}%</p>
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
            <div ref={questionTopRef} tabIndex={-1} className="h-0 scroll-mt-24"></div>
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

            {/* Botão Encerrar */}
            <div className="mt-4 pt-4 border-t border-border">
              <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    Encerrar Estudo
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Encerrar Modo Livre?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Você está na questão {currentQuestionIndex + 1} de {questions.length}.
                      <br /><br />
                      Tem certeza que deseja voltar ao menu principal?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Continuar Estudando</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => setLocation('/mode-selection')}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Voltar ao Menu
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
