import { useState, useEffect } from 'react';

export interface Question {
  id: number;
  category: string;
  difficulty: 'intermediate' | 'advanced';
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  rationale: string;
  tip: string;
}

export interface QuizStats {
  totalQuestions: number;
  answered: number;
  correct: number;
  incorrect: number;
  byCategory: Record<string, { total: number; correct: number }>;
  byDifficulty: Record<string, { total: number; correct: number }>;
}

export interface UserAnswer {
  questionId: number;
  answer: 'A' | 'B' | 'C' | 'D' | null;
  isCorrect: boolean | null;
}

export const useQuizState = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carregar questões do JSON (tenta expandido primeiro, depois fallback)
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Tenta carregar o arquivo expandido com 3000 questões
        const response = await fetch('/questions_expanded.json');
        if (!response.ok) throw new Error('Arquivo expandido não encontrado');
        const data: Question[] = await response.json();
        setQuestions(data);
        setUserAnswers(data.map(q => ({ questionId: q.id, answer: null, isCorrect: null })));
        setLoading(false);
      } catch (error) {
        console.warn('Erro ao carregar questões expandidas, tentando fallback:', error);
        try {
          // Fallback para arquivo original com 30 questões
          const response = await fetch('/questions.json');
          const data: Question[] = await response.json();
          setQuestions(data);
          setUserAnswers(data.map(q => ({ questionId: q.id, answer: null, isCorrect: null })));
          setLoading(false);
        } catch (fallbackError) {
          console.error('Erro ao carregar questões de fallback:', fallbackError);
          setLoading(false);
        }
      }
    };
    loadQuestions();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: 'A' | 'B' | 'C' | 'D') => {
    if (!currentQuestion) return;

    const isCorrect = answer === currentQuestion.correctAnswer;
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = {
      questionId: currentQuestion.id,
      answer,
      isCorrect,
    };
    setUserAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(false);
    }
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
  };

  const handleRestartQuiz = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
    setUserAnswers(questions.map(q => ({ questionId: q.id, answer: null, isCorrect: null })));
  };

  const getStats = (): QuizStats => {
    const stats: QuizStats = {
      totalQuestions: questions.length,
      answered: userAnswers.filter(a => a.answer !== null).length,
      correct: userAnswers.filter(a => a.isCorrect === true).length,
      incorrect: userAnswers.filter(a => a.isCorrect === false).length,
      byCategory: {},
      byDifficulty: {},
    };

    // Agrupar por categoria
    questions.forEach((q) => {
      if (!stats.byCategory[q.category]) {
        stats.byCategory[q.category] = { total: 0, correct: 0 };
      }
      stats.byCategory[q.category].total += 1;

      const userAnswer = userAnswers.find(a => a.questionId === q.id);
      if (userAnswer?.isCorrect) {
        stats.byCategory[q.category].correct += 1;
      }
    });

    // Agrupar por dificuldade
    questions.forEach((q) => {
      if (!stats.byDifficulty[q.difficulty]) {
        stats.byDifficulty[q.difficulty] = { total: 0, correct: 0 };
      }
      stats.byDifficulty[q.difficulty].total += 1;

      const userAnswer = userAnswers.find(a => a.questionId === q.id);
      if (userAnswer?.isCorrect) {
        stats.byDifficulty[q.difficulty].correct += 1;
      }
    });

    return stats;
  };

  return {
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
  };
};
