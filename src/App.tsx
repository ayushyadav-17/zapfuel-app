import React, { useState } from 'react';
import { Check, Zap } from 'lucide-react';
import { PRODUCTS } from './data/products';
import { CartItem, FlavorVariant, PackOption, Product, ScreenRoute } from './types';
import { Navbar } from './components/Navbar';
import { HeroDrop } from './components/HeroDrop';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { BoxBuilderScreen } from './components/BoxBuilderScreen';
import { MacrosLabScreen } from './components/MacrosLabScreen';
import { CartDrawer } from './components/CartDrawer';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenRoute>('drop');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [selectedFlavorId, setSelectedFlavorId] = useState<string>(PRODUCTS[0].flavors[0].id);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => {
      setToastMsg((current) => (current === msg ? null : current));
    }, 2400);
  };

  const handleSelectProduct = (product: Product, flavorId: string) => {
    setSelectedProduct(product);
    setSelectedFlavorId(flavorId);
    setActiveScreen('pdp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToBag = (
    product: Product,
    flavor: FlavorVariant,
    pack: PackOption,
    quantity: number,
    isSubscription: boolean
  ) => {
    const unitPrice = isSubscription ? Number((pack.price * 0.85).toFixed(2)) : pack.price;
    const cartKey = `${product.id}-${flavor.id}-${pack.id}-${isSubscription ? 'sub' : 'one'}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.cartKey === cartKey);
      if (existing) {
        return prev.map((item) =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          cartKey,
          productId: product.id,
          productName: product.name,
          categoryLabel: product.categoryLabel,
          flavorId: flavor.id,
          flavorName: flavor.name,
          flavorDot: flavor.dotColor,
          packId: pack.id,
          packLabel: pack.label,
          unitPrice,
          isSubscription,
          quantity,
          image: flavor.image,
        },
      ];
    });

    showToast(`Added ${product.name} (${flavor.name}) to Bag`);
  };

  const handleQuickAdd = (product: Product, flavor: FlavorVariant) => {
    const defaultPack = product.packOptions[0];
    handleAddToBag(product, flavor, defaultPack, 1, false);
  };

  const handleAddCustomBox = (customItem: CartItem) => {
    setCartItems((prev) => [...prev, customItem]);
    showToast(`Added ${customItem.productName} to Bag`);
    setIsCartOpen(true);
  };

  const handleUpdateQty = (cartKey: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (cartKey: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#131318] text-[#e4e1e9]">
      {/* Slim Dismissible Promo Strip (<= 40px) */}
      <div className="bg-[#CCFF00] text-[#111116] border-b-2 border-[#111116] px-4 py-1.5 text-center">
        <p className="font-label text-[11px] font-bold uppercase tracking-[0.08em]">
          FREE EXPRESS COLD SHIPPING AT $45+ · USE CODE <span className="underline">VOLT15</span> FOR 15% OFF
        </p>
      </div>

      <Navbar
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1">
        {activeScreen === 'drop' && (
          <HeroDrop
            onNavigate={setActiveScreen}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
          />
        )}

        {activeScreen === 'catalog' && (
          <ProductCatalog
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
          />
        )}

        {activeScreen === 'pdp' && (
          <ProductDetailScreen
            product={selectedProduct}
            initialFlavorId={selectedFlavorId}
            onBack={() => setActiveScreen('catalog')}
            onAddToBag={handleAddToBag}
          />
        )}

        {activeScreen === 'builder' && (
          <BoxBuilderScreen onAddCustomBox={handleAddCustomBox} />
        )}

        {activeScreen === 'lab' && (
          <MacrosLabScreen onSelectProduct={handleSelectProduct} />
        )}
      </main>

      {/* Quiet Neo-Brutalist Footer */}
      <footer className="border-t-2 border-[#2a292f] bg-[#0e0e13] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-display font-extrabold text-xl text-white">
              <Zap className="w-5 h-5 text-[#CCFF00] fill-[#CCFF00]" aria-hidden="true" />
              <span>ZAPFUEL NUTRITION</span>
            </div>
            <p className="font-body text-xs text-[#8e9379]">
              Cold-filtered 30g isolate shakes & crisp protein snacks. Formulated in Portland, OR.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-label text-xs uppercase tracking-[0.08em] text-[#c4c9ac]">
            <button
              type="button"
              onClick={() => setActiveScreen('drop')}
              className="hover:text-[#CCFF00] cursor-pointer"
            >
              The Drop
            </button>
            <button
              type="button"
              onClick={() => setActiveScreen('catalog')}
              className="hover:text-[#CCFF00] cursor-pointer"
            >
              Shakes & Bars
            </button>
            <button
              type="button"
              onClick={() => setActiveScreen('builder')}
              className="hover:text-[#CCFF00] cursor-pointer"
            >
              Build a Box
            </button>
            <button
              type="button"
              onClick={() => setActiveScreen('lab')}
              className="hover:text-[#CCFF00] cursor-pointer"
            >
              Macros Lab
            </button>
          </div>

          <p className="font-label text-[11px] uppercase tracking-[0.06em] text-[#8e9379]">
            © 2026 ZAPFUEL INC. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Toast Notification */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 bg-[#CCFF00] text-[#111116] border-[2.5px] border-[#111116] shadow-[4px_4px_0px_#FF007F] rounded-lg px-4 py-3 flex items-center gap-2.5"
        >
          <Check className="w-4 h-4 stroke-[3]" aria-hidden="true" />
          <span className="font-label text-xs font-bold uppercase tracking-[0.06em]">
            {toastMsg}
          </span>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="ml-2 underline font-label text-xs font-bold uppercase cursor-pointer"
          >
            View Bag
          </button>
        </div>
      )}
    </div>
  );
}
