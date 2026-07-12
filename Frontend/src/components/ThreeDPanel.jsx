/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sliders, ToggleLeft, Activity, ShieldAlert, Cpu, Eye, Hourglass, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ThreeDPanel({
  sockets,
  selectedSocketId,
  onSelectSocket,
}) {
  const [hoveredId, setHoveredId] = useState(null);

  // Active socket detail for the expanded drawer view
  const activeSocket = sockets.find(s => s.id === selectedSocketId) || sockets[0];

  return (
    <div className="bg-panel-rose-bg rounded-[24px] border border-panel-rose-border p-4 sm:p-8 shadow-sm h-full flex flex-col justify-between transition-all duration-300">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-panel-rose-border pb-5 mb-8 gap-4">
          <div>
            <span className="text-[#9F1239] font-mono text-xs uppercase tracking-wider mb-1 block">Tactile Hardware Interface</span>
            <h2 className="text-2xl font-semibold text-[#4C0519] tracking-tight">Interactive 3D Chassis Panel</h2>
          </div>
          <span className="text-[10px] bg-[#9F1239] text-white px-3 py-1 rounded-full font-mono w-fit">MODEL v1.02 SOLID-STATE</span>
        </div>

        <p className="text-sm text-[#9F1239]/80 mb-8 leading-relaxed max-w-xl">
          Hover over physical rack units to view status LEDs. Click to slide open the diagnostic drawer and view detailed component telemetry.
        </p>

        {/* 3D Panel Scene Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4">
          
          {/* 3D Chassis visualization (7 columns on large screens) */}
          <div className="lg:col-span-7 flex justify-center">
            
            {/* The Outer Electrical Cabinet (CSS Isometric perspective) */}
            <div 
              className="relative w-full max-w-[340px] bg-[#E5E5E7] rounded-[24px] p-6 border-b-8 border-r-4 border-[#C8C8CC] shadow-2xl flex flex-col gap-4"
              style={{
                perspective: '1200px',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Cabinet Bezel Header */}
              <div className="flex justify-between items-center px-2 pb-2 border-b border-[#D1D1D6] mb-2 font-mono text-[9px] text-[#8E8E93] select-none">
                <span>VOLTORCHESTRA INTEGRATED MODULE</span>
                <span className="text-[#30D158] animate-pulse">● MASTER OK</span>
              </div>

              {/* Main Breaker Modular Switch */}
              <div className="relative bg-white rounded-[16px] p-4 border border-[#D1D1D6] shadow-inner flex justify-between items-center select-none">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#30D158] shadow-md shadow-[#30D158]/50" />
                  <div>
                    <span className="block text-[8px] text-[#8E8E93] font-mono">MAIN RELAY</span>
                    <span className="text-xs font-bold text-[#111111] font-mono">CHASSIS RELAY 25A</span>
                  </div>
                </div>
                <div className="w-10 h-6 bg-[#E5E5E7] rounded-full p-0.5 flex items-center cursor-not-allowed justify-end">
                  <div className="w-5 h-5 bg-white rounded-full shadow-md border border-[#C8C8CC]" />
                </div>
              </div>

              {/* Drawers Container */}
              <div className="flex flex-col gap-3.5 mt-2">
                {sockets.map((socket) => {
                  const isSelected = selectedSocketId === socket.id;
                  const isHovered = hoveredId === socket.id;
                  const isShed = socket.status === 'Shed';
                  const isOff = socket.status === 'Off';

                  // Determine LED status light
                  let ledColor = 'bg-[#30D158] shadow-[#30D158]';
                  if (isShed) ledColor = 'bg-[#FFD60A] shadow-[#FFD60A]';
                  else if (isOff) ledColor = 'bg-[#8E8E93] shadow-transparent';
                  else if (socket.status === 'Overload') ledColor = 'bg-[#FF453A] shadow-[#FF453A]';

                  return (
                    <div
                      key={socket.id}
                      onMouseEnter={() => setHoveredId(socket.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => onSelectSocket(socket.id)}
                      className="relative cursor-pointer transition-all duration-300"
                      style={{
                        transform: isSelected 
                          ? 'translateZ(30px) translateY(-5px) scale(1.02)' 
                          : isHovered 
                          ? 'translateZ(15px) translateY(-2px)' 
                          : 'translateZ(0px)',
                        boxShadow: isSelected 
                          ? '0 25px 30px rgba(0,0,0,0.15)' 
                          : isHovered 
                          ? '0 12px 18px rgba(0,0,0,0.08)' 
                          : '0 4px 6px rgba(0,0,0,0.04)',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      {/* Socket Drawer Front Bezel */}
                      <div className={`relative bg-white rounded-[16px] border p-4 flex items-center justify-between transition-all duration-300 ${
                        isSelected 
                          ? 'border-[#9F1239] bg-gradient-to-r from-white to-[#F5F5F7]' 
                          : 'border-[#D1D1D6]'
                      }`}>
                        {/* Interactive Handle Notch */}
                        <div className="absolute top-1/2 left-2 -translate-y-1/2 w-1.5 h-6 bg-[#C8C8CC] rounded-full border border-white" />

                        <div className="flex items-center gap-4 pl-3">
                          {/* Hardware LED */}
                          <div className={`w-3 h-3 rounded-full ${ledColor} shadow-sm animate-pulse transition-all duration-300`} />
                          
                          <div>
                            <span className="block text-[8px] text-[#8E8E93] font-mono uppercase tracking-wider">SLOT {socket.id === 's1' ? '01' : socket.id === 's2' ? '02' : socket.id === 's3' ? '03' : '04'}</span>
                            <span className="text-sm font-semibold text-[#111111] tracking-tight">{socket.name}</span>
                          </div>
                        </div>

                        {/* Power Rating Badge */}
                        <div className="text-right">
                          <span className="block text-[8px] text-[#8E8E93] font-mono">DEMAND</span>
                          <span className="font-mono text-sm font-bold text-[#111111]">{isOff ? '0' : socket.power} W</span>
                        </div>
                      </div>

                      {/* Sliding visual hint lines on sides */}
                      {isSelected && (
                        <div className="absolute -left-1 top-2 bottom-2 w-1 bg-[#9F1239] rounded-l" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Chassis bottom vents */}
              <div className="flex justify-center gap-1.5 py-2 mt-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1.5 h-6 bg-[#C8C8CC] rounded-full opacity-60" />
                ))}
              </div>
            </div>

          </div>

          {/* TELEMETRY DRAWER DIAGNOSTIC VIEW (5 columns) */}
          <div className="lg:col-span-5 h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSocket.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-white/60 rounded-[24px] border border-[#FECDD3] p-6 h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[#FECDD3] pb-3 mb-4">
                    <div>
                      <span className="text-[10px] text-[#9F1239] font-mono uppercase">EXPANDED DIAGNOSTICS</span>
                      <h3 className="text-lg font-bold text-[#4C0519] tracking-tight">{activeSocket.name}</h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#9F1239] bg-[#9F1239]/10 px-2 py-0.5 rounded-full">
                      {activeSocket.status === 'Active' ? 'ENGAGED' : activeSocket.status === 'Shed' ? 'PAUSED' : 'ISOLATED'}
                    </span>
                  </div>

                  {/* Multi-parameter Readout */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-[16px] p-3 border border-[#FECDD3] text-left">
                        <span className="text-[9px] text-[#9F1239] font-mono uppercase block">CURRENT FLOW</span>
                        <span className="text-md font-mono font-bold text-[#4C0519]">{activeSocket.status === 'Off' ? '0.00' : activeSocket.current.toFixed(2)} A</span>
                      </div>
                      <div className="bg-white rounded-[16px] p-3 border border-[#FECDD3] text-left">
                        <span className="text-[9px] text-[#9F1239] font-mono uppercase block">TERMINAL VOLTS</span>
                        <span className="text-md font-mono font-bold text-[#4C0519]">{activeSocket.status === 'Off' ? '0.0' : activeSocket.voltage.toFixed(1)} V</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-[16px] p-4 border border-[#FECDD3]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] text-[#9F1239] font-mono uppercase">EXPECTED COMPONENT LIFE</span>
                        <span className="text-xs font-mono font-semibold text-[#4C0519]">
                          {activeSocket.health}%
                        </span>
                      </div>
                      {/* Health progress */}
                      <div className="w-full bg-[#FFF1F2] h-1.5 rounded-full overflow-hidden mb-1">
                        <div 
                          className={`h-full rounded-full ${
                            activeSocket.health > 80 ? 'bg-[#30D158]' : activeSocket.health > 50 ? 'bg-[#FFD60A]' : 'bg-[#FF453A]'
                          }`}
                          style={{ width: `${activeSocket.health}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-[#9F1239] font-mono">
                        Prediction: {activeSocket.failurePrediction} (~{activeSocket.daysToFailure} days left)
                      </span>
                    </div>

                    {/* Usage curve visual representation (sparkline style) */}
                    <div className="bg-white rounded-[16px] p-4 border border-panel-rose-border">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] text-[#9F1239] font-mono uppercase flex items-center gap-1">
                          <Activity className="w-3 h-3 text-[#9F1239]" />
                          <span>Power Draw Sparkline (10s window)</span>
                        </span>
                        <span className="text-[10px] text-[#9F1239] font-mono">Peak: {activeSocket.maxPower}W</span>
                      </div>
                      
                      {/* Draw simple visual bars for sparkline history */}
                      <div className="flex items-end justify-between h-14 gap-1 pt-1">
                        {activeSocket.recentUsage.map((val, idx) => {
                          const percent = Math.max(8, Math.round((val / activeSocket.maxPower) * 100));
                          return (
                            <div 
                              key={idx}
                              className={`w-full rounded-t-sm transition-all duration-300 ${
                                activeSocket.status === 'Off' 
                                  ? 'bg-[#E5E5E7]' 
                                  : activeSocket.status === 'Shed'
                                  ? 'bg-[#FFD60A]/40'
                                  : 'bg-[#9F1239]/60 hover:bg-[#9F1239]'
                              }`}
                              style={{ height: `${activeSocket.status === 'Off' ? '8%' : `${percent}%`}` }}
                              title={`Demand: ${val}W`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-panel-rose-border text-[10px] font-mono text-[#9F1239] flex items-center gap-1.5">
                  <Hourglass className="w-3.5 h-3.5 text-[#9F1239]" />
                  <span>Real-time safety rules bound to this module drawer.</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
