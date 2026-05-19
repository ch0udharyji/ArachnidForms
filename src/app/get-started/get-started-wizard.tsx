"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Code, CheckCircle, Database, LayoutDashboard, Key, UploadCloud, DownloadCloud, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GetStartedWizard({ envStatus }: { envStatus?: { hasSmtp: boolean; hasS3: boolean } }) {
  const [step, setStep] = useState(1);
  const router = useRouter();
  
  // API Configurations
  const [integrations, setIntegrations] = useState({
    openai: "",
    stripe: "",
    resend: "",
    webhook: "",
    discord_webhook: "",
    smtp_user: "",
    smtp_pass: "",
    smtp_host: "",
    smtp_port: "587",
    smtp_from: "",
    s3_access: "",
    s3_secret: "",
    s3_region: "",
    s3_bucket: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIntegrations(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(integrations, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "arachnid-api-keys.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("API keys exported successfully");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = e => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setIntegrations(prev => ({ ...prev, ...imported }));
          toast.success("API keys imported successfully!");
        } catch (err) {
          toast.error("Invalid JSON file");
        }
      };
    }
  };

  const handleSubmit = async () => {
    // Validate fields that are not covered by global .env
    const requiredKeys: string[] = [];
    if (!envStatus?.hasSmtp) {
      requiredKeys.push("smtp_host", "smtp_port", "smtp_user", "smtp_pass", "smtp_from");
    }
    if (!envStatus?.hasS3) {
      requiredKeys.push("s3_access", "s3_secret", "s3_region", "s3_bucket");
    }

    for (const key of requiredKeys) {
      // @ts-ignore
      if (!integrations[key] || integrations[key].trim() === "") {
        toast.error(`Please fill in all required fields. Missing: ${key.replace("_", " ").toUpperCase()}`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ integrations })
      });
      if (!res.ok) throw new Error("Failed to save");
      
      toast.success("Onboarding completed!");
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error("An error occurred during save.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <div className="w-full h-screen relative z-10 flex flex-col bg-background overflow-hidden">
        
        {/* Header / Progress bar */}
        <div className="flex border-b border-border h-16 shrink-0">
          <div className={cn("flex-1 px-4 flex flex-col justify-center text-center border-r border-border transition-colors duration-300", step === 1 ? "bg-primary/5 border-b-2 border-b-primary text-primary" : "text-muted-foreground")}>
            <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Step 1</span>
            <p className="text-xs font-medium mt-0.5">Welcome & Guide</p>
          </div>
          <div className={cn("flex-1 px-4 flex flex-col justify-center text-center transition-colors duration-300", step === 2 ? "bg-primary/5 border-b-2 border-b-primary text-primary" : "text-muted-foreground")}>
            <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Step 2</span>
            <p className="text-xs font-medium mt-0.5">API Integrations</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          
          {/* STEP 1 */}
          <div className={cn("absolute inset-0 p-6 md:p-10 flex flex-col items-center justify-center transition-all duration-500 ease-in-out", step === 1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none")}>
            <div className="text-center mb-8 shrink-0 max-w-3xl">
              <div className="flex justify-center mb-4">
                <img src="/logo.png" alt="ArachnidForms Logo" className="w-16 h-16 object-contain" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">Welcome to ArachnidForms.</h1>
              <p className="text-lg text-muted-foreground">
                The ultimate visual builder for creating intelligent, highly-converting forms and surveys. Before you dive in, let's show you around.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto w-full">
              <div className="p-4 border border-border rounded-xl bg-surface/50 flex flex-col items-start gap-2">
                <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm">Drag & Drop Builder</h3>
                <p className="text-xs text-muted-foreground">Construct flows visually. Use logic nodes to create branching paths and dynamic question routing.</p>
              </div>
              
              <div className="p-4 border border-border rounded-xl bg-surface/50 flex flex-col items-start gap-2">
                <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                  <Key className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm">Bring Your Own APIs</h3>
                <p className="text-xs text-muted-foreground">We don't limit your usage. Plug in your own Stripe or OpenAI keys to unlock payments and AI assistance instantly.</p>
              </div>

              <div className="p-4 border border-border rounded-xl bg-surface/50 flex flex-col items-start gap-2">
                <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                  <Database className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm">Self-Destructing Forms</h3>
                <p className="text-xs text-muted-foreground">Forms generated from your templates can be configured to self-destruct after 15 minutes, ensuring strict data hygiene.</p>
              </div>

              <div className="p-4 border border-border rounded-xl bg-surface/50 flex flex-col items-start gap-2">
                <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                  <Code className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm">Complete Ownership</h3>
                <p className="text-xs text-muted-foreground">Responses are tied directly to your database and routed to your webhooks. No vendor lock-in.</p>
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div className={cn("absolute inset-0 p-6 md:p-10 flex flex-col transition-all duration-500 ease-in-out", step === 2 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none")}>
            <div className="max-w-5xl mx-auto w-full">
              <div className="text-left mb-4 shrink-0 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight mb-1">System Configuration</h2>
                  <p className="text-sm text-muted-foreground max-w-2xl">
                    Connect your infrastructure. These credentials are required for production environments to handle emails, file uploads, and payments securely.
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <div className="relative overflow-hidden">
                    <input type="file" accept=".json" onChange={handleImport} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <Button variant="outline" size="sm" className="pointer-events-none bg-surface/50 h-8 text-xs">
                      <UploadCloud className="w-3 h-3 mr-2" /> Import
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleExport} className="bg-surface/50 h-8 text-xs">
                    <DownloadCloud className="w-3 h-3 mr-2" /> Export
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col justify-center">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                
                {/* COLUMN 1 */}
                <div className="space-y-4">
                  <div className="p-3 border border-border bg-surface/30 rounded-lg space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                      Core Services
                      <span className="text-[10px] font-normal normal-case opacity-70">Optional fallback to .env</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold">Global Webhook URL</Label>
                        <Input name="webhook" type="url" placeholder="https://api.yourdomain.com" value={integrations.webhook} onChange={handleChange} className="h-8 text-xs font-mono bg-background" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold">OpenAI API Key</Label>
                        <Input name="openai" type="password" placeholder="sk-..." value={integrations.openai} onChange={handleChange} className="h-8 text-xs font-mono bg-background" />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border border-border bg-surface/30 rounded-lg space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payments & Chat</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Stripe Secret Key</Label>
                        <Input name="stripe" type="password" placeholder="sk_live_..." value={integrations.stripe} onChange={handleChange} className="h-8 text-xs font-mono bg-background" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Discord Webhook</Label>
                        <Input name="discord_webhook" type="url" placeholder="https://discord.com/..." value={integrations.discord_webhook} onChange={handleChange} className="h-8 text-xs font-mono bg-background" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 2 */}
                <div className="space-y-4">
                  {/* Email */}
                  <div className="p-3 border border-border bg-surface/30 rounded-lg space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex justify-between">
                      Email Services
                      {!envStatus?.hasSmtp && <span className="text-[10px] font-normal normal-case text-destructive">Required</span>}
                    </h4>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="space-y-1 col-span-2"><Label className="text-[10px]">Resend Key</Label><Input name="resend" type="password" placeholder="re_..." value={integrations.resend} onChange={handleChange} className="h-7 text-xs font-mono bg-background" /></div>
                      <div className="space-y-1 col-span-2"><Label className="text-[10px]">From Email</Label><Input name="smtp_from" placeholder="noreply@..." value={integrations.smtp_from} onChange={handleChange} className="h-7 text-xs bg-background" /></div>
                      <div className="space-y-1 col-span-2"><Label className="text-[10px]">SMTP Host</Label><Input name="smtp_host" placeholder="smtp.gmail.com" value={integrations.smtp_host} onChange={handleChange} className="h-7 text-xs bg-background" /></div>
                      <div className="space-y-1"><Label className="text-[10px]">Port</Label><Input name="smtp_port" placeholder="587" value={integrations.smtp_port} onChange={handleChange} className="h-7 text-xs bg-background" /></div>
                      <div className="space-y-1"><Label className="text-[10px]">User</Label><Input name="smtp_user" placeholder="user" value={integrations.smtp_user} onChange={handleChange} className="h-7 text-xs bg-background" /></div>
                      <div className="space-y-1 col-span-4"><Label className="text-[10px]">SMTP Password</Label><Input name="smtp_pass" type="password" placeholder="••••••••" value={integrations.smtp_pass} onChange={handleChange} className="h-7 text-xs bg-background" /></div>
                    </div>
                  </div>

                  {/* Storage */}
                  <div className="p-3 border border-border bg-surface/30 rounded-lg space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex justify-between">
                      File Storage (Amazon S3)
                      {!envStatus?.hasS3 && <span className="text-[10px] font-normal normal-case text-destructive">Required</span>}
                    </h4>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="space-y-1 col-span-2"><Label className="text-[10px]">Access Key ID</Label><Input name="s3_access" placeholder="AKIA..." value={integrations.s3_access} onChange={handleChange} className="h-7 text-xs font-mono bg-background" /></div>
                      <div className="space-y-1 col-span-2"><Label className="text-[10px]">Secret Key</Label><Input name="s3_secret" type="password" placeholder="••••••••" value={integrations.s3_secret} onChange={handleChange} className="h-7 text-xs font-mono bg-background" /></div>
                      <div className="space-y-1 col-span-2"><Label className="text-[10px]">Region</Label><Input name="s3_region" placeholder="us-east-1" value={integrations.s3_region} onChange={handleChange} className="h-7 text-xs bg-background" /></div>
                      <div className="space-y-1 col-span-2"><Label className="text-[10px]">Bucket</Label><Input name="s3_bucket" placeholder="arachnid-uploads" value={integrations.s3_bucket} onChange={handleChange} className="h-7 text-xs bg-background" /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="h-20 shrink-0 flex justify-between items-center border-t border-border px-8 md:px-10 bg-surface/50 z-20">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            disabled={step === 1 || isSubmitting}
            className="w-24"
          >
            Back
          </Button>
          
          {step === 1 ? (
            <Button onClick={handleNext} className="w-40">
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold w-48"
            >
              {isSubmitting ? "Saving..." : "Complete Setup"}
              {!isSubmitting && <CheckCircle className="w-4 h-4 ml-2" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// [dev-log-sync]: ebbf4c9fe9932b53