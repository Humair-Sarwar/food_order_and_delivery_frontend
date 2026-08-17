import React, { useRef, useState, useEffect } from "react";
import { useWebCategories } from "../../../hooks/website/categoryService";
import { ChevronLeft, ChevronRight } from "lucide-react";
import no_image from "../../../assets/images/empty-image.jpg";
import { NavLink } from "react-router-dom";

export const CategoriesSection: React.FC = () => {
  const { data, isPending } = useWebCategories();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const categories = (data as any)?.data ?? [];

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      checkScrollPosition();
      scrollContainer.addEventListener("scroll", checkScrollPosition);
      window.addEventListener("resize", checkScrollPosition);

      return () => {
        scrollContainer.removeEventListener("scroll", checkScrollPosition);
        window.removeEventListener("resize", checkScrollPosition);
      };
    }
  }, [categories]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    categories?.length > 0 && (
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-10 bg-gray-100 overflow-hidden">
        <div className="max-w-[96rem] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-10 px-2">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
              Shop by Categories
            </h2>
            <NavLink
              to={"/food-items/All"}
              className="text-orange-600 font-bold hover:text-orange-700 hover:underline cursor-pointer text-sm sm:text-base transition-colors"
            >
              View All
            </NavLink>
          </div>

          {/* Wrapper with slider container */}
          <div className="relative group/slider">
            {/* Left Scroll Button */}
            <button
              onClick={() => scroll("left")}
              className={`absolute -left-2 sm:-left-3 md:-left-5 top-1/2 -translate-y-1/2 cursor-pointer z-20 w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-800 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-300 shadow-xl ${
                canScrollLeft
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-3 pointer-events-none"
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Carousel Container */}
            <div
              ref={scrollRef}
              className="w-full overflow-x-auto pb-6 pt-2 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth px-1"
            >
              <div className="flex justify-start lg:justify-center items-center gap-4 sm:gap-6 w-max mx-auto px-1">
                {isPending
                  ? // Skeleton Loader Cards
                    [1, 2, 3, 4, 5, 6].map((_, idx) => (
                      <div
                        key={idx}
                        className="flex-shrink-0 w-36 sm:w-44 md:w-52 bg-white p-5 sm:p-7 rounded-[2rem] border border-gray-100 text-center animate-pulse shadow-sm"
                      >
                        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gray-200 rounded-2xl mb-4" />
                        <div className="h-4 bg-gray-200 rounded-full w-3/4 mx-auto" />
                      </div>
                    ))
                  : categories.map((cat: any, idx: any) => (
                      <NavLink
                        to={`/food-items/${cat?.category_slug}`}
                        key={idx}
                        className="group flex-shrink-0 w-36 sm:w-44 md:w-52 bg-white p-4 sm:p-5 rounded-[2rem] border border-gray-100 hover:border-orange-200 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 cursor-pointer text-center flex flex-col items-center"
                      >
                        {/* Image Container */}
                        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto bg-gray-50 rounded-[1.5rem] flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform duration-500 overflow-hidden shadow-inner">
                          <img
                            src={
                              cat?.media?.media_path
                                ? `${import.meta.env.VITE_API_BASE_URL}/storage/${cat.media.media_path}`
                                : no_image
                            }
                            alt={cat?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Category Name */}
                        <h3 className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors truncate w-full text-xs sm:text-sm md:text-base">
                          {cat?.title}
                        </h3>
                      </NavLink>
                    ))}
              </div>
            </div>

            {/* Right Scroll Button */}
            <button
              onClick={() => scroll("right")}
              className={`absolute -right-2 sm:-right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 cursor-pointer w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-800 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-300 shadow-xl ${
                canScrollRight
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-3 pointer-events-none"
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>
    )
  );
};
