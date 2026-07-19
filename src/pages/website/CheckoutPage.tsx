import React, { useState } from 'react';
import { CreditCard, Truck, MapPin, CheckCircle2 } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-950 mb-8">Checkout</h1>

      {/* Progress Stepper */}
      <div className="flex justify-between mb-12 relative">
        <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-100 -z-10" />
        {['Shipping', 'Payment', 'Review'].map((label, i) => (
          <div key={label} className={`flex flex-col items-center gap-2 ${step >= i + 1 ? 'text-orange-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= i + 1 ? 'bg-orange-600 text-white' : 'bg-gray-100'}`}>
              {step > i + 1 ? <CheckCircle2 size={20} /> : i + 1}
            </div>
            <span className="text-xs font-bold uppercase">{label}</span>
          </div>
        ))}
      </div>

      {/* Checkout Form Content */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-black">Shipping Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" className="p-4 rounded-xl border border-gray-200" />
              <input type="text" placeholder="Last Name" className="p-4 rounded-xl border border-gray-200" />
              <input type="text" placeholder="Address" className="col-span-2 p-4 rounded-xl border border-gray-200" />
              <input type="text" placeholder="City" className="p-4 rounded-xl border border-gray-200" />
              <input type="text" placeholder="Phone Number" className="p-4 rounded-xl border border-gray-200" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-black">Payment Method (Square)</h2>
            <div className="p-6 border-2 border-orange-100 rounded-2xl bg-orange-50/50 flex items-center gap-4">
              <CreditCard className="text-orange-600" />
              <div>
                <p className="font-bold">Secure Card Payment</p>
                <p className="text-sm text-gray-500">Powered by Square</p>
              </div>
            </div>
            {/* Square Payment Element Placeholder */}
            <div className="h-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
              Square Payment Form UI
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-8">
            <div className="text-green-500 flex justify-center mb-4"><CheckCircle2 size={64} /></div>
            <h2 className="text-2xl font-black">Order Confirmed!</h2>
            <p className="text-gray-500 mt-2">Thank you for your order. We'll update you soon.</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-10 flex gap-4">
          {step > 1 && step < 3 && (
            <button onClick={() => setStep(step - 1)} className="px-8 py-4 rounded-2xl font-bold text-gray-500">Back</button>
          )}
          {step < 3 && (
            <button onClick={() => setStep(step + 1)} className="flex-grow bg-gray-950 text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all">
              {step === 2 ? 'Place Order' : 'Continue'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};