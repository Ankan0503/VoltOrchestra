/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Zap, Power, AlertTriangle, CheckCircle2, Cpu, Heart, Thermometer, Activity } from 'lucide-react';

export default function DigitalTwin({
  sockets,
  relay,
  selectedSocketId,
  onSelectSocket,
  onToggleSocket,
  gridFrequency,
}) {

  const totalLoadKW = (relay.power / 1000).toFixed(2);
  const maxCapacityKW = (relay.maxCapacity / 1000).toFixed(2);
  const capacityPercent = Math.min(100, Math.round((relay.power / relay.maxCapacity) * 100));

  // Count active appliances
  const activeAppliancesCount = sockets.filter(s => s.status === 'Active').length;

  // Friendly icons representing appliances
  const getApplianceEmoji = (id) => {
    switch (id) {
      case 's1': return '❄️'; // Climate
      case 's2': return '🚗'; // EV
      case 's3': return '🍳'; // Kitchen
      case 's4': return '🌐'; // Router
      default: return '🔌';
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. SINGLE UNIFIED DASHBOARD ON TOP */}
      <div className="bg-panel-blue-bg rounded-[28px] border border-panel-blue-border p-6 sm:p-8 shadow-sm transition-all duration-300">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-panel-blue-border pb-5 mb-6">
          <div>
            <span className="text-[10px] bg-[#0A84FF]/10 text-[#0A84FF] px-3 py-1 rounded-full font-mono font-bold tracking-wider uppercase">
              System Core Hub
            </span>
            <h2 className="text-xl font-bold text-[#1F2C42] mt-2 tracking-tight">Main Power & Grid Dashboard</h2>
          </div>
          <div className="flex items-center gap-2 bg-white/90 px-3.5 py-1.5 rounded-xl border border-panel-blue-border text-xs text-[#5C6E85] font-semibold">
            <Cpu className="w-4 h-4 text-[#0A84FF]" />
            <span>Grid Quality: <strong className="text-[#1F2C42]">98% (Stable)</strong></span>
          </div>
        </div>

        {/* Safety Trip Banner if Tripped */}
        {relay.status === 'Tripped' && (
          <div className="bg-[#FF453A]/10 border border-[#FF453A]/30 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-10 h-10 rounded-full bg-[#FF453A]/15 flex items-center justify-center text-[#FF453A] shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#FF453A] text-sm">Main Safety Breaker Tripped!</h4>
                <p className="text-xs text-[#FF453A]/85 mt-0.5">Total electricity demand exceeded 5.0 kW. Reset below to restore power.</p>
              </div>
            </div>
            <button
              onClick={() => onToggleSocket('MAIN_RELAY')}
              className="px-5 py-2.5 bg-[#FF453A] hover:bg-[#FF453A]/90 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0 active:scale-95"
            >
              <Power className="w-3.5 h-3.5" />
              <span>Reset & Restore Power</span>
            </button>
          </div>
        )}

        {/* 4-Column Responsive Dashboard Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Column 1: Total Power Meter */}
          <div className="bg-white/90 rounded-2xl p-4.5 border border-panel-blue-border flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-[#5C6E85] font-mono uppercase block mb-1">Total Power Draw</span>
              <span className="text-2xl font-mono font-extrabold text-[#1F2C42]">
                {totalLoadKW} <span className="text-sm font-normal text-[#5C6E85]">kW</span>
              </span>
            </div>
            {/* Visual Power Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[9px] text-[#5C6E85] font-mono mb-1">
                <span>Usage Load</span>
                <span>{capacityPercent}%</span>
              </div>
              <div className="w-full bg-[#F5F5F7] h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    capacityPercent > 85 ? 'bg-[#FF453A]' : capacityPercent > 65 ? 'bg-[#FF9500]' : 'bg-[#0A84FF]'
                  }`}
                  style={{ width: `${capacityPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Column 2: Main Breaker / Relay status */}
          <div className="bg-white/90 rounded-2xl p-4.5 border border-panel-blue-border flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-[#5C6E85] font-mono uppercase block mb-1">Grid Breaker Switch</span>
              <span className={`text-lg font-bold block ${relay.status === 'Tripped' ? 'text-[#FF453A]' : 'text-[#30D158]'}`}>
                {relay.status === 'Tripped' ? 'TRIPPED (ISOLATED)' : 'ACTIVE (PROTECTED)'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#5C6E85] font-mono mt-3 pt-2 border-t border-[#F5F5F7]">
              <span>Chassis Volts</span>
              <span className="font-bold text-[#1F2C42]">{relay.voltage.toFixed(1)} V AC</span>
            </div>
          </div>

          {/* Column 3: Safety Temperature */}
          <div className="bg-white/90 rounded-2xl p-4.5 border border-panel-blue-border flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-[#5C6E85] font-mono uppercase block mb-1">Cabinet Temperature</span>
              <span className="text-2xl font-mono font-extrabold text-[#1F2C42] flex items-center gap-1.5">
                <Thermometer className="w-5 h-5 text-[#FF9500]" />
                {relay.temperature.toFixed(1)} <span className="text-sm font-normal text-[#5C6E85]">°C</span>
              </span>
            </div>
            <div className="mt-3">
              <span className="text-[10px] text-[#30D158] font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#30D158]"></span>
                Healthy State (Safe limit 80°C)
              </span>
            </div>
          </div>

          {/* Column 4: Grid Frequency */}
          <div className="bg-white/90 rounded-2xl p-4.5 border border-panel-blue-border flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-[#5C6E85] font-mono uppercase block mb-1">Grid Phase Frequency</span>
              <span className="text-2xl font-mono font-extrabold text-[#1F2C42] flex items-center gap-1.5">
                <Activity className="w-5 h-5 text-[#0A84FF]" />
                {gridFrequency.toFixed(2)} <span className="text-sm font-normal text-[#5C6E85]">Hz</span>
              </span>
            </div>
            <div className="mt-3">
              <span className="text-[10px] text-[#5C6E85] font-mono">
                Load Shed Limit: <strong className="text-[#1F2C42]">{maxCapacityKW} kW</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MY SMART APPLIANCES */}
      <div className="bg-panel-blue-bg rounded-[28px] border border-panel-blue-border p-6 sm:p-8 shadow-sm transition-all duration-300 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-panel-blue-border pb-4 gap-3">
          <div>
            <h3 className="text-lg font-bold text-[#1F2C42] tracking-tight">My Smart Appliances</h3>
            <p className="text-xs text-[#5C6E85]">Tap an appliance to run real-time hardware diagnostics & adjust loads.</p>
          </div>
          <span className="bg-white/85 border border-panel-blue-border text-[#1F2C42] px-3 py-1 rounded-full text-xs font-mono font-bold w-fit">
            {activeAppliancesCount} / {sockets.length} ONLINE
          </span>
        </div>

        {/* Expansive, 4-column layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sockets.map((socket) => {
            const isSelected = selectedSocketId === socket.id;
            const isShed = socket.status === 'Shed';
            const isOff = socket.status === 'Off';

            return (
              <div
                key={socket.id}
                onClick={() => onSelectSocket(socket.id)}
                className={`relative bg-white border p-5 rounded-[22px] cursor-pointer transition-all duration-300 select-none hover:shadow-md group flex flex-col justify-between h-44 ${
                  isSelected 
                    ? 'border-[#0A84FF] ring-4 ring-[#0A84FF]/8 shadow-sm' 
                    : isShed
                    ? 'border-[#FF9500] bg-[#FF9500]/5'
                    : isOff
                    ? 'border-[#E5E5E7] opacity-65 bg-gray-50/50'
                    : 'border-[#E5E5E7]'
                }`}
              >
                <div>
                  {/* Header: Icon & Status Dot */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl" role="img" aria-label={socket.name}>
                        {getApplianceEmoji(socket.id)}
                      </span>
                      <div>
                        <h4 className="font-bold text-[#1F2C42] text-[14px] leading-snug tracking-tight group-hover:text-[#0A84FF] transition-colors">
                          {socket.name.split(' (')[0]}
                        </h4>
                        <span className="text-[9px] text-gray-400 block font-mono">{socket.type}</span>
                      </div>
                    </div>

                    {/* Status indicator pill */}
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase shrink-0 ${
                      isOff 
                        ? 'bg-gray-100 text-gray-500' 
                        : isShed 
                        ? 'bg-[#FF9500]/15 text-[#FF9500]' 
                        : 'bg-[#30D158]/15 text-[#30D158]'
                    }`}>
                      {isOff ? 'Off' : isShed ? 'AI Paused' : 'Running'}
                    </span>
                  </div>

                  {/* Middle: Power reading & priority */}
                  <div className="flex justify-between items-center mt-3">
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase block font-mono">Live Draw</span>
                      <span className="text-lg font-mono font-extrabold text-[#1F2C42]">
                        {isOff ? '0' : socket.power} <span className="text-xs font-normal text-gray-500">W</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] text-gray-400 uppercase block font-mono">Priority</span>
                      <span className={`text-[10px] font-bold font-sans ${
                        socket.priority === 'Critical' 
                          ? 'text-[#FF453A]' 
                          : socket.priority === 'High'
                          ? 'text-[#FF9500]'
                          : 'text-gray-500'
                      }`}>
                        {socket.priority}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom: Toggle button & Health bar */}
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between mt-auto">
                  {/* Tiny Health meter */}
                  <div className="flex items-center gap-1 text-[10px] text-gray-500">
                    <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 shrink-0" />
                    <span>{socket.health}%</span>
                  </div>

                  {/* Beautiful Apple-like Toggle Switch Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSocket(socket.id);
                    }}
                    className="p-1 px-3 rounded-full flex items-center gap-1.5 transition-all duration-300 font-bold text-[9px] font-mono border active:scale-90"
                    style={{
                      backgroundColor: isOff ? '#F5F5F7' : '#30D158',
                      borderColor: isOff ? '#E5E5E7' : '#30D158',
                      color: isOff ? '#6E6E73' : '#FFFFFF',
                    }}
                  >
                    <Power className="w-2.5 h-2.5" />
                    <span>{isOff ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic friendly instructions */}
      <div className="border-t border-panel-blue-border pt-4 mt-6 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#5C6E85] gap-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#30D158]" />
          <span>Smart Grid Assistant: <strong className="text-[#1F2C42]">Load-Balancing Active & Protecting Circuit</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#30D158] animate-pulse"></span>
          <span>Automatic safety triggers active</span>
        </div>
      </div>
    </div>
  );
}
