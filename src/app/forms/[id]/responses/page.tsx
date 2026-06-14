import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Database, LayoutDashboard, Clock } from "lucide-react";
import Link from "next/link";
import { ResponsesCharts } from "@/components/analytics/responses-charts";
import { CsvExportButton } from "@/components/analytics/csv-export-button";
import { ResponsesTable } from "@/components/analytics/responses-table";

export default async function ResponsesPage(props: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const params = await props.params;

  const form = await db.form.findUnique({
    where: { id: params.id, ownerId: session.user.id },
    include: {
      responses: {
        orderBy: { submittedAt: "desc" },
        include: {
          respondent: {
            select: {
              name: true,
              email: true,
              image: true,
            }
          }
        }
      }
    }
  });

  if (!form) notFound();

  // Extract all unique keys from all responses to form columns
  const allKeys = new Set<string>();
  form.responses.forEach(r => {
    if (r.answers && typeof r.answers === 'object') {
      Object.keys(r.answers).forEach(k => allKeys.add(k));
    }
  });
  const columns = Array.from(allKeys);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface/50 backdrop-blur supports-[backdrop-filter]:bg-surface/30 sticky top-0 z-10">
        <div className="flex h-16 items-center px-6 gap-4 max-w-7xl mx-auto w-full">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-lg hidden sm:block">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight">{form.title}</h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {form.responses.length} total responses
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link href={`/forms/${form.id}/builder`}>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <LayoutDashboard className="w-4 h-4 mr-2" /> Builder
                </Button>
              </Link>
              {form.responses.length > 0 && (
                <CsvExportButton columns={columns} responses={form.responses} filename={form.title} />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto w-full">
        {form.responses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-border rounded-2xl bg-surface/20 mt-8">
            <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-4 relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <FileText className="w-8 h-8 relative z-10" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No Responses Yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6">Share your form link to start collecting data. Responses will magically appear here!</p>
            <Link href={`/forms/${form.id}/builder`}>
              <Button variant="default">Back to Builder</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <ResponsesCharts form={form} />
            <ResponsesTable responses={form.responses} columns={columns} />
          </div>
        )}
      </main>
    </div>
  );
}
