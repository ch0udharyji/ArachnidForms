"use client"

import { useCallback, useState, useRef, useMemo } from 'react';
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
import { DeleteEdge } from './edges/delete-edge';
import { BuilderSidebar } from './builder-sidebar';
import { PropertiesPanel } from './properties-panel';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Save, ArrowLeft, Share2, Copy, Globe, QrCode, Hash, Download } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const nodeTypes: NodeTypes = {
  questionNode: QuestionNode,
  startNode: StartNode,
  endNode: EndNode,
  logicNode: LogicNode,
};

const edgeTypes: any = {
  deleteEdge: DeleteEdge,
};

const initialNodes: Node[] = [
  { id: 'start', type: 'startNode', position: { x: 300, y: 50 }, data: { label: 'Start' }, deletable: false },
  { id: 'end', type: 'endNode', position: { x: 300, y: 500 }, data: { label: 'Submit' }, deletable: false },
];

const getId = () => `node_${Math.random().toString(36).substring(2, 9)}`;

function CanvasArea({ formId, formSlug, initialData, integrations, isTestAccount }: { formId?: string, formSlug?: string, initialData?: any, integrations?: any, isTestAccount?: boolean }) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData && Array.isArray(initialData.nodes) && initialData.nodes.length > 0 ? initialData.nodes : initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData && Array.isArray(initialData.edges) && initialData.edges.length > 0 ? initialData.edges : []);
  const { screenToFlowPosition } = useReactFlow();
  
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [dragHoverEdge, setDragHoverEdge] = useState<string | null>(null);

  const distanceToSegment = useCallback((p: {x: number, y: number}, v: {x: number, y: number}, w: {x: number, y: number}) => {
    const l2 = (w.x - v.x) ** 2 + (w.y - v.y) ** 2;
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    const proj = { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) };
    return Math.hypot(p.x - proj.x, p.y - proj.y);
  }, []);

  const [isDirty, setIsDirty] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const [shareConfig, setShareConfig] = useState({
    expiresIn: isTestAccount ? '15m' : '7d',
    maxResponses: '',
    allowEdit: initialData?.settings?.allowEdit || false,
    maxEdits: initialData?.settings?.maxEdits || ''
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
          maxResponses: maxResponses || null,
          settings: {
            allowEdit: shareConfig.allowEdit,
            maxEdits: shareConfig.maxEdits ? parseInt(shareConfig.maxEdits, 10) : null
          }
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

  const downloadQR = () => {
    const svg = document.getElementById("form-qr-code");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      const padding = 24;
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, padding, padding);
      }
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `form-qr-${formId || formSlug}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
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
        const newEdge = { ...params, type: 'deleteEdge' };
        setEdges((eds) => addEdge(newEdge, eds));
        setIsDirty(true);
      }
    },
    [setEdges, isValidConnection],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    let closestEdgeId = null;
    let minDistance = 40;

    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      if (sourceNode && targetNode) {
        const sourcePos = { x: sourceNode.position.x + 150, y: sourceNode.position.y + 50 };
        const targetPos = { x: targetNode.position.x + 150, y: targetNode.position.y + 50 };
        const dist = distanceToSegment(position, sourcePos, targetPos);
        if (dist < minDistance) {
          minDistance = dist;
          closestEdgeId = edge.id;
        }
      }
    });

    setDragHoverEdge(closestEdgeId);
  }, [screenToFlowPosition, edges, nodes, distanceToSegment]);

  const onDragLeave = useCallback(() => {
    setDragHoverEdge(null);
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setDragHoverEdge(null);

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

      if (dragHoverEdge) {
        const edgeToSplit = edges.find(e => e.id === dragHoverEdge);
        if (edgeToSplit) {
          const edge1 = {
            id: `e-${edgeToSplit.source}-${newNodeId}`,
            source: edgeToSplit.source,
            target: newNodeId,
            sourceHandle: edgeToSplit.sourceHandle,
            type: 'deleteEdge',
          };
          const edge2 = {
            id: `e-${newNodeId}-${edgeToSplit.target}`,
            source: newNodeId,
            target: edgeToSplit.target,
            targetHandle: edgeToSplit.targetHandle,
            type: 'deleteEdge',
          };
          
          setEdges((eds) => eds.filter(e => e.id !== dragHoverEdge).concat([edge1, edge2]));
        }
      }

      setIsDirty(true);
    },
    [screenToFlowPosition, setNodes, setEdges, integrations, dragHoverEdge, edges],
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

  const displayEdges = useMemo(() => {
    return edges.map(e => {
      // Ensure all initial/existing edges use the deleteEdge type
      let type = e.type || 'deleteEdge';
      if (type !== 'deleteEdge' && type !== 'default') type = 'deleteEdge';
      
      return {
        ...e,
        type,
        style: e.id === dragHoverEdge ? { stroke: '#3b82f6', strokeWidth: 4, opacity: 0.5 } : e.style,
        animated: e.id === dragHoverEdge ? true : e.animated,
      };
    });
  }, [edges, dragHoverEdge]);

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
            edges={displayEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onSelectionChange={onSelectionChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={{ type: 'deleteEdge' }}
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
              {isTestAccount ? (
                <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-center space-y-2">
                  <h3 className="font-bold">Test Mode Active</h3>
                  <p className="text-sm">Forms published with a test account will automatically expire and be permanently deleted in 15 minutes.</p>
                  <p className="text-sm">Sign up with a real account to unlock custom expirations, response limits, and permanent URLs.</p>
                </div>
              ) : (
                <>
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

                  <div className="group border border-border bg-surface/50 rounded-xl p-4 transition-all hover:bg-surface/80 hover:border-primary/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                          <Copy className="w-5 h-5" />
                        </div>
                        <div>
                          <Label className="text-base font-semibold">Allow Response Editing</Label>
                          <p className="text-xs text-muted-foreground">Let users modify their submitted responses.</p>
                        </div>
                      </div>
                      <Switch 
                        checked={shareConfig.allowEdit} 
                        onCheckedChange={(val) => setShareConfig({ ...shareConfig, allowEdit: val })}
                      />
                    </div>
                    {shareConfig.allowEdit && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <Label className="text-sm font-semibold mb-2 block">Maximum Edit Attempts</Label>
                        <div className="relative">
                          <Input
                            type="number"
                            min="1"
                            placeholder="Unlimited"
                            className="h-10 pl-4 bg-background/50 border-input font-mono focus-visible:ring-primary/20"
                            value={shareConfig.maxEdits}
                            onChange={(e) => setShareConfig({ ...shareConfig, maxEdits: e.target.value })}
                          />
                          {shareConfig.maxEdits && (
                            <span className="absolute right-3 top-2.5 text-xs font-semibold tracking-wide text-primary uppercase">
                              Attempts
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-6 py-4 flex flex-col items-center">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-border/50">
                <QRCodeSVG id="form-qr-code" value={shareLink} size={180} level="H" includeMargin={false} />
              </div>
              
              <Button variant="outline" size="sm" onClick={downloadQR} className="h-8">
                <Download className="w-3.5 h-3.5 mr-2" /> Download QR
              </Button>
              
              <div className="w-full space-y-2 mt-2">
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

export function BuilderCanvas({ formId, formSlug, initialData, integrations, isTestAccount }: { formId?: string, formSlug?: string, initialData?: any, integrations?: any, isTestAccount?: boolean }) {
  return (
    <div className="w-full h-full flex flex-col">
      <ReactFlowProvider>
        <CanvasArea formId={formId} formSlug={formSlug} initialData={initialData} integrations={integrations} isTestAccount={isTestAccount} />
      </ReactFlowProvider>
    </div>
  );
}
