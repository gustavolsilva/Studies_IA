import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Clock, AlertCircle } from "lucide-react";
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
import { loadQuestions, shuffleQuestionOptions, type Question } from "@/lib/questionsLoader";

interface Answer {
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
}

export default function ExamMode() {
  const [, setLocation] = useLocation();
  const { saveAttempt } = useQuizHistory();
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutos em segundos
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const startTimeRef = useRef<number>(Date.now());
  const savedRef = useRef<boolean>(false);
  const questionTopRef = useRef<HTMLDivElement | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Carregar todas as questões uma vez
  useEffect(() => {
    const loadQuestionsData = async () => {
      try {
        const loaded = await loadQuestions();
        // Mantemos o banco em memória e embaralhamos as opções a cada seleção de prova
        setAllQuestions(loaded);
      } catch (error) {
        console.error("Erro ao carregar questões:", error);
      } finally {
        setLoading(false);
      }
    };
    loadQuestionsData();
  }, []);

  // Reembaralhar questões quando o componente monta (inicial)
  useEffect(() => {
    if (allQuestions.length > 0 && !loading && questions.length === 0) {
      const selected = selectBalancedQuestions(allQuestions, 45);
      setQuestions(selected);
      setCurrentIndex(0);
      setAnswers([]);
      setSelectedAnswer(null);
      setShowResults(false);
      setTimeLeft(90 * 60);
      startTimeRef.current = Date.now();
      savedRef.current = false;
    }
  }, [allQuestions.length, loading, questions.length]);

  // Função para iniciar uma nova prova com questões diferentes
  const startNewExam = () => {
    if (allQuestions.length === 0) return;
    
    // Selecionar 45 questões balanceadas por categoria
    const selected = selectBalancedQuestions(allQuestions, 45);
    setQuestions(selected);
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResults(false);
    setTimeLeft(90 * 60);
    startTimeRef.current = Date.now();
    savedRef.current = false;
  };

  // Função para selecionar questões balanceadas por categoria (conforme guia oficial Databricks)
  // Distribuição esperada no exame: 20% cada categoria principal
  const selectBalancedQuestions = (allQuestions: Question[], count: number): Question[] => {
    const categoryDistribution: { [key: string]: number } = {
      "Databricks Intelligence Platform": Math.round(count * 0.20),
      "Development and Ingestion": Math.round(count * 0.20),
      "Data Processing & Transformations": Math.round(count * 0.20),
      "Data Governance & Quality": Math.round(count * 0.20),
      "Productionizing Data Pipelines": Math.round(count * 0.20)
    };

    const selected: Question[] = [];
    const usedQuestionIds = new Set<number>();

    // Selecionar questões por categoria mantendo proporção
    Object.entries(categoryDistribution).forEach(([category, targetCount]) => {
      const categoryQuestions = allQuestions.filter(
        (q) => q.category === category && !usedQuestionIds.has(q.id)
      );

      // Embaralhar questões e opções dentro da categoria
      const shuffledCategory = shuffleArray(categoryQuestions).map(shuffleQuestionOptions);

      // Pegar apenas o número necessário
      const toTake = Math.min(targetCount, shuffledCategory.length);
      for (let i = 0; i < toTake; i++) {
        selected.push(shuffledCategory[i]);
        usedQuestionIds.add(shuffledCategory[i].id);
      }
    });

    // Se não conseguimos 45 questões, preencher com questões aleatórias não usadas
    if (selected.length < count) {
      const remaining = allQuestions.filter(
        (q) => !usedQuestionIds.has(q.id)
      );
      const shuffledRemaining = shuffleArray(remaining).map(shuffleQuestionOptions);
      const needed = count - selected.length;
      for (let i = 0; i < needed && i < shuffledRemaining.length; i++) {
        selected.push(shuffledRemaining[i]);
      }
    }

    // Embaralhar ordem final para não aparecer na ordem de categoria
    return shuffleArray(selected);
  };

  // Temporizador
  useEffect(() => {
    if (questionTopRef.current) {
      questionTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentIndex]);

  useEffect(() => {
    if (showResults || loading) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShowResults(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResults, loading]);

  // Salvar tentativa quando mostrar resultados
  useEffect(() => {
    if (showResults && !savedRef.current && answers.length > 0 && questions.length > 0) {
      saveExamAttempt();
    }
  }, [showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectAnswer = (option: string) => {
    setSelectedAnswer(option);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      const current = questions[currentIndex];
      setAnswers([
        ...answers,
        {
          questionId: current.id,
          selectedAnswer,
          isCorrect: selectedAnswer === current.correctAnswer,
        },
      ]);
      setSelectedAnswer(null);

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setShowResults(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      const prevAnswer = answers.find((a) => a.questionId === questions[newIndex].id);
      setSelectedAnswer(prevAnswer?.selectedAnswer || null);
    }
  };

  const handleFinish = () => {
    setShowResults(true);
    saveExamAttempt();
  };

  const handleEarlyExit = () => {
    if (answers.length === 0) {
      setLocation('/mode-selection');
      return;
    }
    
    setShowResults(true);
    saveExamAttempt(true); // true = encerramento antecipado
  };

  const saveExamAttempt = (earlyExit = false) => {
    if (savedRef.current || answers.length === 0) return;
    savedRef.current = true;

    const timeSpent = 90 * 60 - timeLeft;
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

    saveAttempt({
      mode: 'exam',
      startTime: startTimeRef.current,
      endTime: Date.now(),
      totalQuestions: questions.length,
      correctAnswers: answers.filter((a) => a.isCorrect).length,
      incorrectAnswers: answers.filter((a) => !a.isCorrect).length,
      skippedQuestions: questions.length - answers.length,
      timeSpent,
      categoryStats,
      difficultyStats,
      earlyExit,
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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando prova...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const percentage = Math.round((correctCount / answers.length) * 100);
    const passPercentage = 70;
    const passed = percentage >= passPercentage;

    return (
      <div className="min-h-screen bg-background">
        <div className="container py-12">
          <div className="max-w-2xl mx-auto">
            {/* Resultado Final */}
            <Card className="p-8 mb-8 border-2" style={{ borderColor: passed ? "#10b981" : "#ef4444" }}>
              <div className="text-center mb-8">
                <div className="text-6xl font-bold mb-4" style={{ color: passed ? "#10b981" : "#ef4444" }}>
                  {percentage}%
                </div>
                <h1 className="text-3xl font-bold mb-2">
                  {passed ? "✅ APROVADO" : "❌ REPROVADO"}
                </h1>
                <p className="text-muted-foreground">
                  Você acertou {correctCount} de {answers.length} questões
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Nota de corte: {passPercentage}%
                </p>
              </div>
            </Card>

            {/* Resumo por Categoria */}
            <Card className="p-8 mb-8">
              <h2 className="text-xl font-bold mb-4">Desempenho por Categoria</h2>
              <div className="space-y-4">
                {["Databricks Intelligence Platform", "Development and Ingestion", "Data Processing & Transformations", "Productionizing Data Pipelines", "Data Governance & Quality"].map((category) => {
                  const categoryAnswers = answers.filter((a) => {
                    const q = questions.find((q) => q.id === a.questionId);
                    return q?.category === category;
                  });
                  const categoryCorrect = categoryAnswers.filter((a) => a.isCorrect).length;
                  const categoryPercentage = categoryAnswers.length > 0 ? Math.round((categoryCorrect / categoryAnswers.length) * 100) : 0;

                  return (
                    <div key={category} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                      <span className="font-medium">{category}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {categoryCorrect}/{categoryAnswers.length}
                        </span>
                        <div className="w-32 bg-border rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${categoryPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold w-12 text-right">{categoryPercentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Questões Erradas */}
            <Card className="p-8 mb-8">
              <h2 className="text-xl font-bold mb-4">Questões Erradas</h2>
              <div className="space-y-6">
                {answers
                  .filter((a) => !a.isCorrect)
                  .map((answer, idx) => {
                    const question = questions.find((q) => q.id === answer.questionId);
                    return (
                      <div key={idx} className="border-l-4 border-red-500 pl-4 py-2">
                        <p className="font-semibold mb-2">{question?.question}</p>
                        <div className="text-sm space-y-1 mb-3">
                          <p className="text-red-500">
                            ❌ Sua resposta: <strong>{answer.selectedAnswer}</strong> - {question?.options[answer.selectedAnswer as keyof typeof question.options]}
                          </p>
                          <p className="text-green-500">
                            ✅ Resposta correta: <strong>{question?.correctAnswer}</strong> - {question?.options[question?.correctAnswer as keyof typeof question.options]}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{question?.rationale}</p>
                        {question?.officialReference && (
                          <a
                            href={question.officialReference.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            📚 {question.officialReference.title}
                          </a>
                        )}
                      </div>
                    );
                  })}
              </div>
            </Card>

            {/* Botões */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <Button
                  onClick={() => setLocation("/")}
                  variant="outline"
                  className="flex-1"
                >
                  Voltar para Home
                </Button>
                <Button
                  onClick={() => setLocation("/mode-selection")}
                  variant="outline"
                  className="flex-1"
                >
                  Voltar ao Menu
                </Button>
              </div>
              <Button
                onClick={startNewExam}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Fazer Outra Prova
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const current = questions[currentIndex];
  const timeWarning = timeLeft < 300; // Menos de 5 minutos

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Compact Header com Temporizador */}
      <header className="border-b border-border bg-card sticky top-0 z-10 flex-shrink-0">
        <div className="container px-4 md:px-6 py-2 md:py-3 flex items-center justify-between">
          <div>
            <h1 className="text-sm md:text-lg font-bold text-primary">Questão {currentIndex + 1}/{questions.length}</h1>
          </div>
          <div className={`flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm md:text-base ${timeWarning ? "bg-red-500/10" : "bg-primary/10"}`}>
            <Clock className={`w-4 h-4 md:w-5 md:h-5 ${timeWarning ? "text-red-500" : "text-primary"}`} />
            <span className={`font-bold ${timeWarning ? "text-red-500" : "text-primary"}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </header>

      {/* Aviso de Tempo */}
      {timeWarning && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 flex items-center gap-2 text-red-600 text-sm flex-shrink-0">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="font-semibold">Tempo está acabando!</span>
        </div>
      )}

      {/* Conteúdo Principal - Responsivo */}
      <main className="flex-1 overflow-hidden flex flex-col container px-3 md:px-6 py-3 md:py-6">
        {/* Barra de Progresso Compacta */}
        <div className="mb-3 md:mb-4 flex-shrink-0">
          <div className="flex justify-between items-center mb-1.5 md:mb-2 text-xs md:text-sm">
            <span className="font-semibold">Progresso</span>
            <span className="text-muted-foreground">
              {answers.length}/{questions.length}
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all"
              style={{ width: `${(answers.length / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Questão - Scrollable */}
        <div ref={questionTopRef} tabIndex={-1} className="h-0 scroll-mt-8"></div>
        <div className="flex-1 overflow-y-auto pr-2">
          <Card className="p-4 md:p-6 mb-4">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {current.category}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {current.difficulty === "advanced" ? "Avançado" : "Intermediário"}
                </span>
              </div>
              <h2 className="text-base md:text-lg font-bold leading-tight">{current.question}</h2>
            </div>

            {/* Opções - Compactas */}
            <div className="space-y-2">
              {["A", "B", "C", "D"].map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectAnswer(option)}
                  className={`w-full p-3 text-left rounded-lg border-2 transition-all text-sm md:text-base ${
                    selectedAnswer === option
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-2 md:gap-3">
                    <div
                      className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        selectedAnswer === option
                          ? "border-primary bg-primary text-white"
                          : "border-border"
                      }`}
                    >
                      {selectedAnswer === option && <span className="text-xs md:text-sm font-bold">✓</span>}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-xs md:text-sm">{option}.</p>
                      <p className="text-xs md:text-sm text-muted-foreground break-words">{current.options[option as keyof typeof current.options]}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Botões de Navegação - Fixed Bottom */}
        <div className="flex gap-2 pt-3 md:pt-4 border-t border-border flex-shrink-0">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentIndex === 0}
            className="flex-1 text-xs md:text-sm px-2 md:px-4"
          >
            Anterior
          </Button>
          {currentIndex === questions.length - 1 ? (
            <Button
              onClick={handleFinish}
              disabled={!selectedAnswer}
              className="flex-1 text-xs md:text-sm px-2 md:px-4"
            >
              Finalizar
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="flex-1 text-xs md:text-sm px-2 md:px-4"
            >
              Próxima
            </Button>
          )}
        </div>
        
        {/* Botão de Encerrar */}
        <div className="mt-2 pt-2 border-t border-border flex-shrink-0">
          <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 text-xs md:text-sm"
              >
                Encerrar Prova
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Encerrar Prova Antecipadamente?</AlertDialogTitle>
                <AlertDialogDescription>
                  Você respondeu {answers.length} de {questions.length} questões.
                  {answers.length > 0 ? (
                    <>
                      <br /><br />
                      Seu progresso será salvo e você verá os resultados.
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
                <AlertDialogCancel>Continuar Prova</AlertDialogCancel>
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
      </main>
    </div>
  );
}
