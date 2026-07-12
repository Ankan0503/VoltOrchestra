/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function VoltLogo({ className = '', size = 36, glow = true }) {
    return (
        <div
            className={`relative select-none flex items-center justify-center shrink-0 ${className}`}
            style={{ width: size, height: size }}
        >
            {/* Glow aura */}
            {glow && (
                <div
                    className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#0A84FF] to-[#BF5AF2] opacity-25 blur-md animate-pulse"
                    style={{ transform: 'scale(0.85)' }}
                />
            )}

            {/* SVG Canvas */}
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full relative z-10 transition-transform duration-500 hover:scale-105 active:scale-95"
            >
                <defs>
                    {/* Gradients */}
                    <linearGradient id="logo-grad-bolt" x1="32" y1="18" x2="68" y2="82" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#0A84FF" />
                        <stop offset="50%" stopColor="#8E59FF" />
                        <stop offset="100%" stopColor="#BF5AF2" />
                    </linearGradient>

                    <linearGradient id="logo-grad-blue" x1="12" y1="12" x2="88" y2="88" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#0A84FF" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#0A84FF" stopOpacity="0.2" />
                    </linearGradient>

                    <linearGradient id="logo-grad-purple" x1="24" y1="24" x2="76" y2="76" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#BF5AF2" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#0A84FF" stopOpacity="0.3" />
                    </linearGradient>

                    {/* Glow filter for lightning bolt */}
                    <filter id="logo-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Outer Grid Mesh Ring (representing electricity routing, rotates slowly clockwise) */}
                <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="url(#logo-grad-blue)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="14 18"
                    fill="none"
                    opacity="0.5"
                    className="animate-[spin_40s_linear_infinite]"
                    style={{ transformOrigin: 'center' }}
                />

                {/* Inner Safety/Phase Ring (representing wave synchronization, rotates faster counter-clockwise) */}
                <circle
                    cx="50"
                    cy="50"
                    r="28"
                    stroke="url(#logo-grad-purple)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="38 18"
                    fill="none"
                    opacity="0.8"
                    className="animate-[spin_18s_linear_infinite_reverse]"
                    style={{ transformOrigin: 'center' }}
                />

                {/* Central Core Lightning Bolt (perfectly centered, glowing) */}
                <path
                    d="M55 18 L32 52 H48 L42 82 L68 44 H52 Z"
                    fill="url(#logo-grad-bolt)"
                    filter="url(#logo-glow-filter)"
                    className="drop-shadow-[0_2px_8px_rgba(10,132,255,0.4)]"
                />

                {/* Micro-nodes representing synchronized devices */}
                <circle cx="50" cy="8" r="3" fill="#0A84FF" className="animate-ping" style={{ transformOrigin: 'center' }} />
                <circle cx="92" cy="50" r="2.5" fill="#BF5AF2" />
                <circle cx="8" cy="50" r="2.5" fill="#30D158" />
            </svg>
        </div>
    );
}
