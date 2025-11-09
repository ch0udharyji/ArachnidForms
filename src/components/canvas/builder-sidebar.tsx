"use client"

import { useState } from 'react';
import { Type, CheckSquare, List, AlignLeft, CircleDot, Upload, ChevronLeft, ChevronRight, Mail, Hash, Phone, Calendar, Star, ToggleRight, Link as LinkIcon, PenTool, CreditCard, GitBranch, Calculator, MessageSquare, EyeOff, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function BuilderSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const onDragStart = (event: React.DragEvent, nodeType: string, questionType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/questionType', questionType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const blockCategories = [
    {
      name: "Basic",
      blocks: [
        { type: 'text', icon: <Type className="w-4 h-4" />, label: 'Short Text', desc: 'Single line of text.' },
        { type: 'textarea', icon: <AlignLeft className="w-4 h-4" />, label: 'Long Text', desc: 'Multiple lines.' },
        { type: 'statement', icon: <MessageSquare className="w-4 h-4" />, label: 'Statement', desc: 'Read-only text.' },
        { type: 'email', icon: <Mail className="w-4 h-4" />, label: 'Email', desc: 'Validates format.' },
        { type: 'number', icon: <Hash className="w-4 h-4" />, label: 'Number', desc: 'Numerical input.' },
      ]
    },
    {
      name: "Choices",
      blocks: [
        { type: 'select', icon: <List className="w-4 h-4" />, label: 'Dropdown', desc: 'Select from list.' },
        { type: 'radio', icon: <CircleDot className="w-4 h-4" />, label: 'Single Choice', desc: 'Radio buttons.' },
        { type: 'checkbox', icon: <CheckSquare className="w-4 h-4" />, label: 'Multiple Choice', desc: 'Checkboxes.' },
        { type: 'switch', icon: <ToggleRight className="w-4 h-4" />, label: 'Yes / No', desc: 'Boolean toggle.' },
      ]
    },
    {
      name: "Advanced",
      blocks: [
        { type: 'date', icon: <Calendar className="w-4 h-4" />, label: 'Date', desc: 'Date picker.' },
        { type: 'phone', icon: <Phone className="w-4 h-4" />, label: 'Phone', desc: 'Phone format.' },
        { type: 'url', icon: <LinkIcon className="w-4 h-4" />, label: 'Website', desc: 'URL format.' },
        { type: 'rating', icon: <Star className="w-4 h-4" />, label: 'Rating', desc: 'Star rating.' },
        { type: 'file', icon: <Upload className="w-4 h-4" />, label: 'File Upload', desc: 'Accepts files.' },
        { type: 'signature', icon: <PenTool className="w-4 h-4" />, label: 'Signature', desc: 'Draw signature.' },
        { type: 'payment', icon: <CreditCard className="w-4 h-4" />, label: 'Payment', desc: 'Stripe checkout.' },
        { type: 'hidden', icon: <EyeOff className="w-4 h-4" />, label: 'Hidden Field', desc: 'URL params.' },
      ]
    },
    {
      name: "Logic & Routing",
      blocks: [
        { type: 'logic', icon: <GitBranch className="w-4 h-4" />, label: 'Condition', desc: 'If / Else branching.' },
        { type: 'calculation', icon: <Calculator className="w-4 h-4" />, label: 'Calculation', desc: 'Compute values.' },
      ]
    }
  ];

  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = blockCategories.map(cat => ({
    ...cat,
    blocks: cat.blocks.filter(b => 
      b.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.desc.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.blocks.length > 0);

  return (
    <aside className={cn(
      "border-r border-border bg-card flex flex-col h-full transition-all duration-300 relative",
      collapsed ? "w-16" : "w-64"
    )}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute -right-3 top-4 h-6 w-6 rounded-full border border-border bg-background shadow-md z-10"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      <div className={cn("p-4 border-b border-border flex flex-col shrink-0 gap-3", collapsed ? "items-center px-0" : "")}>
        {!collapsed && (
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold tracking-tight uppercase font-mono text-muted-foreground">Blocks</h2>
            <p className="text-xs text-muted-foreground mt-1">Drag and drop onto canvas.</p>
          </div>
        )}
        {!collapsed && (
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search blocks..."
              className="h-8 pl-8 text-xs bg-background/50 focus:bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>
      
      <div className={cn(
        "overflow-y-auto flex-1 p-3",
        "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent",
        collapsed ? "flex flex-col gap-4 items-center px-2 py-4" : "space-y-6 py-4"
      )}>
        {filteredCategories.map((category) => (
          <div key={category.name} className="flex flex-col">
            {!collapsed && (
              <div className="flex items-center mb-3 px-1 space-x-2 opacity-70">
                <div className="h-px bg-border flex-1" />
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">{category.name}</h3>
                <div className="h-px bg-border flex-1" />
              </div>
            )}
            <div className={cn(collapsed ? "flex flex-col gap-4" : "grid grid-cols-1 gap-2")}>
              {category.blocks.map((block) => (
                <div
                  key={block.type}
                  className={cn(
                    "group flex border border-border rounded-lg bg-surface cursor-grab active:cursor-grabbing transition-all duration-200",
                    "hover:border-primary/50 hover:bg-primary/[0.02] hover:shadow-[0_4px_20px_-4px_rgba(255,11,11,0.1)] hover:-translate-y-0.5",
                    collapsed ? "w-10 h-10 items-center justify-center p-0 flex-col" : "items-center p-2.5 space-x-3"
                  )}
                  onDragStart={(event) => onDragStart(event, 'questionNode', block.type)}
                  draggable
                  title={collapsed ? block.label : undefined}
                >
                  <div className={cn(
                    "flex items-center justify-center transition-colors duration-200",
                    collapsed ? "text-muted-foreground group-hover:text-primary" : "w-8 h-8 rounded-md bg-background border border-border text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20"
                  )}>
                    {block.icon}
                  </div>
                  {!collapsed && (
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{block.label}</span>
                      <span className="text-[10px] text-muted-foreground truncate opacity-80">{block.desc}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

// [dev-log-sync]: b5045ad853025e88