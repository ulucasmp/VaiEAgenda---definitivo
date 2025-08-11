
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';

interface WeeklyData {
  day: string;
  agendamentos: number;
  receita: number;
  disponivel: number;
}

interface WeeklyChartsProps {
  weeklyData: WeeklyData[];
  chartConfig: any;
}

const WeeklyCharts = ({ weeklyData, chartConfig }: WeeklyChartsProps) => {
  return (
    <div className="grid lg:grid-cols-2 gap-6 mb-8">
      <Card className="border-blue-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">Agendamentos Semanais</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: any, name: string) => [
                    `${value} agendamentos`,
                    name === 'agendamentos' ? 'Agendamentos' : name
                  ]}
                />
                <Bar 
                  dataKey="agendamentos" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card className="border-blue-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">Receita Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: any, name: string) => [
                    `R$ ${value}`,
                    name === 'receita' ? 'Receita' : name
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="receita" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyCharts;
