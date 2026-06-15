import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { PenTool, Type, Eraser } from 'lucide-react';

export function SignatureModule({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [mode, setMode] = useState<'draw' | 'type'>('draw');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set up drawing styles
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000000'; // Default black

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      onChange(canvas.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onChange('');
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    if (text) {
      // Just store a prefixed string for text signature
      onChange(`typed_sig:${text}`);
    } else {
      onChange('');
    }
  };

  // If the value is a typed signature, extract it for the input
  const typedValue = value.startsWith('typed_sig:') ? value.replace('typed_sig:', '') : '';

  return (
    <div className="w-full max-w-lg space-y-4">
      <div className="flex bg-muted/50 p-1 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setMode('draw')}
          className={cn("px-4 py-2 text-sm font-medium rounded-lg flex items-center transition-all", mode === 'draw' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
        >
          <PenTool className="w-4 h-4 mr-2" /> Draw
        </button>
        <button
          type="button"
          onClick={() => setMode('type')}
          className={cn("px-4 py-2 text-sm font-medium rounded-lg flex items-center transition-all", mode === 'type' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
        >
          <Type className="w-4 h-4 mr-2" /> Type
        </button>
      </div>

      {mode === 'draw' ? (
        <div className="space-y-3">
          <div className="border-2 border-dashed border-border rounded-xl overflow-hidden bg-background">
            <canvas
              ref={canvasRef}
              width={500}
              height={200}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full touch-none cursor-crosshair bg-white"
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Sign in the box above using your mouse or finger</p>
            <Button type="button" variant="ghost" size="sm" onClick={clearCanvas} className="h-8 text-xs">
              <Eraser className="w-3.5 h-3.5 mr-1.5" /> Clear
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 p-6 border-2 border-dashed border-border rounded-xl bg-background/50">
          <div className="space-y-2">
            <label className="text-sm font-medium">Type your full name</label>
            <Input
              type="text"
              placeholder="e.g. John Doe"
              value={typedValue}
              onChange={handleTypeChange}
              className="h-12 text-lg"
            />
          </div>
          
          {typedValue && (
            <div className="mt-6 pt-6 border-t border-border/50 flex flex-col items-center justify-center space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Signature Preview</p>
              <div 
                className="text-4xl text-foreground px-8 py-4 border rounded-xl bg-background shadow-sm w-full text-center overflow-x-auto whitespace-nowrap"
                style={{ fontFamily: "'Brush Script MT', 'Caveat', 'Great Vibes', cursive", fontStyle: 'italic' }}
              >
                {typedValue}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
