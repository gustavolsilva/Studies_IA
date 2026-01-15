import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Clock, Settings } from "lucide-react";

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
  const [timeLimit, setTimeLimit] = useState(0); // 0 = sem limite

  // Carregar questões
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch("/questions_expanded.json");
        const allQuestions = await response.json();
        setQuestions(allQuestions);
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
    const shuffled = questions.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, numQuestions);
    setQuestions(selected);
    setTimeLeft(timeLimit * 60); // Converter minutos para segundos
    setStage("practice");
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
      setStage("results");
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const prevAnswer = answers.find((a) => a.questionId === questions[currentIndex - 1].id);
      setSelectedAnswer(prevAnswer?.selectedAnswer || null);
      setShowFeedback(true);
      setAnswers(answers.slice(0, -1));
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
                            <span className="text-white text-xs font-bold">✓</span>
                          )}
                        </div>
                        <span className="font-medium">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Resumo */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Resumo da Configuração:</p>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Questões:</strong> {numQuestions}
                  </p>
                  <p>
                    <strong>Tempo:</strong> {timeLimit === 0 ? "Sem limite" : `${timeLimit} minutos`}
                  </p>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-4">
                <Button
                  onClick={() => setLocation("/mode-selection")}
                  variant="outline"
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleStartPractice}
                  className="flex-1 bg-primary hover:bg-primary/90"
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
  if (stage === "practice") {
    const current = questions[currentIndex];
    const currentAnswer = answers.find((a) => a.questionId === current.id);

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card sticky top-0 z-10">
          <div className="container py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-primary">Modo Pergunta-a-Pergunta</h1>
              <p className="text-sm text-muted-foreground">
                Questão {currentIndex + 1} de {questions.length}
              </p>
            </div>
            {timeLimit > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10">
                <Clock className="w-5 h-5 text-primary" />
                <span className="font-bold text-lg text-primary">
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Conteúdo */}
        <main className="container py-8">
          <div className="max-w-3xl mx-auto">
            {/* Barra de Progresso */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Progresso</span>
                <span className="text-sm text-muted-foreground">
                  {answers.length} de {questions.length} respondidas
                </span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(answers.length / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Questão */}
            <Card className="p-8 mb-8">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {current.category}
                  </span>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    {current.difficulty === "advanced" ? "Avançado" : "Intermediário"}
                  </span>
                </div>
                <h2 className="text-xl font-bold">{current.question}</h2>
              </div>

              {/* Opções */}
              <div className="space-y-3 mb-8">
                {["A", "B", "C", "D"].map((option) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrectAnswer = option === current.correctAnswer;
                  const isWrongAnswer = showFeedback && isSelected && !isCorrectAnswer;

                  return (
                    <button
                      key={option}
                      onClick={() => !showFeedback && handleSelectAnswer(option)}
                      disabled={showFeedback}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        showFeedback
                          ? isCorrectAnswer
                            ? "border-green-500 bg-green-500/5"
                            : isWrongAnswer
                            ? "border-red-500 bg-red-500/5"
                            : "border-border opacity-50"
                          : isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            showFeedback
                              ? isCorrectAnswer
                                ? "border-green-500 bg-green-500 text-white"
                                : isWrongAnswer
                                ? "border-red-500 bg-red-500 text-white"
                                : "border-border"
                              : isSelected
                              ? "border-primary bg-primary text-white"
                              : "border-border"
                          }`}
                        >
                          {showFeedback && isCorrectAnswer && <span className="text-sm font-bold">✓</span>}
                          {showFeedback && isWrongAnswer && <span className="text-sm font-bold">✗</span>}
                        </div>
                        <div>
                          <p className="font-semibold">{option}.</p>
                          <p className="text-sm text-muted-foreground">
                            {current.options[option as keyof typeof current.options]}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {showFeedback && currentAnswer && (
                <div className="space-y-4 mb-8 p-4 rounded-lg bg-card border-l-4" style={{ borderColor: currentAnswer.isCorrect ? "#10b981" : "#ef4444" }}>
                  <div>
                    <p className="font-semibold mb-2">
                      {currentAnswer.isCorrect ? "✅ Resposta Correta!" : "❌ Resposta Incorreta"}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">{current.rationale}</p>
                  </div>

                  <div className="bg-muted/50 p-3 rounded">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">💡 Dica:</p>
                    <p className="text-sm">{current.tip}</p>
                  </div>

                  <div className="border-t border-border pt-3">
                    <a
                      href={current.officialReference.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-2"
                    >
                      📚 {current.officialReference.title}
                    </a>
                  </div>
                </div>
              )}

              {/* Botões */}
              <div className="flex gap-4">
                {!showFeedback ? (
                  <>
                    <Button
                      onClick={handlePreviousQuestion}
                      variant="outline"
                      disabled={currentIndex === 0}
                      className="flex-1"
                    >
                      ← Anterior
                    </Button>
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={!selectedAnswer}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      Enviar Resposta
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handlePreviousQuestion}
                      variant="outline"
                      disabled={currentIndex === 0}
                      className="flex-1"
                    >
                      ← Anterior
                    </Button>
                    <Button
                      onClick={handleNextQuestion}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      {currentIndex === questions.length - 1 ? "Ver Resultados" : "Próxima →"}
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Tela de Resultados
  if (stage === "results") {
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const percentage = Math.round((correctCount / answers.length) * 100);

    return (
      <div className="min-h-screen bg-background">
        <div className="container py-12">
          <div className="max-w-2xl mx-auto">
            {/* Resultado Final */}
            <Card className="p-8 mb-8 border-2 border-primary">
              <div className="text-center mb-8">
                <div className="text-6xl font-bold mb-4 text-primary">{percentage}%</div>
                <h1 className="text-3xl font-bold mb-2">Prática Concluída!</h1>
                <p className="text-muted-foreground">
                  Você acertou {correctCount} de {answers.length} questões
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

                  if (categoryAnswers.length === 0) return null;

                  return (
                    <div key={category} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                      <span className="font-medium text-sm">{category}</span>
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
            {answers.filter((a) => !a.isCorrect).length > 0 && (
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
                              ❌ Sua resposta: <strong>{answer.selectedAnswer}</strong>
                            </p>
                            <p className="text-green-500">
                              ✅ Resposta correta: <strong>{question?.correctAnswer}</strong>
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{question?.rationale}</p>
                          <a
                            href={question?.officialReference.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            📚 {question?.officialReference.title}
                          </a>
                        </div>
                      );
                    })}
                </div>
              </Card>
            )}

            {/* Botões */}
            <div className="flex gap-4">
              <Button
                onClick={() => setLocation("/mode-selection")}
                variant="outline"
                className="flex-1"
              >
                Voltar ao Menu
              </Button>
              <Button
                onClick={() => {
                  setStage("config");
                  setAnswers([]);
                  setCurrentIndex(0);
                  setSelectedAnswer(null);
                  setShowFeedback(false);
                }}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Fazer Outra Prática
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
