import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitBranch } from 'lucide-react';

export const LogicNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className={`w-[280px] bg-card border rounded-lg shadow-sm ${selected ? 'border-primary ring-1 ring-primary' : 'border-border'}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-primary border-2 border-background" />
      
      <div className="p-3 border-b border-border flex items-center justify-between bg-primary/10 rounded-t-lg">
        <div className="flex items-center space-x-2 text-primary">
          <GitBranch className="w-4 h-4" />
          <span className="text-xs font-mono uppercase tracking-wider font-bold">Condition</span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="text-xs text-muted-foreground mb-2">If:</div>
        <div className="bg-background border border-border rounded p-2 text-xs font-mono text-center truncate">
          {data.targetNodeId ? `[Block ID: ${data.targetNodeId}]` : "Select a block"}
        </div>
        <div className="flex items-center justify-center py-2 text-xs text-muted-foreground font-bold">
          {data.operator === 'equals' ? 'IS EQUAL TO' : 
           data.operator === 'not_equals' ? 'IS NOT EQUAL TO' : 
           data.operator === 'contains' ? 'CONTAINS' : 
           data.operator === 'greater_than' ? 'IS GREATER THAN' : 
           data.operator === 'less_than' ? 'IS LESS THAN' : '...'}
        </div>
        <div className="bg-background border border-border rounded p-2 text-xs font-mono text-center truncate text-primary font-bold">
          {String(data.compareValue || "...")}
        </div>
      </div>
      
      {/* Two Source Handles for Branching */}
      <div className="relative h-8 border-t border-border bg-muted/20 flex justify-between px-6 items-center rounded-b-lg">
        <span className="text-[10px] font-bold text-emerald-500 uppercase">True</span>
        <span className="text-[10px] font-bold text-destructive uppercase">False</span>
        
        <Handle 
          type="source" 
          position={Position.Bottom} 
          id="true" 
          style={{ left: '25%' }}
          className="w-3 h-3 bg-emerald-500 border-2 border-background" 
        />
        <Handle 
          type="source" 
          position={Position.Bottom} 
          id="false" 
          style={{ left: '75%' }}
          className="w-3 h-3 bg-destructive border-2 border-background" 
        />
      </div>
    </div>
  );
});

// [dev-log-sync]: 64c4624463294c57