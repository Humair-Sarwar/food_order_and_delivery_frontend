import React, { useState } from 'react';
import { MessageCircle, X, Send, Paperclip, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-6 z-[55]! flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="mb-0 w-[92vw] md:w-[360px] h-[540px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Modern Gradient Header */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xl">Support Center</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <p className="text-xs font-medium opacity-90">Online • Typically replies in 5m</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-grow p-6 bg-gray-50/50 overflow-y-auto space-y-4">
              {/* Bot Message */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs shrink-0">AI</div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-sm text-gray-700 max-w-[85%]">
                  Hi there! 👋 How can we make your day better?
                </div>
              </div>
              
              {/* Timestamp */}
              <div className="text-center text-[10px] text-gray-400 mt-2">Today at 1:10 PM</div>
            </div>

            {/* Modern Input Footer */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                <button className="text-gray-400 hover:text-orange-600 transition-colors p-1">
                  <Paperclip size={18} />
                </button>
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-grow bg-transparent outline-none text-sm px-2 text-gray-700"
                />
                <button className="bg-orange-600 p-2 rounded-xl text-white hover:bg-orange-700 active:scale-95 transition-all shadow-md shadow-orange-600/20">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button with Pulse Effect */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-orange-600 text-white p-4 rounded-full shadow-xl shadow-orange-600/40 flex items-center justify-center transition-all group"
      >
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>
    </div>
  );
};