import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { churnData } from "@/data/chartData";

export function ChurnChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={churnData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorNewCustomers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(238, 84%, 67%)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(238, 84%, 67%)" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            vertical={false}
          />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <YAxis 
            yAxisId="left"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickFormatter={(value) => `${value}`}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
            formatter={(value: number, name: string) => [
              name === 'churn' ? `${value}%` : value,
              name === 'churn' ? 'Taxa de Churn' : 'Novos Clientes'
            ]}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => (
              <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: 12 }}>
                {value === 'churn' ? 'Taxa de Churn' : 'Novos Clientes'}
              </span>
            )}
          />
          <Bar 
            yAxisId="left"
            dataKey="newCustomers" 
            fill="url(#colorNewCustomers)"
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="churn"
            stroke="hsl(0, 72%, 51%)"
            strokeWidth={2}
            dot={{ fill: 'hsl(0, 72%, 51%)', strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: 'hsl(0, 72%, 51%)' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
