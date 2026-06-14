"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Printer, Trash2, ChevronLeft, ChevronRight, UserCircle, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ResponseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  response: any;
  columns: string[];
  totalCount: number;
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onDelete: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export function ResponseSheet({
  open,
  onOpenChange,
  response,
  columns,
  totalCount,
  currentIndex,
  onNext,
  onPrev,
  onDelete,
  onUpdateNotes
}: ResponseSheetProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const router = useRouter();

  // Reset notes when response changes
  useEffect(() => {
    setNotes(response?.internalNotes || "");
  }, [response?.id, response?.internalNotes]);

  if (!response) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this response? This action cannot be undone.")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/responses/${response.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Response deleted successfully");
      onDelete(response.id);
      onOpenChange(false);
    } catch {
      toast.error("Failed to delete response");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      const res = await fetch(`/api/responses/${response.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internalNotes: notes }),
      });
      if (!res.ok) throw new Error();
      toast.success("Notes saved");
      onUpdateNotes(response.id, notes);
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const answers = response.answers as Record<string, any>;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto print:static print:w-full print:max-w-none print:shadow-none print:p-0">
        <SheetHeader className="print:hidden space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle>Response Details</SheetTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={onPrev} disabled={currentIndex === 0}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium">
                {currentIndex + 1} / {totalCount}
              </span>
              <Button variant="outline" size="icon" onClick={onNext} disabled={currentIndex === totalCount - 1}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
            <Button variant="secondary" size="sm" onClick={handlePrint} className="flex-1 sm:flex-none">
              <Printer className="w-4 h-4 mr-2" /> Print PDF
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting} className="flex-1 sm:flex-none bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border-none shadow-none">
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-4 h-4 mr-2" /> Delete</>}
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-8 space-y-8 print:mt-0 print:p-8">
          {/* Respondent Info */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-surface/50 border border-border print:border-none print:bg-transparent print:p-0">
            {response.respondent?.image ? (
              <img src={response.respondent.image} alt="Avatar" className="w-12 h-12 rounded-full" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <UserCircle className="w-8 h-8" />
              </div>
            )}
            <div>
              <h3 className="font-bold text-lg">{response.respondent?.name || "Anonymous User"}</h3>
              <p className="text-muted-foreground">{response.respondent?.email || "No email provided"}</p>
              <p className="text-xs text-muted-foreground mt-1">Submitted on {format(new Date(response.submittedAt), 'PPpp')}</p>
            </div>
          </div>

          {/* Answers */}
          <div className="space-y-6">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Answers</h4>
            {columns.map(col => {
              const val = answers[col];
              let displayVal = val;
              if (Array.isArray(val)) displayVal = val.join(", ");
              else if (typeof val === 'object' && val !== null) displayVal = JSON.stringify(val);
              else if (val === undefined || val === null) displayVal = <span className="text-muted-foreground/50 italic">No answer provided</span>;
              
              return (
                <div key={col} className="space-y-1">
                  <div className="font-medium text-sm text-foreground/80">{col}</div>
                  <div className="text-base bg-surface/30 p-3 rounded-lg border border-border/50 print:border-none print:bg-transparent print:p-0">
                    {displayVal}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Internal Notes */}
          <div className="space-y-3 print:hidden pt-6 border-t border-border">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Internal Notes</h4>
            <Textarea
              placeholder="Add private notes about this response..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px] resize-y"
            />
            <Button onClick={handleSaveNotes} disabled={isSavingNotes || notes === response.internalNotes} className="w-full">
              {isSavingNotes ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Notes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
