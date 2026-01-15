import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Clock, AlertCircle } from "lucide-react";

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

export default function ExamMode() {
  const [, setLocation] = useLocation();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutos em segundos
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carregar questões
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch("/questions_expanded.json");
        const allQuestions = await response.json();
        // Selecionar 45 questões aleatórias
        const shuffled = allQuestions.sort(() => Math.random() - 0.5);
        setQuestions(shuffled.slice(0, 45));
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar questões:", error);
        setLoading(false);
      }
    };
    loadQuestions();
  }, []);

  // Temporizador
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
      setCurrentIndex(currentIndex - 1);
      const prevAnswer = answers.find((a) => a.questionId === questions[currentIndex - 1].id);
      setSelectedAnswer(prevAnswer?.selectedAnswer || null);
      setAnswers(answers.slice(0, -1));
    }
  };

  const handleFinish = () => {
    setShowResults(true);
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
                onClick={() => setLocation("/exam-mode")}
                className="flex-1 bg-primary hover:bg-primary/90"
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
    <div className="min-h-screen bg-background">
      {/* Header com Temporizador */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-primary">Modo Prova Oficial</h1>
            <p className="text-sm text-muted-foreground">
              Questão {currentIndex + 1} de {questions.length}
            </p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeWarning ? "bg-red-500/10" : "bg-primary/10"}`}>
            <Clock className={`w-5 h-5 ${timeWarning ? "text-red-500" : "text-primary"}`} />
            <span className={`font-bold text-lg ${timeWarning ? "text-red-500" : "text-primary"}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </header>

      {/* Aviso de Tempo */}
      {timeWarning && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-3 flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span className="font-semibold">Tempo está acabando! Menos de 5 minutos restantes.</span>
        </div>
      )}

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
            <div className="space-y-3">
              {["A", "B", "C", "D"].map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectAnswer(option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    selectedAnswer === option
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        selectedAnswer === option
                          ? "border-primary bg-primary text-white"
                          : "border-border"
                      }`}
                    >
                      {selectedAnswer === option && <span className="text-sm font-bold">✓</span>}
                    </div>
                    <div>
                      <p className="font-semibold">{option}.</p>
                      <p className="text-sm text-muted-foreground">{current.options[option as keyof typeof current.options]}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Botões de Navegação */}
          <div className="flex gap-4">
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={currentIndex === 0}
              className="flex-1"
            >
              ← Anterior
            </Button>
            <Button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Próxima →
            </Button>
            {currentIndex === questions.length - 1 && (
              <Button
                onClick={handleFinish}
                disabled={!selectedAnswer}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Finalizar Prova
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
