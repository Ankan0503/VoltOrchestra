/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SocketData } from '../types';
import { TrendingUp, Award, BatteryCharging, DollarSign, Calendar } from 'lucide-react';

interface AnalyticsSectionProps {
  sockets: SocketData[];
}

export default function AnalyticsSection({ sockets }: AnalyticsSectionProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'Day' | 'Week' | 'Month'>('Day');

  const totalLoad = sockets.reduce((sum, s) => sum + (s.status === 'Off' ? 0 : s.power), 0);

  // SVG Radial circle logic
  const size = 180;
  const strokeWidth = 12;
  const center = size / 2;
  const radius1 = center - strokeWidth - 5;
  const radius2 = radius1 - strokeWidth - 10;
  const radius3 = radius2 - strokeWidth - 10;
  const radius4 = radius3 - strokeWidth - 10;

  const circ1 = 2 * Math.PI * radius1;
  const circ2 = 2 * Math.PI * radius2;
  const circ3 = 2 * Math.PI * radius3;
  const circ4 = 2 * Math.PI * radius4;

  // Calculate percentages of total load
  const p1 = totalLoad > 0 ? (sockets[0].status === 'Off' ? 0 : sockets[0].power) / totalLoad : 0;
  const p2 = totalLoad > 0 ? (sockets[1].status === 'Off' ? 0 : sockets[1].power) / totalLoad : 0;
  const p3 = totalLoad > 0 ? (sockets[2].status === 'Off' ? 0 : sockets[2].power) / totalLoad : 0;
  const p4 = totalLoad > 0 ? (sockets[3].status === 'Off' ? 0 : sockets[3].power) / totalLoad : 0;

  // Custom visual curve coordinates for daily power curve representation (handcrafted SVG)
  const powerDataPoints = [1800, 2400, 1600, 3100, 4200, 3500, 2800, 3900, 2900, 3400];
  const maxPointVal = 5000;
  const width = 500;
  const height = 180;

  const svgPoints = powerDataPoints.map((val, idx) => {
    const x = (idx / (powerDataPoints.length - 1)) * (width - 40) + 20;
    const y = height - (val / maxPointVal) * (height - 40) - 20;
    return { x, y, val };
  });

  // Construct a smooth cubic bezier line path
  let pathString = `M ${svgPoints[0].x} ${svgPoints[0].y}`;
  for (let i = 0; i < svgPoints.length - 1; i++) {
    const p0 = svgPoints[i];
    const p1 = svgPoints[i + 1];
    const cpX1 = p0.x + (p1.x - p0.x) / 3;
    const cpY1 = p0.y;
    const cpX2 = p0.x + 2 * (p1.x - p0.x) / 3;
    const cpY2 = p1.y;
    pathString += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
  }

  // Construct fill path string to color the gradient below the line
  const fillPathString = `${pathString} L ${svgPoints[svgPoints.length - 1].x} ${height - 20} L ${svgPoints[0].x} ${height - 20} Z`;

  return (
    <div className="bg-panel-green-bg rounded-[24px] border border-panel-green-border p-8 shadow-sm transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-panel-green-border pb-6 mb-8 gap-4">
        <div>
          <span className="text-[#4A6B54] font-mono text-xs uppercase tracking-wider mb-1 block">Grid Diagnostics</span>
          <h2 className="text-2xl font-semibold text-[#1F3D2B] tracking-tight">System Efficiency & Load Analytics</h2>
        </div>

        <div className="flex items-center gap-1.5 bg-white/60 border border-panel-green-border p-1 rounded-[16px]">
          {(['Day', 'Week', 'Month'] as const).map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTimeframe(time)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all ${
                selectedTimeframe === time 
                  ? 'bg-white text-[#1F3D2B] shadow-sm font-bold' 
                  : 'text-[#4A6B54] hover:text-[#1F3D2B]'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-center">
        
        {/* RADIAL CHART DISPLAY (5 columns) */}
        <div className="xl:col-span-5 flex flex-col md:flex-row items-center gap-8 bg-white/80 rounded-[24px] p-6 border border-panel-green-border">
          
          {/* Concentric SVG Circles */}
          <div className="relative shrink-0 select-none">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background tracks */}
              <circle cx={center} cy={center} r={radius1} fill="none" stroke="#E5E5E7" strokeWidth={strokeWidth} opacity="0.3" />
              <circle cx={center} cy={center} r={radius2} fill="none" stroke="#E5E5E7" strokeWidth={strokeWidth} opacity="0.3" />
              <circle cx={center} cy={center} r={radius3} fill="none" stroke="#E5E5E7" strokeWidth={strokeWidth} opacity="0.3" />
              <circle cx={center} cy={center} r={radius4} fill="none" stroke="#E5E5E7" strokeWidth={strokeWidth} opacity="0.3" />

              {/* Foreground active segments */}
              <circle 
                cx={center} cy={center} r={radius1} fill="none" stroke="#0A84FF" strokeWidth={strokeWidth} 
                strokeDasharray={circ1} strokeDashoffset={circ1 * (1 - p1)} strokeLinecap="round" className="transition-all duration-1000"
              />
              <circle 
                cx={center} cy={center} r={radius2} fill="none" stroke="#30D158" strokeWidth={strokeWidth} 
                strokeDasharray={circ2} strokeDashoffset={circ2 * (1 - p2)} strokeLinecap="round" className="transition-all duration-1000"
              />
              <circle 
                cx={center} cy={center} r={radius3} fill="none" stroke="#FFD60A" strokeWidth={strokeWidth} 
                strokeDasharray={circ3} strokeDashoffset={circ3 * (1 - p3)} strokeLinecap="round" className="transition-all duration-1000"
              />
              <circle 
                cx={center} cy={center} r={radius4} fill="none" stroke="#FF453A" strokeWidth={strokeWidth} 
                strokeDasharray={circ4} strokeDashoffset={circ4 * (1 - p4)} strokeLinecap="round" className="transition-all duration-1000"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col justify-center items-center text-center select-none pointer-events-none">
              <span className="text-[10px] text-[#6E6E73] font-mono uppercase tracking-wider">AGGREGATE</span>
              <span className="text-2xl font-mono font-extrabold text-[#111111]">{totalLoad}W</span>
              <span className="text-[9px] text-[#30D158] font-mono">98.2% Eff</span>
            </div>
          </div>

          {/* Labels & Legend */}
          <div className="space-y-4 flex-1">
            <span className="text-[10px] font-mono text-[#6E6E73] uppercase tracking-wider block">Demand Vector Split</span>
            
            <div className="space-y-3">
              {sockets.map((s, idx) => {
                const colors = ['#0A84FF', '#30D158', '#FFD60A', '#FF453A'];
                const sharePercent = totalLoad > 0 ? Math.round(((s.status === 'Off' ? 0 : s.power) / totalLoad) * 100) : 0;
                return (
                  <div key={s.id} className="flex items-center justify-between gap-4 text-xs font-sans">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[idx] }} />
                      <span className="font-semibold text-[#111111]">{s.name}</span>
                    </div>
                    <div className="font-mono text-[#6E6E73] text-right">
                      <span className="font-bold text-[#111111]">{s.status === 'Off' ? '0' : s.power}W</span>
                      <span className="ml-1.5 opacity-60">({sharePercent}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* LINE CHART CURVE GRAPH (7 columns) */}
        <div className="xl:col-span-7 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-mono text-[#6E6E73] uppercase tracking-wider">Demand Response Profile</span>
            <div className="flex items-center gap-1 text-[10px] text-[#30D158] font-mono bg-[#30D158]/10 px-2 py-0.5 rounded-full font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Optimizing 12% Cost Shaving</span>
            </div>
          </div>

          {/* Smooth clean SVG line graph */}
          <div className="relative w-full h-48 border border-[#E5E5E7] bg-[#F5F5F7]/30 rounded-2xl overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartFillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0A84FF" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0A84FF" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid guide lines */}
              <line x1="20" y1="20" x2={width - 20} y2="20" stroke="#E5E5E7" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="20" y1="70" x2={width - 20} y2="70" stroke="#E5E5E7" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="20" y1="120" x2={width - 20} y2="120" stroke="#E5E5E7" strokeWidth="1" strokeDasharray="4 4" />

              {/* Filled region under the curve */}
              <path d={fillPathString} fill="url(#chartFillGrad)" className="transition-all duration-1000" />

              {/* The actual curve path */}
              <path d={pathString} fill="none" stroke="#0A84FF" strokeWidth="2.5" strokeLinecap="round" className="transition-all duration-1000" />

              {/* Axis markers */}
              <line x1="20" y1={height - 20} x2={width - 20} y2={height - 20} stroke="#E5E5E7" strokeWidth="1" />

              {/* Interaction points */}
              {svgPoints.map((pt, i) => (
                <g key={i} className="group cursor-pointer">
                  <circle 
                    cx={pt.x} cy={pt.y} r="4" fill="#FFFFFF" stroke="#0A84FF" strokeWidth="2" 
                    className="hover:r-6 hover:fill-[#0A84FF] transition-all duration-200"
                  />
                  {/* Hover tooltip placeholder logic via SVG title */}
                  <title>{`Time: ${i * 2}:00 | Power: ${pt.val}W`}</title>
                </g>
              ))}
            </svg>

            {/* Floating visual label overlay inside chart */}
            <div className="absolute top-3 left-4 text-[10px] font-mono text-[#6E6E73]">
              Grid Power Peak (W)
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-[#6E6E73] mt-3 px-1">
            <span>08:00</span>
            <span>10:00</span>
            <span>12:00</span>
            <span>14:00 (Peak load)</span>
            <span>16:00</span>
            <span>18:00</span>
            <span>20:00</span>
          </div>
        </div>

      </div>
    </div>
  );
}
