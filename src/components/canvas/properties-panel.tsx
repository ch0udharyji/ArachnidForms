import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PropertiesPanel({ 
  selectedNode, 
  updateNodeData, 
  deleteNode 
}: { 
  selectedNode: any, 
  updateNodeData: (id: string, data: any) => void,
  deleteNode: (id: string) => void
}) {
  if (!selectedNode) {
    return (
      <aside className="w-80 border-l border-border bg-card flex flex-col h-full items-center justify-center text-center p-6">
        <p className="text-sm text-muted-foreground font-mono">No block selected</p>
      </aside>
    );
  }

  const isLogic = selectedNode.type === 'logicNode';
  const isSystem = selectedNode.type === 'startNode' || selectedNode.type === 'endNode';

  if (isSystem) {
    return (
      <aside className="w-80 border-l border-border bg-card flex flex-col h-full items-center justify-center text-center p-6">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
          <Trash2 className="w-5 h-5 opacity-50" />
        </div>
        <p className="text-sm font-medium text-foreground">System Block</p>
        <p className="text-xs text-muted-foreground mt-1">This block controls form flow and cannot be edited.</p>
      </aside>
    );
  }

  const data = selectedNode.data || {};
  const type = data.questionType || 'text';
  const options = data.options || [];

  const handleLabelChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(selectedNode.id, { ...data, label: e.target.value });
  };

  const handleRequiredChange = (checked: boolean) => {
    updateNodeData(selectedNode.id, { ...data, required: checked });
  };

  const addOption = () => {
    updateNodeData(selectedNode.id, { ...data, options: [...options, `Option ${options.length + 1}`] });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    updateNodeData(selectedNode.id, { ...data, options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_: any, i: number) => i !== index);
    updateNodeData(selectedNode.id, { ...data, options: newOptions });
  };

  const hasOptions = ['select', 'radio', 'checkbox'].includes(type);

  return (
    <aside className="w-80 border-l border-border bg-card flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-border bg-muted/20">
        <h2 className="text-sm font-semibold tracking-tight uppercase font-mono text-muted-foreground">Properties</h2>
        <p className="text-xs text-muted-foreground mt-1">ID: {selectedNode.id}</p>
      </div>

      <div className="p-4 space-y-6">
        {isLogic ? (
          <>
            <div className="space-y-3">
              <label className="text-xs font-semibold text-foreground">Target Block ID</label>
              <Input 
                value={selectedNode.data.targetNodeId || ''} 
                onChange={(e) => updateNodeData(selectedNode.id, { ...data, targetNodeId: e.target.value })}
                placeholder="e.g. node_a1b2c"
                className="h-8 text-xs font-mono"
              />
              <p className="text-[10px] text-muted-foreground">The exact ID of the block to check against.</p>
            </div>
            
            <div className="space-y-3">
              <label className="text-xs font-semibold text-foreground">Condition Operator</label>
              <Select 
                value={selectedNode.data.operator || 'equals'} 
                onValueChange={(val) => updateNodeData(selectedNode.id, { ...data, operator: val })}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Is equal to</SelectItem>
                  <SelectItem value="not_equals">Is not equal to</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="greater_than">Is greater than</SelectItem>
                  <SelectItem value="less_than">Is less than</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-foreground">Value to Compare</label>
              <Input 
                value={selectedNode.data.compareValue || ''} 
                onChange={(e) => updateNodeData(selectedNode.id, { ...data, compareValue: e.target.value })}
                placeholder="e.g. Yes"
                className="h-8 text-xs font-mono"
              />
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-foreground">Block Label</label>
            <Textarea 
              value={data.label || ''} 
              onChange={handleLabelChange}
              className="resize-none h-20 bg-background text-sm"
              placeholder="Type your question here..."
            />
          </div>
        )}
        {!isLogic && (
          <div className="flex items-center justify-between border border-border p-3 rounded-lg bg-background shadow-sm">
            <div className="space-y-0.5">
              <label className="text-xs font-semibold text-foreground">Required Field</label>
              <p className="text-[10px] text-muted-foreground">User must answer this.</p>
            </div>
            <Switch 
              checked={selectedNode.data.required} 
              onCheckedChange={(checked) => updateNodeData(selectedNode.id, { ...data, required: checked })}
            />
          </div>
        )}

        {hasOptions && !isLogic && (
          <div className="space-y-3 pt-4 border-t border-border">
            <label className="text-xs font-semibold text-foreground">Options</label>
            {(selectedNode.data.options || []).map((opt: string, idx: number) => (
              <div key={idx} className="flex items-center space-x-2">
                <Input 
                  value={opt} 
                  onChange={(e) => updateOption(idx, e.target.value)} 
                  className="h-8 text-xs"
                />
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0" onClick={() => removeOption(idx)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full h-8 text-xs" onClick={addOption}>
              <Plus className="mr-2 h-3 w-3" /> Add Option
            </Button>
          </div>
        )}

        <div className="pt-8 mt-auto">
          <Button 
            variant="destructive" 
            className="w-full h-9 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive/20"
            onClick={() => deleteNode(selectedNode.id)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Block
          </Button>
        </div>
      </div>
    </aside>
  );
}

// [dev-log-sync]: 0945288f6b075298