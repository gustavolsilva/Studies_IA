import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, BookOpen, Zap } from "lucide-react";
import { useLocation } from "wouter";

export default function ModeSelection() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <h1 className="text-3xl font-bold text-primary">Databricks Exam Prep</h1>
          <p className="text-muted-foreground mt-2">Escolha o modo de simulado</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Modo Prova Oficial */}
          <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
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
          <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
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
          <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
            <div onClick={() => setLocation("/")} className="space-y-4">
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
      </main>
    </div>
  );
}
