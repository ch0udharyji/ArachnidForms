"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#f97316'];

export function ResponsesCharts({ form }: { form: any }) {
  const canvasData = form.canvasData;
  const nodes = canvasData?.nodes || [];
  const responses = form.responses || [];

  const chartsData = useMemo(() => {
    if (!responses.length) return [];

    const questionNodes = nodes.filter((n: any) => n.type === 'questionNode');
    
    return questionNodes.map((node: any) => {
      const label = node.data.label || 'Untitled Question';
      const type = node.data.questionType || 'text';
      const options = node.data.options || [];

      // Collect all answers for this specific question
      const answersForQuestion = responses.map((r: any) => {
        const ans = r.answers[label];
        return ans !== undefined && ans !== null ? String(ans) : null;
      }).filter(Boolean);

      if (['dropdown', 'multiple_choice', 'radio'].includes(type)) {
        // Aggregate frequencies
        const freqs: Record<string, number> = {};
        answersForQuestion.forEach((ans: string) => { freqs[ans] = (freqs[ans] || 0) + 1; });
        const chartData = Object.keys(freqs).map(k => ({ name: k, value: freqs[k] }));
        return { label, type: 'pie', data: chartData };
      } 
      
      if (type === 'rating') {
        const freqs: Record<string, number> = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
        answersForQuestion.forEach((ans: string) => { freqs[ans] = (freqs[ans] || 0) + 1; });
        const chartData = Object.keys(freqs).map(k => ({ rating: k + ' Stars', count: freqs[k] }));
        return { label, type: 'bar', data: chartData };
      }

      return null;
    }).filter(Boolean);

  }, [nodes, responses]);

  if (chartsData.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {chartsData.map((chart: any, idx: number) => (
        <Card key={idx} className="bg-surface/30 backdrop-blur border-border overflow-hidden">
          <CardHeader className="bg-surface/50 border-b border-border/50 py-4">
            <CardTitle className="text-sm font-bold truncate" title={chart.label}>
              {chart.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 h-[300px]">
            {chart.data.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                No data to display
              </div>
            ) : chart.type === 'pie' ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chart.data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chart.data.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : chart.type === 'bar' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="rating" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// [dev-log-sync]: eff7569a4ed63363