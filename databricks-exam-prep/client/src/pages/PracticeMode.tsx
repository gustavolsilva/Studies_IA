import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Clock, Settings, Check } from "lucide-react";
import { useQuizHistory } from "@/hooks/useQuizHistory";
import { shuffleArray } from "@/lib/utils";

interface Question {
  id: number;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correctAnswer: string;
  category: string;
  difficulty: string;
  rationale: string;
  tip: string;
  officialReference: { title: string; url: string };
}

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

  // Carregar questões
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch("/questions_expanded.json");
        const loadedQuestions = await response.json();
        setAllQuestions(loadedQuestions);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar questões:", error);
        setLoading(false);
      }
    };
    loadQuestions();
  }, []);

  // Iniciar prática
  const handleStartPractice = () => {
    const filtered = allQuestions.filter((q: Question) => selectedCategories.includes(q.category));
    // Usar Fisher-Yates shuffle para garantir aleatoriedade verdadeira
    const shuffled = shuffleArray(filtered);
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
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-primary">Modo Pergunta-a-Pergunta</h1>
              <p className="text-muted-foreground">Questão {currentIndex + 1} de {questions.length}</p>
            </div>
            {timeLimit > 0 && (
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Clock className="h-5 w-5" />
                {formatTime(timeLeft)}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Questão */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-primary">{current.category}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {current.difficulty}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{current.question}</h2>
                </div>

                {/* Opções */}
                <div className="space-y-3 mb-8">
                  {['A', 'B', 'C', 'D'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSelectAnswer(option)}
                      disabled={showFeedback}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        selectedAnswer === option
                          ? showFeedback
                            ? option === current.correctAnswer
                              ? 'border-green-500 bg-green-50 dark:bg-green-950'
                              : 'border-red-500 bg-red-50 dark:bg-red-950'
                            : 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-semibold text-primary">{option}.</span>
                        <span>{current.options[option as keyof typeof current.options]}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Feedback */}
                {showFeedback && (
                  <div className="mb-8 p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="mb-4">
                      {selectedAnswer === current.correctAnswer ? (
                        <p className="text-green-600 dark:text-green-400 font-semibold">✓ Resposta Correta!</p>
                      ) : (
                        <p className="text-red-600 dark:text-red-400 font-semibold">✗ Resposta Incorreta</p>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold mb-2">Explicação:</p>
                        <p className="text-sm text-muted-foreground">{current.rationale}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-2">Dica:</p>
                        <p className="text-sm text-muted-foreground">{current.tip}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-2">Referência Oficial:</p>
                        <a
                          href={current.officialReference.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          📚 {current.officialReference.title}
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Botões */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentIndex === 0 || !showFeedback}
                    className="flex-1"
                  >
                    Anterior
                  </Button>
                  {!showFeedback ? (
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={!selectedAnswer}
                      className="flex-1"
                    >
                      Enviar Resposta
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextQuestion}
                      className="flex-1"
                    >
                      {currentIndex === questions.length - 1 ? 'Finalizar' : 'Próxima'}
                    </Button>
                  )}
                </div>
                
                {/* Botão de Sair (aparece durante a prática) */}
                <div className="mt-4 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (confirm('Tem certeza que deseja sair? Seu progresso será perdido.')) {
                        setLocation('/mode-selection');
                      }
                    }}
                    className="w-full text-muted-foreground hover:text-foreground"
                  >
                    Sair do Simulado
                  </Button>
                </div>
              </Card>
            </div>

            {/* Sidebar de Progresso */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Progresso</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Respondidas</span>
                      <span className="font-semibold">{answers.length}/{questions.length}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(answers.length / questions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Taxa de Acerto</span>
                      <span className="font-semibold">{accuracy}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${accuracy}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Progresso por Categoria */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Por Categoria</h3>
                <div className="space-y-3">
                  {Object.entries(categoryStats).map(([cat, stats]) => (
                    <div key={cat}>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">{cat}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(stats.correct / stats.total) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold">{stats.correct}/{stats.total}</span>
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
