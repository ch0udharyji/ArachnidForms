"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#14b8a6', '#84cc16'];

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

      // Collect all raw answers for this specific question
      const rawAnswers = responses.map((r: any) => r.answers[label]).filter((a: any) => a !== undefined && a !== null && a !== '');

      // Multiple Choice (Array of strings) - count each selection individually
      if (type === 'checkbox') {
        const freqs: Record<string, number> = {};
        rawAnswers.forEach((ans: any) => {
          if (Array.isArray(ans)) {
            ans.forEach(val => { freqs[String(val)] = (freqs[String(val)] || 0) + 1; });
          } else {
            // Fallback for older boolean data format
            const key = typeof ans === 'boolean' ? (ans ? 'Checked' : 'Unchecked') : String(ans);
            freqs[key] = (freqs[key] || 0) + 1;
          }
        });
        const chartData = Object.keys(freqs).map(k => ({ name: k, count: freqs[k] }));
        return { label, type: 'bar', data: chartData };
      }

      // Single Selects mapped to Pie Charts
      if (['select', 'radio', 'image_choice', 'switch', 'consent'].includes(type)) {
        const freqs: Record<string, number> = {};
        rawAnswers.forEach((ans: any) => { 
          const key = typeof ans === 'boolean' ? (ans ? 'Yes' : 'No') : String(ans);
          freqs[key] = (freqs[key] || 0) + 1; 
        });
        const chartData = Object.keys(freqs).map(k => ({ name: k, value: freqs[k] }));
        return { label, type: 'pie', data: chartData };
      } 
      
      // Ratings and NPS mapped to ordered Bar Charts
      if (['rating', 'nps', 'slider'].includes(type)) {
        const freqs: Record<string, number> = {};
        rawAnswers.forEach((ans: any) => { freqs[String(ans)] = (freqs[String(ans)] || 0) + 1; });
        const chartData = Object.keys(freqs).sort((a,b) => Number(a) - Number(b)).map(k => ({ name: type === 'rating' ? k + ' Stars' : k, count: freqs[k] }));
        return { label, type: 'bar', data: chartData };
      }

      return null;
    }).filter(Boolean);

  }, [nodes, responses]);

  if (chartsData.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {chartsData.map((chart: any, idx: number) => (
        <Card key={idx} className="bg-surface/30 backdrop-blur border-border overflow-hidden flex flex-col shadow-sm">
          <CardHeader className="bg-surface/50 border-b border-border/50 py-4 shrink-0">
            <CardTitle className="text-sm font-bold truncate" title={chart.label}>
              {chart.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 h-[350px] flex items-center justify-center">
            {chart.data.length === 0 ? (
              <div className="text-muted-foreground text-sm">
                No measurable data to display
              </div>
            ) : chart.type === 'pie' ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chart.data}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    labelLine={false}
                  >
                    {chart.data.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: 'hsl(var(--foreground))' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : chart.type === 'bar' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={60}>
                    {chart.data.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
