"use client"

import { useCallback, useState, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  ReactFlowProvider,
  useReactFlow,
  BackgroundVariant,
  Node,
  NodeTypes
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { QuestionNode } from './nodes/question-node';
import { StartNode } from './nodes/start-node';
import { EndNode } from './nodes/end-node';
import { LogicNode } from './nodes/logic-node';
import { BuilderSidebar } from './builder-sidebar';
import { PropertiesPanel } from './properties-panel';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Save, ArrowLeft, Share2, Copy, Globe, QrCode, Hash } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const nodeTypes: NodeTypes = {
  questionNode: QuestionNode,
  startNode: StartNode,
  endNode: EndNode,
  logicNode: LogicNode,
};

const initialNodes: Node[] = [
  { id: 'start', type: 'startNode', position: { x: 300, y: 50 }, data: { label: 'Start' }, deletable: false },
  { id: 'end', type: 'endNode', position: { x: 300, y: 500 }, data: { label: 'Submit' }, deletable: false },
];

const getId = () => `node_${Math.random().toString(36).substring(2, 9)}`;

function CanvasArea({ formId, formSlug, initialData, integrations }: { formId?: string, formSlug?: string, initialData?: any, integrations?: any }) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData && Array.isArray(initialData.nodes) && initialData.nodes.length > 0 ? initialData.nodes : initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData && Array.isArray(initialData.edges) && initialData.edges.length > 0 ? initialData.edges : []);
  const { screenToFlowPosition } = useReactFlow();
  
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const [isDirty, setIsDirty] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const [shareConfig, setShareConfig] = useState({
    expiresIn: "never",
    maxResponses: ""
  });
  const [isPublished, setIsPublished] = useState(false);

  const handleExitClick = (e: React.MouseEvent) => {
    if (isDirty) {
      e.preventDefault();
      setShowExitDialog(true);
    }
  };

  const validateGraph = () => {
    const connectedNodeIds = new Set<string>();
    edges.forEach(e => {
      connectedNodeIds.add(e.source);
      connectedNodeIds.add(e.target);
    });

    if (!connectedNodeIds.has('start')) {
      toast.error("The Start node must be connected to your first question.");
      return false;
    }

    if (!connectedNodeIds.has('end')) {
      toast.error("Your last question must be connected to the Submit node.");
      return false;
    }

    const orphans = nodes.filter(n => n.id !== 'start' && n.id !== 'end' && !connectedNodeIds.has(n.id));
    if (orphans.length > 0) {
      toast.error(`You have ${orphans.length} unconnected block(s). Please connect or delete them.`);
      return false;
    }

    return true;
  };

  const router = useRouter();

  const handleSave = async (expiresAt?: Date | null, status?: string, isShare: boolean = false, maxResponses?: string | null) => {
    if (!validateGraph()) return false;
    if (!formId) return false;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/forms/${formId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodes,
          edges,
          expiresAt: expiresAt === null ? null : expiresAt?.toISOString(),
          status: status || "draft",
          maxResponses: maxResponses || null
        })
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success(isShare ? "Form published successfully!" : "Form structure saved!");
      setIsDirty(false);
      
      if (!isShare) {
        router.push('/forms');
      }
      
      return true;
    } catch (err) {
      toast.error("Error saving form. Please try again.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    let expiresAt: Date | null = null;
    if (shareConfig.expiresIn === "15m") expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    if (shareConfig.expiresIn === "1h") expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    if (shareConfig.expiresIn === "24h") expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const success = await handleSave(expiresAt, "published", true, shareConfig.maxResponses);
    if (success) {
      setShareLink(`${window.location.origin}/f/${formSlug || formId}`);
      setIsPublished(true);
    }
  };

  const openPublishModal = () => {
    setIsPublished(false);
    setShowShareDialog(true);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied to clipboard!");
  };

  const isValidConnection = useCallback((connection: Connection) => {
    if (connection.target === 'start') {
      toast.error("Cannot connect into the Start node.");
      return false;
    }
    if (connection.source === 'end') {
      toast.error("Cannot connect out of the Submit node.");
      return false;
    }
    if (connection.source === connection.target) {
      toast.error("A block cannot connect to itself.");
      return false;
    }

    // Source connection rules (allow branching from logic node)
    const sourceNode = nodes.find(n => n.id === connection.source);
    if (sourceNode?.type === 'logicNode') {
      const sourceHandleTaken = edges.some(
        (e) => e.source === connection.source && e.sourceHandle === connection.sourceHandle
      );
      if (sourceHandleTaken) {
        toast.error(`The "${connection.sourceHandle}" branch is already connected.`);
        return false;
      }
    } else {
      const sourceHasOutgoing = edges.some((e) => e.source === connection.source);
      if (sourceHasOutgoing) {
        toast.error("Standard blocks can only have ONE outgoing connection. If you want to branch, connect to a 'Condition' block first.");
        return false;
      }
    }

    // Cycle detection
    const hasCycle = (targetId: string, sourceId: string) => {
      const queue = [targetId];
      while (queue.length > 0) {
        const curr = queue.shift()!;
        if (curr === sourceId) return true;
        const outEdges = edges.filter(e => e.source === curr);
        for (const outEdge of outEdges) {
          queue.push(outEdge.target);
        }
      }
      return false;
    };

    if (hasCycle(connection.target, connection.source)) {
      toast.error("This connection creates an infinite loop!");
      return false;
    }

    return true;
  }, [edges, nodes]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      if (isValidConnection(params as Connection)) {
        setEdges((eds) => addEdge(params, eds));
        setIsDirty(true);
      }
    },
    [setEdges, isValidConnection],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const questionType = event.dataTransfer.getData('application/questionType');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      if (questionType === 'payment' && !integrations?.hasStripe) {
        toast.error("You must configure your Stripe API keys in Settings before using the Payment module.");
        return;
      }

      if (questionType === 'file' && !integrations?.hasS3) {
        toast.error("You must configure your Amazon S3 bucket in Settings before using the File Upload module.");
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      const newNodeId = getId();
      const isLogic = type === 'logicNode' || questionType === 'logic';
      const actualNodeType = isLogic ? 'logicNode' : 'questionNode';
      
      const newNode: Node = {
        id: newNodeId,
        type: actualNodeType,
        position,
        data: isLogic 
          ? {
              operator: 'equals',
              compareValue: '',
              targetNodeId: ''
            }
          : {
              questionType,
              label: 'New Question',
              required: false,
              options: ['Option 1']
            },
      };

      setNodes((nds) => nds.concat(newNode));
      setSelectedNodeId(newNodeId);
      setIsDirty(true);
    },
    [screenToFlowPosition, setNodes, integrations],
  );
  
  const onSelectionChange = useCallback(({ nodes }: any) => {
    if (nodes.length > 0) {
      setSelectedNodeId(nodes[0].id);
    } else {
      setSelectedNodeId(null);
    }
  }, []);

  const updateNodeData = useCallback((id: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = data;
        }
        return node;
      })
    );
    setIsDirty(true);
  }, [setNodes]);

  const deleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    setSelectedNodeId(null);
    setIsDirty(true);
  }, [setNodes, setEdges]);



  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="flex flex-col w-full h-full bg-background">
      {/* Top Builder Header */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-card z-10 shrink-0">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" onClick={handleExitClick}>
            <Button variant="outline" size="sm" className="h-8 text-xs font-medium">
              <ArrowLeft className="h-3.5 w-3.5 mr-2" />
              Exit Builder
            </Button>
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex flex-col">
            <h1 className="text-sm font-bold tracking-tight">Form Builder</h1>
            {formId && <span className="text-[10px] text-muted-foreground font-mono uppercase">ID: {formId}</span>}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={openPublishModal} disabled={isSaving} variant="secondary" size="sm" className="h-8 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20">
            <Globe className="h-3.5 w-3.5 mr-2" />
            Publish & Share
          </Button>
          <Button onClick={() => handleSave()} disabled={isSaving} size="sm" className="h-8 text-xs font-medium">
            <Save className="h-3.5 w-3.5 mr-2" />
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 w-full overflow-hidden relative">
        <BuilderSidebar />
        <div className="flex-1 h-full relative z-0" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onSelectionChange={onSelectionChange}
            nodeTypes={nodeTypes}
            colorMode="dark"
            fitView
          >
            <Controls style={{ left: 16, bottom: 16 }} className="z-50" />
            <MiniMap 
              nodeColor="#ff0b0b" 
              maskColor="rgba(0,0,0,0.5)" 
              style={{ right: 16, bottom: 16 }} 
              className="z-50"
            />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#3f3f46" />
          </ReactFlow>
        </div>
        <PropertiesPanel selectedNode={selectedNode} updateNodeData={updateNodeData} deleteNode={deleteNode} />
      </div>

      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes in your form. Are you sure you want to exit? Your modifications will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>Cancel</Button>
            <Link href="/dashboard">
              <Button variant="destructive">Discard & Exit</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isPublished ? "Form Published!" : "Publish Form"}</DialogTitle>
            <DialogDescription>
              {isPublished 
                ? "Your form is now live and ready to accept responses." 
                : "Configure access limits before sharing your form with the world."}
            </DialogDescription>
          </DialogHeader>

          {!isPublished ? (
            <div className="space-y-6 py-4">
              <div className="group border border-border bg-surface/50 rounded-xl p-4 transition-all hover:bg-surface/80 hover:border-primary/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <Label className="text-base font-semibold">Form Lifespan</Label>
                    <p className="text-xs text-muted-foreground">When should this form automatically self-destruct?</p>
                  </div>
                </div>
                <Select
                  value={shareConfig.expiresIn}
                  onValueChange={(val) => setShareConfig({ ...shareConfig, expiresIn: val || '7d' })}
                >
                  <SelectTrigger className="h-10 text-sm bg-background/50 border-input font-medium focus:ring-primary/20">
                    <SelectValue placeholder="Select expiration" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="never">Keep Alive Forever</SelectItem>
                    <SelectItem value="15m">15 Minutes (High Security)</SelectItem>
                    <SelectItem value="1h">1 Hour</SelectItem>
                    <SelectItem value="24h">24 Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="group border border-border bg-surface/50 rounded-xl p-4 transition-all hover:bg-surface/80 hover:border-primary/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <Hash className="w-5 h-5" />
                  </div>
                  <div>
                    <Label className="text-base font-semibold">Submission Cap</Label>
                    <p className="text-xs text-muted-foreground">Maximum allowed submissions before closing.</p>
                  </div>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    min="1"
                    placeholder="Unlimited"
                    className="h-10 pl-4 bg-background/50 border-input font-mono focus-visible:ring-primary/20"
                    value={shareConfig.maxResponses}
                    onChange={(e) => setShareConfig({ ...shareConfig, maxResponses: e.target.value })}
                  />
                  {shareConfig.maxResponses && (
                    <span className="absolute right-3 top-2.5 text-xs font-semibold tracking-wide text-primary uppercase">
                      Responses
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-4 flex flex-col items-center">
              <div className="p-4 bg-white rounded-xl">
                <QRCodeSVG value={shareLink} size={180} level="H" includeMargin={false} />
              </div>
              
              <div className="w-full space-y-2">
                <Label>Public Link</Label>
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <input
                      readOnly
                      value={shareLink}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                  <Button type="button" size="sm" className="px-3" onClick={copyLink}>
                    <span className="sr-only">Copy</span>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-end">
            {!isPublished ? (
              <>
                <Button variant="outline" onClick={() => setShowShareDialog(false)}>Cancel</Button>
                <Button onClick={handlePublish} disabled={isSaving}>
                  {isSaving ? "Publishing..." : "Publish Form"}
                </Button>
              </>
            ) : (
              <Button variant="secondary" onClick={() => setShowShareDialog(false)}>Done</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function BuilderCanvas({ formId, formSlug, initialData, integrations }: { formId?: string, formSlug?: string, initialData?: any, integrations?: any }) {
  return (
    <div className="w-full h-full flex flex-col">
      <ReactFlowProvider>
        <CanvasArea formId={formId} formSlug={formSlug} initialData={initialData} integrations={integrations} />
      </ReactFlowProvider>
    </div>
  );
}

// [dev-log-sync]: a28486b75fd03c97