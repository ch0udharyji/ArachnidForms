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
      <SheetContent 
        side="bottom" 
        className="w-screen h-screen sm:max-w-none max-w-none sm:w-screen m-0 p-0 flex flex-col bg-background/95 backdrop-blur-sm border-none print:static print:w-full print:max-w-none print:shadow-none print:p-0 print:bg-transparent"
        showCloseButton={false}
      >
        <SheetHeader className="print:hidden border-b border-border/50 bg-background/80 backdrop-blur-xl p-4 sm:px-8 sticky top-0 z-10 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-full hover:bg-surface">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <SheetTitle className="text-xl sm:text-2xl font-bold tracking-tight">Response Details</SheetTitle>
            </div>
            
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="flex items-center bg-surface border border-border rounded-full p-1 shadow-sm">
                <Button variant="ghost" size="icon" onClick={onPrev} disabled={currentIndex === 0} className="h-8 w-8 rounded-full">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium px-4 text-muted-foreground">
                  {currentIndex + 1} <span className="opacity-50">/</span> {totalCount}
                </span>
                <Button variant="ghost" size="icon" onClick={onNext} disabled={currentIndex === totalCount - 1} className="h-8 w-8 rounded-full">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="h-6 w-[1px] bg-border mx-1 hidden sm:block"></div>
              <Button variant="outline" size="sm" onClick={handlePrint} className="hidden sm:flex rounded-full px-4 shadow-sm">
                <Printer className="w-4 h-4 mr-2" /> Print
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting} className="rounded-full px-4 shadow-sm bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border-none">
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Delete</span></>}
              </Button>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 print:p-0 print:overflow-visible">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
            
            {/* Left Column: Answers */}
            <div className="flex-1 space-y-8">
              <div className="bg-surface/30 rounded-2xl border border-border/50 p-6 sm:p-8 shadow-sm print:border-none print:shadow-none print:p-0">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-6 flex items-center">
                  <span className="bg-primary/10 text-primary p-1.5 rounded-lg mr-2"><Save className="w-4 h-4" /></span>
                  Submitted Answers
                </h4>
                <div className="space-y-8">
                  {columns.map((col, idx) => {
                    const val = answers[col];
                    let displayVal = val;
                    if (Array.isArray(val)) displayVal = val.join(", ");
                    else if (typeof val === 'object' && val !== null) displayVal = JSON.stringify(val);
                    else if (val === undefined || val === null) displayVal = <span className="text-muted-foreground/50 italic">No answer provided</span>;
                    
                    return (
                      <div key={col} className="group">
                        <div className="font-medium text-sm text-foreground/70 mb-2 flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground bg-surface px-1.5 py-0.5 rounded border border-border/50">{idx + 1}</span>
                          {col}
                        </div>
                        <div className="text-base font-medium bg-background p-4 rounded-xl border border-border/50 shadow-sm print:border-none print:bg-transparent print:p-0 print:shadow-none">
                          {displayVal}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Metadata & Notes */}
            <div className="w-full lg:w-[350px] space-y-6 print:hidden">
              {/* Respondent Info */}
              <div className="bg-surface/30 rounded-2xl border border-border/50 p-6 shadow-sm">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Respondent</h4>
                <div className="flex items-center gap-4 mb-4">
                  {response.respondent?.image ? (
                    <img src={response.respondent.image} alt="Avatar" className="w-14 h-14 rounded-full ring-2 ring-background shadow-sm" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-2 ring-background shadow-sm">
                      <UserCircle className="w-8 h-8" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{response.respondent?.name || "Anonymous"}</h3>
                    <p className="text-sm text-muted-foreground">{response.respondent?.email || "No email"}</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground bg-background p-3 rounded-lg border border-border/50">
                  <span className="block mb-1 opacity-70">Submitted on</span>
                  <span className="font-medium text-foreground">{format(new Date(response.submittedAt), 'PPpp')}</span>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="bg-surface/30 rounded-2xl border border-border/50 p-6 shadow-sm">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Internal Notes</h4>
                <div className="space-y-3">
                  <Textarea
                    placeholder="Add private notes, tags, or status about this response..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[150px] resize-y bg-background border-border/50 focus:border-primary/50"
                  />
                  <Button 
                    onClick={handleSaveNotes} 
                    disabled={isSavingNotes || notes === response.internalNotes} 
                    className="w-full rounded-xl shadow-sm"
                  >
                    {isSavingNotes ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {notes === response.internalNotes ? "Saved" : "Save Notes"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
