/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Network, Plus, Trash2, Check, HelpCircle, ArrowRight, Layers, Shuffle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function RuleBuilder({
  rules,
  sockets,
  onToggleRule,
  onAddRule,
  onDeleteRule,
}) {
  // New rule creation state
  const [sourceType, setSourceType] = useState('power');
  const [operator, setOperator] = useState('gt');
  const [value, setValue] = useState(3500);
  const [targetSocketId, setTargetSocketId] = useState(sockets[1]?.id || 's2');
  const [action, setAction] = useState('Pause');

  const handleCreateRule = () => {
    let description = '';
    const socketName = sockets.find(s => s.id === targetSocketId)?.name || 'Device';
    
    const sourceLabel = 
      sourceType === 'power' ? 'Total Demand' : 
      sourceType === 'temperature' ? 'Relay Temp' : 
      sourceType === 'battery' ? 'Battery Reserve' : 'Grid Voltage';

    const opLabel = operator === 'gt' ? '>' : operator === 'lt' ? '<' : '==';
    const unit = sourceType === 'power' ? 'W' : sourceType === 'temperature' ? '°C' : sourceType === 'battery' ? '%' : 'V';

    description = `IF ${sourceLabel} ${opLabel} ${value}${unit} THEN ${action} ${socketName}`;

    onAddRule({
      sourceType,
      operator,
      value,
      targetSocketId,
      action,
      enabled: true,
      description,
    });
  };

  return (
    <div className="bg-panel-orange-bg rounded-[24px] border border-panel-orange-border p-4 sm:p-8 shadow-sm transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-panel-orange-border pb-6 mb-8 gap-4">
        <div>
          <span className="text-[#7A604D] font-mono text-[11px] font-semibold uppercase tracking-wider mb-1 block">Dynamic Protection Matrices</span>
          <h2 className="text-2xl font-semibold text-[#422C1A] tracking-tight">Logical Node Rule Engine</h2>
        </div>
        <div className="flex items-center gap-2 bg-white/60 px-3.5 py-1.5 rounded-[16px] border border-panel-orange-border text-xs font-mono text-[#7A604D] w-fit">
          <Network className="w-4 h-4 text-[#FF9500]" />
          <span>Real-time Logic Gate Loop Time: ~4.2ms</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ACTIVE RULE STACK (Visual Node Blocks) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <span className="text-xs font-mono text-[#7A604D] uppercase tracking-wider block">Currently Running Logical Gates</span>

          <div className="space-y-4">
            {rules.map((rule) => {
              const socket = sockets.find(s => s.id === rule.targetSocketId);
              return (
                <div 
                  key={rule.id}
                  className={`relative border rounded-[20px] p-4 sm:p-5 bg-white transition-all duration-300 ${
                    rule.enabled 
                      ? 'border-panel-orange-border shadow-sm' 
                      : 'border-panel-orange-border/60 opacity-60 bg-panel-orange-bg/40'
                  }`}
                >
                  {/* Rule Header */}
                  <div className="flex items-center justify-between mb-4 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${rule.enabled ? 'bg-[#30D158] animate-pulse' : 'bg-[#8E8E93]'}`} />
                      <span className="text-[10px] font-mono text-[#7A604D] uppercase truncate">LOGIC GATE • {rule.sourceType.toUpperCase()} MONITOR</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Enable Switch */}
                      <button
                        onClick={() => onToggleRule(rule.id)}
                        className={`w-10 h-6 rounded-full p-0.5 transition-all duration-200 flex items-center ${
                          rule.enabled ? 'bg-[#30D158] justify-end' : 'bg-[#E5E5E7] justify-start'
                        }`}
                      >
                        <span className="w-5 h-5 bg-white rounded-full shadow-md" />
                      </button>

                      {/* Delete */}
                      <button 
                        onClick={() => onDeleteRule(rule.id)}
                        className="text-[#7A604D] hover:text-[#FF453A] p-1 rounded-lg hover:bg-[#FAF5F0]/60 transition-all"
                        title="Delete Rule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Flow Diagram Representation inside rule card */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-[11px] sm:text-xs select-none">
                    {/* IF Block */}
                    <div className="bg-[#422C1A] text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-[12px] border border-[#ECDCCB] font-bold">
                      IF
                    </div>

                    {/* Sensor Pill */}
                    <div className="bg-[#FAF5F0] border border-[#ECDCCB] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-[12px] text-[#422C1A] font-semibold">
                      {rule.sourceType === 'power' && '⚡ Total Demand'}
                      {rule.sourceType === 'temperature' && '🌡️ Relay Temperature'}
                      {rule.sourceType === 'battery' && '🔋 Battery State'}
                      {rule.sourceType === 'voltage' && '🔌 Line Voltage'}
                    </div>

                    {/* Operator Pill */}
                    <div className="bg-[#FF9500]/10 text-[#FF9500] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-[12px] font-bold">
                      {rule.operator === 'gt' ? '>' : rule.operator === 'lt' ? '<' : '=='}
                    </div>

                    {/* Value Pill */}
                    <div className="bg-white border border-[#ECDCCB] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-[12px] text-[#422C1A] font-bold">
                      {rule.value} {rule.sourceType === 'power' ? 'W' : rule.sourceType === 'temperature' ? '°C' : rule.sourceType === 'battery' ? '%' : 'V'}
                    </div>

                    <ArrowRight className="w-4 h-4 text-[#7A604D] shrink-0" />

                    {/* THEN Block */}
                    <div className="bg-[#30D158]/10 text-[#30D158] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-[12px] font-extrabold">
                      THEN
                    </div>

                    {/* Action */}
                    <div className="bg-[#FF453A]/10 text-[#FF453A] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-[12px] font-bold">
                      {rule.action}
                    </div>

                    {/* Target */}
                    <div className="bg-panel-orange-bg border border-panel-orange-border px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-[12px] text-[#422C1A] font-semibold">
                      {socket?.name || 'Device'}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: RULE CONSTRUCTOR PANEL */}
        <div className="lg:col-span-5 bg-white/60 border border-panel-orange-border rounded-[24px] p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="w-5 h-5 text-[#FF9500]" />
            <h3 className="text-lg font-bold text-[#422C1A]">Logic Node Constructor</h3>
          </div>
          <p className="text-xs text-[#7A604D] mb-6 leading-relaxed">
            Construct high-precision safety and automation logic by wiring sensor readings directly to relay commands.
          </p>

          <div className="space-y-4">
            {/* Source Sensor Parameter */}
            <div>
              <label className="block text-[10px] font-mono text-[#7A604D] uppercase mb-1.5">1. SENSOR PARAMETER SOURCE</label>
              <select
                value={sourceType}
                onChange={(e) => {
                  const type = e.target.value;
                  setSourceType(type);
                  // Auto fill appropriate defaults for convenience
                  if (type === 'power') setValue(4000);
                  else if (type === 'temperature') setValue(55);
                  else if (type === 'battery') setValue(30);
                  else if (type === 'voltage') setValue(245);
                }}
                className="w-full bg-white border border-panel-orange-border rounded-[12px] px-4 py-2.5 text-sm text-[#422C1A] font-sans focus:outline-none focus:ring-2 focus:ring-[#FF9500]"
              >
                <option value="power">⚡ Total Power Load (Watts)</option>
                <option value="temperature">🌡️ Relay Temperature (°C)</option>
                <option value="battery">🔋 Battery Capacity (%)</option>
                <option value="voltage">🔌 Utility Voltage (V)</option>
              </select>
            </div>

            {/* Operator and Target Value */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-[10px] font-mono text-[#7A604D] uppercase mb-1.5">OPERATOR</label>
                <select
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  className="w-full bg-white border border-panel-orange-border rounded-[12px] px-3 py-2.5 text-sm text-[#422C1A] font-mono focus:outline-none focus:ring-2 focus:ring-[#FF9500]"
                >
                  <option value="gt">&gt; (Greater Than)</option>
                  <option value="lt">&lt; (Less Than)</option>
                  <option value="eq">== (Equals)</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-mono text-[#7A604D] uppercase mb-1.5">THRESHOLD VALUE</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-panel-orange-border rounded-[12px] px-4 py-2.5 text-sm text-[#422C1A] font-mono focus:outline-none focus:ring-2 focus:ring-[#FF9500]"
                />
              </div>
            </div>

            {/* Target Action */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-[#7A604D] uppercase mb-1.5">2. COMMAND ACTION</label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full bg-white border border-panel-orange-border rounded-[12px] px-3 py-2.5 text-sm text-[#422C1A] focus:outline-none focus:ring-2 focus:ring-[#FF9500]"
                >
                  <option value="Pause">⏸️ Pause / Shed Load</option>
                  <option value="Resume">▶️ Resume / Connect</option>
                  <option value="Trip">🛑 Complete Isolation Trip</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#7A604D] uppercase mb-1.5">3. TARGET MODULE</label>
                <select
                  value={targetSocketId}
                  onChange={(e) => setTargetSocketId(e.target.value)}
                  className="w-full bg-white border border-panel-orange-border rounded-[12px] px-3 py-2.5 text-sm text-[#422C1A] focus:outline-none focus:ring-2 focus:ring-[#FF9500]"
                >
                  {sockets.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleCreateRule}
              className="w-full bg-[#422C1A] text-white py-3 rounded-[12px] text-sm font-semibold hover:bg-black transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Plus className="w-4 h-4" />
              <span>Compile & Wire Logic Node</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
