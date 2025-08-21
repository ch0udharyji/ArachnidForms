"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layers, FileText, Settings, Key, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  const mainLinks = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/forms", icon: FileText, label: "My Forms" },
    { href: "/templates", icon: Layers, label: "Templates" },
  ];

  const settingsLinks = [
    { href: "/settings", icon: Settings, label: "General" },
    { href: "/settings/api-keys", icon: Key, label: "API Keys" },
  ];

  const NavLink = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => {
    const isActive = pathname === href || pathname.startsWith(`${href}/`);
    
    return (
      <Link 
        href={href} 
        className={cn(
          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
          isActive 
            ? "bg-primary/10 text-primary font-semibold" 
            : "text-muted-foreground hover:bg-surface hover:text-foreground font-medium"
        )}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full shadow-[0_0_8px_var(--primary)]" />
        )}
        <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary" : "group-hover:text-foreground")} />
        <span className="text-sm">{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="h-16 flex items-center px-6 shrink-0 relative">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <img src="/logo.png" alt="ArachnidForms Logo" className="w-5 h-5 object-contain" />
          </div>
          <h2 className="text-lg font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Arachnid
          </h2>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-6 scrollbar-none">
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 mb-2">Platform</p>
          {mainLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>
        
        <nav className="space-y-1 mt-auto">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 mb-2">Configuration</p>
          {settingsLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>
      </div>
    </div>
  );
}

// [dev-log-sync]: 2165085d8fcf76fd