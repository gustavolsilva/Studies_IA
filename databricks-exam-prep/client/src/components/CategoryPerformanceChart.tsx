import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CategoryData {
  simuladoNumber: number;
  [key: string]: number | string;
}

interface CategoryPerformanceChartProps {
  data: CategoryData[];
  categories: string[];
  title: string;
}

const colors = [
  'var(--primary)',
  'var(--destructive)',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899'
];

export function CategoryPerformanceChart({ data, categories, title }: CategoryPerformanceChartProps) {
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
          {categories.map((category, index) => (
            <Line 
              key={category}
              type="monotone" 
              dataKey={category} 
              stroke={colors[index % colors.length]} 
              strokeWidth={2}
              dot={{ fill: colors[index % colors.length], r: 4 }}
              activeDot={{ r: 6 }}
              name={category}
              isAnimationActive={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
