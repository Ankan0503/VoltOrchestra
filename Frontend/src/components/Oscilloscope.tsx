/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { ZoomIn, ZoomOut, Activity, Lock, Unlock, RefreshCw } from 'lucide-react';

interface OscilloscopeProps {
  voltage: number;
  current: number;
  frequency: number;
  relayTripped: boolean;
}

export default function Oscilloscope({
  voltage,
  current,
  frequency,
  relayTripped,
}: OscilloscopeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [measureMode, setMeasureMode] = useState<boolean>(false);
  const [measurePoint, setMeasurePoint] = useState<{ x: number; y: number } | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<number>(0);

  // Animation frame loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      // Draw dark bezel background
      ctx.fillStyle = '#09090B';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid lines
      ctx.strokeStyle = '#1E1E24';
      ctx.lineWidth = 1;

      const gridSpacing = 40 * zoom;
      const midY = height / 2;
      const midX = width / 2;

      // Vertical grid lines
      for (let x = (midX + offset) % gridSpacing; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal grid lines
      for (let y = midY % gridSpacing; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Main Axes
      ctx.strokeStyle = '#27272A';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.moveTo(midX, 0);
      ctx.lineTo(midX, height);
      ctx.stroke();

      // Tick marks on main axes
      ctx.strokeStyle = '#3F3F46';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, midY - 3);
        ctx.lineTo(x, midY + 3);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 10) {
        ctx.beginPath();
        ctx.moveTo(midX - 3, y);
        ctx.lineTo(midX + 3, y);
        ctx.stroke();
      }

      if (isLive && !relayTripped) {
        time += 0.05 * (frequency / 50);
      }

      // Waveform formulas
      const vAmp = relayTripped ? 0 : 70; // 230V scaled down
      const cAmp = relayTripped ? 0 : Math.min(60, current * 4); // Amps scaled down
      const omega = 0.03 * zoom;

      // Draw Voltage Waveform (Green #30D158)
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#30D158';
      ctx.strokeStyle = '#30D158';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const t = x - offset;
        const y = midY - Math.sin(t * omega + time) * vAmp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw Current Waveform (Yellow #FFD60A) - slightly out of phase (Power Factor)
      ctx.shadowColor = '#FFD60A';
      ctx.strokeStyle = '#FFD60A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const phaseShift = 0.4; // 0.8 power factor phase angle
      for (let x = 0; x < width; x++) {
        const t = x - offset;
        const y = midY - Math.sin(t * omega + time - phaseShift) * cAmp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Reset shadow
      ctx.shadowBlur = 0;

      // Draw measured point if selected
      if (measurePoint) {
        ctx.strokeStyle = '#0A84FF';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);

        // Horizontal measure line
        ctx.beginPath();
        ctx.moveTo(0, measurePoint.y);
        ctx.lineTo(width, measurePoint.y);
        ctx.stroke();

        // Vertical measure line
        ctx.beginPath();
        ctx.moveTo(measurePoint.x, 0);
        ctx.lineTo(measurePoint.x, height);
        ctx.stroke();

        ctx.setLineDash([]);

        // Intersection indicator
        ctx.fillStyle = '#0A84FF';
        ctx.beginPath();
        ctx.arc(measurePoint.x, measurePoint.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Calculate and draw labels
        const relativeY = midY - measurePoint.y;
        const measuredV = Math.round((relativeY / 70) * 325); // peak AC voltage 230 * sqrt(2) ~ 325
        const measuredA = ((relativeY / 60) * 25).toFixed(2); // max 25A scaled

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
        ctx.fillText(`Cursor X: ${Math.round(measurePoint.x)}px`, measurePoint.x + 8, measurePoint.y - 18);
        ctx.fillText(`V(t): ${relayTripped ? '0' : measuredV}V | I(t): ${relayTripped ? '0.00' : measuredA}A`, measurePoint.x + 8, measurePoint.y - 5);
      }

      // Panel metrics overlays (top-right overlay)
      ctx.fillStyle = 'rgba(15, 15, 20, 0.85)';
      ctx.fillRect(width - 150, 10, 140, 68);
      ctx.strokeStyle = '#27272A';
      ctx.strokeRect(width - 150, 10, 140, 68);

      ctx.fillStyle = '#6E6E73';
      ctx.font = '10px ui-monospace, monospace';
      ctx.fillText('OSCILLOSCOPE', width - 140, 24);
      
      ctx.fillStyle = '#30D158';
      ctx.fillText(`CH1 (V): ${relayTripped ? '0' : '230.4'}V RMS`, width - 140, 38);

      ctx.fillStyle = '#FFD60A';
      ctx.fillText(`CH2 (I): ${relayTripped ? '0.00' : current.toFixed(2)}A RMS`, width - 140, 52);

      ctx.fillStyle = '#0A84FF';
      ctx.fillText(`FREQ: ${relayTripped ? '0.00' : frequency.toFixed(1)} Hz`, width - 140, 66);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [voltage, current, frequency, zoom, isLive, measurePoint, offset, relayTripped]);

  // Handle Dragging / Panning
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (measureMode) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMeasurePoint({ x, y });
    } else {
      setIsDragging(true);
      setDragStart(e.clientX - offset);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && !measureMode) {
      setOffset(e.clientX - dragStart);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="bg-panel-blue-bg rounded-[24px] border border-panel-blue-border p-4 sm:p-6 shadow-sm overflow-hidden flex flex-col h-full transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[#5C6E85] font-mono text-xs uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4 text-[#0A84FF] animate-pulse" />
            <span>Harmonic Waveform Scope</span>
          </div>
          <h3 className="text-xl font-medium text-[#1F2C42] tracking-tight">Real-Time Phase Oscilloscope</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Controls */}
          <button
            onClick={() => setZoom((prev) => Math.min(2.5, prev + 0.15))}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-panel-blue-border bg-white/80 hover:bg-white text-[#1F2C42] transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.15))}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#D5E4F5] bg-white/80 hover:bg-white text-[#1F2C42] transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setOffset(0);
              setMeasurePoint(null);
            }}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#D5E4F5] bg-white/80 hover:bg-white text-[#1F2C42] transition-all"
            title="Reset Pan"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMeasureMode(!measureMode)}
            className={`flex items-center gap-2 px-3 h-9 rounded-lg border text-sm font-medium transition-all ${
              measureMode
                ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-sm'
                : 'border-[#D5E4F5] bg-white/80 hover:bg-white text-[#1F2C42]'
            }`}
          >
            {measureMode ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            <span>{measureMode ? 'Measuring' : 'Cursor Measure'}</span>
          </button>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-3.5 h-9 rounded-lg text-sm font-medium transition-all ${
              isLive ? 'bg-[#111111] text-white' : 'border border-[#E5E5E7] hover:bg-[#F5F5F7] text-[#6E6E73]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLive && !relayTripped ? 'bg-[#30D158] animate-ping' : 'bg-[#FF453A]'}`}></span>
            <span>{isLive ? 'Live Stream' : 'Wave Paused'}</span>
          </button>
        </div>
      </div>

      <div className="relative flex-1 min-h-[320px] rounded-xl overflow-hidden border border-[#E5E5E7] shadow-inner bg-[#09090B]">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`w-full h-full block ${measureMode ? 'cursor-crosshair' : isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        />

        {/* Floating Calibration Card */}
        <div className="absolute bottom-4 left-4 bg-[#09090B]/90 backdrop-blur-md rounded-lg border border-[#27272A] p-3 text-white flex gap-4 text-[11px] font-mono select-none">
          <div>
            <span className="text-[#6E6E73] block mb-0.5">TIME BASE</span>
            <span className="font-semibold text-white">5.00 ms/div</span>
          </div>
          <div className="border-l border-[#27272A] pl-4">
            <span className="text-[#30D158] block mb-0.5">CH1 (VOLTS)</span>
            <span className="font-semibold text-white">100 V/div</span>
          </div>
          <div className="border-l border-[#27272A] pl-4">
            <span className="text-[#FFD60A] block mb-0.5">CH2 (AMPS)</span>
            <span className="font-semibold text-white">5.00 A/div</span>
          </div>
          <div className="border-l border-[#27272A] pl-4">
            <span className="text-[#6E6E73] block mb-0.5">TRIGGER</span>
            <span className="font-semibold text-[#30D158]">CH1 ↑ AUTO</span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs font-mono text-[#6E6E73] flex justify-between items-center bg-[#F5F5F7] p-3 rounded-lg border border-[#E5E5E7]">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-1 bg-[#30D158] rounded-sm"></span>
          <span>Voltage Waveform (Sine wave, 230V RMS @ 50.0Hz)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-1 bg-[#FFD60A] rounded-sm"></span>
          <span>Current Draw Waveform (Phase shift determined by cos φ)</span>
        </div>
      </div>
    </div>
  );
}
