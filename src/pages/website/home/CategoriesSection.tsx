import React from 'react';

const categories = [
  { name: "Smart Phones", img: "📱" },
  { name: "Smart Watches", img: "⌚" },
  { name: "Tablets", img: "💻" },
  { name: "Laptops", img: "⌨️" },
  { name: "Audio", img: "🎧" },
  { name: "Gaming", img: "🎮" }
];

export const CategoriesSection: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black text-gray-950">Shop by Categories</h2>
          <button className="text-orange-600 font-bold hover:underline">View All</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, idx) => (
            <div 
              key={idx}
              className="group bg-white p-6 rounded-3xl border border-gray-100 hover:border-orange-200 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 cursor-pointer text-center"
            >
              {/* Image Container */}
              <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {cat.img}
              </div>
              {/* Category Name */}
              <h3 className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};