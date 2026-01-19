import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Clock, Settings, Check } from "lucide-react";
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
import { useQuizHistory } from "@/hooks/useQuizHistory";
import { shuffleArray } from "@/lib/utils";
import { loadQuestions, shuffleQuestionOptions, type Question as LoadedQuestion } from "@/lib/questionsLoader";

type Question = LoadedQuestion;

interface Answer {
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
}

type Stage = "config" | "practice" | "results";

export default function PracticeMode() {
  const [, setLocation] = useLocation();
  const { saveAttempt } = useQuizHistory();
  const [stage, setStage] = useState<Stage>("config");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Configuração
  const [numQuestions, setNumQuestions] = useState(10);
  const [timeLimit, setTimeLimit] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'Databricks Intelligence Platform',
    'Development and Ingestion',
    'Data Processing & Transformations',
    'Productionizing Data Pipelines',
    'Data Governance & Quality'
  ]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);

  const questionTopRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (stage !== "practice") return;
    if (questionTopRef.current) {
      questionTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentIndex, stage]);

  // Carregar questões
  useEffect(() => {
    const loadQuestionsData = async () => {
      try {
        const loaded = await loadQuestions();
        setAllQuestions(loaded);
      } catch (error) {
        console.error("Erro ao carregar questões:", error);
      } finally {
        setLoading(false);
      }
    };
    loadQuestionsData();
  }, []);

  // Iniciar prática
  const handleStartPractice = () => {
    const filtered = allQuestions.filter((q: Question) => selectedCategories.includes(q.category));
    // Usar Fisher-Yates shuffle para garantir aleatoriedade verdadeira
    const shuffled = shuffleArray(filtered).map(shuffleQuestionOptions);
    const selected = shuffled.slice(0, Math.min(numQuestions, filtered.length));
    setQuestions(selected);
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setTimeLeft(timeLimit * 60);
    setStage("practice");
  };

  // Toggle categoria
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Temporizador
  useEffect(() => {
    if (stage !== "practice" || timeLimit === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStage("results");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, timeLimit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectAnswer = (option: string) => {
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer) {
      const current = questions[currentIndex];
      const isCorrect = selectedAnswer === current.correctAnswer;
      setAnswers([
        ...answers,
        {
          questionId: current.id,
          selectedAnswer,
          isCorrect,
        },
      ]);
      setShowFeedback(true);
    }
  };

  const handleEarlyExit = () => {
    if (answers.length === 0) {
      setLocation('/mode-selection');
      return;
    }

    const categoryStats: Record<string, { correct: number; total: number }> = {};
    const difficultyStats: Record<string, { correct: number; total: number }> = {};
    
    questions.forEach((q) => {
      const answer = answers.find((a) => a.questionId === q.id);
      if (!categoryStats[q.category]) {
        categoryStats[q.category] = { correct: 0, total: 0 };
      }
      if (!difficultyStats[q.difficulty]) {
        difficultyStats[q.difficulty] = { correct: 0, total: 0 };
      }
      categoryStats[q.category].total += 1;
      difficultyStats[q.difficulty].total += 1;
      if (answer?.isCorrect) {
        categoryStats[q.category].correct += 1;
        difficultyStats[q.difficulty].correct += 1;
      }
    });

    const startTime = Date.now() - (timeLimit > 0 ? (timeLimit * 60 - timeLeft) * 1000 : 0);
    const timeSpent = timeLimit > 0 ? (timeLimit * 60 - timeLeft) : 0;

    saveAttempt({
      mode: 'practice',
      startTime,
      endTime: Date.now(),
      totalQuestions: questions.length,
      correctAnswers: answers.filter((a) => a.isCorrect).length,
      incorrectAnswers: answers.filter((a) => !a.isCorrect).length,
      skippedQuestions: questions.length - answers.length,
      timeSpent,
      categoryStats,
      difficultyStats,
      earlyExit: true,
      answers: answers.map((a) => {
        const q = questions.find((q) => q.id === a.questionId)!;
        return {
          questionId: a.questionId.toString(),
          selected: a.selectedAnswer,
          correct: q.correctAnswer,
          isCorrect: a.isCorrect,
          category: q.category,
          difficulty: q.difficulty,
        };
      }),
    });
    
    setStage("results");
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const categoryStats: Record<string, { correct: number; total: number }> = {};
      const difficultyStats: Record<string, { correct: number; total: number }> = {};
      
      questions.forEach((q) => {
        const answer = answers.find((a) => a.questionId === q.id);
        if (!categoryStats[q.category]) {
          categoryStats[q.category] = { correct: 0, total: 0 };
        }
        if (!difficultyStats[q.difficulty]) {
          difficultyStats[q.difficulty] = { correct: 0, total: 0 };
        }
        categoryStats[q.category].total += 1;
        difficultyStats[q.difficulty].total += 1;
        if (answer?.isCorrect) {
          categoryStats[q.category].correct += 1;
          difficultyStats[q.difficulty].correct += 1;
        }
      });

      const startTime = Date.now() - (timeLimit > 0 ? (timeLimit * 60 - timeLeft) * 1000 : 0);
      const timeSpent = timeLimit > 0 ? (timeLimit * 60 - timeLeft) : 0;

      saveAttempt({
        mode: 'practice',
        startTime,
        endTime: Date.now(),
        totalQuestions: questions.length,
        correctAnswers: answers.filter((a) => a.isCorrect).length,
        incorrectAnswers: answers.filter((a) => !a.isCorrect).length,
        skippedQuestions: 0,
        timeSpent,
        categoryStats,
        difficultyStats,
        answers: answers.map((a) => {
          const q = questions.find((q) => q.id === a.questionId)!;
          return {
            questionId: a.questionId.toString(),
            selected: a.selectedAnswer,
            correct: q.correctAnswer,
            isCorrect: a.isCorrect,
            category: q.category,
            difficulty: q.difficulty,
          };
        }),
      });
      
      setStage("results");
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      const prevAnswer = answers.find((a) => a.questionId === questions[newIndex].id);
      setSelectedAnswer(prevAnswer?.selectedAnswer || null);
      setShowFeedback(prevAnswer !== undefined);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando questões...</p>
        </div>
      </div>
    );
  }

  // Tela de Configuração
  if (stage === "config") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-12">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">Modo Pergunta-a-Pergunta</h1>
              <p className="text-muted-foreground">Configure seu simulado personalizado</p>
            </div>

            <Card className="p-8 space-y-8">
              {/* Seleção de Categorias */}
              <div>
                <label className="block text-sm font-semibold mb-4">Categorias</label>
                <div className="space-y-3">
                  {[
                    'Databricks Intelligence Platform',
                    'Development and Ingestion',
                    'Data Processing & Transformations',
                    'Productionizing Data Pipelines',
                    'Data Governance & Quality'
                  ].map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`w-full p-3 text-left rounded-lg border-2 transition-all flex items-center justify-between ${
                        selectedCategories.includes(category)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="text-sm">{category}</span>
                      {selectedCategories.includes(category) && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Número de Questões */}
              <div>
                <label className="block text-sm font-semibold mb-4">
                  Número de Questões: <span className="text-primary text-lg">{numQuestions}</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>5</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>

              {/* Limite de Tempo */}
              <div>
                <label className="block text-sm font-semibold mb-4">
                  Limite de Tempo (minutos)
                </label>
                <div className="space-y-3">
                  {[
                    { label: "Sem limite", value: 0 },
                    { label: "15 minutos", value: 15 },
                    { label: "30 minutos", value: 30 },
                    { label: "45 minutos", value: 45 },
                    { label: "60 minutos", value: 60 },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTimeLimit(option.value)}
                      className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                        timeLimit === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            timeLimit === option.value
                              ? "border-primary bg-primary"
                              : "border-border"
                          }`}
                        >
                          {timeLimit === option.value && (
                            <div className="w-2 h-2 bg-background rounded-full"></div>
                          )}
                        </div>
                        <span>{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Resumo */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Resumo:</strong> Você fará {numQuestions} questões de {selectedCategories.length} categoria(s)
                  {timeLimit > 0 && ` em ${timeLimit} minutos`}
                </p>
              </div>

              {/* Botões */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setLocation("/mode-selection")}
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleStartPractice}
                  disabled={selectedCategories.length === 0}
                  className="flex-1"
                >
                  Começar Prática
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Tela de Prática
  if (stage === "practice" && questions.length > 0) {
    const current = questions[currentIndex];
    const accuracy = Math.round((answers.filter((a) => a.isCorrect).length / answers.length) * 100) || 0;
    const categoryStats = questions.reduce((acc: Record<string, { correct: number; total: number }>, q) => {
      if (!acc[q.category]) acc[q.category] = { correct: 0, total: 0 };
      const answer = answers.find((a) => a.questionId === q.id);
      acc[q.category].total += 1;
      if (answer?.isCorrect) acc[q.category].correct += 1;
      return acc;
    }, {});

    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Compact Header */}
        <div className="bg-card border-b border-border px-4 py-2 md:px-6 md:py-3 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-primary">Questão {currentIndex + 1}/{questions.length}</h1>
          </div>
          {timeLimit > 0 && (
            <div className="flex items-center gap-2 text-primary font-semibold text-sm md:text-base">
              <Clock className="h-4 w-4 md:h-5 md:w-5" />
              {formatTime(timeLeft)}
            </div>
          )}
        </div>

        {/* Main Content - Responsive Layout */}
        <div className="flex-1 overflow-hidden flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6 p-3 md:p-6 container">
          {/* Questão - Left Side */}
          <div className="md:col-span-2 flex flex-col min-h-0">
            <div ref={questionTopRef} tabIndex={-1} className="h-0 scroll-mt-8"></div>
            <Card className="p-4 md:p-6 flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                    <span className="text-xs md:text-sm font-semibold text-primary">{current.category}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {current.difficulty}
                    </span>
                  </div>
                  <h2 className="text-base md:text-lg font-bold text-foreground leading-tight">{current.question}</h2>
                </div>

                {/* Opções - Compact */}
                <div className="space-y-2 mb-4 flex-1">
                  {['A', 'B', 'C', 'D'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSelectAnswer(option)}
                      disabled={showFeedback}
                      className={`w-full p-3 text-left rounded-lg border-2 transition-all text-sm md:text-base ${
                        selectedAnswer === option
                          ? showFeedback
                            ? option === current.correctAnswer
                              ? 'border-green-500 bg-green-50 dark:bg-green-950'
                              : 'border-red-500 bg-red-50 dark:bg-red-950'
                            : 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-primary flex-shrink-0">{option}.</span>
                        <span className="break-words">{current.options[option as keyof typeof current.options]}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Feedback - Expandable */}
                {showFeedback && (
                  <div className="mb-4 p-3 md:p-4 rounded-lg bg-muted/50 border border-border text-sm md:text-base max-h-40 md:max-h-48 overflow-y-auto">
                    <div className="mb-3">
                      {selectedAnswer === current.correctAnswer ? (
                        <p className="text-green-600 dark:text-green-400 font-semibold text-sm">✓ Correto!</p>
                      ) : (
                        <p className="text-red-600 dark:text-red-400 font-semibold text-sm">✗ Incorreto</p>
                      )}
                    </div>
                    <div className="space-y-2 text-xs md:text-sm">
                      <div>
                        <p className="font-semibold mb-1">Explicação:</p>
                        <p className="text-muted-foreground line-clamp-2">{current.rationale}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Botões - Fixed Bottom */}
                <div className="flex gap-2 mt-auto pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentIndex === 0 || !showFeedback}
                    className="flex-1 text-xs md:text-sm px-2 md:px-4"
                  >
                    Anterior
                  </Button>
                  {!showFeedback ? (
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={!selectedAnswer}
                      className="flex-1 text-xs md:text-sm px-2 md:px-4"
                    >
                      Enviar
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextQuestion}
                      className="flex-1 text-xs md:text-sm px-2 md:px-4"
                    >
                      {currentIndex === questions.length - 1 ? 'Finalizar' : 'Próxima'}
                    </Button>
                  )}
                </div>
                
                {/* Botão de Encerrar */}
                <div className="mt-2 pt-2 border-t border-border">
                  <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 text-xs md:text-sm"
                      >
                        Encerrar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Encerrar Simulado?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Você respondeu {answers.length} de {questions.length} questões.
                          {answers.length > 0 ? (
                            <>
                              <br /><br />
                              Seu progresso será salvo.
                            </>
                          ) : (
                            <>
                              <br /><br />
                              Nenhuma resposta foi registrada.
                            </>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Continuar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleEarlyExit}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Encerrar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            </div>

          {/* Sidebar - Right Side */}
          <div className="hidden md:flex flex-col gap-4 min-h-0">
            <Card className="p-4 flex-1 overflow-y-auto">
              <h3 className="font-semibold mb-3 text-sm">Progresso</h3>
              <div className="space-y-3 text-xs md:text-sm">
                <div>
                  <div className="flex justify-between mb-1 text-xs">
                    <span>Respondidas</span>
                    <span className="font-semibold">{answers.length}/{questions.length}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all"
                      style={{ width: `${(answers.length / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-xs">
                    <span>Taxa de Acerto</span>
                    <span className="font-semibold">{accuracy}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className="bg-green-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${accuracy}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Progresso por Categoria */}
            <Card className="p-4 flex-1 overflow-y-auto">
              <h3 className="font-semibold mb-3 text-sm">Categoria</h3>
              <div className="space-y-2 text-xs">
                {Object.entries(categoryStats).slice(0, 3).map(([cat, stats]) => (
                  <div key={cat}>
                    <p className="font-semibold text-muted-foreground mb-0.5 truncate">{cat}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-1">
                        <div
                          className="bg-primary h-1 rounded-full"
                          style={{ width: `${(stats.correct / stats.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold whitespace-nowrap">{stats.correct}/{stats.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          </div>
        </div>
      </div>
    );
  }

  // Tela de Resultados
  if (stage === "results") {
    const accuracy = Math.round((answers.filter((a) => a.isCorrect).length / answers.length) * 100);
    const categoryStats: Record<string, { correct: number; total: number }> = {};
    
    questions.forEach((q) => {
      const answer = answers.find((a) => a.questionId === q.id);
      if (!categoryStats[q.category]) {
        categoryStats[q.category] = { correct: 0, total: 0 };
      }
      categoryStats[q.category].total += 1;
      if (answer?.isCorrect) {
        categoryStats[q.category].correct += 1;
      }
    });

    return (
      <div className="min-h-screen bg-background">
        <div className="container py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-primary mb-2">Simulado Finalizado!</h1>
              <p className="text-muted-foreground">Veja seus resultados abaixo</p>
            </div>

            {/* Resultado Geral */}
            <Card className="p-8 mb-8 text-center">
              <div className="mb-6">
                <div className="text-6xl font-bold text-primary mb-2">{accuracy}%</div>
                <p className="text-muted-foreground">
                  {answers.filter((a) => a.isCorrect).length} de {answers.length} questões corretas
                </p>
              </div>
              <div className="inline-block px-4 py-2 rounded-lg bg-muted">
                <p className="text-sm font-semibold">
                  {accuracy >= 70 ? '✓ APROVADO' : '✗ REPROVADO'}
                </p>
              </div>
            </Card>

            {/* Desempenho por Categoria */}
            <Card className="p-8 mb-8">
              <h2 className="text-xl font-bold mb-6">Desempenho por Categoria</h2>
              <div className="space-y-4">
                {Object.entries(categoryStats).map(([category, stats]) => {
                  const catAccuracy = Math.round((stats.correct / stats.total) * 100);
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{category}</span>
                        <span className="text-sm text-muted-foreground">
                          {stats.correct}/{stats.total} ({catAccuracy}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${catAccuracy}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Botões */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setLocation("/")}
                  className="flex-1"
                >
                  Voltar para Home
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLocation("/mode-selection")}
                  className="flex-1"
                >
                  Voltar ao Menu
                </Button>
              </div>
              <Button
                onClick={() => {
                  setStage("config");
                  setCurrentIndex(0);
                  setAnswers([]);
                  setSelectedAnswer(null);
                  setShowFeedback(false);
                }}
                className="w-full"
              >
                Fazer Outro Simulado
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
