"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { MoreVertical, Share2, Trash2, Edit2, ExternalLink, Settings, BarChart, Clock, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { createFormAction } from "@/app/actions/form";

export function FormList({ forms: initialForms }: { forms: any[] }) {
  const [forms, setForms] = useState(initialForms);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; formId: string | null; formTitle: string }>({ isOpen: false, formId: null, formTitle: "" });
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleUpdate = async (id: string, updates: any) => {
    try {
      const res = await fetch(`/api/forms/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error();
      setForms((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
      toast.success("Updated successfully");
      setEditingFormId(null);
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.formId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/forms/${deleteDialog.formId}/delete`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setForms((prev) => prev.filter((f) => f.id !== deleteDialog.formId));
      toast.success("Form deleted");
      setDeleteDialog({ isOpen: false, formId: null, formTitle: "" });
      setDeleteConfirmText("");
    } catch {
      toast.error("Failed to delete form");
    } finally {
      setIsDeleting(false);
    }
  };

  const copyShareLink = (slug: string) => {
    const link = `${window.location.origin}/f/${slug}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!");
  };

  if (forms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border rounded-2xl bg-surface/20">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
          <Edit2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold mb-2">No forms created</h3>
        <p className="text-muted-foreground max-w-sm mb-6">You don't have any forms yet. Create one to start collecting responses.</p>
        <form action={createFormAction}>
          <Button type="submit">Create Your First Form</Button>
        </form>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {forms.map((form) => (
          <div key={form.id} className="group relative flex flex-col justify-between p-5 border border-border rounded-2xl bg-surface/30 hover:bg-surface/80 hover:border-primary/40 transition-all duration-300 overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                  form.status === 'published' ? 'text-green-500 bg-green-500/10' : 
                  form.status === 'archived' ? 'text-zinc-500 bg-zinc-500/10' : 
                  'text-amber-500 bg-amber-500/10'
                }`}>
                  {form.status}
                </span>
                {form.status === 'published' && (
                  <Link href={`/f/${form.slug}`} target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
              </div>

              <div className="space-y-1 mt-1 min-h-[92px]">
                {editingFormId === form.id ? (
                  <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                    <Input
                      defaultValue={form.title}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdate(form.id, { title: e.currentTarget.value });
                        if (e.key === "Escape") setEditingFormId(null);
                      }}
                      onBlur={(e) => {
                        if (e.target.value !== form.title) handleUpdate(form.id, { title: e.target.value });
                        else setEditingFormId(null);
                      }}
                      autoFocus
                      className="font-bold text-xl h-8 px-2 border-primary/40 focus-visible:ring-primary/20 -ml-2 transition-colors bg-surface shadow-sm"
                      placeholder="Form Title"
                    />
                    <Textarea
                      defaultValue={form.description || ""}
                      onBlur={(e) => {
                        if (e.target.value !== form.description) handleUpdate(form.id, { description: e.target.value });
                      }}
                      className="text-sm text-muted-foreground resize-none border-primary/40 focus-visible:ring-primary/20 -mx-2 px-2 py-1 min-h-[60px] bg-surface shadow-sm"
                      placeholder="Add a description..."
                    />
                  </div>
                ) : (
                  <div className="group/text cursor-pointer relative" onClick={() => setEditingFormId(form.id)}>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xl truncate">{form.title}</h3>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingFormId(form.id); }}
                        className="opacity-0 group-hover/text:opacity-100 text-muted-foreground hover:text-primary transition-all duration-200 p-1 bg-surface rounded-md border border-border"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1 min-h-[40px]">
                      {form.description || <span className="italic opacity-50">No description provided</span>}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="relative z-10 mt-4 pt-4 border-t border-border/50">
              <div className="flex justify-between items-center text-[11px] font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDistanceToNow(new Date(form.updatedAt))} ago
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {form.visits || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart className="w-3.5 h-3.5 text-primary" />
                    {form._count?.responses || 0}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-2 w-full">
                  <Link href={`/forms/${form.id}/builder`} className="flex-1">
                    <Button variant="secondary" className="w-full text-xs h-9 bg-background hover:bg-primary hover:text-primary-foreground group-hover:border-primary/20">
                      <Settings className="w-3.5 h-3.5 mr-1.5" /> Edit
                    </Button>
                  </Link>
                  <Link href={`/forms/${form.id}/responses`} className="flex-1">
                    <Button variant="secondary" className="w-full text-xs h-9 bg-background hover:bg-primary hover:text-primary-foreground group-hover:border-primary/20">
                      <BarChart className="w-3.5 h-3.5 mr-1.5" /> Results
                    </Button>
                  </Link>
                  <Button variant="secondary" className="flex-1 text-xs h-9 bg-background hover:bg-surface" onClick={() => copyShareLink(form.slug || form.id)}>
                    <Share2 className="w-3.5 h-3.5 mr-1.5" /> Share
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setDeleteDialog({ isOpen: true, formId: form.id, formTitle: form.title })}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => !open && setDeleteDialog({ isOpen: false, formId: null, formTitle: "" })}>
        <DialogContent className="border-border bg-surface shadow-2xl shadow-destructive/10">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Delete Form
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your form and all its responses.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm font-medium">
              Please type <span className="font-bold text-foreground select-none bg-background px-1.5 py-0.5 rounded border">{deleteDialog.formTitle}</span> to confirm.
            </p>
            <Input 
              value={deleteConfirmText} 
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder={deleteDialog.formTitle}
              className="border-destructive/30 focus-visible:ring-destructive/20"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ isOpen: false, formId: null, formTitle: "" })}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteConfirmText !== deleteDialog.formTitle || isDeleting}
              className="shadow-lg shadow-destructive/20"
            >
              {isDeleting ? "Deleting..." : "Delete Form"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// [dev-log-sync]: 27e0a8f4d378ee2a