/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DollarSign, ArrowUpRight, TrendingDown, ArrowDownRight, Award } from 'lucide-react';

interface EnergyCostSectionProps {
  totalLoad: number;
}

export default function EnergyCostSection({ totalLoad }: EnergyCostSectionProps) {
  // Mock pricing calculations (Rupees as requested by user template)
  const ratePerKwh = 7.50; // INR
  const todayUsageKwh = 12.4;
  const yesterdayUsageKwh = 14.8;
  const todayCost = Math.round(todayUsageKwh * ratePerKwh);
  const yesterdayCost = Math.round(yesterdayUsageKwh * ratePerKwh);
  const monthCost = 1042;

  return (
    <div className="bg-panel-green-bg rounded-[24px] border border-panel-green-border p-8 shadow-sm transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-panel-green-border pb-6 mb-8 gap-4">
        <div>
          <span className="text-[#4A6B54] font-mono text-xs uppercase tracking-wider mb-1 block">Financial Auditing</span>
          <h2 className="text-2xl font-semibold text-[#1F3D2B] tracking-tight">Utility Tariffs & Live Energy Billing</h2>
        </div>

        <div className="flex items-center gap-1.5 bg-[#30D158]/10 text-[#30D158] px-3.5 py-1.5 rounded-[16px] border border-[#30D158]/20 text-xs font-mono font-bold">
          <TrendingDown className="w-4 h-4 text-[#30D158]" />
          <span>Active Tariff: Off-Peak (Base rate ₹{ratePerKwh.toFixed(2)} / kWh)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Today's Spend Card */}
        <div className="bg-white/80 border border-panel-green-border rounded-[20px] p-6 flex flex-col justify-between h-44 hover:shadow-sm transition-all">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] text-[#4A6B54] font-mono uppercase tracking-wider">TODAY'S ESTIMATE</span>
              <span className="text-[10px] text-[#30D158] font-mono flex items-center gap-0.5 font-bold">
                <ArrowDownRight className="w-3 h-3" />
                -16.2%
              </span>
            </div>
            <div className="text-3xl font-mono font-extrabold text-[#1F3D2B]">₹{todayCost}</div>
          </div>
          <div className="text-[10px] font-mono text-[#4A6B54] border-t border-panel-green-border pt-3 flex justify-between">
            <span>CONSUMED</span>
            <span>{todayUsageKwh.toFixed(1)} kWh today</span>
          </div>
        </div>

        {/* Yesterday's Spend Card */}
        <div className="bg-white/80 border border-panel-green-border rounded-[20px] p-6 flex flex-col justify-between h-44 hover:shadow-sm transition-all">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] text-[#4A6B54] font-mono uppercase tracking-wider">YESTERDAY'S ACCUMULATION</span>
              <span className="text-[10px] text-[#FF453A] font-mono flex items-center gap-0.5 font-bold">
                <ArrowUpRight className="w-3 h-3" />
                +8.1%
              </span>
            </div>
            <div className="text-3xl font-mono font-extrabold text-[#1F3D2B]">₹{yesterdayCost}</div>
          </div>
          <div className="text-[10px] font-mono text-[#4A6B54] border-t border-panel-green-border pt-3 flex justify-between">
            <span>CONSUMED</span>
            <span>{yesterdayUsageKwh.toFixed(1)} kWh yesterday</span>
          </div>
        </div>

        {/* Monthly Projection Card */}
        <div className="bg-white/80 border border-panel-green-border rounded-[20px] p-6 flex flex-col justify-between h-44 hover:shadow-sm transition-all">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] text-[#4A6B54] font-mono uppercase tracking-wider">MONTH TO DATE</span>
              <span className="text-[10px] text-[#30D158] font-mono flex items-center gap-1 font-bold uppercase">
                <Award className="w-3.5 h-3.5" />
                On Track
              </span>
            </div>
            <div className="text-3xl font-mono font-extrabold text-[#1F3D2B]">₹{monthCost}</div>
          </div>
          <div className="text-[10px] font-mono text-[#4A6B54] border-t border-panel-green-border pt-3 flex justify-between">
            <span>PREDICTION</span>
            <span>Est. ₹1,480 total by cycle end</span>
          </div>
        </div>

      </div>
    </div>
  );
}
