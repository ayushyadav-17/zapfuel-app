import React, { useMemo, useState } from 'react';
import { Check, PackagePlus, RotateCcw, Sparkles, Trash2, X } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { CartItem } from '../types';

interface BoxBuilderScreenProps {
  onAddCustomBox: (item: CartItem) => void;
}

interface SlotItem {
  productId: string;
  productName: string;
  flavorId: string;
  flavorName: string;
  dotColor: string;
  proteinG: number;
  calories: number;
  sugarG: number;
  image: string;
}

const BOX_TIERS = [
  { slots: 6, label: '6-Slot Mini Stack', discountPct: 10, basePrice: 23.0 },
  { slots: 12, label: '12-Slot Pro Box', discountPct: 15, basePrice: 41.0 },
  { slots: 18, label: '18-Slot Vault', discountPct: 20, basePrice: 58.0 },
] as const;

export const BoxBuilderScreen: React.FC<BoxBuilderScreenProps> = ({ onAddCustomBox }) => {
  const [boxSize, setBoxSize] = useState<6 | 12 | 18>(12);
  const [selectedSlots, setSelectedSlots] = useState<SlotItem[]>([]);
  const [justAdded, setJustAdded] = useState(false);

  const singleItems = useMemo(() => {
    const items: SlotItem[] = [];
    for (const p of PRODUCTS) {
      if (p.category === 'packs') continue;
      for (const f of p.flavors) {
        items.push({
          productId: p.id,
          productName: p.name,
          flavorId: f.id,
          flavorName: f.name,
          dotColor: f.dotColor,
          proteinG: p.macros.proteinG,
          calories: p.macros.calories,
          sugarG: p.macros.sugarG,
          image: f.image,
        });
      }
    }
    return items;
  }, []);

  const currentTier = BOX_TIERS.find((t) => t.slots === boxSize) ?? BOX_TIERS[1];
  const isFull = selectedSlots.length === boxSize;

  const handleSizeChange = (newSize: 6 | 12 | 18) => {
    setBoxSize(newSize);
    setSelectedSlots((prev) => prev.slice(0, newSize));
  };

  const handleAddSlot = (item: SlotItem) => {
    if (selectedSlots.length >= boxSize) return;
    setSelectedSlots((prev) => [...prev, item]);
  };

  const handleRemoveSlot = (index: number) => {
    setSelectedSlots((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAutoFill = () => {
    const filled: SlotItem[] = [...selectedSlots];
    let i = 0;
    while (filled.length < boxSize) {
      filled.push(singleItems[i % singleItems.length]);
      i += 1;
    }
    setSelectedSlots(filled);
  };

  const totals = useMemo(() => {
    const protein = selectedSlots.reduce((sum, s) => sum + s.proteinG, 0);
    const calories = selectedSlots.reduce((sum, s) => sum + s.calories, 0);
    const sugar = selectedSlots.reduce((sum, s) => sum + s.sugarG, 0);
    return { protein, calories, sugar };
  }, [selectedSlots]);

  const handleCheckoutBox = () => {
    if (!isFull) return;
    const counts = new Map<string, number>();
    for (const s of selectedSlots) {
      const label = `${s.productName} (${s.flavorName})`;
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
    const summary = Array.from(counts.entries())
      .map(([name, qty]) => `${qty}x ${name}`)
      .join(', ');

    const customKey = `custom-box-${boxSize}-${Date.now()}`;
    onAddCustomBox({
      cartKey: customKey,
      productId: `custom-box-${boxSize}`,
      productName: `Custom ${currentTier.label}`,
      categoryLabel: `Save ${currentTier.discountPct}% Bundle`,
      flavorId: 'custom-mix',
      flavorName: `${boxSize} Custom Picks`,
      flavorDot: '#CCFF00',
      packId: `slots-${boxSize}`,
      packLabel: `${boxSize}-Slot Box`,
      unitPrice: currentTier.basePrice,
      isSubscription: false,
      quantity: 1,
      image: selectedSlots[0]?.image ?? singleItems[0].image,
      customSummary: summary,
    });

    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-[#2a292f] pb-6">
        <div>
          <span className="font-label text-xs uppercase tracking-[0.1em] text-[#FF007F]">
            INTERACTIVE STACK CONFIGURATOR
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white mt-1">
            Build Your Own Neon Box
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {BOX_TIERS.map((tier) => {
            const active = tier.slots === boxSize;
            return (
              <button
                key={tier.slots}
                type="button"
                onClick={() => handleSizeChange(tier.slots)}
                className={`px-4 py-2 rounded font-label text-xs uppercase tracking-[0.06em] border-2 transition-all cursor-pointer ${
                  active
                    ? 'bg-[#CCFF00] text-[#111116] border-[#111116] font-bold shadow-[3px_3px_0px_#FF007F]'
                    : 'bg-[#16161D] text-[#e4e1e9] border-[#2E29FF] hover:bg-[#2E29FF]'
                }`}
              >
                {tier.label} · {tier.discountPct}% Off
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Pickable Shakes, Bars, and Bites */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-white">
              Tap Items to Load Slots ({selectedSlots.length}/{boxSize})
            </h2>
            <button
              type="button"
              onClick={handleAutoFill}
              disabled={isFull}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#16161D] border-2 border-[#2E29FF] font-label text-xs uppercase tracking-[0.06em] text-[#CCFF00] hover:bg-[#2E29FF] hover:text-white disabled:opacity-40 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Auto-Fill Remaining</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {singleItems.map((item) => (
              <div
                key={`${item.productId}-${item.flavorId}`}
                className="bg-[#16161D] border-2 border-[#2a292f] hover:border-[#CCFF00] rounded-xl p-4 flex items-center gap-4 neo-shadow-dark transition-colors"
              >
                <img
                  src={item.image}
                  alt={`${item.productName} ${item.flavorName}`}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-lg object-cover border-2 border-[#2a292f] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.dotColor }}
                      aria-hidden="true"
                    />
                    <span className="font-label text-[11px] uppercase tracking-[0.06em] text-[#c4c9ac] truncate">
                      {item.flavorName}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-white truncate mt-0.5">
                    {item.productName}
                  </h3>
                  <div className="font-label text-[11px] text-[#CCFF00] tabular-nums mt-0.5">
                    {item.proteinG}G PROTEIN · {item.calories} KCAL
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isFull}
                  onClick={() => handleAddSlot(item)}
                  aria-label={`Add ${item.productName} ${item.flavorName} to box`}
                  className="neo-btn neo-btn-turbo px-3 py-2 rounded font-label text-xs uppercase tracking-[0.06em] disabled:opacity-40 cursor-pointer shrink-0"
                >
                  + Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Sticky Box Tray & Telemetry */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 bg-[#16161D] border-[2.5px] border-[#CCFF00] rounded-2xl p-6 neo-shadow-dark space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label text-xs uppercase tracking-[0.08em] text-[#CCFF00]">
                YOUR CUSTOM STACK
              </span>
              <h2 className="font-display font-extrabold text-2xl text-white">
                {currentTier.label}
              </h2>
            </div>
            {selectedSlots.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedSlots([])}
                className="inline-flex items-center gap-1 font-label text-xs uppercase tracking-[0.06em] text-[#FF007F] hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-label text-xs uppercase tracking-[0.06em]">
              <span className="text-[#c4c9ac]">
                Slots Filled:{' '}
                <strong className="text-white tabular-nums">
                  {selectedSlots.length} / {boxSize}
                </strong>
              </span>
              <span className="text-[#CCFF00] tabular-nums">
                {isFull ? 'READY TO SHIP!' : `${boxSize - selectedSlots.length} left`}
              </span>
            </div>
            <div className="h-3 bg-[#111116] border-2 border-[#2a292f] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#CCFF00] transition-all duration-200"
                style={{ width: `${(selectedSlots.length / boxSize) * 100}%` }}
              />
            </div>
          </div>

          {/* Visual Slot Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
            {Array.from({ length: boxSize }).map((_, idx) => {
              const slot = selectedSlots[idx];
              if (!slot) {
                return (
                  <div
                    key={idx}
                    className="h-16 rounded-lg border-2 border-dashed border-[#2a292f] bg-[#111116]/60 flex items-center justify-center font-label text-[10px] text-[#8e9379] uppercase tabular-nums"
                  >
                    Slot {idx + 1}
                  </div>
                );
              }
              return (
                <div
                  key={`${slot.productId}-${idx}`}
                  className="relative h-16 rounded-lg border-2 bg-[#111116] p-2 flex flex-col justify-between group"
                  style={{ borderColor: slot.dotColor }}
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveSlot(idx)}
                    aria-label={`Remove ${slot.flavorName} from slot ${idx + 1}`}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#FF007F] text-white border border-[#111116] flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <span className="font-label text-[10px] uppercase tracking-[0.04em] text-white truncate font-bold">
                    {slot.flavorName}
                  </span>
                  <span className="font-label text-[10px] text-[#CCFF00] tabular-nums">
                    {slot.proteinG}G PRO
                  </span>
                </div>
              );
            })}
          </div>

          {/* Box Totals Telemetry */}
          <div className="grid grid-cols-3 bg-[#111116] border-2 border-[#2a292f] rounded-lg overflow-hidden text-center">
            <div className="p-3 border-r-2 border-[#2a292f]">
              <span className="block font-label text-[10px] text-[#8e9379] uppercase">
                TOTAL PROTEIN
              </span>
              <span className="font-display font-extrabold text-xl text-[#CCFF00] tabular-nums">
                {totals.protein}G
              </span>
            </div>
            <div className="p-3 border-r-2 border-[#2a292f]">
              <span className="block font-label text-[10px] text-[#8e9379] uppercase">
                TOTAL SUGAR
              </span>
              <span className="font-display font-extrabold text-xl text-white tabular-nums">
                {totals.sugar}G
              </span>
            </div>
            <div className="p-3">
              <span className="block font-label text-[10px] text-[#8e9379] uppercase">
                BOX PRICE
              </span>
              <span className="font-display font-extrabold text-xl text-[#FF007F] tabular-nums">
                ${currentTier.basePrice.toFixed(0)}
              </span>
            </div>
          </div>

          {/* Add Custom Box CTA */}
          <button
            type="button"
            disabled={!isFull}
            onClick={handleCheckoutBox}
            className={`neo-btn w-full py-3.5 px-6 rounded font-label text-sm uppercase tracking-[0.06em] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
              justAdded
                ? 'bg-[#FF007F] text-white border-2 border-[#111116] shadow-[4px_4px_0px_#CCFF00]'
                : 'neo-btn-turbo'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Custom Stack Added to Bag!</span>
              </>
            ) : (
              <>
                <PackagePlus className="w-4 h-4" />
                <span>
                  {isFull
                    ? `Add ${boxSize}-Slot Stack · $${currentTier.basePrice.toFixed(2)}`
                    : `Fill ${boxSize - selectedSlots.length} More Slot${
                        boxSize - selectedSlots.length === 1 ? '' : 's'
                      }`}
                </span>
              </>
            )}
          </button>

          {selectedSlots.length > 0 && !isFull && (
            <button
              type="button"
              onClick={() => setSelectedSlots([])}
              className="w-full py-1.5 font-label text-[11px] uppercase tracking-[0.06em] text-[#8e9379] hover:text-white flex items-center justify-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" aria-hidden="true" />
              <span>Reset All Slots</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
