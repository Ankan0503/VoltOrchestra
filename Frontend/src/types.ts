/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface SocketData {
  id: string;
  name: string;
  type: string;
  power: number; // Watts
  voltage: number; // Volts
  current: number; // Amps
  maxPower: number; // Watts
  priority: Priority;
  status: 'Active' | 'Shed' | 'Overload' | 'Off';
  health: number; // 0 - 100
  failurePrediction: string;
  daysToFailure: number;
  recentUsage: number[]; // Last 10 readings
}

export interface MainRelayState {
  status: 'Active' | 'Tripped' | 'Resetting';
  power: number; // Watts
  maxCapacity: number; // Watts (e.g., 5000)
  voltage: number; // Volts (around 230)
  current: number; // Amps
  temperature: number; // Celsius
  health: number; // 0 - 100
}

export interface Rule {
  id: string;
  sourceType: 'power' | 'temperature' | 'battery' | 'voltage';
  operator: 'gt' | 'lt' | 'eq';
  value: number;
  targetSocketId: string;
  action: 'Pause' | 'Resume' | 'Trip';
  enabled: boolean;
  description: string;
}

export interface LiveEvent {
  id: string;
  timestamp: string; // e.g. "20:32"
  title: string;
  description: string;
  type: 'info' | 'warning' | 'critical' | 'success';
}

export interface AlertNotification {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'warning' | 'success' | 'info';
  read: boolean;
}

export interface SimulationConfig {
  currentMode: 'Adaptive Protection' | 'Manual Override' | 'Peak Shaving' | 'Eco Orchestration';
  adaptiveProtection: boolean;
  gridFrequency: number; // Hz
  reactivePower: number; // VAR
  powerFactor: number; // cos phi
}
