/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SocketData } from '../types';
import { X, Sliders, BatteryCharging, AlertCircle, RefreshCw, BarChart2, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface DrawerDetailsProps {
  socket: SocketData | null;
  onClose: () => void;
  onToggleSocket: (id: string) => void;
  onUpdatePower: (id: string, power: number) => void;
}

export default function DrawerDetails({
  socket,
  onClose,
  onToggleSocket,
  onUpdatePower,
}: DrawerDetailsProps) {
  if (!socket) return null;

  const isOff = socket.status === 'Off';
  const isShed = socket.status === 'Shed';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop blur overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#111111]/30 backdrop-blur-md transition-opacity"
      />

      {/* Slide-over Drawer Chassis */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className="relative w-full max-w-lg bg-white h-full shadow-2xl border-l border-[#E5E5E7] p-8 flex flex-col justify-between overflow-y-auto"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E5E5E7] pb-6 mb-8">
            <div>
              <span className="text-[10px] text-[#6E6E73] font-mono uppercase block mb-1">HARDWARE CHASSIS OVERVIEW</span>
              <h2 className="text-2xl font-semibold text-[#111111] tracking-tight">{socket.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full border border-[#E5E5E7] hover:bg-[#F5F5F7] flex items-center justify-center text-[#111111] transition-all"
              title="Close Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Large Visual 3D Socket Drawing (Handcrafted CSS) */}
          <div className="flex justify-center items-center py-6 mb-8 bg-[#F5F5F7] rounded-3xl border border-[#E5E5E7] shadow-inner relative overflow-hidden select-none">
            {/* Minimalist round physical plug socket */}
            <div className="relative w-44 h-44 rounded-full bg-white border border-[#E5E5E7] shadow-md flex items-center justify-center">
              {/* Outer screw-less bezel ring */}
              <div className="w-40 h-40 rounded-full border-2 border-[#F5F5F7] flex items-center justify-center">
                {/* Socket core face plate */}
                <div className="relative w-36 h-36 rounded-full bg-[#FAFAFA] border border-[#E5E5E7] flex flex-col justify-between p-6 shadow-inner">
                  {/* Top Grounding contact brass clip */}
                  <div className="w-4 h-2 bg-[#C8C8CC] mx-auto rounded-b-md border border-[#A1A1AA]" />
                  
                  {/* Two round power receptacle pins */}
                  <div className="flex justify-between px-4 my-2">
                    <div className="w-6 h-6 rounded-full bg-[#111111] border-b-2 border-r border-[#6E6E73] shadow-inner flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-black" />
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#111111] border-b-2 border-r border-[#6E6E73] shadow-inner flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-black" />
                    </div>
                  </div>

                  {/* Bottom Grounding contact brass clip */}
                  <div className="w-4 h-2 bg-[#C8C8CC] mx-auto rounded-t-md border border-[#A1A1AA]" />
                </div>
              </div>

              {/* Glowing LED Status Ring representing flow state */}
              <div className={`absolute inset-0 rounded-full border-2 transition-all duration-500 pointer-events-none ${
                isOff 
                  ? 'border-transparent' 
                  : isShed 
                  ? 'border-[#FFD60A] shadow-[0_0_15px_rgba(255,214,10,0.4)]' 
                  : 'border-[#30D158] shadow-[0_0_15px_rgba(48,209,88,0.4)] animate-pulse'
              }`} />
            </div>

            <div className="absolute bottom-3 left-4 text-[9px] font-mono text-[#6E6E73]">
              PLATE CHASSIS ID: OSC-{socket.id.toUpperCase()}
            </div>
            <div className="absolute bottom-3 right-4 text-[9px] font-mono text-[#30D158]">
              {socket.status}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3.5 mb-8 text-left">
            <div className="bg-[#F5F5F7] border border-[#E5E5E7] rounded-xl p-4">
              <span className="text-[9px] text-[#6E6E73] font-mono uppercase block mb-1">DEMAND</span>
              <span className="text-lg font-mono font-bold text-[#111111]">
                {isOff ? '0' : socket.power} W
              </span>
            </div>
            <div className="bg-[#F5F5F7] border border-[#E5E5E7] rounded-xl p-4">
              <span className="text-[9px] text-[#6E6E73] font-mono uppercase block mb-1">CURRENT</span>
              <span className="text-lg font-mono font-bold text-[#111111]">
                {isOff ? '0.00' : socket.current.toFixed(2)} A
              </span>
            </div>
            <div className="bg-[#F5F5F7] border border-[#E5E5E7] rounded-xl p-4">
              <span className="text-[9px] text-[#6E6E73] font-mono uppercase block mb-1">VOLTAGE</span>
              <span className="text-lg font-mono font-bold text-[#111111]">
                {isOff ? '0.0' : socket.voltage.toFixed(1)} V
              </span>
            </div>
          </div>

          {/* Active Interactive Sliders / Controls */}
          <div className="space-y-6">
            <span className="text-xs font-mono text-[#6E6E73] uppercase tracking-wider block border-b border-[#E5E5E7] pb-2">Load Simulation & Controls</span>
            
            {/* Simulate variable demand slider */}
            <div>
              <div className="flex justify-between items-center text-sm mb-2 font-sans text-[#111111]">
                <span className="font-semibold">Simulated Current Draw (W)</span>
                <span className="font-mono font-bold">{isOff ? '0' : socket.power}W <span className="text-[#6E6E73] font-normal">/ {socket.maxPower}W</span></span>
              </div>
              <input
                type="range"
                min="50"
                max={socket.maxPower}
                step="50"
                disabled={isOff}
                value={isOff ? 0 : socket.power}
                onChange={(e) => onUpdatePower(socket.id, parseInt(e.target.value))}
                className="w-full h-2 bg-[#E5E5E7] rounded-lg appearance-none cursor-pointer accent-[#0A84FF] disabled:opacity-50"
              />
              <span className="text-[10px] text-[#6E6E73] font-mono mt-1 block">Adjust to simulate device turning on/off or power surges.</span>
            </div>

            {/* Isolate Solid-State Relays Toggle */}
            <div className="flex items-center justify-between bg-[#F5F5F7] border border-[#E5E5E7] p-5 rounded-2xl">
              <div>
                <h4 className="font-bold text-[#111111] text-sm mb-1">Contact Relay Break</h4>
                <p className="text-xs text-[#6E6E73]">Manually isolate or re-connect the solid-state contacts.</p>
              </div>
              <button
                onClick={() => onToggleSocket(socket.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all flex items-center gap-1.5 ${
                  isOff
                    ? 'bg-[#30D158]/10 text-[#30D158] hover:bg-[#30D158]/15'
                    : 'bg-[#FF453A]/10 text-[#FF453A] hover:bg-[#FF453A]/15'
                }`}
              >
                <span>{isOff ? 'ENGAGE CONTACT' : 'ISOLATE RELAY'}</span>
              </button>
            </div>
          </div>

          {/* Recent Usage log */}
          <div className="mt-8">
            <span className="text-xs font-mono text-[#6E6E73] uppercase tracking-wider block mb-3">Diagnostic Usage Curve</span>
            <div className="flex items-end h-20 gap-1.5 px-3 py-1 bg-[#F5F5F7] border border-[#E5E5E7] rounded-2xl shadow-inner select-none">
              {socket.recentUsage.map((val, idx) => {
                const percent = Math.max(5, Math.round((val / socket.maxPower) * 100));
                return (
                  <div
                    key={idx}
                    className={`w-full rounded-t-sm transition-all duration-300 ${isOff ? 'bg-[#C8C8CC]' : 'bg-[#0A84FF]/75'}`}
                    style={{ height: `${isOff ? '5%' : `${percent}%`}` }}
                    title={`${val} Watts`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Diagnostic Footer */}
        <div className="mt-8 pt-4 border-t border-[#E5E5E7] text-[10px] font-mono text-[#6E6E73] flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-[#FFD60A]" />
          <span>Priority Matrix: Sockets will be shedded automatically if overload thresholds trigger.</span>
        </div>
      </motion.div>
    </div>
  );
}
