"use client";

import { useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ResponsesTable({ responses, columns }: { responses: any[], columns: string[] }) {
  const [search, setSearch] = useState("");

  const filteredResponses = responses.filter((r) => {
    if (!search) return true;
    
    const searchLower = search.toLowerCase();
    
    // Check respondent email/name
    if (r.respondent?.name?.toLowerCase().includes(searchLower)) return true;
    if (r.respondent?.email?.toLowerCase().includes(searchLower)) return true;
    
    // Check answers
    const answers = r.answers as Record<string, any>;
    for (const key of columns) {
      const val = answers[key];
      if (typeof val === 'string' && val.toLowerCase().includes(searchLower)) return true;
      if (typeof val === 'number' && val.toString().includes(searchLower)) return true;
      if (Array.isArray(val) && val.join(" ").toLowerCase().includes(searchLower)) return true;
    }
    
    return false;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Filter by name, email, or answers..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-surface/50 border-border focus:border-primary focus:ring-primary/20"
          />
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          Showing {filteredResponses.length} of {responses.length} responses
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface/30 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface/50 text-muted-foreground font-semibold border-b border-border text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Respondent</th>
                <th className="px-6 py-4 whitespace-nowrap">Submitted</th>
                {columns.map(col => (
                  <th key={col} className="px-6 py-4 whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredResponses.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} className="px-6 py-12 text-center text-muted-foreground">
                    No responses match your search.
                  </td>
                </tr>
              ) : filteredResponses.map(response => {
                const answers = response.answers as Record<string, any>;
                return (
                  <tr key={response.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {response.respondent ? (
                        <div>
                          <div className="font-medium text-foreground">{response.respondent.name || "Anonymous User"}</div>
                          <div className="text-xs text-muted-foreground">{response.respondent.email}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">Anonymous</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground" title={format(new Date(response.submittedAt), 'PPpp')}>
                      {formatDistanceToNow(new Date(response.submittedAt), { addSuffix: true })}
                    </td>
                    {columns.map(col => {
                      const val = answers[col];
                      let displayVal = val;
                      if (Array.isArray(val)) displayVal = val.join(", ");
                      else if (typeof val === 'object' && val !== null) displayVal = JSON.stringify(val);
                      else if (val === undefined || val === null) displayVal = <span className="text-muted-foreground/50">-</span>;
                      
                      return (
                        <td key={col} className="px-6 py-4 max-w-[300px] truncate">
                          {displayVal}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
