import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Upload, PenTool, Eraser } from 'lucide-react';

export function SignatureModule({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [mode, setMode] = useState<'draw' | 'upload'>('draw');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
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
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
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
    if (!isDrawing) return;
    setIsDrawing(false);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setError('Only PNG, JPG, and WebP images are supported.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setError('File size must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

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
          onClick={() => setMode('upload')}
          className={cn("px-4 py-2 text-sm font-medium rounded-lg flex items-center transition-all", mode === 'upload' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
        >
          <Upload className="w-4 h-4 mr-2" /> Upload
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
              className="w-full touch-none cursor-crosshair"
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Sign in the box above</p>
            <Button type="button" variant="ghost" size="sm" onClick={clearCanvas} className="h-8 text-xs">
              <Eraser className="w-3.5 h-3.5 mr-1.5" /> Clear
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-background/50 hover:bg-background transition-colors">
          <input
            type="file"
            id="sig-upload"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFileUpload}
          />
          <label htmlFor="sig-upload" className="cursor-pointer flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">Click to upload signature</p>
            <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
          </label>
        </div>
      )}

      {error && <p className="text-sm text-destructive font-medium">{error}</p>}
      
      {value && mode === 'upload' && (
        <div className="mt-4 p-4 border rounded-xl bg-background flex items-center justify-center">
          <img src={value} alt="Signature Preview" className="max-h-24 object-contain" />
        </div>
      )}
    </div>
  );
}
