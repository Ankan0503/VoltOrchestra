/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Power, AlertTriangle, Thermometer, Activity } from 'lucide-react';

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
          <h2 className="text-lg font-bold text-[#1F2C42] tracking-tight">Dashboard</h2>
          <div className="flex items-center gap-3 text-xs text-[#5C6E85]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#30D158]"></span>
              Grid Stable
            </span>
            <span className="text-gray-300">·</span>
            <span>{relay.voltage.toFixed(0)}V AC</span>
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
          <h3 className="text-lg font-bold text-[#1F2C42] tracking-tight">Smart Appliances</h3>
          <span className="bg-white/85 border border-panel-blue-border text-[#1F2C42] px-3 py-1 rounded-full text-xs font-mono font-bold w-fit">
            {activeAppliancesCount}/{sockets.length} Online
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {sockets.map((socket) => {
            const isSelected = selectedSocketId === socket.id;
            const isShed = socket.status === 'Shed';
            const isOff = socket.status === 'Off';

            return (
              <div
                key={socket.id}
                onClick={() => onSelectSocket(socket.id)}
                className={`relative bg-white border p-4 rounded-[20px] cursor-pointer transition-all duration-300 select-none hover:shadow-md group ${
                  isSelected
                    ? 'border-[#0A84FF] ring-3 ring-[#0A84FF]/10 shadow-sm'
                    : isShed
                    ? 'border-[#FF9500] bg-[#FF9500]/5'
                    : isOff
                    ? 'border-[#E5E5E7] opacity-60 bg-gray-50/50'
                    : 'border-[#E5E5E7]'
                }`}
              >
                {/* Top: emoji + name + toggle */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl" role="img" aria-label={socket.name}>
                      {getApplianceEmoji(socket.id)}
                    </span>
                    <div>
                      <h4 className="font-bold text-[#1F2C42] text-sm leading-tight group-hover:text-[#0A84FF] transition-colors">
                        {socket.name.split(' (')[0]}
                      </h4>
                      <span className={`text-[9px] font-mono font-bold uppercase ${
                        isOff ? 'text-gray-400' : isShed ? 'text-[#FF9500]' : 'text-[#30D158]'
                      }`}>
                        {isOff ? 'Off' : isShed ? 'Paused' : 'Running'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSocket(socket.id);
                    }}
                    className="p-1.5 px-2.5 rounded-full flex items-center gap-1 transition-all duration-300 font-bold text-[9px] font-mono border active:scale-90"
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

                {/* Power draw */}
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-[9px] text-gray-400 uppercase block font-mono">Draw</span>
                    <span className="text-xl font-mono font-extrabold text-[#1F2C42]">
                      {isOff ? '0' : socket.power} <span className="text-xs font-normal text-gray-400">W</span>
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold ${
                    socket.priority === 'Critical' ? 'text-[#FF453A]'
                    : socket.priority === 'High' ? 'text-[#FF9500]'
                    : 'text-gray-400'
                  }`}>
                    {socket.priority}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Grid Assistant status */}
      <div className="flex items-center gap-2 text-xs text-[#5C6E85] pt-2">
        <Shield className="w-3.5 h-3.5 text-[#30D158]" />
        <span>Auto load-balancing active</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#30D158] animate-pulse"></span>
      </div>
    </div>
  );
}
