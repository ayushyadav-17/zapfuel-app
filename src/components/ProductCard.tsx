import React, { useState } from 'react';
import { ArrowUpRight, Plus, Check } from 'lucide-react';
import { Product, FlavorVariant } from '../types';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product, flavorId: string) => void;
  onQuickAdd: (product: Product, flavor: FlavorVariant) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onQuickAdd,
}) => {
  const [selectedFlavorIdx, setSelectedFlavorIdx] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const activeFlavor = product.flavors[selectedFlavorIdx] ?? product.flavors[0];
  const basePack = product.packOptions[0];

  const borderColor =
    product.borderAccent === 'lime'
      ? '#CCFF00'
      : product.borderAccent === 'magenta'
      ? '#FF007F'
      : '#2E29FF';

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(product, activeFlavor);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1100);
  };

  return (
    <article
      className="group relative flex flex-col bg-[#16161D] rounded-lg neo-shadow-dark transition-transform duration-150 hover:-translate-y-1"
      style={{ border: `2.5px solid ${borderColor}` }}
    >
      {/* Top-Right Dynamic Macro Sticker Cluster */}
      <div className="absolute -top-3.5 right-3 z-20 flex items-center gap-1.5">
        <span
          className="px-2.5 py-1 rounded-full font-label text-[11px] font-bold uppercase tracking-[0.08em] border-2 border-[#111116] shadow-[2px_2px_0px_#000000] rotate-2 tabular-nums"
          style={{
            backgroundColor: activeFlavor.accentHex,
            color:
              activeFlavor.accentHex === '#CCFF00' || activeFlavor.accentHex === '#FFE600'
                ? '#111116'
                : '#ffffff',
          }}
        >
          {product.macros.proteinG}G PROTEIN
        </span>
        <span className="px-2.5 py-1 rounded-full font-label text-[11px] font-bold uppercase tracking-[0.08em] bg-[#111116] text-white border-2 border-[#e4e1e9]/30 shadow-[2px_2px_0px_#000000] -rotate-2 tabular-nums">
          {product.macros.bcaaG}G BCAA
        </span>
      </div>

      {/* Product Visual Stage */}
      <button
        type="button"
        onClick={() => onSelectProduct(product, activeFlavor.id)}
        className="relative w-full aspect-[4/3] overflow-hidden rounded-t-[5px] bg-[#0e0e13] border-b-2 border-[#2a292f] cursor-pointer text-left"
        aria-label={`View ${product.name} details`}
      >
        {!imgError ? (
          <img
            src={activeFlavor.image}
            alt={`${product.name} in ${activeFlavor.name}`}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#1b1b20] to-[#0e0e13]">
            <span className="font-display font-extrabold text-2xl text-[#CCFF00]">
              {product.name}
            </span>
            <span className="font-label text-xs uppercase tracking-widest text-[#c4c9ac] mt-2">
              {activeFlavor.name}
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#16161D] via-[#16161D]/40 to-transparent pointer-events-none" />
        <span className="absolute bottom-3 left-3 font-label text-[11px] uppercase tracking-[0.1em] text-white/90 bg-[#111116]/85 px-2 py-0.5 rounded border border-white/15">
          {product.categoryLabel}
        </span>
      </button>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display font-extrabold text-xl text-white leading-tight">
              <button
                type="button"
                onClick={() => onSelectProduct(product, activeFlavor.id)}
                className="text-left hover:text-[#CCFF00] transition-colors cursor-pointer"
              >
                {product.name}
              </button>
            </h3>
            <p className="font-body text-sm text-[#c4c9ac] mt-1.5 line-clamp-2 leading-snug">
              {product.shortDesc}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="font-display font-extrabold text-xl text-white tabular-nums">
              ${basePack.price.toFixed(0)}
            </div>
            <div className="font-label text-[10px] uppercase tracking-[0.08em] text-[#c4c9ac] whitespace-nowrap">
              {basePack.label}
            </div>
          </div>
        </div>

        {/* Interactive Flavor Selector Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {product.flavors.map((flavor, idx) => {
            const isSelected = idx === selectedFlavorIdx;
            return (
              <button
                key={flavor.id}
                type="button"
                onClick={() => {
                  setSelectedFlavorIdx(idx);
                  setImgError(false);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label text-[11px] uppercase tracking-[0.05em] border-2 transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#2a292f] text-white border-white shadow-[2px_2px_0px_#000000]'
                    : 'bg-[#111116] text-[#c4c9ac] border-[#2a292f] hover:border-[#8e9379]'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black shrink-0"
                  style={{ backgroundColor: flavor.dotColor }}
                  aria-hidden="true"
                />
                <span>{flavor.name}</span>
              </button>
            );
          })}
        </div>

        {/* Compact Macro Strip */}
        <div className="grid grid-cols-3 bg-[#111116] border border-[#2a292f] rounded text-center py-2">
          <div className="border-r border-[#2a292f] px-1">
            <span className="block font-label text-[10px] text-[#8e9379] uppercase">CALS</span>
            <span className="font-display font-bold text-sm text-white tabular-nums">
              {product.macros.calories}
            </span>
          </div>
          <div className="border-r border-[#2a292f] px-1">
            <span className="block font-label text-[10px] text-[#8e9379] uppercase">CARBS</span>
            <span className="font-display font-bold text-sm text-white tabular-nums">
              {product.macros.netCarbsG}g
            </span>
          </div>
          <div className="px-1">
            <span className="block font-label text-[10px] text-[#8e9379] uppercase">SUGAR</span>
            <span className="font-display font-bold text-sm text-[#CCFF00] tabular-nums">
              {product.macros.sugarG}g
            </span>
          </div>
        </div>

        {/* Action Row */}
        <div className="mt-auto pt-1 flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleQuickAddClick}
            className={`neo-btn flex-1 py-2.5 px-4 rounded font-label text-xs uppercase tracking-[0.06em] flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
              justAdded
                ? 'bg-[#FF007F] text-white border-2 border-[#111116] shadow-[4px_4px_0px_#CCFF00]'
                : 'neo-btn-turbo'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Add {basePack.label}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onSelectProduct(product, activeFlavor.id)}
            className="neo-btn neo-btn-secondary py-2.5 px-3.5 rounded font-label text-xs uppercase tracking-[0.06em] flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
            aria-label={`Inspect ${product.name}`}
          >
            <span>Specs</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
};
