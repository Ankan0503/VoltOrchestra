/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckCircle2, Shield, Sparkles, TrendingDown, Lightbulb, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EnergySavingTipsProps {
  totalLoad: number;
  relayStatus: string;
  temperature: number;
  renderAdvancedOscilloscope: () => React.ReactNode;
}

export default function EnergySavingTips({
  totalLoad,
  relayStatus,
  temperature,
  renderAdvancedOscilloscope,
}: EnergySavingTipsProps) {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Active home safety checklist items
  const isHealthy = relayStatus === 'Active';

  const tips = [
    {
      title: "Optimize Your EV Charging",
      text: "Charge your electric vehicle between 11 PM and 6 AM. This lowers grid congestion and takes advantage of off-peak renewable solar/wind energy.",
      icon: "🚗"
    },
    {
      title: "Eco-Friendly Climate Tips",
      text: "Adjusting your living room thermostat by just 1°C can reduce your climate control energy bill by up to 10% per day.",
      icon: "❄️"
    },
    {
      title: "Use Residual Oven Heat",
      text: "You can turn off your kitchen oven 5 minutes before the timer ends. The trapped residual heat will complete the cooking and save power.",
      icon: "🍳"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Friendly Overview Card */}
      <div className="bg-white rounded-[24px] border border-[#E5E5E7] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b border-[#F5F5F7] pb-4">
          <Shield className="w-5 h-5 text-[#30D158]" />
          <h3 className="text-lg font-semibold text-[#111111] tracking-tight">Your Home Power Health</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Interactive Checklist */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Current Safety Checklist</h4>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                {isHealthy ? (
                  <CheckCircle2 className="w-5 h-5 text-[#30D158] shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-[#FF453A] shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="text-sm font-semibold text-[#111111]">
                    {isHealthy ? "Main Breaker: Safe & Connected" : "Main Breaker: Power Tripped"}
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isHealthy ? "All electrical lines are operating under safe temperature limits." : "System tripped to protect your appliance circuits."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#30D158] shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm font-semibold text-[#111111]">AI Automated Guard: Active</span>
                  <p className="text-xs text-gray-500 mt-0.5">Watching appliances and pausing loads to prevent blackouts.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#30D158] shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm font-semibold text-[#111111]">Safety Rules: Fully Armed</span>
                  <p className="text-xs text-gray-500 mt-0.5">Custom overload protections and temperature safety limits active.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Actions / Savings Tips */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-[#FFD60A]" />
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Smart Savings Tips</h4>
            </div>

            <div className="space-y-3.5">
              {tips.slice(0, 2).map((tip, idx) => (
                <div key={idx} className="bg-[#F5F5F7] rounded-xl p-3.5 border border-[#E5E5E7]/60 flex gap-3 items-start">
                  <span className="text-xl shrink-0">{tip.icon}</span>
                  <div>
                    <h5 className="text-xs font-bold text-[#111111]">{tip.title}</h5>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{tip.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Collapsible toggle for Advanced Techy Oscilloscope */}
        <div className="border-t border-[#F5F5F7] mt-6 pt-4 flex justify-center">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-semibold text-[#0A84FF] hover:text-[#0A84FF]/85 flex items-center gap-1.5 transition-all py-1 px-3 rounded-lg hover:bg-[#0A84FF]/5"
          >
            {showAdvanced ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Hide Advanced Voltage Waveforms</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>Show Advanced Live Waveform Diagnostics</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Waveform Drawer */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {renderAdvancedOscilloscope()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
