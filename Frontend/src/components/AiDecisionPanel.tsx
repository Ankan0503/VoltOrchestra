/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Eye, ShieldCheck, Cpu, Terminal, ArrowUpRight, Sparkles } from 'lucide-react';

interface AiDecisionPanelProps {
  totalLoad: number;
  maxCapacity: number;
  relayTripped: boolean;
  logs: string[];
}

export default function AiDecisionPanel({
  totalLoad,
  maxCapacity,
  relayTripped,
  logs,
}: AiDecisionPanelProps) {
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const [currentReasoningText, setCurrentReasoningText] = useState<string>('');

  // Scroll terminal logs to bottom when they change
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Forecast calculations
  const projectedLoad = relayTripped ? 0 : totalLoad * 1.15; // forecasted spikes
  const overloadRisk = relayTripped 
    ? 'None' 
    : totalLoad > maxCapacity * 0.9 
    ? 'High (95%)' 
    : totalLoad > maxCapacity * 0.75 
    ? 'Medium (55%)' 
    : 'Low (8%)';

  const getRiskColor = () => {
    if (relayTripped) return 'text-[#6E6E73]';
    if (totalLoad > maxCapacity * 0.9) return 'text-[#FF453A]';
    if (totalLoad > maxCapacity * 0.75) return 'text-[#FFD60A]';
    return 'text-[#30D158]';
  };

  return (
    <div className="bg-panel-blue-bg rounded-[24px] border border-panel-blue-border p-4 sm:p-6 shadow-sm h-full flex flex-col justify-between transition-all duration-300">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-panel-blue-border pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#0A84FF]" />
            <h3 className="text-lg font-semibold text-[#1F2C42] tracking-tight">AI Smart Assistant</h3>
          </div>
          <div className="flex items-center gap-1.5 bg-[#0A84FF]/10 text-[#0A84FF] px-2.5 py-1 rounded-full text-[10px] font-mono font-bold">
            <Sparkles className="w-3 h-3 text-[#0A84FF] animate-pulse" />
            <span>Assistant Active</span>
          </div>
        </div>

        {/* AI Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/80 rounded-[16px] p-4 border border-[#D5E4F5]">
            <span className="text-[10px] text-[#5C6E85] font-mono uppercase block mb-1">Estimated Peak</span>
            <span className="text-xl font-mono font-extrabold text-[#1F2C42]">
              {(projectedLoad / 1000).toFixed(2)} kW
            </span>
            <span className="text-[10px] text-[#5C6E85] font-mono block mt-1">Calculated trend</span>
          </div>

          <div className="bg-white/80 rounded-[16px] p-4 border border-[#D5E4F5]">
            <span className="text-[10px] text-[#5C6E85] font-mono uppercase block mb-1">Overload Risk</span>
            <span className={`text-md font-mono font-extrabold block uppercase ${getRiskColor()}`}>
              {overloadRisk}
            </span>
            <span className="text-[10px] text-[#5C6E85] font-mono block mt-1">Trip threat level</span>
          </div>
        </div>

        {/* Core Thinking reasoning - Looks like ChatGPT */}
        <div className="mb-6">
          <span className="text-xs font-mono text-[#5C6E85] uppercase tracking-wider block mb-2">Smart Assistant Observations</span>
          <div className="bg-white/60 rounded-[16px] p-5 border border-[#D5E4F5]/60 leading-relaxed text-[#1F2C42] text-sm font-sans space-y-3.5">
            <div className="flex gap-2 items-start">
              <span className="text-[#0A84FF] font-mono text-xs font-bold mt-1">●</span>
              <p>
                <strong className="text-xs font-mono uppercase block text-[#5C6E85] mb-0.5">Current Status</strong>
                Watching 4 smart appliances. Total demand is {totalLoad}W. Household voltage is stable and all lines are balanced.
              </p>
            </div>

            {totalLoad > maxCapacity * 0.8 && !relayTripped ? (
              <div className="flex gap-2 items-start">
                <span className="text-[#FF453A] font-mono text-xs font-bold mt-1">●</span>
                <p>
                  <strong className="text-xs font-mono uppercase block text-[#FF453A] mb-0.5">Overload Warning</strong>
                  Home electricity usage is high. The system is closely monitoring loads to see if low-priority appliances need to be paused.
                </p>
              </div>
            ) : null}

            <div className="flex gap-2 items-start">
              <span className="text-[#0A84FF] font-mono text-xs font-bold mt-1">●</span>
              <p>
                <strong className="text-xs font-mono uppercase block text-[#5C6E85] mb-0.5">Current Action</strong>
                {relayTripped ? (
                  <span className="text-[#FF453A]">Power is currently safety-tripped. Please click 'Reset' in the Smart Appliance Controls to restore.</span>
                ) : totalLoad > maxCapacity * 0.8 ? (
                  <span>
                    Temporarily **pausing** low-priority devices (like the Electric Vehicle Charger) to prevent the main circuit breaker from tripping.
                  </span>
                ) : (
                  <span>All appliances are running safely under the 5.0 kW limit. No action is required.</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time thinking log output */}
      <div>
        <div className="flex items-center justify-between text-xs font-mono text-[#5C6E85] mb-2 uppercase">
          <div className="flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>Assistant Activity Log</span>
          </div>
          <span>Active</span>
        </div>

        <div 
          ref={terminalContainerRef}
          className="bg-[#09090B] rounded-[16px] p-4 border border-[#27272A] h-48 overflow-y-auto font-mono text-xs text-[#E5E5E7] flex flex-col gap-2 shadow-inner"
        >
          {logs.map((log, index) => {
            const isWarning = log.includes('tripped') || log.includes('exceeded') || log.includes('high') || log.includes('high') || log.includes('Overload') || log.includes('Alert') || log.includes('Pause');
            const isSuccess = log.includes('stable') || log.includes('operating') || log.includes('running') || log.includes('restored') || log.includes('optimal') || log.includes('Success') || log.includes('balanced');
            return (
              <div 
                key={index} 
                className={`border-b border-[#1E1E24]/30 pb-1.5 leading-relaxed ${
                  isWarning ? 'text-[#FFD60A]' : isSuccess ? 'text-[#30D158]' : 'text-[#A1A1AA]'
                }`}
              >
                <span className="text-[#52525B] mr-2">[{log.slice(0, 8)}]</span>
                <span>{log.slice(9)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
