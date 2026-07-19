import React, { useState } from "react";
import {
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  CreditCard,
  Lock,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { RelatedProducts } from "./RelatedProducts";

export const ProductDetail: React.FC = () => {
  const [quantity, setQuantity] = useState(1);

  return (<>
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Top Section: Product Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Single Large Image */}
        <div className="aspect-[4/3] bg-gray-100 rounded-3xl overflow-hidden shadow-sm">
          <img
            src="/placeholder-product.jpg"
            alt="Product"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <span className="text-orange-600 font-bold text-sm tracking-widest uppercase">
            Best Seller
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-950 mt-2">
            Delicious Burger
          </h1>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
            </div>
            <span className="text-gray-500 text-sm">(128 Reviews)</span>
          </div>

          <p className="text-gray-600 mt-6 leading-relaxed">
            Juicy beef patty, fresh lettuce, melted cheddar cheese, and our
            secret sauce in a toasted brioche bun. Experience the authentic
            taste of premium quality ingredients.
          </p>

          {/* <div className="text-3xl font-black text-gray-950 mt-8">Rs. 850</div> */}

          {/* Price Section */}
          <div className="flex items-center gap-4 mt-8">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                {/* Sale Price */}
                <span className="text-4xl font-black text-orange-600">
                  Rs. 650
                </span>

                {/* Sale Badge */}
                <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  25% OFF
                </span>
              </div>

              {/* Original Price */}
              <span className="text-gray-400 font-medium line-through decoration-gray-400">
                Rs. 850
              </span>
            </div>
          </div>
          <div className="mt-4">
            {true ? (
              <div className="flex items-center gap-2 text-red-600 text-sm font-semibold">
                <XCircle size={18} strokeWidth={2.5} />
                Out of Stock
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                <CheckCircle2 size={18} strokeWidth={2.5} />
                In Stock
              </div>
            )}
          </div>
          {/* Controls */}
          <div className="flex items-center gap-4 mt-8">
            <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl w-fit border border-gray-100">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-600 shadow-sm border border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all active:scale-90"
              >
                -
              </button>
              <span className="font-black text-lg text-gray-950 w-8 text-center tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-600 shadow-sm border border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all active:scale-90"
              >
                +
              </button>
            </div>

            <button className="flex-grow flex items-center justify-center gap-2 bg-gray-950 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-95">
              <ShoppingBag size={20} /> Add to Cart
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-4 mt-10">
            <div className="flex items-center gap-3 text-gray-600">
              <Truck className="text-orange-600" />{" "}
              <span className="text-sm font-medium">Fast Delivery</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <ShieldCheck className="text-orange-600" />{" "}
              <span className="text-sm font-medium">Fresh Quality</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <CreditCard className="text-orange-600" />{" "}
              <span className="text-sm font-medium">Easy Payment</span>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            {/* Security Note */}
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-4">
              <Lock size={16} className="text-gray-400" />
              <span className="font-medium">
                Safe & secure checkout. Easy and fast.
              </span>
            </div>

            {/* Payment Icons */}
            <div className="flex items-center justify-center gap-3 flex-wrap transition-all">
              <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg h-10 w-16 flex items-center justify-center">
                {/* Mastercard Logo/Icon */}
                <img
                  src="/payment-icons/mastercard.png"
                  alt="Mastercard"
                  className="h-6 object-contain"
                />
              </div>
              <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg h-10 w-16 flex items-center justify-center">
                {/* Visa Logo/Icon */}
                <img
                  src="/payment-icons/visa.png"
                  alt="Visa"
                  className="h-6 object-contain"
                />
              </div>
              <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg h-10 w-16 flex items-center justify-center">
                {/* Google Pay Logo/Icon */}
                <img
                  src="/payment-icons/easypaisa.jpg"
                  alt="GPay"
                  className="h-6 object-contain"
                />
              </div>
              <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg h-10 w-16 flex items-center justify-center">
                {/* Apple Pay Logo/Icon */}
                <img
                  src="/payment-icons/jazzcash.png"
                  alt="ApplePay"
                  className="h-6 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Detailed Description */}
      <div className="mt-20 border-t border-gray-100 pt-12">
        <h2 className="text-2xl font-black text-gray-950 mb-6">
          Product Details
        </h2>
        <div className="prose max-w-none text-gray-600">
          <p className="mb-4">
            Our Delicious Burger is crafted with passion, using only the finest
            ingredients sourced from local farms. The beef patty is 100%
            grass-fed, grilled to perfection to retain its juicy texture.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>100% Fresh Beef Patty</li>
            <li>Hand-picked Crisp Lettuce</li>
            <li>Artisan Brioche Bun baked daily</li>
            <li>Signature House Sauce</li>
          </ul>
        </div>
      </div>

    </div>
      <RelatedProducts/>
      </>
  );
};
