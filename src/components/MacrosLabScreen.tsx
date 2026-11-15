import React, { useMemo, useState } from 'react';
import { ArrowRight, Check, Flame, Zap } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';

interface MacrosLabScreenProps {
  onSelectProduct: (product: Product, flavorId: string) => void;
}

type GoalMode = 'lean-cut' | 'muscle-build' | 'endurance';

export const MacrosLabScreen: React.FC<MacrosLabScreenProps> = ({ onSelectProduct }) => {
  const [weightLbs, setWeightLbs] = useState(165);
  const [goal, setGoal] = useState<GoalMode>('muscle-build');

  const dailyTarget = useMemo(() => {
    const multiplier = goal === 'lean-cut' ? 1.0 : goal === 'muscle-build' ? 0.9 : 0.75;
    return Math.round(weightLbs * multiplier);
  }, [weightLbs, goal]);

  const recommendedProduct = useMemo(() => {
    if (goal === 'lean-cut') return PRODUCTS[3]; // Power Crunch Bites (150 cal, 20g pro)
    if (goal === 'endurance') return PRODUCTS[0]; // Volt Zest 30G Shake (350mg electrolytes)
    return PRODUCTS[4]; // Hyper Starter 12-Drop
  }, [goal]);

  const comparisonRows = [
    {
      metric: 'Protein per Serving',
      zapfuel: '30g Isolate',
      legacyShake: '20g Concentrate',
      candyBar: '14g Soy Blend',
      win: true,
    },
    {
      metric: 'Added Sugar',
      zapfuel: '0g',
      legacyShake: '9g Cane Sugar',
      candyBar: '18g Corn Syrup',
      win: true,
    },
    {
      metric: 'Calories',
      zapfuel: '160 kcal',
      legacyShake: '240 kcal',
      candyBar: '290 kcal',
      win: true,
    },
    {
      metric: 'BCAAs (Naturally Occurring)',
      zapfuel: '5.5g',
      legacyShake: '3.2g',
      candyBar: '2.1g',
      win: true,
    },
    {
      metric: 'Sugar Alcohols / Maltitol',
      zapfuel: '0g (None)',
      legacyShake: '4g Erythritol',
      candyBar: '12g Maltitol',
      win: true,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Header */}
      <div className="border-b-2 border-[#2a292f] pb-6 space-y-2">
        <span className="font-label text-xs uppercase tracking-[0.1em] text-[#CCFF00]">
          MACROS LAB · TRANSPARENT TELEMETRY
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white">
          Clean Protein Math. Zero Fillers.
        </h1>
        <p className="font-body text-base text-[#c4c9ac] max-w-2xl">
          Dial in your daily protein target and see how cold-filtered ZAPFUEL stacks compare against
          legacy chalky shakes and sugar-loaded snack bars.
        </p>
      </div>

      {/* Interactive Daily Protein Target Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 bg-[#16161D] border-2 border-[#2E29FF] rounded-2xl p-6 sm:p-8 neo-shadow-dark space-y-6">
          <div className="flex items-center gap-2 text-[#CCFF00]">
            <Zap className="w-5 h-5 fill-[#CCFF00]" aria-hidden="true" />
            <h2 className="font-display font-extrabold text-2xl text-white">
              Daily Fuel Target Calculator
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="weight-slider"
                className="font-label text-xs uppercase tracking-[0.08em] text-[#c4c9ac]"
              >
                Body Weight (lbs)
              </label>
              <span className="font-display font-extrabold text-2xl text-[#CCFF00] tabular-nums">
                {weightLbs} LBS
              </span>
            </div>
            <input
              id="weight-slider"
              type="range"
              min={95}
              max={280}
              step={5}
              value={weightLbs}
              onChange={(e) => setWeightLbs(Number(e.target.value))}
              className="w-full accent-[#CCFF00] cursor-pointer h-2 bg-[#111116] rounded-lg"
            />
            <div className="flex justify-between font-label text-[10px] text-[#8e9379] uppercase tabular-nums">
              <span>95 lbs</span>
              <span>185 lbs</span>
              <span>280 lbs</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <span className="block font-label text-xs uppercase tracking-[0.08em] text-[#c4c9ac]">
              Training Phase
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'lean-cut' as const, label: 'Lean Shred', sub: '1.0g / lb' },
                { id: 'muscle-build' as const, label: 'Hypertrophy', sub: '0.9g / lb' },
                { id: 'endurance' as const, label: 'All-Day Output', sub: '0.75g / lb' },
              ].map((m) => {
                const active = goal === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setGoal(m.id)}
                    className={`p-3.5 rounded-lg border-2 text-left transition-all cursor-pointer ${
                      active
                        ? 'bg-[#CCFF00] text-[#111116] border-[#111116] shadow-[3px_3px_0px_#FF007F]'
                        : 'bg-[#111116] text-white border-[#2a292f] hover:border-[#2E29FF]'
                    }`}
                  >
                    <div className="font-label text-xs uppercase font-bold">{m.label}</div>
                    <div
                      className={`font-body text-xs mt-0.5 tabular-nums ${
                        active ? 'text-[#111116]/80 font-bold' : 'text-[#8e9379]'
                      }`}
                    >
                      {m.sub} target
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calculated Readout */}
          <div className="bg-[#111116] border-2 border-[#2a292f] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-label text-xs uppercase tracking-[0.08em] text-[#FF007F]">
                RECOMMENDED DAILY TARGET
              </span>
              <div className="font-display font-extrabold text-4xl text-white tabular-nums mt-1">
                {dailyTarget}G PROTEIN / DAY
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="font-label text-xs uppercase tracking-[0.08em] text-[#c4c9ac]">
                ZAPFUEL COVERAGE
              </span>
              <div className="font-display font-bold text-lg text-[#CCFF00] tabular-nums">
                2 Drops = 60g ({Math.min(100, Math.round((60 / dailyTarget) * 100))}%)
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Product Match Card */}
        <div className="lg:col-span-5 bg-[#16161D] border-[2.5px] border-[#FF007F] rounded-2xl p-6 neo-shadow-dark flex flex-col justify-between gap-5">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF007F] text-white font-label text-[11px] font-bold uppercase tracking-[0.08em]">
              <Flame className="w-3.5 h-3.5" aria-hidden="true" />
              BEST MATCH FOR YOUR GOAL
            </span>
            <h3 className="font-display font-extrabold text-2xl text-white">
              {recommendedProduct.name}
            </h3>
            <p className="font-body text-sm text-[#c4c9ac]">{recommendedProduct.shortDesc}</p>
          </div>

          <div className="aspect-[16/10] rounded-xl overflow-hidden border-2 border-[#2a292f] bg-[#0e0e13]">
            <img
              src={recommendedProduct.flavors[0].image}
              alt={recommendedProduct.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <button
            type="button"
            onClick={() =>
              onSelectProduct(recommendedProduct, recommendedProduct.flavors[0].id)
            }
            className="neo-btn neo-btn-turbo w-full py-3.5 px-5 rounded font-label text-xs uppercase tracking-[0.06em] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Inspect {recommendedProduct.name}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Head-to-Head Comparison Table */}
      <div className="bg-[#16161D] border-2 border-[#2a292f] rounded-2xl overflow-hidden neo-shadow-dark">
        <div className="p-6 border-b-2 border-[#2a292f]">
          <h2 className="font-display font-extrabold text-2xl text-white">
            Head-to-Head Macro Audit
          </h2>
          <p className="font-body text-sm text-[#c4c9ac] mt-1">
            ZAPFUEL Volt Zest 30G Shake compared to typical grocery RTD shakes and protein candy bars.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#111116] border-b-2 border-[#2a292f]">
                <th className="py-3.5 px-5 font-label text-xs uppercase tracking-[0.08em] text-[#c4c9ac]">
                  Metric
                </th>
                <th className="py-3.5 px-5 font-label text-xs uppercase tracking-[0.08em] text-[#CCFF00]">
                  ZAPFUEL Volt Zest
                </th>
                <th className="py-3.5 px-5 font-label text-xs uppercase tracking-[0.08em] text-[#8e9379]">
                  Legacy Whey RTD
                </th>
                <th className="py-3.5 px-5 font-label text-xs uppercase tracking-[0.08em] text-[#8e9379]">
                  Snack Candy Bar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a292f]">
              {comparisonRows.map((row) => (
                <tr key={row.metric} className="hover:bg-[#1b1b20] transition-colors">
                  <td className="py-4 px-5 font-body font-medium text-sm text-white">
                    {row.metric}
                  </td>
                  <td className="py-4 px-5 font-display font-bold text-base text-[#CCFF00] tabular-nums">
                    <span className="inline-flex items-center gap-1.5">
                      <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                      {row.zapfuel}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-body text-sm text-[#c4c9ac] tabular-nums">
                    {row.legacyShake}
                  </td>
                  <td className="py-4 px-5 font-body text-sm text-[#c4c9ac] tabular-nums">
                    {row.candyBar}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
