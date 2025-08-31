"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormNode {
  id: string;
  type: string;
  data: {
    label?: string;
    questionType?: string;
    description?: string;
    required?: boolean;
    options?: string[];
    [key: string]: any;
  };
}

export function PublicFormClient({ slug, title, canvasData }: { slug: string, title: string, canvasData: any }) {
  const [hasVisited, setHasVisited] = useState(false);
  const [answersById, setAnswersById] = useState<Record<string, any>>({});
  const [answersByLabel, setAnswersByLabel] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasVisited) {
      setHasVisited(true);
      fetch(`/api/f/${slug}/visit`, { method: "POST" }).catch(() => {});
    }
  }, [hasVisited, slug]);

  const nodes: FormNode[] = canvasData?.nodes || [];
  const edges: any[] = canvasData?.edges || [];

  const startNode = nodes.find(n => n.type === 'startNode');

  const getNextNodeId = (fromNodeId: string, currentAnswersById: Record<string, any>): string | null => {
    let currentId = fromNodeId;
    let safeguard = 0;

    while (safeguard < 100) {
      safeguard++;
      const outgoingEdges = edges.filter(e => e.source === currentId);
      if (outgoingEdges.length === 0) return null;

      const currentNode = nodes.find(n => n.id === currentId);
      let nextEdge = outgoingEdges[0];

      if (currentNode?.type === 'logicNode') {
        const targetId = currentNode.data.targetNodeId;
        const operator = currentNode.data.operator;
        const compareValue = currentNode.data.compareValue;
        
        const actualValue = currentAnswersById[targetId] || "";
        let result = false;

        const valStr = String(actualValue).toLowerCase();
        const compStr = String(compareValue).toLowerCase();
        const valNum = Number(actualValue);
        const compNum = Number(compareValue);

        switch (operator) {
          case 'equals': result = valStr === compStr; break;
          case 'not_equals': result = valStr !== compStr; break;
          case 'contains': result = valStr.includes(compStr); break;
          case 'greater_than': result = !isNaN(valNum) && !isNaN(compNum) && valNum > compNum; break;
          case 'less_than': result = !isNaN(valNum) && !isNaN(compNum) && valNum < compNum; break;
          default: result = false;
        }

        const handle = result ? 'true' : 'false';
        nextEdge = outgoingEdges.find(e => e.sourceHandle === handle) || outgoingEdges[0];
      }

      if (!nextEdge) return null;

      const nextNode = nodes.find(n => n.id === nextEdge.target);
      if (!nextNode) return null;

      if (nextNode.type === 'questionNode' || nextNode.type === 'endNode') {
        return nextNode.id;
      }
      
      currentId = nextNode.id;
    }

    return null;
  };

  const firstQuestionId = useMemo(() => {
    if (!startNode) return null;
    return getNextNodeId(startNode.id, {});
  }, [startNode, edges, nodes]);

  const [currentNodeId, setCurrentNodeId] = useState<string | null>(firstQuestionId);
  const [history, setHistory] = useState<string[]>([]);
  const [animationKey, setAnimationKey] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/f/${slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answersByLabel })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit form");

      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (nodeId: string, label: string, value: any) => {
    setAnswersById(prev => ({ ...prev, [nodeId]: value }));
    setAnswersByLabel(prev => ({ ...prev, [label]: value }));
  };

  const handleNext = () => {
    if (!currentNodeId) return;
    const nextId = getNextNodeId(currentNodeId, answersById);
    if (nextId) {
      setHistory(prev => [...prev, currentNodeId]);
      setCurrentNodeId(nextId);
      setAnimationKey(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prevId = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentNodeId(prevId);
      setAnimationKey(prev => prev + 1);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8 bg-surface/30 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-border/50 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Thank You!</h2>
          <p className="mt-2 text-lg text-muted-foreground">Your response has been successfully submitted.</p>
        </div>
      </div>
    );
  }

  const currentNode = nodes.find(n => n.id === currentNodeId);

  if (!startNode || !currentNodeId || !currentNode) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <Sparkles className="w-12 h-12 text-primary mx-auto opacity-50" />
          <h2 className="text-2xl font-bold">This form is empty or disconnected.</h2>
        </div>
      </div>
    );
  }

  const isEndNode = currentNode.type === 'endNode';

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-16 px-4 relative overflow-hidden">
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-3xl relative z-10 space-y-8">
        {history.length > 0 && (
          <Button variant="ghost" onClick={handleBack} className="absolute -top-16 left-0 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        )}

        <div key={animationKey} className="animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-both w-full">
          {isEndNode ? (
            <div className="bg-surface/30 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-border/50 text-center space-y-8">
              <h2 className="text-4xl font-extrabold tracking-tight">Ready to submit?</h2>
              <p className="text-lg text-muted-foreground">Review your answers by going back, or submit them now.</p>
              
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl font-medium">
                  {error}
                </div>
              )}

              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className={cn(
                  "h-14 px-10 text-lg font-bold rounded-2xl shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all",
                  isSubmitting && "opacity-70 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Submitting...</>
                ) : (
                  <>Submit Response <CheckCircle2 className="w-6 h-6 ml-2" /></>
                )}
              </Button>
            </div>
          ) : (
            <div className="bg-surface/30 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl border border-border/50 transition-all">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground flex items-baseline gap-3 leading-tight">
                    <span className="text-primary/50 text-2xl">{history.length + 1}.</span> 
                    {currentNode?.data?.label || "Untitled Question"}
                    {currentNode?.data?.required && <span className="text-primary text-3xl leading-none">*</span>}
                  </h1>
                  {currentNode?.data?.description && (
                    <p className="mt-4 text-muted-foreground/80 text-xl pl-10">{currentNode.data.description}</p>
                  )}
                </div>

                <div className="pt-8 pl-0 sm:pl-10">
                  {currentNode?.data?.questionType === 'long_text' || currentNode?.data?.questionType === 'textarea' ? (
                    <Textarea 
                      autoFocus
                      placeholder="Type your answer here..."
                      className="min-h-[160px] text-xl p-6 bg-background/50 border-border focus:border-primary focus:ring-primary/20 resize-none rounded-2xl"
                      value={answersById[currentNode.id] || ""}
                      onChange={(e) => handleInputChange(currentNode.id, currentNode.data.label as string, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                          e.preventDefault();
                          handleNext();
                        }
                      }}
                    />
                  ) : currentNode?.data?.questionType === 'dropdown' || currentNode?.data?.questionType === 'multiple_choice' || currentNode?.data?.questionType === 'select' ? (
                    <select 
                      autoFocus
                      className="w-full h-16 px-6 text-xl bg-background/50 border border-border rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                      value={answersById[currentNode.id] || ""}
                      onChange={(e) => handleInputChange(currentNode.id, currentNode.data.label as string, e.target.value)}
                    >
                      <option value="">Select an option...</option>
                      {(currentNode.data.options || ['Option 1', 'Option 2', 'Option 3']).map((opt: string) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : currentNode?.data?.questionType === 'radio' ? (
                    <div className="space-y-3">
                      {(currentNode.data.options || ['Yes', 'No']).map((opt: string) => (
                        <label key={opt} className={cn(
                          "flex items-center space-x-3 p-4 border rounded-2xl cursor-pointer transition-all hover:bg-primary/5",
                          answersById[currentNode.id] === opt ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border bg-background/50"
                        )}>
                          <input 
                            type="radio" 
                            name={currentNode.id} 
                            value={opt}
                            checked={answersById[currentNode.id] === opt}
                            onChange={(e) => handleInputChange(currentNode.id, currentNode.data.label as string, e.target.value)}
                            className="w-5 h-5 text-primary border-border focus:ring-primary"
                          />
                          <span className="text-xl font-medium">{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : currentNode?.data?.questionType === 'rating' ? (
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleInputChange(currentNode.id, currentNode.data.label as string, num)}
                          className={cn(
                            "w-14 h-14 rounded-2xl text-2xl font-bold transition-all border",
                            answersById[currentNode.id] === num ? "bg-primary text-primary-foreground border-primary scale-110" : "bg-background/50 border-border text-muted-foreground hover:border-primary hover:text-foreground"
                          )}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <Input 
                      autoFocus
                      type={currentNode?.data?.questionType === 'email' ? 'email' : currentNode?.data?.questionType === 'number' ? 'number' : 'text'}
                      placeholder="Your answer"
                      className="h-16 px-6 text-xl bg-background/50 border-border focus:border-primary focus:ring-primary/20 rounded-2xl"
                      value={answersById[currentNode.id] || ""}
                      onChange={(e) => handleInputChange(currentNode.id, currentNode.data.label as string, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleNext();
                        }
                      }}
                    />
                  )}
                </div>

                <div className="pt-10 flex items-center gap-4 pl-0 sm:pl-10">
                  <Button 
                    onClick={handleNext}
                    disabled={currentNode?.data?.required && !answersById[currentNode.id]}
                    className="h-14 px-8 text-lg font-bold rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    OK <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                  <span className="text-sm text-muted-foreground hidden sm:inline-flex items-center gap-1">
                    press <kbd className="font-mono bg-background px-1.5 py-0.5 rounded border">Enter</kbd> ↵
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// [dev-log-sync]: 3d2262d9eb7e308d