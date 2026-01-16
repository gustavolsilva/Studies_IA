import { useState, useEffect } from 'react';

export interface QuizAttempt {
  id: string;
  mode: 'exam' | 'practice' | 'free';
  startTime: number;
  endTime: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  timeSpent: number; // em segundos
  categoryStats: Record<string, { correct: number; total: number }>;
  difficultyStats: Record<string, { correct: number; total: number }>;
  answers: Array<{
    questionId: string;
    selected: string;
    correct: string;
    isCorrect: boolean;
    category: string;
    difficulty: string;
  }>;
}

export interface QuizHistory {
  attempts: QuizAttempt[];
  totalAttempts: number;
  overallAccuracy: number;
  bestScore: number;
  worstScore: number;
  averageScore: number;
  totalTimeSpent: number;
}

const STORAGE_KEY = 'databricks_quiz_history';

export function useQuizHistory() {
  const [history, setHistory] = useState<QuizHistory | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar histórico do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      } else {
        setHistory({
          attempts: [],
          totalAttempts: 0,
          overallAccuracy: 0,
          bestScore: 0,
          worstScore: 0,
          averageScore: 0,
          totalTimeSpent: 0,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      setHistory({
        attempts: [],
        totalAttempts: 0,
        overallAccuracy: 0,
        bestScore: 0,
        worstScore: 0,
        averageScore: 0,
        totalTimeSpent: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Salvar tentativa de simulado
  const saveAttempt = (attempt: Omit<QuizAttempt, 'id'>) => {
    if (!history) return;

    const newAttempt: QuizAttempt = {
      ...attempt,
      id: `attempt_${Date.now()}`,
    };

    const updatedAttempts = [newAttempt, ...history.attempts];
    const totalCorrect = updatedAttempts.reduce((sum, a) => sum + a.correctAnswers, 0);
    const totalQuestions = updatedAttempts.reduce((sum, a) => sum + a.totalQuestions, 0);
    const scores = updatedAttempts.map(a => (a.correctAnswers / a.totalQuestions) * 100);

    const updatedHistory: QuizHistory = {
      attempts: updatedAttempts,
      totalAttempts: updatedAttempts.length,
      overallAccuracy: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0,
      bestScore: scores.length > 0 ? Math.max(...scores) : 0,
      worstScore: scores.length > 0 ? Math.min(...scores) : 0,
      averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b) / scores.length : 0,
      totalTimeSpent: updatedAttempts.reduce((sum, a) => sum + a.timeSpent, 0),
    };

    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  };

  // Obter detalhes de um simulado específico
  const getAttemptDetails = (attemptId: string) => {
    return history?.attempts.find(a => a.id === attemptId);
  };

  // Obter estatísticas por categoria
  const getCategoryStats = () => {
    if (!history || history.attempts.length === 0) return {};

    const stats: Record<string, { correct: number; total: number; accuracy: number }> = {};

    history.attempts.forEach(attempt => {
      Object.entries(attempt.categoryStats).forEach(([category, stat]) => {
        if (!stats[category]) {
          stats[category] = { correct: 0, total: 0, accuracy: 0 };
        }
        stats[category].correct += stat.correct;
        stats[category].total += stat.total;
      });
    });

    // Calcular acurácia
    Object.keys(stats).forEach(category => {
      stats[category].accuracy = stats[category].total > 0
        ? (stats[category].correct / stats[category].total) * 100
        : 0;
    });

    return stats;
  };

  // Obter estatísticas por dificuldade
  const getDifficultyStats = () => {
    if (!history || history.attempts.length === 0) return {};

    const stats: Record<string, { correct: number; total: number; accuracy: number }> = {};

    history.attempts.forEach(attempt => {
      Object.entries(attempt.difficultyStats).forEach(([difficulty, stat]) => {
        if (!stats[difficulty]) {
          stats[difficulty] = { correct: 0, total: 0, accuracy: 0 };
        }
        stats[difficulty].correct += stat.correct;
        stats[difficulty].total += stat.total;
      });
    });

    // Calcular acurácia
    Object.keys(stats).forEach(difficulty => {
      stats[difficulty].accuracy = stats[difficulty].total > 0
        ? (stats[difficulty].correct / stats[difficulty].total) * 100
        : 0;
    });

    return stats;
  };

  // Limpar histórico
  const clearHistory = () => {
    const emptyHistory: QuizHistory = {
      attempts: [],
      totalAttempts: 0,
      overallAccuracy: 0,
      bestScore: 0,
      worstScore: 0,
      averageScore: 0,
      totalTimeSpent: 0,
    };
    setHistory(emptyHistory);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Deletar tentativa específica
  const deleteAttempt = (attemptId: string) => {
    if (!history) return;

    const updatedAttempts = history.attempts.filter(a => a.id !== attemptId);
    const totalCorrect = updatedAttempts.reduce((sum, a) => sum + a.correctAnswers, 0);
    const totalQuestions = updatedAttempts.reduce((sum, a) => sum + a.totalQuestions, 0);
    const scores = updatedAttempts.map(a => (a.correctAnswers / a.totalQuestions) * 100);

    const updatedHistory: QuizHistory = {
      attempts: updatedAttempts,
      totalAttempts: updatedAttempts.length,
      overallAccuracy: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0,
      bestScore: scores.length > 0 ? Math.max(...scores) : 0,
      worstScore: scores.length > 0 ? Math.min(...scores) : 0,
      averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b) / scores.length : 0,
      totalTimeSpent: updatedAttempts.reduce((sum, a) => sum + a.timeSpent, 0),
    };

    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  };

  // Exportar histórico em JSON
  const exportHistory = () => {
    if (!history) return '';
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      history,
    };
    return JSON.stringify(payload, null, 2);
  };

  // Importar histórico a partir de JSON
  const importHistory = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (!data || !data.history || !Array.isArray(data.history.attempts)) {
        throw new Error('Formato inválido');
      }
      const imported: QuizHistory = data.history as QuizHistory;
      setHistory(imported);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(imported));
      return true;
    } catch (e) {
      console.error('Falha ao importar histórico:', e);
      return false;
    }
  };

  return {
    history,
    loading,
    saveAttempt,
    getAttemptDetails,
    getCategoryStats,
    getDifficultyStats,
    clearHistory,
    deleteAttempt,
    exportHistory,
    importHistory,
  };
}
