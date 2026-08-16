import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, X, Plus, Minus, CreditCard, Truck, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, total, clearCart } = useCart();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment' | 'success'>('cart');

  const handleCheckout = () => {
    setCheckoutStep('payment');
  };

  const handlePayment = () => {
    setTimeout(() => {
      setCheckoutStep('success');
      clearCart();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-50 border-l border-slate-200 z-50 flex flex-col shadow-2xl"
          >
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
                {checkoutStep === 'cart' && 'Shopping Cart'}
                {checkoutStep === 'payment' && 'Checkout'}
                {checkoutStep === 'success' && 'Order Placed'}
              </h2>
              <button 
                onClick={() => {
                  setIsCartOpen(false);
                  setTimeout(() => setCheckoutStep('cart'), 300);
                }}
                className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {checkoutStep === 'cart' && (
                items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
                    <ShoppingCart className="w-16 h-16 opacity-20" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-3 flex gap-3 items-center">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900 truncate">{item.name}</h4>
                          <p className="text-xs text-slate-500">{item.supplier}</p>
                          <div className="text-emerald-600 font-bold mt-1">₹${item.price.toLocaleString("en-IN")}</div>
                        </div>
                        <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-slate-200">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-800"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono w-4 text-center text-slate-800">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-800"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {checkoutStep === 'payment' && (
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      Delivery Details
                    </h3>
                    <div className="space-y-2">
                      <input type="text" placeholder="Full Name" className="w-full bg-white border border-slate-200 rounded-lg px-5 py-4 min-h-[56px] text-lg min-h-[48px] text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50" />
                      <input type="text" placeholder="Farm Address" className="w-full bg-white border border-slate-200 rounded-lg px-5 py-4 min-h-[56px] text-lg min-h-[48px] text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50" />
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      Payment Method
                    </h3>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input type="text" placeholder="Card Number" className="flex-1 bg-white border border-slate-200 rounded-lg px-5 py-4 min-h-[56px] text-lg min-h-[48px] text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50" />
                      </div>
                      <div className="flex gap-2">
                        <input type="text" placeholder="MM/YY" className="w-1/2 bg-white border border-slate-200 rounded-lg px-5 py-4 min-h-[56px] text-lg min-h-[48px] text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50" />
                        <input type="text" placeholder="CVC" className="w-1/2 bg-white border border-slate-200 rounded-lg px-5 py-4 min-h-[56px] text-lg min-h-[48px] text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {checkoutStep === 'success' && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 pt-12">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Order Placed Successfully!</h3>
                  <p className="text-sm text-slate-600 max-w-[250px]">
                    Your order has been confirmed. You can track its status in the chat by asking for order tracking.
                  </p>
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      setTimeout(() => setCheckoutStep('cart'), 300);
                    }}
                    className="mt-6 w-full py-4 min-h-[56px] text-lg min-h-[48px] bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg transition-colors font-semibold"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            {checkoutStep !== 'success' && items.length > 0 && (
              <div className="p-4 border-t border-slate-200 bg-white space-y-4">
                <div className="flex justify-between items-center text-slate-800">
                  <span className="text-sm">Subtotal</span>
                  <span className="font-semibold">₹${total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between items-center text-slate-800">
                  <span className="text-sm">Taxes & Fees</span>
                  <span className="font-semibold">₹${(total * 0.05).toLocaleString("en-IN")}</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-slate-900">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-emerald-600 text-lg">₹${(total * 1.05).toLocaleString("en-IN")}</span>
                </div>
                
                {checkoutStep === 'cart' ? (
                  <button 
                    onClick={handleCheckout}
                    className="w-full py-4 min-h-[56px] text-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-600/30 text-white rounded-xl transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                  </button>
                ) : (
                  <button 
                    onClick={handlePayment}
                    className="w-full py-4 min-h-[56px] text-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-600/30 text-white rounded-xl transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    Pay ₹${(total * 1.05).toLocaleString("en-IN")}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
