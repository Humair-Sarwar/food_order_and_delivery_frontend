import React from 'react';
import { ShoppingBag } from 'lucide-react';

const items = [
  { id: 1, name: "Cheesy Fries", price: "Rs. 350", img: "/fries.jpg" },
  { id: 2, name: "Fried Chicken", price: "Rs. 550", img: "/chicken.jpg" },
  { id: 3, name: "Cold Drink", price: "Rs. 150", img: "/coke.jpg" },
  { id: 4, name: "Garlic Bread", price: "Rs. 400", img: "/bread.jpg" },
];

export const RelatedProducts: React.FC = () => {
  return (
    <div className="mt-20 bg-[#fafafa]">
        <div className='max-w-7xl mx-auto py-10'>
      <h2 className="text-2xl font-black text-gray-950 mb-8">Other Food Items</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="group bg-white p-4 rounded-3xl border border-gray-100 hover:shadow-xl transition-all duration-300">
            {/* Image */}
            <div className="aspect-square bg-gray-100 rounded-2xl mb-4 overflow-hidden">
              <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            
            {/* Info */}
            <h3 className="font-bold text-gray-950">{item.name}</h3>
            <div className="flex flex-col gap-3 mt-3">
              <span className="font-black text-orange-600">{item.price}</span>
              
              {/* Add to Cart Button */}
              <button className="flex items-center justify-center gap-2 w-full bg-orange-600 text-white py-2 rounded-xl text-sm font-bold hover:bg-orange-700 transition-colors">
                <ShoppingBag size={16} />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};