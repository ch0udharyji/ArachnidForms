"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UploadCloud, DownloadCloud, Save, ChevronDown, Lock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { signOut } from "next-auth/react";



export function IntegrationSettings({ initialIntegrations, isTestAccount, envStatus }: { initialIntegrations: any, isTestAccount?: boolean, envStatus?: { hasSmtp: boolean; hasS3: boolean } }) {
  const [integrations, setIntegrations] = useState({
    openai: initialIntegrations?.openai || "",
    stripe: initialIntegrations?.stripe || "",
    resend: initialIntegrations?.resend || "",
    webhook: initialIntegrations?.webhook || "",
    discord_webhook: initialIntegrations?.discord_webhook || "",
    smtp_user: initialIntegrations?.smtp_user || "",
    smtp_pass: initialIntegrations?.smtp_pass || "",
    smtp_host: initialIntegrations?.smtp_host || "",
    smtp_port: initialIntegrations?.smtp_port || "587",
    smtp_from: initialIntegrations?.smtp_from || "",
    s3_access: initialIntegrations?.s3_access || "",
    s3_secret: initialIntegrations?.s3_secret || "",
    s3_region: initialIntegrations?.s3_region || "",
    s3_bucket: initialIntegrations?.s3_bucket || ""
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

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

  const handleSave = async () => {
    if (isTestAccount) {
      toast.error("Test accounts cannot save API integrations. Please sign up.");
      return;
    }
    
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
      if (!integrations[key] || String(integrations[key]).trim() === "") {
        toast.error(`Please fill in all required fields. Missing: ${key.replace("_", " ").toUpperCase()}`);
        return;
      }
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ integrations })
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Integrations updated successfully!");
    } catch (err) {
      toast.error("Failed to update integrations.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full relative overflow-hidden">
      {isTestAccount && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Login Required</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            You must create a free account to configure your own APIs, Email Servers, and Storage Buckets. Test accounts are restricted.
          </p>
          <Button onClick={() => setShowWarning(true)}>Create Account</Button>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">API Configurations</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your custom API keys, webhooks, and environment variables.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative overflow-hidden">
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImport} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isTestAccount}
            />
            <Button variant="outline" size="sm" className="pointer-events-none" disabled={isTestAccount}>
              <UploadCloud className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={isTestAccount}>
            <DownloadCloud className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-6 mb-6">
        
        {/* COLUMN 1 */}
        <div className="space-y-4 lg:space-y-6">
          <div className="p-3 border border-border bg-surface/30 rounded-lg space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              Core Services
              <span className="text-[10px] font-normal normal-case opacity-70">Optional fallback to .env</span>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold">OpenAI API Key</Label>
                <Input name="openai" type="password" placeholder="sk-..." value={integrations.openai} onChange={handleChange} className="h-7 text-xs font-mono bg-background" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold">Stripe Secret Key</Label>
                <Input name="stripe" type="password" placeholder="sk_live_..." value={integrations.stripe} onChange={handleChange} className="h-7 text-xs font-mono bg-background" />
              </div>
            </div>
          </div>

          <div className="p-3 border border-border bg-surface/30 rounded-lg space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Webhooks & Events</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px]">Global Webhook URL</Label>
                <Input name="webhook" type="url" placeholder="https://api..." value={integrations.webhook} onChange={handleChange} className="h-7 text-xs font-mono bg-background" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">Discord Webhook</Label>
                <Input name="discord_webhook" type="url" placeholder="https://discord.com/..." value={integrations.discord_webhook} onChange={handleChange} className="h-7 text-xs font-mono bg-background" />
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2 */}
        <div className="space-y-4 lg:space-y-6">
          {/* Email */}
          <div className="p-3 border border-border bg-surface/30 rounded-lg space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex justify-between">
              Email & SMTP
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
              File Storage (S3)
              {!envStatus?.hasS3 && <span className="text-[10px] font-normal normal-case text-destructive">Required</span>}
            </h4>
            <div className="grid grid-cols-4 gap-2">
              <div className="space-y-1 col-span-2"><Label className="text-[10px]">Access Key ID</Label><Input name="s3_access" placeholder="AKIA..." value={integrations.s3_access} onChange={handleChange} className="h-7 text-xs font-mono bg-background" /></div>
              <div className="space-y-1 col-span-2"><Label className="text-[10px]">Secret Key</Label><Input name="s3_secret" type="password" placeholder="••••••••" value={integrations.s3_secret} onChange={handleChange} className="h-7 text-xs font-mono bg-background" /></div>
              <div className="space-y-1 col-span-2"><Label className="text-[10px]">Region</Label><Input name="s3_region" placeholder="us-east-1" value={integrations.s3_region} onChange={handleChange} className="h-7 text-xs bg-background" /></div>
              <div className="space-y-1 col-span-2"><Label className="text-[10px]">Bucket Name</Label><Input name="s3_bucket" placeholder="arachnid-uploads" value={integrations.s3_bucket} onChange={handleChange} className="h-7 text-xs bg-background" /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border flex justify-end">
        <Button onClick={handleSave} disabled={isSaving || isTestAccount}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Configuration"}
        </Button>
      </div>

      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertTriangle className="w-5 h-5" />
              <DialogTitle>Session Expiration Warning</DialogTitle>
            </div>
            <DialogDescription>
              You are currently logged in with a temporary test account. If you leave to create a real account, <strong>you will be logged out and this test session will immediately expire.</strong> All forms created during this test session may be lost.
              <br /><br />
              Do you wish to continue and create a new account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWarning(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => signOut({ callbackUrl: "/register" })}>Continue & Register</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// [dev-log-sync]: ba3712afb32b8289