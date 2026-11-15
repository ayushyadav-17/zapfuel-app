import React, { useState } from 'react';
import { ArrowLeft, Check, Minus, Plus, Star, Zap } from 'lucide-react';
import { FlavorVariant, PackOption, Product } from '../types';
import { NutritionHud } from './NutritionHud';

interface ProductDetailScreenProps {
  product: Product;
  initialFlavorId?: string;
  onBack: () => void;
  onAddToBag: (
    product: Product,
    flavor: FlavorVariant,
    pack: PackOption,
    quantity: number,
    isSubscription: boolean
  ) => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  initialFlavorId,
  onBack,
  onAddToBag,
}) => {
  const initialFlavor =
    product.flavors.find((f) => f.id === initialFlavorId) ?? product.flavors[0];

  const [selectedFlavor, setSelectedFlavor] = useState<FlavorVariant>(initialFlavor);
  const [selectedPack, setSelectedPack] = useState<PackOption>(
    product.packOptions[1] ?? product.packOptions[0]
  );
  const [isSubscription, setIsSubscription] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'nutrition' | 'ingredients' | 'reviews'>('nutrition');
  const [addedFeedback, setAddedFeedback] = useState(false);

  const unitPrice = isSubscription
    ? Number((selectedPack.price * 0.85).toFixed(2))
    : selectedPack.price;
  const totalPrice = (unitPrice * quantity).toFixed(2);

  const handleAdd = () => {
    onAddToBag(product, selectedFlavor, selectedPack, quantity, isSubscription);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1200);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb Back */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 font-label text-xs uppercase tracking-[0.08em] text-[#c4c9ac] hover:text-[#CCFF00] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Catalog</span>
        </button>
        <span className="font-label text-xs uppercase tracking-[0.08em] text-[#8e9379]">
          {product.categoryLabel}
        </span>
      </div>

      {/* Main Split PDP Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Sticky Visual Stage */}
        <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-5">
          <div className="relative">
            {/* Floating Sticker Badges */}
            <div
              className="absolute -top-3 left-4 z-20 px-3.5 py-1.5 rounded-full font-label text-xs font-bold uppercase tracking-[0.08em] border-2 border-[#111116] shadow-[3px_3px_0px_#000000] -rotate-2 tabular-nums"
              style={{
                backgroundColor: selectedFlavor.accentHex,
                color:
                  selectedFlavor.accentHex === '#CCFF00' || selectedFlavor.accentHex === '#FFE600'
                    ? '#111116'
                    : '#ffffff',
              }}
            >
              {product.macros.proteinG}G PROTEIN · {product.macros.sugarG}G SUGAR
            </div>

            {product.badgeText && (
              <div className="absolute -bottom-3 right-4 z-20 px-3.5 py-1.5 rounded-full bg-[#FFE600] text-[#111116] font-label text-xs font-bold uppercase tracking-[0.08em] border-2 border-[#111116] shadow-[3px_3px_0px_#FF007F] rotate-2">
                {product.badgeText}
              </div>
            )}

            <div
              className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#0e0e13] neo-shadow-dark"
              style={{ border: `3px solid ${selectedFlavor.accentHex}` }}
            >
              <img
                src={selectedFlavor.image}
                alt={`${product.name} — ${selectedFlavor.name}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Highlights Strip */}
          <div className="bg-[#16161D] border-2 border-[#2a292f] rounded-xl p-5 space-y-2.5">
            <span className="font-label text-xs uppercase tracking-[0.08em] text-[#CCFF00]">
              KEY PERFORMANCE SPECS
            </span>
            <ul className="space-y-2">
              {product.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5 font-body text-sm text-[#e4e1e9]">
                  <Zap
                    className="w-4 h-4 text-[#CCFF00] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Contiguous Purchase Module */}
        <div className="lg:col-span-6 bg-[#16161D] border-2 border-[#2E29FF] rounded-2xl p-6 sm:p-8 neo-shadow-dark space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-label text-xs uppercase tracking-[0.08em] text-[#FF007F]">
                {selectedFlavor.tagline}
              </span>
              <span className="inline-flex items-center gap-1 font-label text-xs text-[#FFE600] tabular-nums">
                <Star className="w-3.5 h-3.5 fill-[#FFE600]" aria-hidden="true" />
                4.9 ({product.reviews.length * 42} Verified)
              </span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white leading-tight">
              {product.name}
            </h1>
            <p className="font-body text-base text-[#c4c9ac] leading-relaxed">
              {product.longDesc}
            </p>
          </div>

          {/* Nutrition Metric HUD */}
          <NutritionHud macros={product.macros} accentColor={selectedFlavor.accentHex} />

          {/* Flavor Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-label text-xs uppercase tracking-[0.08em] text-[#e4e1e9]">
                Flavor: <strong className="text-white">{selectedFlavor.name}</strong>
              </span>
              <span className="font-label text-xs uppercase tracking-[0.08em] text-[#CCFF00]">
                In Stock
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {product.flavors.map((flavor) => {
                const active = flavor.id === selectedFlavor.id;
                return (
                  <button
                    key={flavor.id}
                    type="button"
                    onClick={() => setSelectedFlavor(flavor)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full font-label text-xs uppercase tracking-[0.06em] border-2 transition-all cursor-pointer ${
                      active
                        ? 'bg-[#2a292f] text-white border-white shadow-[3px_3px_0px_#000000]'
                        : 'bg-[#111116] text-[#c4c9ac] border-[#2a292f] hover:border-[#8e9379]'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black"
                      style={{ backgroundColor: flavor.dotColor }}
                      aria-hidden="true"
                    />
                    <span>{flavor.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pack Size Selector */}
          <div className="space-y-2.5">
            <span className="block font-label text-xs uppercase tracking-[0.08em] text-[#e4e1e9]">
              Select Pack Size
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {product.packOptions.map((pack) => {
                const active = pack.id === selectedPack.id;
                return (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => setSelectedPack(pack)}
                    className={`p-3 rounded-lg border-2 text-left transition-all cursor-pointer ${
                      active
                        ? 'bg-[#2E29FF] border-[#CCFF00] text-white shadow-[3px_3px_0px_#111116]'
                        : 'bg-[#111116] border-[#2a292f] text-[#c4c9ac] hover:border-[#2E29FF]'
                    }`}
                  >
                    <div className="font-label text-xs uppercase font-bold">{pack.label}</div>
                    <div className="font-display font-extrabold text-lg text-white tabular-nums mt-0.5">
                      ${pack.price.toFixed(0)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Purchase Mode Radios (Neo-Brutalist Custom Checkboxes/Radios) */}
          <div className="space-y-2.5">
            <span className="block font-label text-xs uppercase tracking-[0.08em] text-[#e4e1e9]">
              Delivery Cadence
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsSubscription(true)}
                className={`p-3.5 rounded-lg border-2 flex items-start gap-3 text-left transition-all cursor-pointer ${
                  isSubscription
                    ? 'bg-[#1b1b20] border-[#CCFF00]'
                    : 'bg-[#111116] border-[#2a292f] hover:border-[#8e9379]'
                }`}
              >
                <span
                  className={`w-5 h-5 mt-0.5 rounded border-2 border-[#111116] flex items-center justify-center shrink-0 ${
                    isSubscription ? 'bg-[#CCFF00] text-[#111116]' : 'bg-[#2a292f]'
                  }`}
                >
                  {isSubscription && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </span>
                <div>
                  <div className="font-label text-xs uppercase font-bold text-white">
                    Auto-Refill · Save 15%
                  </div>
                  <div className="font-body text-xs text-[#c4c9ac] mt-0.5 tabular-nums">
                    ${(selectedPack.price * 0.85).toFixed(2)} every 30 days · Skip anytime
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setIsSubscription(false)}
                className={`p-3.5 rounded-lg border-2 flex items-start gap-3 text-left transition-all cursor-pointer ${
                  !isSubscription
                    ? 'bg-[#1b1b20] border-[#FF007F]'
                    : 'bg-[#111116] border-[#2a292f] hover:border-[#8e9379]'
                }`}
              >
                <span
                  className={`w-5 h-5 mt-0.5 rounded border-2 border-[#111116] flex items-center justify-center shrink-0 ${
                    !isSubscription ? 'bg-[#CCFF00] text-[#111116]' : 'bg-[#2a292f]'
                  }`}
                >
                  {!isSubscription && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </span>
                <div>
                  <div className="font-label text-xs uppercase font-bold text-white">
                    One-Time Drop
                  </div>
                  <div className="font-body text-xs text-[#c4c9ac] mt-0.5 tabular-nums">
                    ${selectedPack.price.toFixed(2)} single shipment
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Quantity Stepper + Add to Bag CTA */}
          <div className="flex items-stretch gap-3 pt-2">
            <div className="flex items-center bg-[#111116] border-2 border-[#2E29FF] rounded px-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="p-2.5 text-white hover:text-[#CCFF00] cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-display font-bold text-base text-white tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="p-2.5 text-white hover:text-[#CCFF00] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className={`neo-btn flex-1 py-3.5 px-6 rounded font-label text-sm uppercase tracking-[0.06em] flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                addedFeedback
                  ? 'bg-[#FF007F] text-white border-2 border-[#111116] shadow-[4px_4px_0px_#CCFF00]'
                  : 'neo-btn-turbo'
              }`}
            >
              {addedFeedback ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Bag · ${totalPrice}</span>
                </>
              ) : (
                <span className="tabular-nums">Add to Bag · ${totalPrice}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Technical Tabs: Nutrition Facts / Ingredients / Reviews */}
      <div className="bg-[#16161D] border-2 border-[#2a292f] rounded-2xl p-6 sm:p-8 neo-shadow-dark space-y-6">
        <div className="flex flex-wrap gap-2 border-b-2 border-[#2a292f] pb-4">
          {[
            { id: 'nutrition' as const, label: 'Full Macro Breakdown' },
            { id: 'ingredients' as const, label: 'Clean Ingredients' },
            { id: 'reviews' as const, label: `Verified Reviews (${product.reviews.length})` },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded font-label text-xs uppercase tracking-[0.08em] border-2 transition-all cursor-pointer ${
                  active
                    ? 'bg-[#CCFF00] text-[#111116] border-[#111116] font-bold shadow-[3px_3px_0px_#FF007F]'
                    : 'bg-[#111116] text-[#c4c9ac] border-[#2a292f] hover:border-[#2E29FF]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'nutrition' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Protein', val: `${product.macros.proteinG}g`, note: '100% Isolate' },
              { label: 'Calories', val: `${product.macros.calories}`, note: 'Per Serving' },
              { label: 'Net Carbs', val: `${product.macros.netCarbsG}g`, note: 'Low Glycemic' },
              { label: 'Added Sugar', val: `${product.macros.sugarG}g`, note: 'No Crash' },
              { label: 'BCAAs', val: `${product.macros.bcaaG}g`, note: 'Naturally Occurring' },
              { label: 'Dietary Fiber', val: `${product.macros.fiberG}g`, note: 'Prebiotic' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[#111116] border-2 border-[#2a292f] rounded-lg p-4"
              >
                <span className="font-label text-[10px] uppercase tracking-[0.1em] text-[#8e9379]">
                  {stat.label}
                </span>
                <div className="font-display font-extrabold text-2xl text-[#CCFF00] tabular-nums mt-1">
                  {stat.val}
                </div>
                <span className="font-body text-xs text-[#c4c9ac]">{stat.note}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.ingredients.map((ing, i) => (
              <div
                key={ing}
                className="flex items-center gap-3 bg-[#111116] border-2 border-[#2a292f] rounded-lg p-4"
              >
                <span className="font-label text-xs font-bold text-[#FF007F] tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-body text-sm text-white">{ing}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {product.reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#111116] border-2 border-[#2E29FF] rounded-xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-label text-xs uppercase tracking-[0.06em] text-[#CCFF00]">
                    Flavor: {rev.flavorName}
                  </span>
                  <div className="flex items-center gap-0.5 text-[#FFE600]">
                    {Array.from({ length: rev.rating }).map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-[#FFE600]" />
                    ))}
                  </div>
                </div>
                <p className="font-body text-sm text-[#e4e1e9] leading-relaxed">"{rev.quote}"</p>
                <div className="font-label text-xs text-[#8e9379]">
                  {rev.author} · {rev.role}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
