import React from 'react';
import { X, ShoppingBag, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
          />
          
          {/* Side Panel */}
          <motion.div 
  initial={{ x: "100%" }}
  animate={{ x: 0 }}
  exit={{ x: "100%" }}
  transition={{ type: "spring", damping: 25, stiffness: 200 }}
  className="fixed inset-y-0 right-0 my-4 mr-4 h-[calc(100vh-32px)] w-[calc(100vw-32px)] md:w-[450px] rounded-3xl bg-white z-[101] shadow-2xl p-8 flex flex-col"
>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-gray-950">Your Cart</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* Empty State */}
            <div className="flex-grow flex flex-col items-center justify-center text-gray-400">
              <ShoppingBag size={48} className="mb-4 opacity-20" />
              <p className="font-medium">Your cart is currently empty.</p>
            </div>

           {/* Footer Actions */}
<div className="space-y-4 pt-6 border-t border-gray-100">
  
  {/* Total Row - Yahan add kiya gaya hai */}
  <div className="flex items-center justify-between text-lg font-bold text-gray-950">
    <span>Total</span>
    <span className='font-semibold'>Rs. 0.00</span>
  </div>

  {/* Buttons */}
  <div className="grid grid-cols-2 gap-3">
    <button className="w-full py-3 cursor-pointer rounded-xl font-bold text-white bg-gray-950 hover:bg-gray-800 transition-all text-sm">
      View Cart
    </button>
    <button className="w-full bg-orange-600 cursor-pointer text-white py-3 rounded-xl font-bold hover:bg-orange-500 transition-all text-sm shadow-md shadow-orange-600/20 active:scale-95">
      Checkout
    </button>
  </div>

  {/* Secure Checkout Note */}
  <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
    <Lock size={12} className='text-black'/>
    <span>Safe & secure checkout. Easy and fast.</span>
  </div>
</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};