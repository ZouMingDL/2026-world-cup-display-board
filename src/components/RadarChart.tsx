import React from 'react';
import { Player } from '../data/worldCupData';

interface RadarChartProps {
  players: Player[];
  width?: number;
  height?: number;
}

const METRICS = [
  { key: 'pace', label: '速度 (PAC)', color: 'text-amber-500' },
  { key: 'shooting', label: '射门 (SHO)', color: 'text-rose-500' },
  { key: 'passing', label: '传球 (PAS)', color: 'text-indigo-500' },
  { key: 'dribbling', label: '盘带 (DRI)', color: 'text-emerald-500' },
  { key: 'defending', label: '防守 (DEF)', color: 'text-blue-500' },
  { key: 'physical', label: '身体 (PHY)', color: 'text-orange-500' },
] as const;

export default function RadarChart({ players, width = 280, height = 280 }: RadarChartProps) {
  const center = 140;
  const radius = 95;
  const numPoints = METRICS.length;

  // Colors mapping for up to 3 players in comparison
  const themeColors = [
    { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.22)', label: '金色' }, // Player 1 (primary)
    { stroke: '#3b82f6', fill: 'rgba(59, 130, 246, 0.22)', label: '蓝色' },  // Player 2
    { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.22)', label: '绿色' },  // Player 3
  ];

  // Helper to calculate coordinates for polar coordinates
  const getCoordinates = (index: number, value: number) => {
    // Math.PI / 2 projects first point straight up (90 deg or -Math.PI / 2)
    const angle = (Math.PI * 2 / numPoints) * index - Math.PI / 2;
    const factor = value / 100;
    const x = center + radius * factor * Math.cos(angle);
    const y = center + radius * factor * Math.sin(angle);
    return { x, y };
  };

  // Helper to calculate coordinates for labels (slightly further out)
  const getLabelCoordinates = (index: number) => {
    const angle = (Math.PI * 2 / numPoints) * index - Math.PI / 2;
    const x = center + (radius + 20) * Math.cos(angle);
    const y = center + (radius + 14) * Math.sin(angle);
    return { x, y };
  };

  // Generate background concentric heptagons / hexagons
  const grids = [20, 40, 60, 80, 100];

  return (
    <div className="flex flex-col items-center justify-center bg-transparent select-none">
      <svg
        id="radar_svg"
        width="100%"
        height="100%"
        viewBox="0 0 280 280"
        className="w-full max-w-[280px] h-auto drop-shadow-sm transition-all duration-300"
      >
        {/* Subtle subtle outer drop glow */}
        <defs>
          <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Draw concentric background grid lines */}
        {grids.map((gridValue) => {
          const points = Array.from({ length: numPoints }, (_, i) => {
            const { x, y } = getCoordinates(i, gridValue);
            return `${x},${y}`;
          }).join(' ');

          return (
            <polygon
              id={`grid-${gridValue}`}
              key={`grid-${gridValue}`}
              points={points}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="0.8"
              strokeDasharray={gridValue === 100 ? "0" : "2,2"}
              className={`${gridValue === 100 ? 'opacity-85' : 'opacity-40'}`}
            />
          );
        })}

        {/* 2. Draw axes running from the center to vertices */}
        {Array.from({ length: numPoints }).map((_, i) => {
          const { x, y } = getCoordinates(i, 100);
          return (
            <line
              id={`axis-line-${i}`}
              key={`axis-line-${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth="1"
              className="opacity-60"
            />
          );
        })}

        {/* 3. Render any player data shapes */}
        {players.map((player, pIdx) => {
          if (!player) return null;
          const config = themeColors[pIdx % themeColors.length];
          const abilityKeys = ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'] as const;

          const pointsStr = abilityKeys.map((key, i) => {
            const val = player.ability[key] || 0;
            const { x, y } = getCoordinates(i, val);
            return `${x},${y}`;
          }).join(' ');

          const centerPointStr = abilityKeys.map((_key, i) => {
            const { x, y } = getCoordinates(i, 0);
            return `${x},${y}`;
          }).join(' ');

          return (
            <g key={`player-polygon-${player.id}-${pIdx}`} className="transition-all duration-300">
              {/* Colored translucent polygon */}
              <polygon
                id={`poly-${player.id}`}
                points={pointsStr}
                fill={config.fill}
                stroke={config.stroke}
                strokeWidth="2.2"
                strokeLinejoin="round"
                opacity="0.85"
                filter={players.length === 1 ? "url(#glow)" : undefined}
                className="transition-all duration-500 ease-out"
              />

              {/* Little anchor dots at each variable vertex */}
              {abilityKeys.map((key, i) => {
                const val = player.ability[key];
                const { x, y } = getCoordinates(i, val);
                return (
                  <circle
                    id={`dot-${player.id}-${i}`}
                    key={`dot-${player.id}-${i}`}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="#ffffff"
                    stroke={config.stroke}
                    strokeWidth="1.8"
                    className="transition-all duration-500 ease-out hover:r-5 focus:outline-none"
                  />
                );
              })}
            </g>
          );
        })}

        {/* 4. Labels for each axis vertex */}
        {METRICS.map((metric, i) => {
          const { x, y } = getLabelCoordinates(i);
          // Set text-anchor alignment nicely based on location
          let textAnchor = 'middle';
          if (x < center - 15) textAnchor = 'end';
          if (x > center + 15) textAnchor = 'start';

          // Slightly shift vertical positioning to align text cleanly
          let dy = '0.35em';
          if (y < center - 15) dy = '-0.1em';
          if (y > center + 15) dy = '0.8em';

          // Collect compared stats values
          const statsValues = players.map(p => p.ability[metric.key]);

          return (
            <g key={`metric-label-${metric.key}`} id={`g-metric-${metric.key}`}>
              <text
                x={x}
                y={y}
                dy={dy}
                textAnchor={textAnchor}
                className="font-sans font-medium text-[10.5px] fill-slate-700"
              >
                {metric.label.split(' ')[0]}
              </text>
              <text
                x={x}
                y={y}
                dy={y < center - 15 ? '1em' : y > center + 15 ? '1.9em' : '1.35em'}
                textAnchor={textAnchor}
                className="font-mono text-[9px] font-bold fill-slate-500 opacity-90"
              >
                {statsValues.join(' vs ')}
              </text>
            </g>
          );
        })}

        {/* Tiny center hub point */}
        <circle cx={center} cy={center} r="2" fill="#94a3b8" />
      </svg>

      {/* Mini legend color label tags if multiple players are graphed */}
      {players.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2 px-1">
          {players.map((player, pIdx) => {
            const config = themeColors[pIdx % themeColors.length];
            return (
              <div key={`legend-${player.id}`} className="flex items-center space-x-1 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block border-2 shrink-0"
                  style={{ borderColor: config.stroke, backgroundColor: config.fill }}
                />
                <span className="font-medium text-slate-700 text-[11px] truncate max-w-[70px]">
                  {player.name.split('·')[1] || player.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  ({Math.round(
                    Object.values(player.ability).reduce((a, b) => a + b, 0) / 6
                  )}分)
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
