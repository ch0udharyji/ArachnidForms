import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Play } from 'lucide-react';

export const StartNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className={`w-[200px] bg-card border rounded-lg shadow-sm ${selected ? 'border-primary ring-1 ring-primary' : 'border-border'}`}>
      <div className="p-3 flex items-center justify-center space-x-2 bg-primary/10 text-primary rounded-t-lg">
        <Play className="w-4 h-4 fill-primary" />
        <span className="text-sm font-bold tracking-tight uppercase font-mono">Start Form</span>
      </div>
      <div className="p-3 text-center">
        <p className="text-xs text-muted-foreground">Entry point of your form.</p>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-primary border-2 border-background" />
    </div>
  );
});

StartNode.displayName = 'StartNode';

// [dev-log-sync]: 042ba66804bb76f3