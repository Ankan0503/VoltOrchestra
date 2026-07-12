/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bell, AlertTriangle, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AlertsPanel({
  alerts,
  onDismissAlert,
  onClearAll,
}) {
  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="bg-panel-blue-bg rounded-[24px] border border-panel-blue-border p-4 sm:p-8 shadow-sm h-full flex flex-col justify-between transition-all duration-300">
      <div>
        <div className="flex justify-between items-center border-b border-panel-blue-border pb-5 mb-6">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-[#0A84FF]" />
            <h3 className="text-lg font-semibold text-[#1F2C42] tracking-tight">Active Safeguard Alerts</h3>
          </div>
          {alerts.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs font-mono font-semibold text-[#5C6E85] hover:text-[#1F2C42] transition-all"
            >
              Clear All Logs
            </button>
          )}
        </div>

        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-[#30D158]/10 flex items-center justify-center text-[#30D158] mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-[#1F2C42] text-sm tracking-tight mb-1">System Completely Stable</h4>
            <p className="text-xs text-[#5C6E85] max-w-xs leading-relaxed">
              No relay warnings or overload conditions detected in the active safety stack.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {alerts.map((alert) => {
                const isWarning = alert.type === 'warning';
                const isSuccess = alert.type === 'success';

                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                    className="relative bg-[#F5F5F7] border border-[#E5E5E7] p-4 rounded-[16px] flex gap-3.5 items-start group hover:shadow-sm transition-all duration-200"
                  >
                    <div className="shrink-0 mt-0.5">
                      {isWarning ? (
                        <AlertTriangle className="w-4.5 h-4.5 text-[#FFD60A]" />
                      ) : isSuccess ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-[#30D158]" />
                      ) : (
                        <Bell className="w-4.5 h-4.5 text-[#0A84FF]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-bold text-xs text-[#111111] tracking-tight truncate">{alert.title}</h4>
                        <span className="text-[9px] font-mono text-[#6E6E73] shrink-0">{alert.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-[#6E6E73] leading-relaxed font-sans">{alert.description}</p>
                    </div>

                    <button
                      onClick={() => onDismissAlert(alert.id)}
                      className="text-[#6E6E73] hover:text-[#111111] opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-md hover:bg-[#E5E5E7] absolute top-3 right-3"
                      title="Dismiss Alert"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="border-t border-[#E5E5E7] pt-4 mt-6 text-[10px] font-mono text-[#6E6E73] flex items-center justify-between">
        <span>Safeguard Loop: Active</span>
        <span>Unread: {unreadCount}</span>
      </div>
    </div>
  );
}
