import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { CartItem, ConfirmedOrder } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (cartKey: string, delta: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onClearCart: () => void;
}

const FREE_SHIPPING_THRESHOLD = 45;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}) => {
  const [step, setStep] = useState<'bag' | 'checkout' | 'confirmed'>('bag');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoFeedback, setPromoFeedback] = useState<string | null>(null);

  // Checkout form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountRate = appliedPromo === 'VOLT15' ? 0.15 : 0;
  const discountAmount = Number((subtotal * discountRate).toFixed(2));
  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const shippingCost = afterDiscount >= FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : 6.99;
  const finalTotal = Number((afterDiscount + shippingCost).toFixed(2));
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - afterDiscount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = promoCode.trim().toUpperCase();
    if (cleaned === 'VOLT15') {
      setAppliedPromo('VOLT15');
      setPromoFeedback('VOLT15 applied — 15% off unlocked.');
    } else {
      setPromoFeedback('Invalid code. Try VOLT15 for 15% off.');
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !address.trim() || !postalCode.trim()) {
      setFormError('Please fill in your name, email, shipping address, and postal code.');
      return;
    }
    setFormError(null);
    const orderNum = `ZF-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedOrder({
      orderNumber: orderNum,
      customerName: fullName.trim(),
      email: email.trim(),
      address: address.trim(),
      postalCode: postalCode.trim(),
      paymentMethod,
      items: [...items],
      subtotal,
      discount: discountAmount,
      shipping: shippingCost,
      total: finalTotal,
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    onClearCart();
    setStep('confirmed');
  };

  const handleCloseAndReset = () => {
    if (step === 'confirmed') {
      setStep('bag');
      setConfirmedOrder(null);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      <div className="relative w-full max-w-md bg-[#131318] border-l-[3px] border-[#CCFF00] h-full flex flex-col shadow-[-8px_0px_0px_#000000]">
        {/* Header */}
        <div className="px-5 py-4 border-b-2 border-[#2a292f] flex items-center justify-between bg-[#16161D]">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('bag')}
                aria-label="Back to bag"
                className="p-1.5 rounded border border-[#2a292f] text-[#c4c9ac] hover:text-white cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <ShoppingBag className="w-5 h-5 text-[#CCFF00]" aria-hidden="true" />
            <h2 className="font-display font-extrabold text-xl text-white">
              {step === 'bag'
                ? 'Your Drop Bag'
                : step === 'checkout'
                ? 'Express Checkout'
                : 'Order Confirmed'}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleCloseAndReset}
            aria-label="Close bag drawer"
            className="p-2 rounded border-2 border-[#2a292f] bg-[#111116] text-white hover:border-[#FF007F] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: BAG ITEMS */}
        {step === 'bag' && (
          <>
            {/* Free Shipping Progress */}
            <div className="px-5 py-3 bg-[#1b1b20] border-b-2 border-[#2a292f] space-y-1.5">
              <div className="flex items-center justify-between font-label text-[11px] uppercase tracking-[0.06em]">
                <span className="flex items-center gap-1.5 text-white">
                  <Truck className="w-3.5 h-3.5 text-[#CCFF00]" aria-hidden="true" />
                  {remainingForFreeShipping === 0 && items.length > 0
                    ? 'Free Express Cold Shipping Unlocked!'
                    : `Add $${remainingForFreeShipping.toFixed(2)} for Free Express Shipping`}
                </span>
              </div>
              <div className="h-2 bg-[#111116] rounded-full overflow-hidden border border-[#2a292f]">
                <div
                  className="h-full bg-[#CCFF00] transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (afterDiscount / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Itemized List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#16161D] border-2 border-[#2E29FF] flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-[#CCFF00]" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-display font-bold text-xl text-white">Your bag is empty</p>
                    <p className="font-body text-sm text-[#c4c9ac] max-w-xs">
                      Load up on 30g Voltage Lime shakes, Cobalt Crunch bars, or build a custom box.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="neo-btn neo-btn-turbo px-5 py-2.5 rounded font-label text-xs uppercase tracking-[0.06em] cursor-pointer"
                  >
                    Browse the Drop
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.cartKey}
                    className="bg-[#16161D] border-2 border-[#2a292f] rounded-xl p-3.5 flex gap-3.5"
                  >
                    <img
                      src={item.image}
                      alt={item.productName}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-lg object-cover border border-[#2a292f] shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-display font-bold text-sm text-white truncate">
                            {item.productName}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: item.flavorDot }}
                              aria-hidden="true"
                            />
                            <span className="font-label text-[11px] text-[#c4c9ac] truncate">
                              {item.flavorName} · {item.packLabel}
                            </span>
                          </div>
                          {item.isSubscription && (
                            <span className="inline-block mt-1 font-label text-[10px] uppercase tracking-[0.06em] text-[#CCFF00]">
                              Auto-Refill (15% Off)
                            </span>
                          )}
                          {item.customSummary && (
                            <p className="font-body text-[11px] text-[#8e9379] mt-1 line-clamp-2">
                              {item.customSummary}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.cartKey)}
                          aria-label={`Remove ${item.productName}`}
                          className="text-[#8e9379] hover:text-[#FF007F] p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center bg-[#111116] border border-[#2E29FF] rounded">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.cartKey, -1)}
                            aria-label="Decrease item quantity"
                            className="p-1.5 text-white hover:text-[#CCFF00] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center font-label text-xs font-bold text-white tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.cartKey, 1)}
                            aria-label="Increase item quantity"
                            className="p-1.5 text-white hover:text-[#CCFF00] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-display font-extrabold text-base text-white tabular-nums">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Promo + Totals Footer */}
            {items.length > 0 && (
              <div className="p-5 bg-[#16161D] border-t-2 border-[#2a292f] space-y-4">
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag
                      className="w-3.5 h-3.5 text-[#8e9379] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code (try VOLT15)"
                      className="w-full pl-8 pr-3 py-2 rounded bg-[#111116] border-2 border-[#2E29FF] text-xs text-white placeholder-[#8e9379] focus:outline-none focus:border-[#CCFF00]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded bg-[#2E29FF] text-white font-label text-xs uppercase tracking-[0.06em] border-2 border-[#111116] cursor-pointer hover:bg-[#4446ff]"
                  >
                    Apply
                  </button>
                </form>

                {promoFeedback && (
                  <p
                    className={`font-label text-xs ${
                      appliedPromo ? 'text-[#CCFF00]' : 'text-[#FF007F]'
                    }`}
                  >
                    {promoFeedback}
                  </p>
                )}

                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-[#c4c9ac]">
                    <span>Subtotal</span>
                    <span className="tabular-nums text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#CCFF00]">
                      <span>Promo (VOLT15)</span>
                      <span className="tabular-nums">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#c4c9ac]">
                    <span>Express Shipping</span>
                    <span className="tabular-nums text-white">
                      {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#2a292f] font-display font-extrabold text-lg text-white">
                    <span>Total</span>
                    <span className="tabular-nums text-[#CCFF00]">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="neo-btn neo-btn-turbo w-full py-3.5 px-6 rounded font-label text-sm uppercase tracking-[0.06em] cursor-pointer"
                >
                  Proceed to Checkout · ${finalTotal.toFixed(2)}
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: CHECKOUT FORM */}
        {step === 'checkout' && (
          <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-5 space-y-5">
            <div className="bg-[#16161D] border-2 border-[#2a292f] rounded-xl p-4 flex items-center justify-between">
              <span className="font-label text-xs uppercase tracking-[0.06em] text-[#c4c9ac]">
                Order Total ({items.reduce((s, i) => s + i.quantity, 0)} items)
              </span>
              <span className="font-display font-extrabold text-xl text-[#CCFF00] tabular-nums">
                ${finalTotal.toFixed(2)}
              </span>
            </div>

            {formError && (
              <div className="p-3 rounded bg-[#93000a] border-2 border-[#ffdad6] text-xs font-body text-white">
                {formError}
              </div>
            )}

            <div className="space-y-3.5">
              <div>
                <label className="block font-label text-xs uppercase tracking-[0.08em] text-[#c4c9ac] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full px-3.5 py-2.5 rounded bg-[#111116] border-2 border-[#2E29FF] text-sm text-white placeholder-[#8e9379] focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div>
                <label className="block font-label text-xs uppercase tracking-[0.08em] text-[#c4c9ac] mb-1">
                  Email for Receipt
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full px-3.5 py-2.5 rounded bg-[#111116] border-2 border-[#2E29FF] text-sm text-white placeholder-[#8e9379] focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div>
                <label className="block font-label text-xs uppercase tracking-[0.08em] text-[#c4c9ac] mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="742 Evergreen Ave, Apt 4B"
                  className="w-full px-3.5 py-2.5 rounded bg-[#111116] border-2 border-[#2E29FF] text-sm text-white placeholder-[#8e9379] focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div>
                <label className="block font-label text-xs uppercase tracking-[0.08em] text-[#c4c9ac] mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="94107"
                  className="w-full px-3.5 py-2.5 rounded bg-[#111116] border-2 border-[#2E29FF] text-sm text-white placeholder-[#8e9379] focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div>
                <span className="block font-label text-xs uppercase tracking-[0.08em] text-[#c4c9ac] mb-2">
                  Payment Method
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-lg border-2 flex items-center gap-2 font-label text-xs uppercase cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-[#2E29FF] border-[#CCFF00] text-white'
                        : 'bg-[#111116] border-[#2a292f] text-[#c4c9ac]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 shrink-0" />
                    <span>Express Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-lg border-2 flex items-center gap-2 font-label text-xs uppercase cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'bg-[#2E29FF] border-[#CCFF00] text-white'
                        : 'bg-[#111116] border-[#2a292f] text-[#c4c9ac]'
                    }`}
                  >
                    <Truck className="w-4 h-4 shrink-0" />
                    <span>Cash on Drop</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="neo-btn neo-btn-turbo w-full py-3.5 px-6 rounded font-label text-sm uppercase tracking-[0.06em] cursor-pointer"
            >
              Confirm & Place Order · ${finalTotal.toFixed(2)}
            </button>
          </form>
        )}

        {/* STEP 3: CONFIRMED RECEIPT */}
        {step === 'confirmed' && confirmedOrder && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="bg-[#16161D] border-2 border-[#CCFF00] rounded-2xl p-6 text-center space-y-3 neo-shadow-dark">
              <CheckCircle2 className="w-12 h-12 text-[#CCFF00] mx-auto" />
              <span className="inline-block px-3 py-1 rounded-full bg-[#CCFF00] text-[#111116] font-label text-xs font-bold uppercase tracking-[0.08em]">
                DISPATCHING IN 24H
              </span>
              <h3 className="font-display font-extrabold text-2xl text-white">
                Order #{confirmedOrder.orderNumber} Confirmed
              </h3>
              <p className="font-body text-sm text-[#c4c9ac]">
                Receipt sent to <strong className="text-white">{confirmedOrder.email}</strong>.
                Delivering to {confirmedOrder.address}, {confirmedOrder.postalCode}.
              </p>
            </div>

            <div className="bg-[#16161D] border-2 border-[#2a292f] rounded-xl p-4 space-y-3">
              <span className="font-label text-xs uppercase tracking-[0.08em] text-[#FF007F]">
                ITEMIZED RECEIPT
              </span>
              <div className="divide-y divide-[#2a292f]">
                {confirmedOrder.items.map((item) => (
                  <div
                    key={item.cartKey}
                    className="py-2.5 flex items-center justify-between gap-2 text-sm"
                  >
                    <div>
                      <div className="font-bold text-white">
                        {item.quantity}x {item.productName}
                      </div>
                      <div className="font-label text-[11px] text-[#8e9379]">
                        {item.flavorName} · {item.packLabel}
                      </div>
                    </div>
                    <span className="font-display font-bold text-white tabular-nums">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t-2 border-[#2a292f] flex justify-between font-display font-extrabold text-lg text-[#CCFF00]">
                <span>Total Paid ({confirmedOrder.paymentMethod === 'cod' ? 'COD' : 'Card'})</span>
                <span className="tabular-nums">${confirmedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCloseAndReset}
              className="neo-btn neo-btn-turbo w-full py-3.5 px-6 rounded font-label text-sm uppercase tracking-[0.06em] cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
