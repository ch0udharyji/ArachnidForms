import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { CheckCircle2 } from 'lucide-react';

export const EndNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className={`w-[200px] bg-card border rounded-lg shadow-sm ${selected ? 'border-primary ring-1 ring-primary' : 'border-border'}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-primary border-2 border-background" />
      <div className="p-3 flex items-center justify-center space-x-2 bg-green-500/10 text-green-500 rounded-t-lg">
        <CheckCircle2 className="w-4 h-4" />
        <span className="text-sm font-bold tracking-tight uppercase font-mono">Submit Form</span>
      </div>
      <div className="p-3 text-center">
        <p className="text-xs text-muted-foreground">User finishes here.</p>
      </div>
    </div>
  );
});

EndNode.displayName = 'EndNode';

// [dev-log-sync]: 323e178a5ffb5ce7