import React from 'react';
import { ProductMacros } from '../types';

interface NutritionHudProps {
  macros: ProductMacros;
  compact?: boolean;
  accentColor?: string;
}

export const NutritionHud: React.FC<NutritionHudProps> = ({
  macros,
  compact = false,
  accentColor = '#CCFF00',
}) => {
  const cells = [
    { label: 'PROTEIN', value: `${macros.proteinG}G`, highlight: true },
    { label: 'NET CARBS', value: `${macros.netCarbsG}G`, highlight: false },
    { label: 'CALORIES', value: `${macros.calories}`, highlight: false },
    { label: 'ADDED SUGAR', value: `${macros.sugarG}G`, highlight: false },
  ];

  return (
    <div
      className={`grid grid-cols-4 bg-[#111116] border-2 border-[#2a292f] rounded overflow-hidden ${
        compact ? 'text-xs' : 'text-sm'
      }`}
    >
      {cells.map((cell, idx) => (
        <div
          key={cell.label}
          className={`flex flex-col justify-center ${
            compact ? 'px-2.5 py-2' : 'px-3.5 py-3'
          } ${idx < cells.length - 1 ? 'border-r-2 border-[#2a292f]' : ''}`}
        >
          <span className="font-label text-[10px] uppercase tracking-[0.1em] text-[#c4c9ac] leading-tight">
            {cell.label}
          </span>
          <span
            className={`font-display font-extrabold tabular-nums leading-tight mt-0.5 ${
              compact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'
            }`}
            style={{ color: cell.highlight ? accentColor : '#ffffff' }}
          >
            {cell.value}
          </span>
        </div>
      ))}
    </div>
  );
};
