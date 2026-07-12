/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SocketData } from '../types';
import { Heart, ShieldAlert, Activity, CheckCircle2, ChevronRight, ActivitySquare } from 'lucide-react';

interface AppleHealthPredictionProps {
  sockets: SocketData[];
  onSelectSocket: (id: string) => void;
}

export default function AppleHealthPrediction({
  sockets,
  onSelectSocket,
}: AppleHealthPredictionProps) {
  return (
    <div className="bg-panel-rose-bg rounded-[24px] border border-panel-rose-border p-8 shadow-sm transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-panel-rose-border pb-6 mb-8 gap-4">
        <div>
          <span className="text-[#9F1239] font-mono text-xs uppercase tracking-wider mb-1 block">Predictive Maintenance AI</span>
          <h2 className="text-2xl font-semibold text-[#4C0519] tracking-tight">Electrical Component Health & Diagnostics</h2>
        </div>

        <div className="flex items-center gap-1.5 bg-[#30D158]/10 text-[#30D158] px-3.5 py-1.5 rounded-[16px] border border-[#30D158]/20 text-xs font-mono font-bold">
          <Heart className="w-4 h-4 text-[#30D158] animate-pulse" />
          <span>Overall System Index: 91% Healthy</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sockets.map((socket) => {
          const isCritical = socket.health < 70;
          const isWarning = socket.health >= 70 && socket.health < 90;

          return (
            <div
              key={socket.id}
              onClick={() => onSelectSocket(socket.id)}
              className="bg-white/80 hover:bg-white rounded-[20px] border border-panel-rose-border p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between h-48 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] text-[#6E6E73] font-mono uppercase tracking-wider">UNIT {socket.id.toUpperCase()}</span>
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center border border-[#E5E5E7] text-[#6E6E73] group-hover:text-[#0A84FF] transition-all">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <h3 className="font-bold text-[#111111] text-base mb-1 tracking-tight">{socket.name}</h3>
                <span className="text-xs text-[#6E6E73] font-sans block mb-4">{socket.type}</span>
              </div>

              <div>
                {/* Health indicator */}
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-xs font-mono text-[#6E6E73]">COMPONENT HEALTH</span>
                  <span className={`text-md font-mono font-bold ${
                    isCritical ? 'text-[#FF453A]' : isWarning ? 'text-[#FFD60A]' : 'text-[#30D158]'
                  }`}>
                    {socket.health}%
                  </span>
                </div>

                {/* Micro progress line */}
                <div className="w-full bg-white h-1.5 rounded-full overflow-hidden mb-3 border border-[#E5E5E7]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCritical ? 'bg-[#FF453A]' : isWarning ? 'bg-[#FFD60A]' : 'bg-[#30D158]'
                    }`}
                    style={{ width: `${socket.health}%` }}
                  />
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#6E6E73]">
                  {isCritical ? (
                    <ShieldAlert className="w-3.5 h-3.5 text-[#FF453A]" />
                  ) : isWarning ? (
                    <ShieldAlert className="w-3.5 h-3.5 text-[#FFD60A]" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#30D158]" />
                  )}
                  <span className="truncate" title={socket.failurePrediction}>
                    {socket.failurePrediction} (~{socket.daysToFailure}d)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
