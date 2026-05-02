"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function CsvExportButton({ columns, responses, filename }: { columns: string[], responses: any[], filename: string }) {
  const handleExport = () => {
    // Build CSV headers
    const headers = ['Submitted At', ...columns];
    
    // Build CSV rows
    const rows = responses.map(response => {
      const answers = response.answers || {};
      const rowData = [
        new Date(response.submittedAt).toISOString(),
        ...columns.map(col => {
          let val = answers[col];
          if (Array.isArray(val)) val = val.join('; ');
          if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
          if (val === undefined || val === null) val = '';
          
          // Escape quotes and wrap in quotes for CSV safety
          const escaped = String(val).replace(/"/g, '""');
          return `"${escaped}"`;
        })
      ];
      return rowData.join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button onClick={handleExport} size="sm" className="bg-primary/10 text-primary hover:bg-primary/20 border-transparent transition-all hover:scale-105">
      <Download className="w-4 h-4 sm:mr-2" />
      <span className="hidden sm:inline">Export CSV</span>
    </Button>
  );
}

// [dev-log-sync]: a0455ada29f9d8e8