import React, { useState } from 'react';
import { ArrowRight, Flame, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { HERO_IMAGE, PRODUCTS } from '../data/products';
import { FlavorVariant, Product, ScreenRoute } from '../types';
import { NutritionHud } from './NutritionHud';
import { ProductCard } from './ProductCard';

interface HeroDropProps {
  onNavigate: (screen: ScreenRoute) => void;
  onSelectProduct: (product: Product, flavorId: string) => void;
  onQuickAdd: (product: Product, flavor: FlavorVariant) => void;
}

export const HeroDrop: React.FC<HeroDropProps> = ({
  onNavigate,
  onSelectProduct,
  onQuickAdd,
}) => {
  const [heroImgError, setHeroImgError] = useState(false);
  const flagship = PRODUCTS[0];
  const featuredProducts = PRODUCTS.slice(0, 3);

  return (
    <div className="space-y-16 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-8 sm:pt-12 lg:pt-16 pb-4 overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Column: Typography + HUD + Dual Actions */}
            <div className="lg:col-span-6 flex flex-col justify-between gap-8">
              <div className="space-y-5">
                {/* Rotated Drop Tag */}
                <div className="inline-flex items-center gap-2 bg-[#FF007F] text-white px-3.5 py-1.5 rounded-full border-2 border-[#111116] shadow-[3px_3px_0px_#CCFF00] -rotate-2">
                  <Flame className="w-4 h-4 fill-white" aria-hidden="true" />
                  <span className="font-label text-xs font-bold uppercase tracking-[0.08em]">
                    DROP 04 · COLD-FILTERED ISOLATE
                  </span>
                </div>

                <h1 className="font-display font-extrabold text-[44px] leading-[48px] sm:text-[62px] sm:leading-[66px] tracking-[-0.03em] text-white [text-wrap:balance]">
                  HIGH-VOLTAGE PROTEIN.{' '}
                  <span className="text-[#CCFF00]">ZERO SUGAR CRASH.</span>
                </h1>

                <p className="font-body text-base sm:text-lg text-[#c4c9ac] max-w-xl leading-relaxed">
                  Crisp yuzu-lime shakes, puffed chocolate caramel bars, and sour berry crunch bites.
                  30g cold-filtered isolate with 0g added sugar—built for late nights, early lifts,
                  and nonstop output.
                </p>

                {/* Primary & Secondary CTAs */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('catalog')}
                    className="neo-btn neo-btn-turbo px-6 py-3.5 rounded font-label text-sm uppercase tracking-[0.06em] flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <span>Shop the Drop</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('builder')}
                    className="neo-btn neo-btn-secondary px-6 py-3.5 rounded font-label text-sm uppercase tracking-[0.06em] flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <Sparkles className="w-4 h-4 text-[#CCFF00]" aria-hidden="true" />
                    <span>Build Variety Box</span>
                  </button>
                </div>
              </div>

              {/* Racing Telemetry Nutrition Metric HUD */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-label uppercase tracking-[0.08em] text-[#c4c9ac]">
                  <span>Flagship Shake Telemetry · 12 fl oz</span>
                  <button
                    type="button"
                    onClick={() => onSelectProduct(flagship, flagship.flavors[0].id)}
                    className="text-[#CCFF00] hover:underline cursor-pointer"
                  >
                    Inspect Full Label
                  </button>
                </div>
                <NutritionHud macros={flagship.macros} accentColor="#CCFF00" />
              </div>
            </div>

            {/* Right Column: Hero Product Stage with Overlapping Stickers */}
            <div className="lg:col-span-6 relative flex flex-col">
              {/* Top-Right Sticker Stamp */}
              <div className="hidden sm:flex absolute -top-4 right-4 z-20 items-center gap-2 bg-[#CCFF00] text-[#111116] px-4 py-2 rounded-full border-[2.5px] border-[#111116] shadow-[4px_4px_0px_#FF007F] rotate-3">
                <span className="font-display font-extrabold text-lg tabular-nums">30G PROTEIN</span>
              </div>

              {/* Bottom-Left Sticker Stamp */}
              <div className="hidden sm:flex absolute -bottom-4 left-4 z-20 items-center gap-2 bg-[#2E29FF] text-white px-4 py-2 rounded-full border-[2.5px] border-[#111116] shadow-[4px_4px_0px_#CCFF00] -rotate-2">
                <span className="font-label text-xs font-bold uppercase tracking-[0.08em] tabular-nums">
                  0G SUGAR · 350MG ELECTROLYTES
                </span>
              </div>

              <div className="relative flex-1 min-h-[320px] lg:min-h-full bg-[#16161D] border-[3px] border-[#2E29FF] rounded-2xl neo-shadow-dark overflow-hidden">
                {!heroImgError ? (
                  <img
                    src={HERO_IMAGE}
                    alt="ZAPFUEL Voltage Lime, Cyber Magenta, and Cobalt Blue 30g protein shakes"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgError(true)}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-10 bg-[#16161D]">
                    <span className="font-display font-extrabold text-3xl text-[#CCFF00]">
                      ZAPFUEL DROP 04
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#111116]/85 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-5 right-5 left-5 sm:left-auto flex items-center justify-between sm:justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => onSelectProduct(flagship, 'voltage-lime')}
                    className="bg-[#111116]/90 hover:bg-[#CCFF00] hover:text-[#111116] text-white border-2 border-[#CCFF00] px-4 py-2 rounded font-label text-xs uppercase tracking-[0.08em] transition-colors cursor-pointer"
                  >
                    Tap to Shop Volt Zest →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROOF / VALUE STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#16161D] border-2 border-[#2a292f] rounded-lg p-5 flex items-start gap-4 neo-shadow-dark">
            <div className="p-2.5 rounded bg-[#CCFF00] text-[#111116] border-2 border-[#111116] shrink-0">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-white">
                Cold-Filtered Grass-Fed Isolate
              </h2>
              <p className="font-body text-sm text-[#c4c9ac] mt-1">
                100% lactose-free whey isolate with zero chalky thickeners, gums, or maltitol.
              </p>
            </div>
          </div>

          <div className="bg-[#16161D] border-2 border-[#2a292f] rounded-lg p-5 flex items-start gap-4 neo-shadow-dark">
            <div className="p-2.5 rounded bg-[#FF007F] text-white border-2 border-[#111116] shrink-0">
              <Flame className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-white">
                Candy-Level Crunch & Citrus Snap
              </h2>
              <p className="font-body text-sm text-[#c4c9ac] mt-1">
                Real toasted protein crisps and yuzu-berry extracts engineered to taste illicit.
              </p>
            </div>
          </div>

          <div className="bg-[#16161D] border-2 border-[#2a292f] rounded-lg p-5 flex items-start gap-4 neo-shadow-dark">
            <div className="p-2.5 rounded bg-[#2E29FF] text-white border-2 border-[#111116] shrink-0">
              <Truck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-white">
                Free Express Cold-Safe Drop at $45+
              </h2>
              <p className="font-body text-sm text-[#c4c9ac] mt-1">
                Dispatched within 24 hours. Use promo code <strong className="text-[#CCFF00]">VOLT15</strong> at checkout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED LINEUP SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-[#2a292f] pb-5">
          <div>
            <span className="font-label text-xs uppercase tracking-[0.1em] text-[#FF007F]">
              CORE LINEUP · HIGH VELOCITY
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-1">
              Featured Shakes & Crunch Drops
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('catalog')}
            className="neo-btn neo-btn-secondary px-4 py-2.5 rounded font-label text-xs uppercase tracking-[0.06em] self-start sm:self-auto cursor-pointer whitespace-nowrap"
          >
            View All 6 Drops →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 pt-2">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onQuickAdd={onQuickAdd}
            />
          ))}
        </div>
      </section>

      {/* CUSTOM BOX PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2E29FF] border-[3px] border-[#111116] rounded-2xl p-6 sm:p-10 neo-shadow-lime flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-block bg-[#FFE600] text-[#111116] font-label text-xs font-bold uppercase tracking-[0.08em] px-3 py-1 rounded-full border-2 border-[#111116] -rotate-1">
              CUSTOM STACK BUILDER · SAVE UP TO 20%
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white leading-tight">
              Mix Your Own 12-Slot Fridge & Gym Stack.
            </h2>
            <p className="font-body text-base text-white/90">
              Pair 30g Voltage Lime shakes with Cobalt Crunch bars and Power Crunch pouches in one
              custom drop box with real-time macro telemetry.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('builder')}
            className="neo-btn neo-btn-turbo px-6 py-4 rounded font-label text-sm uppercase tracking-[0.06em] shrink-0 cursor-pointer whitespace-nowrap"
          >
            Launch Box Builder →
          </button>
        </div>
      </section>
    </div>
  );
};
