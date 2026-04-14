import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Type, CheckSquare, List, AlignLeft, CircleDot, Upload, Mail, Hash, Phone, Calendar, Star, ToggleRight, Link as LinkIcon, PenTool, CreditCard, GitBranch, Calculator, MessageSquare, EyeOff } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  text: <Type className="w-4 h-4" />,
  textarea: <AlignLeft className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  number: <Hash className="w-4 h-4" />,
  phone: <Phone className="w-4 h-4" />,
  url: <LinkIcon className="w-4 h-4" />,
  select: <List className="w-4 h-4" />,
  checkbox: <CheckSquare className="w-4 h-4" />,
  radio: <CircleDot className="w-4 h-4" />,
  switch: <ToggleRight className="w-4 h-4" />,
  date: <Calendar className="w-4 h-4" />,
  rating: <Star className="w-4 h-4" />,
  file: <Upload className="w-4 h-4" />,
  signature: <PenTool className="w-4 h-4" />,
  payment: <CreditCard className="w-4 h-4" />,
  calculation: <Calculator className="w-4 h-4" />,
  statement: <MessageSquare className="w-4 h-4" />,
  hidden: <EyeOff className="w-4 h-4" />,
};

export const QuestionNode = memo(({ data, selected }: NodeProps) => {
  const type = (data.questionType as string) || 'text';
  const label = (data.label as string) || 'Untitled Question';
  const required = data.required as boolean;

  return (
    <div className={`w-[280px] bg-card border rounded-lg shadow-sm ${selected ? 'border-primary ring-1 ring-primary' : 'border-border'}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-primary border-2 border-background" />
      
      <div className="p-3 border-b border-border flex items-center justify-between bg-muted/30 rounded-t-lg">
        <div className="flex items-center space-x-2 text-muted-foreground">
          {iconMap[type] || iconMap.text}
          <span className="text-xs font-mono uppercase tracking-wider">{type}</span>
        </div>
        {required && <span className="text-[10px] text-destructive font-bold uppercase">Required</span>}
      </div>
      
      <div className="p-4">
        <h3 className="text-sm font-medium text-foreground line-clamp-2">{label}</h3>
        
        {/* Visual placeholder based on type */}
        <div className="mt-3 opacity-50 pointer-events-none">
          {['text', 'email', 'number', 'phone', 'url'].includes(type) && (
            <div className="h-8 w-full border border-border rounded-md bg-background flex items-center px-3">
               <span className="text-xs text-muted-foreground opacity-50">Input field</span>
            </div>
          )}
          {type === 'textarea' && <div className="h-16 w-full border border-border rounded-md bg-background flex p-3"><span className="text-xs text-muted-foreground opacity-50">Long answer text...</span></div>}
          {type === 'select' && (
            <div className="h-8 w-full border border-border rounded-md bg-background flex items-center px-3 justify-between">
              <span className="text-xs text-muted-foreground">Select option...</span>
              <div className="w-2 h-2 border-l border-b border-muted-foreground rotate-[-45deg] translate-y-[-2px]" />
            </div>
          )}
          {(type === 'radio' || type === 'checkbox') && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 border border-border ${type === 'radio' ? 'rounded-full' : 'rounded-sm'}`} />
                <div className="h-2 w-16 bg-border rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 border border-border ${type === 'radio' ? 'rounded-full' : 'rounded-sm'}`} />
                <div className="h-2 w-12 bg-border rounded" />
              </div>
            </div>
          )}
          {type === 'switch' && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-4 bg-border rounded-full flex items-center p-0.5">
                 <div className="w-3 h-3 bg-muted-foreground rounded-full" />
              </div>
            </div>
          )}
          {type === 'date' && (
            <div className="h-8 w-full border border-border rounded-md bg-background flex items-center px-3 justify-between">
              <span className="text-xs text-muted-foreground opacity-50">MM/DD/YYYY</span>
              <Calendar className="w-3 h-3 text-muted-foreground" />
            </div>
          )}
          {type === 'rating' && (
            <div className="flex items-center space-x-1">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-border" />)}
            </div>
          )}
          {type === 'signature' && (
            <div className="h-16 w-full border border-border rounded-md bg-background flex items-center justify-center">
              <PenTool className="w-4 h-4 text-muted-foreground opacity-50" />
            </div>
          )}
          {type === 'payment' && (
            <div className="h-10 w-full border border-border rounded-md bg-background flex items-center px-3 justify-between">
              <span className="text-xs text-muted-foreground opacity-50">Card details</span>
              <CreditCard className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
          {type === 'calculation' && (
            <div className="h-10 w-full border border-border rounded-md bg-background flex items-center px-3 justify-center">
              <span className="text-xs font-mono text-muted-foreground opacity-50">f(x) = ...</span>
            </div>
          )}
          {type === 'statement' && (
            <div className="h-16 w-full rounded-md bg-muted/20 flex p-3">
              <span className="text-[10px] text-muted-foreground opacity-70">Rich text display block. No input required.</span>
            </div>
          )}
          {type === 'hidden' && (
            <div className="h-8 w-full border border-dashed border-border rounded-md bg-background flex items-center justify-center">
              <EyeOff className="w-3 h-3 text-muted-foreground opacity-50 mr-2" />
              <span className="text-[10px] font-mono text-muted-foreground opacity-50">Hidden Field</span>
            </div>
          )}
          {type === 'file' && (
            <div className="h-16 w-full border border-dashed border-border rounded-md bg-background flex flex-col items-center justify-center">
              <Upload className="w-4 h-4 text-muted-foreground mb-1" />
              <span className="text-[10px] text-muted-foreground">Upload File</span>
            </div>
          )}
        </div>
      </div>

      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-primary border-2 border-background" />
    </div>
  );
});

QuestionNode.displayName = 'QuestionNode';

// [dev-log-sync]: 2e95f2e2982f4c6d