/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import DigitalTwin from './components/DigitalTwin';
import Oscilloscope from './components/Oscilloscope';
import AiDecisionPanel from './components/AiDecisionPanel';
import EnergySavingTips from './components/EnergySavingTips';
import RoomSimulator from './components/RoomSimulator';
import ThreeDPanel from './components/ThreeDPanel';
import RuleBuilder from './components/RuleBuilder';
import AnalyticsSection from './components/AnalyticsSection';
import AppleHealthPrediction from './components/AppleHealthPrediction';
import AutomationCards from './components/AutomationCards';
import AlertsPanel from './components/AlertsPanel';
import EnergyCostSection from './components/EnergyCostSection';
import DrawerDetails from './components/DrawerDetails';
import VoltLogo from './components/VoltLogo';

import {
  Activity,
  ShieldAlert,
  Zap,
  Power,
  Sparkles,
  Settings,
  Layers,
  TrendingUp,
  RefreshCw,
  Cpu,
  Info,
  Home,
  User,
  LogIn,
  LogOut,
  Lock,
  Mail,
  CheckCircle2,
  Key,
  Bell,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // --- STATE DEFINITIONS ---

  const [currentMode, setCurrentMode] = useState('Adaptive Protection');
  const [adaptiveProtection, setAdaptiveProtection] = useState(true);
  const [gridFrequency, setGridFrequency] = useState(50.0);

  // 4 Smart appliances in the home
  const [sockets, setSockets] = useState([
    {
      id: 's1',
      name: 'A/C & Heating (Climate Control)',
      type: 'Living Room Heat Pump',
      power: 1200, // Watts
      voltage: 230.1,
      current: 5.21,
      maxPower: 2500,
      priority: 'Medium',
      status: 'Active',
      health: 91,
      failurePrediction: 'Healthy. Regular usage pattern.',
      daysToFailure: 120,
      recentUsage: [1100, 1150, 1200, 1200, 1250, 1150, 1200, 1200, 1300, 1200],
    },
    {
      id: 's2',
      name: 'Electric Vehicle Charger',
      type: 'Garage Charging Station',
      power: 1800, // Watts
      voltage: 229.8,
      current: 7.83,
      maxPower: 3000,
      priority: 'Low',
      status: 'Active',
      health: 95,
      failurePrediction: 'Optimal charging speed.',
      daysToFailure: 240,
      recentUsage: [1750, 1800, 1850, 1800, 1900, 1800, 1800, 1850, 1800, 1800],
    },
    {
      id: 's3',
      name: 'Kitchen Range & Oven',
      type: 'Induction Cooking Hub',
      power: 600, // Watts
      voltage: 230.2,
      current: 2.61,
      maxPower: 1800,
      priority: 'High',
      status: 'Active',
      health: 98,
      failurePrediction: 'Nominal Operations',
      daysToFailure: 365,
      recentUsage: [550, 600, 600, 650, 600, 580, 600, 600, 600, 600],
    },
    {
      id: 's4',
      name: 'Home Router & Security Core',
      type: 'Internet Router & Cameras',
      power: 150, // Watts
      voltage: 230.4,
      current: 0.65,
      maxPower: 300,
      priority: 'Critical',
      status: 'Active',
      health: 99,
      failurePrediction: 'Nominal Operations',
      daysToFailure: 730,
      recentUsage: [150, 150, 152, 150, 150, 150, 151, 150, 150, 150],
    },
  ]);

  // Main system protection relay state
  const [relay, setRelay] = useState({
    status: 'Active',
    power: 3750,
    maxCapacity: 5000, // 5.0kW max capacity limit
    voltage: 230.1,
    current: 16.3,
    temperature: 34.5,
    health: 95,
  });

  // Logical rules running on the device
  const [rules, setRules] = useState([
    {
      id: 'rule-1',
      sourceType: 'power',
      operator: 'gt',
      value: 4000,
      targetSocketId: 's2',
      action: 'Pause',
      enabled: true,
      description: 'IF Total Demand > 4000W THEN Pause Electric Vehicle Charger',
    },
    {
      id: 'rule-2',
      sourceType: 'temperature',
      operator: 'gt',
      value: 55,
      targetSocketId: 's1',
      action: 'Pause',
      enabled: true,
      description: 'IF Safety Temp > 55°C THEN Pause A/C & Heating',
    },
  ]);

  // Real-time console reasoning logs shown in AI Thinking Box
  const [logs, setLogs] = useState([
    '11:14:00 AI Assistant: Smart power optimizer connected and running.',
    '11:14:02 AI Assistant: All home appliances are verified healthy and drawing power safely.',
    '11:14:04 AI Assistant: Automatic safety rule monitoring active. Maximum home capacity is 5.0 kW.',
    '11:14:06 AI Assistant: Home voltage is stable at 230V.',
    '11:14:08 AI Assistant: Total energy usage is in the green eco-friendly zone.',
  ]);

  // Notifications in the Apple style alerts widget
  const [alerts, setAlerts] = useState([
    {
      id: 'alert-1',
      timestamp: '11:14',
      title: 'Adaptive Protection Enabled',
      description: 'VoltAI has automatically calibrated the priority shedding matrix to safeguard the 5.0kW grid terminal.',
      type: 'success',
      read: false,
    },
  ]);

  const [selectedSocketId, setSelectedSocketId] = useState(null);
  const [activeSection, setActiveSection] = useState('digital-twin');

  // User Authentication state & Modals
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authRole, setAuthRole] = useState('Mesh Architect');
  const [isSignUp, setIsSignUp] = useState(false);

  // Diagnostics Tab selector
  const [diagnosticsTab, setDiagnosticsTab] = useState('ai');
  const [isDiagnosticsExpanded, setIsDiagnosticsExpanded] = useState(false);

  // --- ACTIONS & HANDLERS ---

  const handleSelectSocket = (id) => {
    setSelectedSocketId(id);
  };

  const handleToggleSocket = (id) => {
    // Check if it is the main relay resetting
    if (id === 'MAIN_RELAY') {
      if (relay.status === 'Tripped') {
        setRelay(prev => ({ ...prev, status: 'Active' }));
        setSockets(prev => prev.map(s => ({ ...s, status: 'Active' })));

        const timestamp = new Date().toLocaleTimeString();
        appendLog(`RELAY COIL: Manual safety reset requested. Re-engaging contactors.`);
        appendLog(`SYSTEM ONLINE: Voltage path restored to all sockets.`);

        addAlert('System Restored', 'The primary contactor coil has been re-engaged. Power restored.', 'success');
      } else {
        // Force manual trip
        setRelay(prev => ({ ...prev, status: 'Tripped' }));
        setSockets(prev => prev.map(s => ({ ...s, status: 'Off' })));

        appendLog(`CRITICAL BREAKER: Manual absolute contact trip forced by administrator.`);
        addAlert('Coil Manually Tripped', 'The primary contactor coil was manually isolated.', 'warning');
      }
      return;
    }

    // Individual socket toggle
    setSockets(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'Off' ? 'Active' : 'Off';
        const timestamp = new Date().toLocaleTimeString();
        appendLog(`SOCKET CONTACTOR: ${s.name} manually set to ${nextStatus.toUpperCase()}`);
        return {
          ...s,
          status: nextStatus,
          power: nextStatus === 'Off' ? 0 : s.maxPower * 0.5, // Start back at 50% max load
        };
      }
      return s;
    }));
  };

  const handleUpdateSocketPower = (id, newPower) => {
    setSockets(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          power: newPower,
          current: newPower / s.voltage,
        };
      }
      return s;
    }));
  };

  const handleToggleRule = (id) => {
    setRules(prev => prev.map(r => {
      if (r.id === id) {
        const nextState = !r.enabled;
        appendLog(`LOGIC NODE: ${r.description.split('THEN')[0]} set to ${nextState ? 'ENABLED' : 'DISABLED'}`);
        return { ...r, enabled: nextState };
      }
      return r;
    }));
  };

  const handleAddRule = (newRule) => {
    const r = {
      ...newRule,
      id: `rule-${Date.now()}`,
    };
    setRules(prev => [...prev, r]);
    appendLog(`LOGIC COMPILE: Compiled node: "${r.description}" successfully.`);
    addAlert('New Logic Gate Wired', `Rule successfully attached to target module.`, 'success');
  };

  const handleDeleteRule = (id) => {
    setRules(prev => prev.filter(r => r.id !== id));
    appendLog(`LOGIC CLEANUP: Decompiled rule node ${id}.`);
  };

  const handleToggleMode = (mode) => {
    setCurrentMode(mode);
    appendLog(`ORCHESTRATOR: Switched active automation profile to "${mode.toUpperCase()}"`);
    addAlert('Automation Profile Engaged', `System active mode set to ${mode}.`, 'info');
  };

  const handleDismissAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleClearAlerts = () => {
    setAlerts([]);
  };

  // Helper utility to safely append logs
  const appendLog = (message) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `${time} ${message}`].slice(-30)); // limit log length
  };

  // Helper utility to add alert notification
  const addAlert = (title, description, type) => {
    const time = new Date().toLocaleTimeString().slice(0, 5);
    setAlerts(prev => [
      {
        id: `alert-${Date.now()}`,
        timestamp: time,
        title,
        description,
        type,
        read: false,
      },
      ...prev,
    ]);
  };

  // --- HIGH FREQUENCY SIMULATION ENGINE (1s tick) ---

  useEffect(() => {
    const interval = setInterval(() => {
      if (relay.status === 'Tripped') return; // If breaker is isolated, freeze simulation

      const timestamp = new Date().toLocaleTimeString();

      // 1. Add realistic jitter to active socket loads to simulate live power variations
      setSockets(prevSockets => {
        let updatedSockets = prevSockets.map(socket => {
          if (socket.status === 'Off' || socket.status === 'Shed') {
            return { ...socket, power: 0, current: 0 };
          }

          // Generate some jitter around current consumption
          const jitterPercent = (Math.random() - 0.5) * 0.04; // +/- 2%
          let newPower = Math.round(socket.power * (1 + jitterPercent));

          // Bound within limits
          newPower = Math.max(50, Math.min(socket.maxPower, newPower));

          // Also shift historical readings
          const newHistory = [...socket.recentUsage.slice(1), newPower];

          return {
            ...socket,
            power: newPower,
            current: newPower / socket.voltage,
            recentUsage: newHistory,
          };
        });

        // 2. Compute aggregate demands
        const totalPower = updatedSockets.reduce((sum, s) => sum + s.power, 0);
        const avgVoltage = 230 + (Math.random() - 0.5) * 0.4;
        const totalCurrent = totalPower / avgVoltage;

        // Grid stability and line frequency calculation
        // As load approaches maximum grid limits (5000W), the frequency drops due to grid strain
        let simulatedFreq = 50.0 + (Math.random() - 0.5) * 0.05;
        if (totalPower > 4400) {
          simulatedFreq = 49.5 + (Math.random() - 0.5) * 0.05; // Drop frequency to show critical strain!
        }

        // Temperature increases directly based on load density (load^2 * constant)
        const loadRatio = totalPower / relay.maxCapacity;
        const targetTemp = 30 + (loadRatio * 32); // maxes around 62C
        const currentTemp = relay.temperature + (targetTemp - relay.temperature) * 0.2; // smooth heating curves

        // --- RULE NODE GATE COMPILATION CHECK ---
        rules.forEach(rule => {
          if (!rule.enabled) return;

          let trigger = false;
          if (rule.sourceType === 'power' && totalPower > rule.value) trigger = true;
          if (rule.sourceType === 'temperature' && currentTemp > rule.value) trigger = true;

          if (trigger) {
            const target = updatedSockets.find(s => s.id === rule.targetSocketId);
            if (target && target.status === 'Active') {
              // Trigger action
              if (rule.action === 'Pause') {
                updatedSockets = updatedSockets.map(s => {
                  if (s.id === rule.targetSocketId) {
                    appendLog(`AI Assistant: Paused "${s.name}" to respect safety rule (${rule.description.split('THEN')[0].replace('IF ', 'if ')}).`);
                    addAlert('Device Paused', `${s.name} was temporarily paused to protect the electrical circuit.`, 'warning');
                    return { ...s, status: 'Shed', power: 0, current: 0 };
                  }
                  return s;
                });
              }
            }
          } else {
            // Restore if previously shedded by rule and total demand has dropped below threshold
            const target = updatedSockets.find(s => s.id === rule.targetSocketId);
            if (target && target.status === 'Shed' && totalPower < rule.value * 0.8) {
              updatedSockets = updatedSockets.map(s => {
                if (s.id === rule.targetSocketId) {
                  appendLog(`AI Assistant: Restarted "${s.name}". Total home power usage is safe again.`);
                  addAlert('Device Restarted', `${s.name} is now running normally as electricity demand stabilized.`, 'success');
                  return { ...s, status: 'Active', power: s.maxPower * 0.6 }; // restore to 60%
                }
                return s;
              });
            }
          }
        });

        // --- AI AGENT PROTECTIVE LEVEL INTERVENTIONS ---
        if (currentMode === 'Adaptive Protection') {
          // If aggregate load exceeds 4300W and EV Charger is active, AI sheds EV Charger
          const evCharger = updatedSockets.find(s => s.id === 's2');
          if (totalPower > 4300 && evCharger && evCharger.status === 'Active') {
            updatedSockets = updatedSockets.map(s => {
              if (s.id === 's2') {
                appendLog(`AI Assistant: High demand detected (${totalPower}W). Temporarily pausing EV charging to prevent a home safety trip.`);
                addAlert('Overload Prevented', 'AI paused the Electric Vehicle Charger to protect your home breakers.', 'warning');
                return { ...s, status: 'Shed', power: 0, current: 0 };
              }
              return s;
            });
          }

          // If nominal again and EV Charger is shedded, restore
          const evShedded = updatedSockets.find(s => s.id === 's2' && s.status === 'Shed');
          if (totalPower < 3200 && evShedded) {
            updatedSockets = updatedSockets.map(s => {
              if (s.id === 's2') {
                appendLog(`AI Assistant: Power headroom is safe. Automatically resuming Electric Vehicle Charger.`);
                addAlert('EV Charger Resumed', 'AI restored EV charging as home capacity cleared.', 'success');
                return { ...s, status: 'Active', power: 1500 };
              }
              return s;
            });
          }
        }

        // --- PEAK SHAVING PROFILE ---
        if (currentMode === 'Peak Shaving') {
          // Hard capacity cap of 3500W. If exceeded, shed lowest priority until <= 3500W
          if (totalPower > 3500) {
            // Find active sockets to shed, starting from low priority
            const lowPriorityActive = updatedSockets.find(s => s.status === 'Active' && s.priority === 'Low');
            if (lowPriorityActive) {
              updatedSockets = updatedSockets.map(s => {
                if (s.id === lowPriorityActive.id) {
                  appendLog(`PEAK SHAVING: Shedding low priority "${s.name}" to satisfy 3.5kW limit.`);
                  addAlert('Peak Shaving Activated', `${s.name} paused to maintain green energy envelope.`, 'warning');
                  return { ...s, status: 'Shed', power: 0, current: 0 };
                }
                return s;
              });
            } else {
              const medPriorityActive = updatedSockets.find(s => s.status === 'Active' && s.priority === 'Medium');
              if (medPriorityActive) {
                updatedSockets = updatedSockets.map(s => {
                  if (s.id === medPriorityActive.id) {
                    appendLog(`PEAK SHAVING: Shedding medium priority "${s.name}" to satisfy 3.5kW limit.`);
                    return { ...s, status: 'Shed', power: 0, current: 0 };
                  }
                  return s;
                });
              }
            }
          }
        }

        // --- HARD PHYSICAL OVERLOAD BREAKER TRIP ---
        // If aggregate exceeds absolute safety limits (5000W), the main breaker physical safety trips instantly
        const finalAggregatePower = updatedSockets.reduce((sum, s) => sum + s.power, 0);
        if (finalAggregatePower > 5000) {
          setRelay(prev => ({
            ...prev,
            status: 'Tripped',
            power: 0,
            current: 0,
            temperature: 58.2, // sudden spike
          }));
          // Shut down all sockets
          updatedSockets = updatedSockets.map(s => ({ ...s, status: 'Off', power: 0, current: 0 }));

          appendLog(`System Alert: Safety switch tripped! Home demand reached ${finalAggregatePower}W, exceeding the 5.0 kW circuit capacity. All appliances turned off safely.`);
          addAlert('Safety Switch Tripped', 'Total electricity demand exceeded 5.0 kW. All appliances have been turned off to prevent fuses from blowing.', 'warning');
        } else {
          // Update relay metrics
          setRelay(prev => ({
            ...prev,
            power: finalAggregatePower,
            current: totalCurrent,
            voltage: avgVoltage,
            temperature: currentTemp,
          }));
        }

        // Randomly add monitoring logs to simulate healthy live agent monitoring (once in 12 ticks)
        if (Math.random() < 0.08 && finalAggregatePower <= 5000) {
          const monitoringMessages = [
            'AI Assistant: Verified electrical connections are stable and operating smoothly.',
            'AI Assistant: Real-time power efficiency is optimal (98% power quality index).',
            'AI Assistant: Running automated predictive health checks in the background.',
            'AI Assistant: Verified that power flow across all appliance circuits is perfectly balanced.',
          ];
          appendLog(monitoringMessages[Math.floor(Math.random() * monitoringMessages.length)]);
        }

        setGridFrequency(simulatedFreq);
        return updatedSockets;
      });

    }, 1000);

    return () => clearInterval(interval);
  }, [relay, rules, currentMode]); return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#111111] font-sans antialiased selection:bg-[#0A84FF]/20 selection:text-[#0A84FF] pb-24 overflow-x-hidden">

      {/* ──────────────────────────────────────────
           Top Navigation
         ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[#E5E5E7] transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <VoltLogo size={38} glow={true} />
            <div>
              <span className="font-extrabold text-md tracking-tight block">VoltOrchestra</span>
              <span className="text-[9px] font-mono text-[#6E6E73] block uppercase tracking-wider leading-none">OS for Electricity v1.02</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2 bg-[#BF5AF2]/10 hover:bg-[#BF5AF2]/20 text-[#BF5AF2] px-3.5 py-1.5 rounded-full border border-[#BF5AF2]/30 text-xs font-semibold font-sans transition-all shadow-sm active:scale-95"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30D158] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#30D158]"></span>
                </span>
                <div className="w-4 h-4 rounded-full overflow-hidden bg-[#BF5AF2]/20 flex items-center justify-center border border-[#BF5AF2]/40">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="w-2.5 h-2.5 text-[#BF5AF2]" />
                  )}
                </div>
                <span className="font-mono text-[11px] font-bold tracking-tight uppercase">Mesh Profile</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsSignUp(false);
                  setShowAuthModal(true);
                }}
                className="flex items-center gap-2 bg-[#0A84FF] hover:bg-[#0A84FF]/90 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold font-sans transition-all shadow-sm shadow-[#0A84FF]/10 active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login / Signup</span>
              </button>
            )}

            <button
              onClick={() => {
                appendLog(`AGENT RE-CALIBRATE: Manually requested complete telemetry reset.`);
                addAlert('Telemetry Reset', 'Master orchestrator coils calibrated successfully.', 'info');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E5E5E7] text-xs font-semibold font-sans hover:bg-[#F5F5F7] transition-all text-[#111111]"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#6E6E73]" />
              <span>Calibrate Telemetry</span>
            </button>
          </div>
        </div>
      </header>

      {/* ──────────────────────────────────────────
           Global Status Bar (compact)
         ────────────────────────────────────────── */}
      <div className="bg-[#111111] text-white py-2.5 px-6 font-sans text-xs select-none border-b border-[#27272A]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[#30D158]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#30D158] animate-pulse"></span>
              <span className="font-semibold">Safe & Active</span>
            </div>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400">
              <strong className="text-white">{relay.voltage.toFixed(0)}V</strong> · {relay.temperature.toFixed(0)}°C
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">Profile:</span>
            <span className="text-[#0A84FF] font-bold bg-[#0A84FF]/10 px-2 py-0.5 rounded-md text-[10px] border border-[#0A84FF]/20 uppercase">
              {currentMode}
            </span>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────
           Segmented Bento-Grid Tab Navigation Bar
         ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="bg-[#F4F4F6]/90 p-1.5 rounded-[24px] border border-[#E5E5E7] flex flex-col sm:flex-row gap-1.5 shadow-sm">
          <button
            onClick={() => setActiveSection('digital-twin')}
            className={`flex-1 py-3 px-4 rounded-[18px] text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 border border-transparent ${activeSection === 'digital-twin'
                ? 'bg-panel-blue-bg text-panel-blue-text border-panel-blue-border shadow-sm scale-[1.01]'
                : 'text-panel-blue-text/60 hover:text-panel-blue-text hover:bg-panel-blue-bg/40'
              }`}
          >
            <Layers className={`w-4 h-4 ${activeSection === 'digital-twin' ? 'text-[#0A84FF]' : 'text-panel-blue-text/50'}`} />
            <span>Live Home Devices</span>
          </button>
          <button
            onClick={() => setActiveSection('room-simulator')}
            className={`flex-1 py-3 px-4 rounded-[18px] text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 border border-transparent ${activeSection === 'room-simulator'
                ? 'bg-panel-purple-bg text-panel-purple-text border-panel-purple-border shadow-sm scale-[1.01]'
                : 'text-panel-purple-text/60 hover:text-panel-purple-text hover:bg-panel-purple-bg/40'
              }`}
          >
            <Home className={`w-4 h-4 ${activeSection === 'room-simulator' ? 'text-[#BF5AF2]' : 'text-panel-purple-text/50'}`} />
            <span>2.5D Room Simulator</span>
          </button>
          <button
            onClick={() => setActiveSection('analytics')}
            className={`flex-1 py-3 px-4 rounded-[18px] text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 border border-transparent ${activeSection === 'analytics'
                ? 'bg-panel-green-bg text-panel-green-text border-panel-green-border shadow-sm scale-[1.01]'
                : 'text-panel-green-text/60 hover:text-panel-green-text hover:bg-panel-green-bg/40'
              }`}
          >
            <TrendingUp className={`w-4 h-4 ${activeSection === 'analytics' ? 'text-[#30D158]' : 'text-panel-green-text/50'}`} />
            <span>Energy Savings & Bills</span>
          </button>
          <button
            onClick={() => setActiveSection('rule-engine')}
            className={`flex-1 py-3 px-4 rounded-[18px] text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 border border-transparent ${activeSection === 'rule-engine'
                ? 'bg-panel-orange-bg text-panel-orange-text border-panel-orange-border shadow-sm scale-[1.01]'
                : 'text-panel-orange-text/60 hover:text-panel-orange-text hover:bg-panel-orange-bg/40'
              }`}
          >
            <Cpu className={`w-4 h-4 ${activeSection === 'rule-engine' ? 'text-[#F97316]' : 'text-panel-orange-text/50'}`} />
            <span>Smart Automation Rules</span>
          </button>
          <button
            onClick={() => setActiveSection('system-cabinet')}
            className={`flex-1 py-3 px-4 rounded-[18px] text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 border border-transparent ${activeSection === 'system-cabinet'
                ? 'bg-panel-rose-bg text-panel-rose-text border-panel-rose-border shadow-sm scale-[1.01]'
                : 'text-panel-rose-text/60 hover:text-panel-rose-text hover:bg-panel-rose-bg/40'
              }`}
          >
            <Settings className={`w-4 h-4 ${activeSection === 'system-cabinet' ? 'text-[#9F1239]' : 'text-panel-rose-text/50'}`} />
            <span>3D Panel Visualizer</span>
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────
           Dynamic Section Hero Header (compact)
         ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pt-6 pb-6">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-5 transition-colors duration-300 ${activeSection === 'digital-twin' ? 'border-panel-blue-border' :
              activeSection === 'room-simulator' ? 'border-panel-purple-border' :
                activeSection === 'analytics' ? 'border-panel-green-border' :
                  activeSection === 'rule-engine' ? 'border-panel-orange-border' :
                    'border-panel-rose-border'
            }`}
        >
          <div>
            <h2 className={`text-xl md:text-2xl font-bold tracking-tight transition-colors duration-300 ${activeSection === 'digital-twin' ? 'text-[#1F2C42]' :
                activeSection === 'room-simulator' ? 'text-panel-purple-text' :
                  activeSection === 'analytics' ? 'text-panel-green-text' :
                    activeSection === 'rule-engine' ? 'text-[#431407]' :
                      'text-panel-rose-text'
              }`}>
              {activeSection === 'digital-twin' && 'Live Appliances & Controls'}
              {activeSection === 'room-simulator' && 'ESP Room Architect & Map'}
              {activeSection === 'analytics' && 'Power Bills & Savings'}
              {activeSection === 'rule-engine' && 'Automatic Power Rules'}
              {activeSection === 'system-cabinet' && 'Breaker Board Lifespan'}
            </h2>
            <p className={`text-xs mt-1 transition-colors duration-300 ${activeSection === 'digital-twin' ? 'text-[#5C6E85]' :
                activeSection === 'room-simulator' ? 'text-panel-purple-text/80' :
                  activeSection === 'analytics' ? 'text-[#4A6B53]' :
                    activeSection === 'rule-engine' ? 'text-[#52525B]' :
                      'text-panel-rose-text/80'
              }`}>
              {activeSection === 'digital-twin' && 'Monitor and control smart appliances. Auto load-balancing protects your circuit.'}
              {activeSection === 'room-simulator' && 'Build rooms on an interactive grid. Place doors, windows, and ESP mesh nodes.'}
              {activeSection === 'analytics' && 'Track real-time bills, energy forecasts, and per-appliance consumption.'}
              {activeSection === 'rule-engine' && 'Set automation rules to save money and prevent safety trips.'}
              {activeSection === 'system-cabinet' && 'Explore breakers in an interactive 3D model with lifespan data.'}
            </p>
          </div>

          {/* Capacity indicator — only show for non-digital-twin tabs */}
          {activeSection !== 'digital-twin' && (
            <div className={`flex items-center justify-center gap-4 bg-white border p-3 rounded-[16px] shadow-sm shrink-0 transition-colors duration-300 ${activeSection === 'room-simulator' ? 'border-panel-purple-border' :
                activeSection === 'analytics' ? 'border-panel-green-border' :
                  activeSection === 'rule-engine' ? 'border-panel-orange-border' :
                    'border-panel-rose-border'
              }`}>
              <div className="text-right">
                <span className={`text-[10px] font-mono uppercase block mb-0.5 ${activeSection === 'room-simulator' ? 'text-panel-purple-text/70' :
                    activeSection === 'analytics' ? 'text-[#4A6B53]' :
                      activeSection === 'rule-engine' ? 'text-panel-orange-text' :
                        'text-panel-rose-text/80'
                  }`}>CAPACITY</span>
                <span className={`text-lg font-mono font-bold ${activeSection === 'room-simulator' ? 'text-panel-purple-text' :
                    activeSection === 'analytics' ? 'text-[#1C3A27]' :
                      activeSection === 'rule-engine' ? 'text-[#431407]' :
                        'text-panel-rose-text'
                  }`}>
                  {(relay.power / 1000).toFixed(1)}kW
                </span>
              </div>
              <div className="relative w-10 h-10 flex items-center justify-center">
                <svg width="40" height="40" className="-rotate-90">
                  <circle cx="20" cy="20" r="16" fill="none" strokeWidth="3" stroke="#E5E5E7" />
                  <circle cx="20" cy="20" r="16" fill="none" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - (100 * Math.min(100, Math.round((relay.power / relay.maxCapacity) * 100))) / 100} className="transition-all duration-500" stroke={
                    activeSection === 'room-simulator' ? '#BF5AF2' :
                      activeSection === 'analytics' ? '#30D158' :
                        activeSection === 'rule-engine' ? '#F97316' : '#9F1239'
                  } />
                </svg>
                <span className="absolute text-[9px] font-mono font-bold text-[#1F2C42]">
                  {Math.min(100, Math.round((relay.power / relay.maxCapacity) * 100))}%
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </section>

      {/* ──────────────────────────────────────────
           Main Section Containers
         ────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {activeSection === 'digital-twin' && (
            <motion.div
              key="digital-twin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12 text-left"
            >
              {/* 1 & 2. Main Appliance Controls & Power Dashboard (Full Width) */}
              <div className="w-full">
                <DigitalTwin
                  sockets={sockets}
                  relay={relay}
                  selectedSocketId={selectedSocketId}
                  onSelectSocket={handleSelectSocket}
                  onToggleSocket={handleToggleSocket}
                  gridFrequency={gridFrequency}
                />
              </div>

              {/* 3. Advanced Diagnostics & System Logs (Grouped at the bottom) */}
              <div className="border-t border-[#E5E5E7] pt-8">
                {/* Collapsible Header */}
                <div
                  onClick={() => setIsDiagnosticsExpanded(!isDiagnosticsExpanded)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/70 p-4 -mx-4 rounded-2xl transition-all"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-[#0A84FF]/10 flex items-center justify-center text-[#0A84FF] shrink-0">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-[#1F2C42] tracking-tight">System Logs & Advanced Diagnostics</h3>
                        <span className="text-[10px] bg-gray-100 text-gray-500 font-mono px-2 py-0.5 rounded-md font-bold">
                          {isDiagnosticsExpanded ? 'EXPANDED' : 'COLLAPSED'}
                        </span>
                      </div>
                      <p className="text-xs text-[#5C6E85] mt-0.5">Analyze automatic AI load-balancing, live voltage oscilloscope, and warning logs.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-start sm:self-auto font-mono text-xs font-bold text-[#0A84FF]">
                    <span>{isDiagnosticsExpanded ? 'Hide Diagnostics' : 'Show Diagnostics'}</span>
                    <div className="w-8 h-8 rounded-full bg-[#0A84FF]/10 flex items-center justify-center">
                      {isDiagnosticsExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Collapsible Content */}
                <AnimatePresence initial={false}>
                  {isDiagnosticsExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden mt-6"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pt-4 border-t border-gray-100">
                        <span className="text-xs font-bold font-mono uppercase text-gray-400 tracking-wider">Select Diagnostics Module</span>

                        {/* Gorgeous segmented controller */}
                        <div className="bg-[#F5F5F7] border border-[#E5E5E7] p-1 rounded-full flex gap-1 self-start md:self-auto shadow-inner">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDiagnosticsTab('ai');
                            }}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold font-mono tracking-tight transition-all flex items-center gap-1.5 ${diagnosticsTab === 'ai'
                                ? 'bg-white text-[#0A84FF] border border-[#E5E5E7] shadow-sm font-bold'
                                : 'text-[#5C6E85] hover:text-[#1F2C42]'
                              }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI Orchestrator</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDiagnosticsTab('tips');
                            }}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold font-mono tracking-tight transition-all flex items-center gap-1.5 ${diagnosticsTab === 'tips'
                                ? 'bg-white text-[#BF5AF2] border border-[#E5E5E7] shadow-sm font-bold'
                                : 'text-[#5C6E85] hover:text-[#1F2C42]'
                              }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Safety & Tips</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDiagnosticsTab('alerts');
                            }}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold font-mono tracking-tight transition-all flex items-center gap-1.5 relative ${diagnosticsTab === 'alerts'
                                ? 'bg-white text-[#FF453A] border border-[#E5E5E7] shadow-sm font-bold'
                                : 'text-[#5C6E85] hover:text-[#1F2C42]'
                              }`}
                          >
                            <Bell className="w-3.5 h-3.5" />
                            <span>Live Alerts</span>
                            {alerts.length > 0 && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF453A] text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                                {alerts.length}
                              </span>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="w-full">
                        <AnimatePresence mode="wait">
                          {diagnosticsTab === 'ai' && (
                            <motion.div
                              key="diagnostics-ai"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="w-full"
                            >
                              <AiDecisionPanel
                                totalLoad={relay.power}
                                maxCapacity={relay.maxCapacity}
                                relayTripped={relay.status === 'Tripped'}
                                logs={logs}
                              />
                            </motion.div>
                          )}

                          {diagnosticsTab === 'tips' && (
                            <motion.div
                              key="diagnostics-tips"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="w-full"
                            >
                              <EnergySavingTips
                                totalLoad={relay.power}
                                relayStatus={relay.status}
                                temperature={relay.temperature}
                                renderAdvancedOscilloscope={() => (
                                  <Oscilloscope
                                    voltage={relay.voltage}
                                    current={relay.current}
                                    frequency={gridFrequency}
                                    relayTripped={relay.status === 'Tripped'}
                                  />
                                )}
                              />
                            </motion.div>
                          )}

                          {diagnosticsTab === 'alerts' && (
                            <motion.div
                              key="diagnostics-alerts"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="w-full"
                            >
                              <AlertsPanel
                                alerts={alerts}
                                onDismissAlert={handleDismissAlert}
                                onClearAll={handleClearAlerts}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {activeSection === 'room-simulator' && (
            <motion.div
              key="room-simulator"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              <RoomSimulator
                sockets={sockets}
                onToggleSocket={handleToggleSocket}
                appendLog={appendLog}
                addAlert={addAlert}
              />
            </motion.div>
          )}

          {activeSection === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              <div>
                <AnalyticsSection sockets={sockets} />
              </div>
              <div>
                <EnergyCostSection totalLoad={relay.power} />
              </div>
            </motion.div>
          )}

          {activeSection === 'rule-engine' && (
            <motion.div
              key="rule-engine"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              <div>
                <RuleBuilder
                  rules={rules}
                  sockets={sockets}
                  onToggleRule={handleToggleRule}
                  onAddRule={handleAddRule}
                  onDeleteRule={handleDeleteRule}
                />
              </div>
              <div>
                <AutomationCards
                  currentMode={currentMode}
                  adaptiveProtection={adaptiveProtection}
                  onToggleMode={handleToggleMode}
                  onToggleAdaptive={() => setAdaptiveProtection(!adaptiveProtection)}
                />
              </div>
            </motion.div>
          )}

          {activeSection === 'system-cabinet' && (
            <motion.div
              key="system-cabinet"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              <div>
                <ThreeDPanel
                  sockets={sockets}
                  selectedSocketId={selectedSocketId}
                  onSelectSocket={handleSelectSocket}
                />
              </div>
              <div>
                <AppleHealthPrediction
                  sockets={sockets}
                  onSelectSocket={handleSelectSocket}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ──────────────────────────────────────────
           Drawer Detail overlay with backdrop blur
         ────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedSocketId && (
          <DrawerDetails
            socket={sockets.find(s => s.id === selectedSocketId) || null}
            onClose={() => setSelectedSocketId(null)}
            onToggleSocket={handleToggleSocket}
            onUpdatePower={handleUpdateSocketPower}
          />
        )}
      </AnimatePresence>

      {/* ──────────────────────────────────────────
           Interactive Auth Modal (Login/Signup)
         ────────────────────────────────────────── */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="absolute inset-0 bg-[#111111]/45 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-white border border-[#E5E5E7] rounded-[28px] shadow-2xl p-6 overflow-hidden z-10"
            >
              {/* Header */}
              <div className="text-center pb-5 border-b border-[#F5F5F7] mb-5">
                <div className="w-12 h-12 bg-[#0A84FF]/10 rounded-2xl flex items-center justify-center mx-auto mb-3 text-[#0A84FF]">
                  <Key className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-[#111111] tracking-tight">
                  {isSignUp ? 'Create Mesh Account' : 'Authenticate VoltOS'}
                </h3>
                <p className="text-xs text-[#6E6E73] mt-1 font-sans">
                  {isSignUp ? 'Register as a certified mesh participant' : 'Input your keys to join the local wireless power grid'}
                </p>
              </div>

              {/* Form fields */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const nameToUse = authName.trim() || (authEmail ? authEmail.split('@')[0] : 'User');
                  const emailToUse = authEmail.trim() || 'ankangiri05@gmail.com';

                  setUser({
                    name: nameToUse,
                    email: emailToUse,
                    role: authRole,
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                  });
                  appendLog(`MESH SECURITY: Authenticated session for user "${nameToUse}" (${emailToUse})`);
                  addAlert('Identity Verified', `Logged in safely as ${nameToUse} (${authRole})`, 'success');
                  setShowAuthModal(false);
                }}
                className="space-y-4 text-left"
              >
                {/* Email shortcut button */}
                {!isSignUp && !authEmail && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthEmail('ankangiri05@gmail.com');
                      setAuthName('Ankan Giri');
                      setAuthRole('Mesh Architect');
                    }}
                    className="w-full flex items-center justify-between bg-[#F5F5F7] hover:bg-[#E5E5E7] border border-[#E5E5E7] text-xs font-medium text-[#111111] px-4 py-2.5 rounded-xl transition-all mb-2"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#0A84FF]"></span>
                      <span>Quick Sign in as Ankan</span>
                    </span>
                    <span className="font-mono text-[10px] text-gray-400">ankangiri05@gmail.com</span>
                  </button>
                )}

                {isSignUp && (
                  <div>
                    <label className="text-[10px] text-gray-400 font-mono uppercase block mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ankan Giri"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        className="w-full bg-[#FAF9F6] border border-[#E5E5E7] rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-[#111111] focus:ring-2 focus:ring-[#0A84FF] outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[10px] text-gray-400 font-mono uppercase block mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@example.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-[#E5E5E7] rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-[#111111] focus:ring-2 focus:ring-[#0A84FF] outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 font-mono uppercase block mb-1.5">Secured Key Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-[#E5E5E7] rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-[#111111] focus:ring-2 focus:ring-[#0A84FF] outline-none transition-all"
                    />
                  </div>
                </div>



                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-[#111111] text-white py-3 rounded-xl text-xs font-bold transition-all hover:bg-[#27272A] flex items-center justify-center gap-2 shadow-md active:scale-95"
                >
                  <span>Verify Identity & Connect</span>
                </button>
              </form>

              {/* Toggle switch */}
              <div className="mt-5 pt-4 border-t border-[#F5F5F7] text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs text-[#0A84FF] hover:underline font-semibold"
                >
                  {isSignUp ? 'Already registered? Authenticate here' : 'New to VoltOrchestra? Register a new account'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ──────────────────────────────────────────
           Interactive Mesh Profile Modal
         ────────────────────────────────────────── */}
      <AnimatePresence>
        {showProfileModal && user && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfileModal(false)}
              className="absolute inset-0 bg-[#111111]/45 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-white border border-[#E5E5E7] rounded-[28px] shadow-2xl p-6 overflow-hidden z-10 text-left"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#F5F5F7] mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#30D158] animate-pulse"></span>
                  <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Local Wireless Mesh Profile</span>
                </div>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-xs text-[#6E6E73] hover:text-[#111111] font-bold"
                >
                  Close
                </button>
              </div>

              {/* Profile Card details */}
              <div className="bg-[#FAF9F6] border border-[#E5E5E7] rounded-2xl p-4 flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#BF5AF2]/40 bg-white">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="text-md font-bold text-[#111111]">{user.name}</h4>
                  <p className="text-xs text-gray-500 font-mono mb-1">{user.email}</p>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#BF5AF2]/15 text-[#BF5AF2] px-2.5 py-0.5 rounded-full border border-[#BF5AF2]/25">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Grid credentials info */}
              <div className="space-y-3.5 mb-6 text-left">
                <span className="text-[10px] text-gray-400 font-mono uppercase block">Grid Telemetry Credentials</span>

                <div className="bg-[#F5F5F7] rounded-xl p-3 border border-gray-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Security Token</span>
                    <span className="font-mono text-[#111111] font-semibold">mesh_v_0xbf5af2c3...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Node Sync State</span>
                    <span className="text-[#30D158] font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> SECURED
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Linked Smart Assets</span>
                    <span className="font-semibold text-[#111111]">4 Active ESP Sockets</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const prevUser = user;
                    setUser(null);
                    setShowProfileModal(false);
                    appendLog(`MESH SECURITY: Terminated session for "${prevUser.name}"`);
                    addAlert('Logged Out', 'Terminated mesh session safely.', 'info');
                  }}
                  className="flex-1 border border-red-200 text-red-500 hover:bg-red-50 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out Connection</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 bg-[#111111] text-white hover:bg-[#27272A] py-3 rounded-xl text-xs font-bold transition-all text-center"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Branding block */}
      <footer className="max-w-7xl mx-auto px-6 mt-32 pt-12 border-t border-[#E5E5E7] text-center text-xs text-[#6E6E73] font-mono">
        <p className="mb-2">VoltOrchestra Operating System • Developed for Next-Gen Electrical Infrastructure</p>
        <p className="opacity-60">© 2026 VoltOrchestra Inc. Phase balanced safety metrics verified.</p>
      </footer>

    </div>
  );
}
