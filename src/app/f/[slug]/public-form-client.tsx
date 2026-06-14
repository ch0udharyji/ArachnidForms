"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

import { signIn } from "next-auth/react";
import { usePathname } from "next/navigation";

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

export function PublicFormClient({ slug, title, canvasData, session, previousResponse }: { slug: string, title: string, canvasData: any, session: any, previousResponse?: any }) {
  const pathname = usePathname();
  const [hasVisited, setHasVisited] = useState(false);
  const [answersById, setAnswersById] = useState<Record<string, any>>({});
  const [answersByLabel, setAnswersByLabel] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from local storage on mount, or from previous response if editing
  useEffect(() => {
    try {
      const savedById = localStorage.getItem(`form-draft-${slug}-id`);
      const savedByLabel = localStorage.getItem(`form-draft-${slug}-label`);
      if (savedById && savedByLabel) {
        setAnswersById(JSON.parse(savedById));
        setAnswersByLabel(JSON.parse(savedByLabel));
      } else if (previousResponse) {
        let constructedById = previousResponse.answersById || {};
        const byLabel = previousResponse.answers || {};
        
        // Backward compatibility for old responses that didn't save answersById
        if (Object.keys(constructedById).length === 0 && Object.keys(byLabel).length > 0) {
          canvasData?.nodes?.forEach((node: any) => {
            if (node.data?.label && byLabel[node.data.label] !== undefined) {
              constructedById[node.id] = byLabel[node.data.label];
            }
          });
        }
        
        setAnswersById(constructedById);
        setAnswersByLabel(byLabel);
      }
    } catch (e) {}
  }, [slug, previousResponse]);

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

    if (session?.user?.isTestAccount) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/f/${slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          answers: answersByLabel, 
          answersById: answersById, 
          responseId: previousResponse?.id 
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit form");

      setIsSubmitted(true);
      // Clear draft on success
      localStorage.removeItem(`form-draft-${slug}-id`);
      localStorage.removeItem(`form-draft-${slug}-label`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (nodeId: string, label: string, value: any) => {
    const newAnswersById = { ...answersById, [nodeId]: value };
    const newAnswersByLabel = { ...answersByLabel, [label]: value };
    setAnswersById(newAnswersById);
    setAnswersByLabel(newAnswersByLabel);
    
    // Save to local storage on change
    localStorage.setItem(`form-draft-${slug}-id`, JSON.stringify(newAnswersById));
    localStorage.setItem(`form-draft-${slug}-label`, JSON.stringify(newAnswersByLabel));
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
        <div className="max-w-2xl w-full space-y-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/10">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">Thank You!</h2>
          <p className="mt-4 text-lg sm:text-xl text-muted-foreground/80 font-medium">
            {previousResponse ? "Your response has been successfully updated." : "Your response has been successfully submitted."}
          </p>
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

      <div className="w-full max-w-3xl relative z-10 space-y-8 px-4 sm:px-8">
        {history.length > 0 && (
          <Button variant="ghost" onClick={handleBack} className="absolute -top-16 left-4 sm:left-8 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        )}

        {previousResponse && (
          <div className="absolute -top-16 right-4 sm:right-8 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium border border-primary/20 flex items-center">
            <Sparkles className="w-3 h-3 mr-1.5" />
            Editing previous response {previousResponse.editCount > 0 && `(Edited ${previousResponse.editCount}x)`}
          </div>
        )}

        <div key={animationKey} className="animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-both w-full">
          {isEndNode ? (
            <div className="w-full text-center space-y-8 py-8">
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">Ready to submit?</h2>
              
              {session?.user?.isTestAccount ? (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl text-base font-medium leading-relaxed max-w-xl mx-auto">
                  Test accounts cannot submit forms. Please sign in with a real account to continue.
                </div>
              ) : (
                <p className="text-lg sm:text-xl text-muted-foreground/80">Review your answers by going back, or submit them now.</p>
              )}
              
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <Button 
                onClick={session?.user?.isTestAccount ? () => signIn(undefined, { callbackUrl: pathname }) : handleSubmit} 
                disabled={isSubmitting}
                className={cn(
                  "h-14 sm:h-16 px-8 sm:px-12 text-lg sm:text-xl font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all w-full sm:w-auto mt-6",
                  isSubmitting && "opacity-70 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                ) : session?.user?.isTestAccount ? (
                  <>Sign In to Submit <ChevronRight className="w-5 h-5 ml-2" /></>
                ) : (
                  <>
                    {previousResponse ? "Update Response" : "Submit Response"} <CheckCircle2 className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="w-full transition-all py-6 sm:py-10">
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground flex items-baseline gap-3 leading-tight">
                    <span className="text-primary/50 text-xl sm:text-2xl flex-shrink-0">{history.length + 1}.</span> 
                    <span>
                      {currentNode?.data?.label || "Untitled Question"}
                      {currentNode?.data?.required && <span className="text-primary text-2xl leading-none ml-2">*</span>}
                    </span>
                  </h1>
                  {currentNode?.data?.description && (
                    <p className="mt-3 text-muted-foreground/80 text-base sm:text-lg pl-8 sm:pl-10">{currentNode.data.description}</p>
                  )}
                </div>

                <div className="pt-6 pl-8 sm:pl-10">
                  {currentNode?.data?.questionType === 'long_text' || currentNode?.data?.questionType === 'textarea' ? (
                    <Textarea 
                      autoFocus
                      placeholder="Type your answer here..."
                      className="min-h-[120px] sm:min-h-[160px] text-lg sm:text-xl p-4 sm:p-6 bg-background/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none rounded-xl sm:rounded-2xl shadow-sm"
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
                      className="w-full h-14 sm:h-16 px-4 sm:px-6 text-lg sm:text-xl font-medium bg-background/50 border border-border rounded-xl sm:rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none appearance-none cursor-pointer shadow-sm"
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
                          "flex items-center space-x-4 p-4 sm:p-5 border rounded-xl sm:rounded-2xl cursor-pointer transition-all hover:bg-primary/5",
                          answersById[currentNode.id] === opt ? "border-primary bg-primary/10 ring-1 ring-primary shadow-sm shadow-primary/10" : "border-border bg-background/50"
                        )}>
                          <input 
                            type="radio" 
                            name={currentNode.id} 
                            value={opt}
                            checked={answersById[currentNode.id] === opt}
                            onChange={(e) => handleInputChange(currentNode.id, currentNode.data.label as string, e.target.value)}
                            className="w-5 h-5 sm:w-6 sm:h-6 text-primary border-border focus:ring-primary bg-transparent"
                          />
                          <span className="text-lg sm:text-xl font-medium text-foreground">{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : currentNode?.data?.questionType === 'rating' ? (
                    <div className="flex flex-wrap gap-2 sm:gap-4">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleInputChange(currentNode.id, currentNode.data.label as string, num)}
                          className={cn(
                            "w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl text-xl sm:text-2xl font-bold transition-all border",
                            answersById[currentNode.id] === num ? "bg-primary text-primary-foreground border-primary scale-110 shadow-lg shadow-primary/20" : "bg-background/50 border-border text-muted-foreground hover:border-primary hover:text-foreground"
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
                      placeholder="Type your answer here..."
                      className="h-14 sm:h-16 px-4 sm:px-6 text-lg sm:text-xl font-medium bg-background/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-xl sm:rounded-2xl shadow-sm"
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

                <div className="pt-8 flex items-center gap-4 pl-8 sm:pl-10">
                  <Button 
                    onClick={handleNext}
                    disabled={currentNode?.data?.required && !answersById[currentNode.id]}
                    className="h-12 sm:h-14 px-8 sm:px-10 text-lg font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                  >
                    OK <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                  <span className="text-sm text-muted-foreground/70 hidden sm:inline-flex items-center gap-1.5">
                    press <kbd className="font-mono bg-background/50 px-1.5 py-0.5 rounded border border-border/50 text-foreground/70 shadow-sm text-xs">Enter</kbd> ↵
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
