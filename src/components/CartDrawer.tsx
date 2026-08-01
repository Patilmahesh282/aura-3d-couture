import React, { useState } from 'react';
import { CartItem } from '../types';
import { PROMO_CODES } from '../data/initialProducts';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Sparkles, Check } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: (promoCode?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  cart,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number; description: string } | null>({
    code: 'AURA3D',
    discountPercent: 15,
    description: '15% Off 3D Launch Special'
  });
  const [promoError, setPromoError] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedPromo ? (subtotal * appliedPromo.discountPercent) / 100 : 0;
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const tax = Number(((subtotal - discountAmount) * 0.08).toFixed(2));
  const total = Number((subtotal - discountAmount + shipping + tax).toFixed(2));

  const handleApplyPromo = () => {
    setPromoError('');
    const found = PROMO_CODES.find(p => p.code.toUpperCase() === promoInput.trim().toUpperCase());
    if (found) {
      setAppliedPromo(found);
      setPromoInput('');
    } else {
      setPromoError('Invalid promo code. Try AURA3D or VIP20');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          
          {/* Cart Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Your Shopping Cart</h2>
              <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                {cart.reduce((a, b) => a + b.quantity, 0)} items
              </span>
            </div>
            <button
              id="close-cart-drawer"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="text-slate-300 font-bold">Your cart is empty</div>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explore our 3D interactive garments and add custom apparel to your bag.
                </p>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex gap-4 items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {/* Color dot & info */}
                    <div
                      className="w-10 h-10 rounded-xl border border-slate-700 flex items-center justify-center shrink-0 shadow-inner"
                      style={{ backgroundColor: item.selectedColor }}
                    >
                      <span className="text-[10px] font-mono font-black text-white bg-slate-950/70 px-1 py-0.5 rounded">
                        {item.size}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{item.name}</h4>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Color: {item.colorName} {item.decal ? `• Print: ${item.decal}` : ''}
                      </div>
                      <div className="text-xs font-black text-cyan-400 mt-1">${item.price}</div>
                    </div>
                  </div>

                  {/* Quantity controls & remove */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1">
                      <button
                        id={`qty-minus-${item.id}`}
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono font-bold text-white w-4 text-center">{item.quantity}</span>
                      <button
                        id={`qty-plus-${item.id}`}
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStockAvailable}
                        className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <button
                      id={`remove-cart-${item.id}`}
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-800 bg-slate-950 space-y-4">
              {/* Promo Code Input */}
              <div className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. AURA3D)"
                      value={promoInput}
                      onChange={e => setPromoInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                  <button
                    id="apply-promo-btn"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs rounded-xl border border-slate-700"
                  >
                    Apply
                  </button>
                </div>

                {appliedPromo && (
                  <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 pt-1">
                    <Check className="w-3.5 h-3.5" /> Code <b>{appliedPromo.code}</b> applied ({appliedPromo.description})
                  </div>
                )}
                {promoError && <div className="text-[11px] text-rose-400 font-mono">{promoError}</div>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-400 font-mono pt-2 border-t border-slate-800/60">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-200">${subtotal.toFixed(2)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({appliedPromo.discountPercent}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold font-sans text-white pt-2 border-t border-slate-800">
                  <span>Total Due</span>
                  <span className="text-cyan-400 text-base font-black">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                id="proceed-checkout-btn"
                onClick={() => onProceedToCheckout(appliedPromo?.code)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-slate-950" /> Proceed to Payment Gateway <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
