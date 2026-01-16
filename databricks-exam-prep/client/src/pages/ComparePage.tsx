import { useState } from "react";
import { useQuizHistory } from "@/hooks/useQuizHistory";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

function buildCategoryRows(a1: any, a2: any) {
  const tags = new Set([
    ...Object.keys(a1?.categoryStats || {}),
    ...Object.keys(a2?.categoryStats || {}),
  ]);
  const rows: Array<{ category: string; a1Pct: number; a2Pct: number; delta: number }> = [];
  tags.forEach((tag) => {
    const r1 = a1?.categoryStats?.[tag] || { correct: 0, total: 0 };
    const r2 = a2?.categoryStats?.[tag] || { correct: 0, total: 0 };
    const pct1 = r1.total ? Math.round((r1.correct / r1.total) * 100) : 0;
    const pct2 = r2.total ? Math.round((r2.correct / r2.total) * 100) : 0;
    rows.push({ category: tag, a1Pct: pct1, a2Pct: pct2, delta: pct2 - pct1 });
  });
  return rows.sort((x, y) => y.delta - x.delta);
}

export default function ComparePage() {
  const { history } = useQuizHistory();
  const attempts = history?.attempts || [];
  const [firstId, setFirstId] = useState<string>(attempts[0]?.id || "");
  const [secondId, setSecondId] = useState<string>(attempts[1]?.id || "");

  const a1 = attempts.find((a) => a.id === firstId);
  const a2 = attempts.find((a) => a.id === secondId);

  const rows = a1 && a2 ? buildCategoryRows(a1, a2) : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-primary hover:underline mb-4 inline-block">← Voltar</Link>
        <h1 className="text-4xl font-bold text-primary mb-2">Comparar Simulados</h1>
        <p className="text-muted-foreground mb-6">Selecione duas tentativas para comparar por categoria</p>

        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">Primeiro Simulado</label>
              <select
                aria-label="Selecionar primeiro simulado"
                value={firstId}
                onChange={(e) => setFirstId(e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
              >
                {attempts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {new Date(a.startTime).toLocaleDateString('pt-BR')} · {a.mode} · {Math.round((a.correctAnswers / a.totalQuestions) * 100)}%
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Segundo Simulado</label>
              <select
                aria-label="Selecionar segundo simulado"
                value={secondId}
                onChange={(e) => setSecondId(e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
              >
                {attempts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {new Date(a.startTime).toLocaleDateString('pt-BR')} · {a.mode} · {Math.round((a.correctAnswers / a.totalQuestions) * 100)}%
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {a1 && a2 ? (
          <div className="space-y-8">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Resumo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Primeiro</p>
                  <p className="font-semibold">{Math.round((a1.correctAnswers / a1.totalQuestions) * 100)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Segundo</p>
                  <p className="font-semibold">{Math.round((a2.correctAnswers / a2.totalQuestions) * 100)}%</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Comparação por Categoria</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-border">
                      <th className="py-2">Categoria</th>
                      <th className="py-2">Primeiro (%)</th>
                      <th className="py-2">Segundo (%)</th>
                      <th className="py-2">Δ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.category} className="border-b border-border">
                        <td className="py-2">{r.category}</td>
                        <td className="py-2">{r.a1Pct}</td>
                        <td className="py-2">{r.a2Pct}</td>
                        <td className={`py-2 ${r.delta >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{r.delta}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={rows}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="category" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} />
                    <Legend />
                    <Bar dataKey="a1Pct" fill="var(--primary)" name="Primeiro (%)" />
                    <Bar dataKey="a2Pct" fill="var(--sidebar-ring)" name="Segundo (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        ) : (
          <Card className="p-6">
            <p className="text-muted-foreground">Selecione duas tentativas para visualizar a comparação.</p>
          </Card>
        )}

        <div className="mt-8">
          <Link href="/history">
            <Button variant="outline">Ver Histórico</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
