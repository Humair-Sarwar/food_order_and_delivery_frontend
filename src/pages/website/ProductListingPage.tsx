import React, { useState } from 'react';
import { SlidersHorizontal, Search, ChevronDown, ChevronUp } from 'lucide-react';

// Reusable Accordion Component for Filters
const FilterSection = ({ title, isOpen, onToggle, children }: any) => (
  <div className="border-t border-gray-100 py-6">
    <button 
      onClick={onToggle} 
      className="flex items-center justify-between w-full font-black text-gray-950"
    >
      {title}
      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </button>
    <div className={`mt-4 space-y-4 transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`}>
      {children}
    </div>
  </div>
);

export const ProductListingPage: React.FC = () => {
  const [inStockOnly, setInStockOnly] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>('price');

  return (
    <div className='w-full bg-gray-50/50'>
    <div className="max-w-7xl mx-auto px-4 py-12  rounded-[3rem]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <h1 className="text-4xl font-black text-gray-950">Explore Foods</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search delicious..." className="pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none w-64" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left: Modern Accordion Filters */}
        <aside className="w-full md:w-72">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-2 font-black text-xl mb-6">
              <SlidersHorizontal size={20} className="text-orange-600" /> Filters
            </div>

            {/* Stock Toggle */}
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-gray-700">In stock only</span>
              <button 
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`w-12 h-6 rounded-full transition-all flex items-center p-1 ${inStockOnly ? 'bg-orange-600 justify-end' : 'bg-gray-200'}`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
              </button>
            </div>

            {/* Price Range Accordion */}
            <FilterSection 
              title="Price Range" 
              isOpen={openSection === 'price'} 
              onToggle={() => setOpenSection(openSection === 'price' ? null : 'price')}
            >
              <div className="flex gap-2">
                <input type="number" placeholder="Min" className="w-full p-3 rounded-xl border border-gray-200" />
                <input type="number" placeholder="Max" className="w-full p-3 rounded-xl border border-gray-200" />
              </div>
              <input type="range" className="w-full accent-orange-600" />
            </FilterSection>

            {/* Restaurants Accordion */}
            <FilterSection 
              title="Restaurants" 
              isOpen={openSection === 'rest'} 
              onToggle={() => setOpenSection(openSection === 'rest' ? null : 'rest')}
            >
              {['Burger King', 'McDonalds', 'KFC'].map(r => (
                <label key={r} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded-md accent-orange-600" />
                  <span className="text-gray-600">{r}</span>
                </label>
              ))}
            </FilterSection>

            {/* Categories Accordion */}
            <FilterSection 
              title="Categories" 
              isOpen={openSection === 'cat'} 
              onToggle={() => setOpenSection(openSection === 'cat' ? null : 'cat')}
            >
              {['Burgers', 'Fries', 'Pizza'].map(c => (
                <label key={c} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded-md accent-orange-600" />
                  <span className="text-gray-600">{c}</span>
                </label>
              ))}
            </FilterSection>
          </div>
        </aside>

        {/* Right: Modern Product Grid */}
        <main className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="group bg-white p-5 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500">
                <div className="aspect-square bg-gray-100 rounded-[2rem] mb-5 overflow-hidden">
                  <img src="/burger.jpg" alt="Product" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="font-black text-lg text-gray-950">Delicious Burger {i}</h3>
                <p className="text-sm text-gray-500 mb-4">Juicy patty, fresh cheese</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-orange-600">Rs. 850</span>
                  <button className="bg-gray-950 text-white px-5 py-2.5 rounded-2xl font-bold hover:bg-orange-600 transition-colors">
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
    </div>
  );
};