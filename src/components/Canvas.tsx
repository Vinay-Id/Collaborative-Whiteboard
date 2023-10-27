import React, { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client'; 
interface CanvasProps {
  socket: Socket; 
}
function Canvas({ socket }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const context = canvas.getContext('2d');
      contextRef.current = context;
      context!.lineCap = 'round';
      context!.lineJoin = 'round';
      context!.strokeStyle = 'black';
      context!.lineWidth = 2;
    }

    socket.on('draw', (data: { x: number; y: number; type: string }) => {
      drawLine(data);
    });
  }, [socket]);

  const startDrawing = (event: React.MouseEvent) => {
    const { offsetX, offsetY } = event.nativeEvent;
    contextRef.current!.beginPath();
    contextRef.current!.moveTo(offsetX, offsetY);
    isDrawing.current = true;
  };

  const endDrawing = () => {
    contextRef.current!.closePath();
    isDrawing.current = false;
  };

  const drawLine = (data: { x: number; y: number; type: string }) => {
    const { x, y, type } = data;
    const context = contextRef.current;
    if (!context) return;
    if (type === 'start') {
      context.beginPath();
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
      context.stroke();
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDrawing.current) return;
    const { offsetX, offsetY } = event.nativeEvent;
    drawLine({ x: offsetX, y: offsetY, type: 'move' });
    socket.emit('draw', { x: offsetX, y: offsetY, type: 'move' });
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={endDrawing}
      onMouseMove={handleMouseMove}
    />
  );
}

export default Canvas;
