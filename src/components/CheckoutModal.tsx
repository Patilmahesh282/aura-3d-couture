import React, { useState } from 'react';
import { CartItem, User, Order } from '../types';
import confetti from 'canvas-confetti';
import { X, CreditCard, ShieldCheck, Lock, CheckCircle2, ArrowRight, Smartphone, Zap, Truck, Sparkles, Building2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  cart: CartItem[];
  user: User | null;
  appliedPromoCode?: string;
  onClose: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  cart,
  user,
  appliedPromoCode,
  onClose,
  onOrderCompleted
}) => {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'crypto'>('card');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [show3DS, setShow3DS] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Shipping Form State
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || 'Sarah Connor',
    email: user?.email || 'shopper@aura.com',
    street: user?.savedAddresses?.[0]?.street || '742 Cyberpunk Ave, Suite 300',
    city: user?.savedAddresses?.[0]?.city || 'Neo Tokyo',
    state: user?.savedAddresses?.[0]?.state || 'CA',
    zip: user?.savedAddresses?.[0]?.zip || '90210',
    country: 'United States'
  });

  // Card Details State
  const [cardDetails, setCardDetails] = useState({
    number: '4242 •••• •••• 4242',
    name: user?.name || 'SARAH CONNOR',
    expiry: '12/28',
    cvv: '888'
  });

  // Financials
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let discount = 0;
  if (appliedPromoCode === 'AURA3D') discount = subtotal * 0.15;
  if (appliedPromoCode === 'VIP20') discount = subtotal * 0.20;
  if (appliedPromoCode === 'FREESHIP') discount = subtotal * 0.10;

  const tax = Number(((subtotal - discount) * 0.08).toFixed(2));
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const total = Number((subtotal - discount + shipping + tax).toFixed(2));

  const handlePayClick = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city) {
      setErrorMessage('Please complete all shipping address fields.');
      return;
    }

    // Trigger simulated 3DS 2.0 Auth step
    setShow3DS(true);
  };

  const handle3DSVerification = async () => {
    setShow3DS(false);
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/checkout/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          shippingAddress,
          paymentMethod,
          paymentDetails: {
            cardNumberLast4: cardDetails.number.slice(-4),
            cardHolder: cardDetails.name
          },
          userId: user?.id,
          promoCode: appliedPromoCode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment processing failed.');
      }

      // Success! Launch Confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      setIsProcessing(false);
      onOrderCompleted(data.order);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Payment failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row my-8">
        
        {/* Close Modal */}
        <button
          id="close-checkout-modal"
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Section: Payment Method & Card Details */}
        <div className="w-full md:w-3/5 p-6 md:p-8 space-y-6 overflow-y-auto max-h-[640px]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Lock className="w-3.5 h-3.5" /> 256-BIT SSL ENCRYPTED PAYMENT GATEWAY
            </div>
            <h2 className="text-2xl font-black text-white">Secure Checkout</h2>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-mono">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Payment Method Selector Tabs */}
          <div className="grid grid-cols-3 gap-2">
            <button
              id="pay-method-card"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                paymentMethod === 'card'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span>Credit Card</span>
            </button>
            <button
              id="pay-method-apple"
              onClick={() => setPaymentMethod('applepay')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                paymentMethod === 'applepay'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Smartphone className="w-5 h-5" />
              <span>Apple Pay</span>
            </button>
            <button
              id="pay-method-crypto"
              onClick={() => setPaymentMethod('crypto')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                paymentMethod === 'crypto'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Zap className="w-5 h-5" />
              <span>Web3 USDC</span>
            </button>
          </div>

          {/* Interactive 3D Card Preview */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="relative w-full h-44 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-700 to-indigo-900 p-6 text-white shadow-xl cursor-pointer select-none overflow-hidden transform hover:scale-[1.01] transition-transform"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                
                {!isFlipped ? (
                  /* Card Front */
                  <div className="h-full flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <div className="text-xs font-mono tracking-widest text-cyan-200 uppercase font-bold">AURA Couture Card</div>
                      <ShieldCheck className="w-6 h-6 text-cyan-300" />
                    </div>
                    <div className="font-mono text-lg font-black tracking-widest my-2">
                      {cardDetails.number}
                    </div>
                    <div className="flex justify-between items-end text-xs">
                      <div>
                        <div className="text-[9px] uppercase font-mono text-cyan-200">Card Holder</div>
                        <div className="font-bold uppercase tracking-wider">{cardDetails.name}</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase font-mono text-cyan-200">Expires</div>
                        <div className="font-bold font-mono">{cardDetails.expiry}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Card Back (CVV Stripe) */
                  <div className="h-full flex flex-col justify-between py-2">
                    <div className="w-full h-8 bg-slate-950/80 -mx-6 px-6" />
                    <div className="bg-slate-200 text-slate-950 px-3 py-1 font-mono font-bold text-right text-xs rounded">
                      CVV: {cardDetails.cvv}
                    </div>
                    <div className="text-[10px] text-cyan-200 font-mono">
                      Click card to flip back
                    </div>
                  </div>
                )}
              </div>

              {/* Card Inputs */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-400 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardDetails.number}
                    onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Expiration (MM/YY)</label>
                  <input
                    type="text"
                    value={cardDetails.expiry}
                    onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">CVV Security Code</label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    onFocus={() => setIsFlipped(true)}
                    onBlur={() => setIsFlipped(false)}
                    onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Shipping Address Form */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-cyan-400" /> Shipping Destination Address
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={shippingAddress.fullName}
                  onChange={e => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-slate-400 mb-1">Street Address</label>
                <input
                  type="text"
                  value={shippingAddress.street}
                  onChange={e => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">City</label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Zip Code</label>
                <input
                  type="text"
                  value={shippingAddress.zip}
                  onChange={e => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Order Summary & Pay Action */}
        <div className="w-full md:w-2/5 p-6 md:p-8 bg-slate-950 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Order Summary ({cart.length} items)</h3>

            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between text-xs text-slate-300">
                  <div>
                    <div className="font-bold text-white line-clamp-1">{item.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Qty: {item.quantity} • Size: {item.size}
                    </div>
                  </div>
                  <div className="font-mono font-bold text-cyan-400">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-1.5 text-xs text-slate-400 font-mono">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promo Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm font-sans font-bold text-white pt-2 border-t border-slate-800">
                <span>Total Amount</span>
                <span className="text-cyan-400 text-lg font-black">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Pay Button */}
          <div className="pt-6 space-y-3">
            <button
              id="authorize-payment-btn"
              onClick={handlePayClick}
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-slate-950" /> Authorize & Pay ${total.toFixed(2)}
            </button>

            <div className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-cyan-500" /> Protected by AURA 3D Vault Encryption
            </div>
          </div>

        </div>
      </div>

      {/* 3DS 2.0 Verification Modal Popup */}
      {show3DS && (
        <div className="fixed inset-0 z-60 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full text-cyan-400 mx-auto flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">3D Secure 2.0 Bank Authorization</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your issuing bank requires quick verification. Enter test OTP <b>123456</b> or click approve.
            </p>

            <input
              type="text"
              placeholder="Enter OTP Code (123456)"
              value={otpCode}
              onChange={e => setOtpCode(e.target.value)}
              className="w-full text-center px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl font-mono text-cyan-400 font-bold focus:outline-none focus:border-cyan-500"
            />

            <div className="flex gap-2">
              <button
                id="cancel-3ds-btn"
                onClick={() => setShow3DS(false)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                id="verify-3ds-btn"
                onClick={handle3DSVerification}
                className="w-1/2 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
              >
                Approve Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Processing Spinner Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-70 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center">
          <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mb-4" />
          <h3 className="text-xl font-black text-white">Securing Transaction & Allocating Inventory...</h3>
          <p className="text-xs text-cyan-400 font-mono mt-2">Decrementing stock live across servers...</p>
        </div>
      )}
    </div>
  );
};
