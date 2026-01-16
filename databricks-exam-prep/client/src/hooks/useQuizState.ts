import { useState, useEffect } from 'react';
import { loadQuestions, type Question as LoadedQuestion } from '@/lib/questionsLoader';

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
  const [questions, setQuestions] = useState<LoadedQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carregar questões via loader (normaliza options_A/B/C/D → options)
  useEffect(() => {
    const doLoad = async () => {
      try {
        const data = await loadQuestions();
        setQuestions(data);
        setUserAnswers(data.map(q => ({ questionId: q.id, answer: null, isCorrect: null })));
      } catch (error) {
        console.error('Erro ao carregar questões:', error);
      } finally {
        setLoading(false);
      }
    };
    doLoad();
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
