import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PerformanceData {
  simuladoNumber: number;
  taxaAcerto: number;
  questoesRespondidas: number;
  acertos: number;
  data: string;
}

interface PerformanceChartProps {
  data: PerformanceData[];
  title: string;
}

export function PerformanceChart({ data, title }: PerformanceChartProps) {
  if (data.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-card rounded-lg border border-border">
        <p className="text-muted-foreground">Nenhum dado disponível para gráfico</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis 
            dataKey="simuladoNumber" 
            stroke="var(--muted-foreground)"
            label={{ value: 'Simulado #', position: 'insideBottomRight', offset: -5 }}
          />
          <YAxis 
            stroke="var(--muted-foreground)"
            label={{ value: 'Taxa de Acerto (%)', angle: -90, position: 'insideLeft' }}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--foreground)'
            }}
            formatter={(value) => {
              if (typeof value === 'number') {
                return `${value.toFixed(1)}%`;
              }
              return value;
            }}
            labelFormatter={(label) => `Simulado ${label}`}
          />
          <Legend 
            wrapperStyle={{ color: 'var(--foreground)' }}
          />
          <Line 
            type="monotone" 
            dataKey="taxaAcerto" 
            stroke="var(--primary)" 
            strokeWidth={2}
            dot={{ fill: 'var(--primary)', r: 5 }}
            activeDot={{ r: 7 }}
            name="Taxa de Acerto (%)"
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
