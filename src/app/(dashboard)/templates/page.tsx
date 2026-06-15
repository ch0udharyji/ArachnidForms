"use client";

import { useState, useMemo, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Search, Heart, Users, Briefcase, Stethoscope, GraduationCap, ShoppingCart, Home, Scale, Sparkles, FileText, ChevronRight, Loader2 } from "lucide-react";
import { createFormAction } from "@/app/actions/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Category = "Feedback" | "Events" | "HR" | "Marketing" | "IT" | "Healthcare" | "Education" | "E-commerce" | "Real Estate";

interface Template {
  id: string;
  title: string;
  description: string;
  category: Category;
}

const TEMPLATES: Template[] = [
  { id: "1", title: "Customer Satisfaction", description: "Standard CSAT survey to gauge user happiness.", category: "Feedback" },
  { id: "2", title: "Product Review", description: "Collect detailed reviews and ratings for specific products.", category: "Feedback" },
  { id: "3", title: "Beta Tester Feedback", description: "Gather structured insights from your early adopters.", category: "Feedback" },
  { id: "4", title: "Employee Engagement", description: "Measure team morale and workplace satisfaction.", category: "Feedback" },
  { id: "5", title: "Net Promoter Score", description: "Quick NPS survey to measure brand loyalty.", category: "Feedback" },
  { id: "6", title: "Conference Registration", description: "Complex multi-day event ticketing and meal preferences.", category: "Events" },
  { id: "7", title: "Meetup RSVP", description: "Simple yes/no attendance and headcount tracker.", category: "Events" },
  { id: "8", title: "Webinar Sign-up", description: "Capture leads for online seminars and workshops.", category: "Events" },
  { id: "9", title: "Hackathon Application", description: "Collect portfolios, team info, and technical skills.", category: "Events" },
  { id: "10", title: "Charity Gala RSVP", description: "Elegant form for VIP event confirmations.", category: "Events" },
  { id: "11", title: "Job Application", description: "Standard employment application with resume upload.", category: "HR" },
  { id: "12", title: "Time Off Request", description: "Internal HR form for vacation and sick days.", category: "HR" },
  { id: "13", title: "Onboarding Checklist", description: "Streamline new hire data collection and equipment requests.", category: "HR" },
  { id: "14", title: "Exit Interview", description: "Confidential offboarding survey for departing employees.", category: "HR" },
  { id: "15", title: "Manager Evaluation", description: "Anonymous 360-degree feedback for leadership.", category: "HR" },
  { id: "16", title: "Lead Generation", description: "High-converting form for capturing inbound sales prospects.", category: "Marketing" },
  { id: "17", title: "Newsletter Signup", description: "Minimalist email capture for content updates.", category: "Marketing" },
  { id: "18", title: "Contest Entry", description: "Sweepstakes form with terms and conditions agreement.", category: "Marketing" },
  { id: "19", title: "Content Download", description: "Gated asset form (eBook/Whitepaper) to drive leads.", category: "Marketing" },
  { id: "20", title: "Partnership Inquiry", description: "B2B form for affiliate and agency collaborations.", category: "Marketing" },
  { id: "21", title: "Helpdesk Ticket", description: "Standard support request with urgency dropdown.", category: "IT" },
  { id: "22", title: "Software Request", description: "Approval workflow for new SaaS licenses.", category: "IT" },
  { id: "23", title: "Hardware Issue", description: "Report broken equipment or request replacements.", category: "IT" },
  { id: "24", title: "Access Request", description: "Security clearance form for VPN and database access.", category: "IT" },
  { id: "25", title: "Bug Report", description: "Capture reproduction steps and screenshots from QA.", category: "IT" },
  { id: "26", title: "Patient Intake", description: "Comprehensive medical history and insurance details.", category: "Healthcare" },
  { id: "27", title: "Appointment Booking", description: "Schedule clinic visits with preferred doctors.", category: "Healthcare" },
  { id: "28", title: "Symptom Checker", description: "Pre-screening questionnaire before telehealth calls.", category: "Healthcare" },
  { id: "29", title: "Post-Op Followup", description: "Track patient recovery metrics automatically.", category: "Healthcare" },
  { id: "30", title: "Prescription Refill", description: "Secure request for medication renewals.", category: "Healthcare" },
  { id: "31", title: "Course Registration", description: "Enrollment form with prerequisite checks.", category: "Education" },
  { id: "32", title: "Alumni Network", description: "Keep graduate contact information up to date.", category: "Education" },
  { id: "33", title: "Student Survey", description: "End-of-semester course feedback and rating.", category: "Education" },
  { id: "34", title: "Teacher Evaluation", description: "Peer and administrative reviews of faculty.", category: "Education" },
  { id: "35", title: "Scholarship App", description: "Detailed application with essay and transcript uploads.", category: "Education" },
  { id: "36", title: "Order Return", description: "RMA request with photo upload for defective items.", category: "E-commerce" },
  { id: "37", title: "Custom Order", description: "Bespoke product configurator and quote request.", category: "E-commerce" },
  { id: "38", title: "Vendor Application", description: "Marketplace onboarding for new sellers.", category: "E-commerce" },
  { id: "39", title: "Wholesale Inquiry", description: "B2B bulk ordering pricing requests.", category: "E-commerce" },
  { id: "40", title: "Product Pre-order", description: "Capture payment info to reserve upcoming drops.", category: "E-commerce" },
  { id: "41", title: "Property Viewing", description: "Schedule tours with real estate agents.", category: "Real Estate" },
  { id: "42", title: "Tenancy Application", description: "Background check consent and rental history.", category: "Real Estate" },
];

const categoryIcons: Record<Category, React.ElementType> = {
  Feedback: Heart,
  Events: Users,
  HR: Briefcase,
  Marketing: Sparkles,
  IT: FileText,
  Healthcare: Stethoscope,
  Education: GraduationCap,
  "E-commerce": ShoppingCart,
  "Real Estate": Home,
};

export default function TemplatesPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("category");
  const [isPending, startTransition] = useTransition();

  const handleUseTemplate = (title: string, description: string) => {
    if (isPending) return;
    startTransition(() => {
      createFormAction(title, description);
    });
  };

  const filteredTemplates = useMemo(() => {
    let result = TEMPLATES.filter(t => 
      t.title.toLowerCase().includes(search.toLowerCase()) || 
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy === "asc") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "desc") {
      result = [...result].sort((a, b) => b.title.localeCompare(a.title));
    }
    
    return result;
  }, [search, sortBy]);

  const groupedTemplates = useMemo(() => {
    if (sortBy !== "category") return null;
    
    const groups = filteredTemplates.reduce((acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = [];
      }
      acc[template.category].push(template);
      return acc;
    }, {} as Record<string, Template[]>);

    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredTemplates, sortBy]);

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Template Gallery</h1>
          <p className="text-muted-foreground mt-1">Jumpstart your workflow with {TEMPLATES.length}+ pre-built forms.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search templates..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-surface/50 border-border focus-visible:ring-primary/20 h-10 rounded-full"
            />
          </div>
          <Select value={sortBy} onValueChange={(val) => val && setSortBy(val)}>
            <SelectTrigger className="w-full sm:w-[180px] h-10 rounded-full bg-surface/50 border-border">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="category">Category-wise</SelectItem>
              <SelectItem value="asc">Alphabetical (A-Z)</SelectItem>
              <SelectItem value="desc">Alphabetical (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl bg-surface/20">
          <Sparkles className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-lg font-bold">No templates found</h3>
          <p className="text-muted-foreground text-sm max-w-sm mt-1">We couldn't find any templates matching "{search}". Try another search term.</p>
        </div>
      ) : sortBy === "category" && groupedTemplates ? (
        <div className="space-y-10">
          {groupedTemplates.map(([category, templates]) => {
            const CategoryIcon = categoryIcons[category as Category];
            return (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                  <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                    <CategoryIcon className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">{category}</h2>
                  <span className="text-xs font-medium text-muted-foreground bg-surface/50 px-2 py-0.5 rounded-full ml-2">
                    {templates.length} {templates.length === 1 ? 'template' : 'templates'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {templates.map((template) => {
                    const Icon = categoryIcons[template.category as Category];
                    return (
                      <div 
                        key={template.id} 
                        onClick={() => handleUseTemplate(template.title, template.description)}
                        className={`group relative flex flex-col justify-between p-5 border border-border rounded-2xl bg-surface/30 hover:bg-surface/80 hover:border-primary/40 transition-all duration-300 ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} overflow-hidden`}
                      >
                        {/* Decorative background glow */}
                        <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
                        
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-primary/10 text-primary rounded-xl">
                              <Icon className="w-5 h-5" />
                            </div>
                          </div>
                          
                          <h3 className="text-base font-bold mb-1.5 group-hover:text-primary transition-colors pr-2">
                            {template.title}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                            {template.description}
                          </p>
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            {template.category}
                          </span>
                          <div className="flex items-center text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
                            Use Template <ChevronRight className="w-3 h-3 ml-1" />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredTemplates.map((template) => {
            const Icon = categoryIcons[template.category as Category];
            return (
              <div 
                key={template.id} 
                onClick={() => handleUseTemplate(template.title, template.description)}
                className={`group relative flex flex-col justify-between p-5 border border-border rounded-2xl bg-surface/30 hover:bg-surface/80 hover:border-primary/40 transition-all duration-300 ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} overflow-hidden`}
              >
                {/* Decorative background glow */}
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
                
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-primary/10 text-primary rounded-xl">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <h3 className="text-base font-bold mb-1.5 group-hover:text-primary transition-colors pr-2">
                    {template.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {template.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {template.category}
                  </span>
                  <div className="flex items-center text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
                    Use Template <ChevronRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
