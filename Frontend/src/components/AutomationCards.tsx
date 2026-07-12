/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ToggleLeft, Moon, Sun, ShieldAlert, Zap, Award, Sparkles } from 'lucide-react';

interface AutomationCardsProps {
  currentMode: string;
  adaptiveProtection: boolean;
  onToggleMode: (mode: any) => void;
  onToggleAdaptive: () => void;
}

export default function AutomationCards({
  currentMode,
  adaptiveProtection,
  onToggleMode,
  onToggleAdaptive,
}: AutomationCardsProps) {
  
  const modes = [
    {
      id: 'Adaptive Protection',
      title: 'Adaptive Protection',
      description: 'AI actively monitors harmonics and automatically sheds low-priority loads to avoid physical relay trips.',
      icon: ShieldAlert,
      color: 'border-[#30D158] text-[#30D158] bg-[#30D158]/5',
    },
    {
      id: 'Peak Shaving',
      title: 'Peak Shaving',
      description: 'Limits total aggregate consumption to 3.5kW during grid tariff peaks to save utility costs.',
      icon: Zap,
      color: 'border-[#0A84FF] text-[#0A84FF] bg-[#0A84FF]/5',
    },
    {
      id: 'Eco Orchestration',
      title: 'Eco Orchestration',
      description: 'Prioritizes internal solar reserves and schedules heavy tasks (EV Charging) during high solar generation.',
      icon: Sparkles,
      color: 'border-[#FFD60A] text-[#FFD60A] bg-[#FFD60A]/5',
    },
  ];

  return (
    <div className="bg-panel-orange-bg rounded-[24px] border border-panel-orange-border p-8 shadow-sm transition-all duration-300">
      <div className="border-b border-panel-orange-border pb-6 mb-8">
        <span className="text-[#7A604D] font-mono text-xs uppercase tracking-wider mb-2 block">Orchestrator Automation Profiles</span>
        <h2 className="text-2xl font-semibold text-[#422C1A] tracking-tight">Home & Industrial Automation Presets</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modes.map((mode) => {
          const isActive = currentMode === mode.id;
          const Icon = mode.icon;

          return (
            <div
              key={mode.id}
              onClick={() => onToggleMode(mode.id)}
              className={`border p-6 rounded-[20px] cursor-pointer transition-all duration-300 flex flex-col justify-between h-56 hover:shadow-md ${
                isActive 
                  ? 'border-[#422C1A] bg-white ring-4 ring-[#422C1A]/5 scale-[1.01]' 
                  : 'border-panel-orange-border bg-white'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center border ${
                    isActive ? 'border-[#422C1A] bg-[#422C1A] text-white' : 'border-panel-orange-border bg-panel-orange-bg text-[#7A604D]'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  {/* Visual checkbox */}
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isActive ? 'border-[#30D158] bg-[#30D158]' : 'border-panel-orange-border'
                  }`}>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-[#422C1A] text-base mb-2 tracking-tight">{mode.title}</h3>
                <p className="text-xs text-[#7A604D] leading-relaxed">{mode.description}</p>
              </div>

              <div className="pt-4 border-t border-panel-orange-border/40 flex justify-between items-center text-[10px] font-mono text-[#7A604D]">
                <span>STATUS: {isActive ? 'ACTIVE' : 'STANDBY'}</span>
                {isActive && <span className="text-[#30D158] font-bold">OPTIMIZED RUNNING</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
