import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, FileText, MessageSquare, Clock, Activity, ExternalLink, Settings, BarChart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { createFormAction } from "@/app/actions/form";

export default async function DashboardPage() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const forms = await db.form.findMany({
    where: { ownerId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: { responses: true }
      }
    }
  });

  const totalForms = forms.length;
  const totalResponses = forms.reduce((acc, form) => acc + form._count.responses, 0);
  const activeForms = forms.filter(f => f.status === 'published').length;

  return (
    <div className="w-full h-full flex flex-col space-y-8 pb-12 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back. Here's an overview of your forms.</p>
        </div>
        {forms.length > 0 && (
          <form action={createFormAction}>
            <Button type="submit" className="font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
              <Plus className="w-4 h-4 mr-2" /> Create New Form
            </Button>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="p-6 border border-border rounded-2xl bg-surface/30 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total Forms</h3>
              <p className="text-3xl font-black mt-1">{totalForms}</p>
            </div>
          </div>
        </div>

        <div className="p-6 border border-border rounded-2xl bg-surface/30 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total Views</h3>
              <p className="text-3xl font-black mt-1">{forms.reduce((acc, form) => acc + (form.visits || 0), 0)}</p>
            </div>
          </div>
        </div>

        <div className="p-6 border border-border rounded-2xl bg-surface/30 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-colors" />
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total Responses</h3>
              <p className="text-3xl font-black mt-1">{totalResponses}</p>
            </div>
          </div>
        </div>

        <div className="p-6 border border-border rounded-2xl bg-surface/30 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Active Forms</h3>
              <p className="text-3xl font-black mt-1">{activeForms}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
          Your Forms
          <span className="text-xs font-bold bg-surface px-2 py-0.5 rounded-full text-muted-foreground border border-border">
            {forms.length}
          </span>
        </h2>
        
        {forms.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-2xl bg-surface/20">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">No forms yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6">Create your first form to start collecting responses and integrating your APIs.</p>
            <form action={createFormAction}>
              <Button type="submit">Create Your First Form</Button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {forms.map((form) => (
              <div key={form.id} className="group flex flex-col justify-between p-5 border border-border rounded-2xl bg-surface/30 hover:bg-surface/80 hover:border-primary/40 transition-all duration-300">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                        form.status === 'published' ? 'text-green-500 bg-green-500/10' : 
                        form.status === 'archived' ? 'text-zinc-500 bg-zinc-500/10' : 
                        'text-amber-500 bg-amber-500/10'
                      }`}>
                        {form.status}
                      </span>
                    </div>
                    {form.status === 'published' && (
                      <Link href={`/f/${form.slug}`} target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-1 truncate group-hover:text-primary transition-colors">
                    {form.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                    {form.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex flex-col gap-4">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Updated {formatDistanceToNow(new Date(form.updatedAt), { addSuffix: true })}
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold text-foreground">
                      <BarChart className="w-3.5 h-3.5 text-primary" />
                      {form._count.responses} Responses
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Link href={`/forms/${form.id}/builder`} className="w-full">
                      <Button variant="secondary" className="w-full text-xs h-8 bg-background hover:bg-primary hover:text-primary-foreground group-hover:border-primary/20">
                        <Settings className="w-3.5 h-3.5 mr-1.5" /> Edit Builder
                      </Button>
                    </Link>
                    <Link href={`/forms/${form.id}/responses`} className="w-full">
                      <Button variant="secondary" className="w-full text-xs h-8 bg-background hover:bg-surface">
                        <BarChart className="w-3.5 h-3.5 mr-1.5" /> Results
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// [dev-log-sync]: 593321b6f6b281a4