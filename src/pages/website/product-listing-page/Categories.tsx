import React, { useRef, useState, useEffect } from "react";
import { useWebListingCategories } from "../../../hooks/website/categoryService";
import { ChevronLeft, ChevronRight } from "lucide-react";
import no_image from "../../../assets/images/empty-image.jpg";
import { NavLink, useParams } from "react-router-dom";

export const Categories: React.FC = () => {
  const { slug } = useParams();

  console.log(slug);
  const { data, isPending } = useWebListingCategories(slug);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const categories = data?.data ?? [];

  // Check scroll position to determine whether to show/hide arrows
  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      // Using a small buffer (5px) to prevent floating point calculation inaccuracies
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
    <>
      {data?.selected_category?.cover_media?.media_path && (
        <div className="w-full h-64 md:h-80 lg:h-100 overflow-hidden bg-gray-200">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}/storage/${data.selected_category.cover_media.media_path}`}
            alt={data?.selected_category?.title || "Category Cover"}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <section className="pt-15 px-6 bg-gray-100">
        {(data?.selected_category?.page_description || data?.selected_category?.title) && <div className="pb-6 px-6 text-center">
          <h1 className="text-3xl font-black text-gray-950 mb-2">{data?.selected_category?.title}</h1>
          {data?.selected_category?.page_description && <p className="text-gray-600 mx-auto">{data?.selected_category?.page_description}</p>}
        </div>}
        
        <div className="mx-7">
          {/* Wrapper with hover state */}
          <div
            className="relative group/slider"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Left Arrow */}
            <button
              onClick={() => scroll("left")}
              className={`absolute -left-5 top-1/2 -translate-y-1/2 cursor-pointer z-10 w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-800 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-300 shadow-xl ${
                isHovered && canScrollLeft
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-3 pointer-events-none"
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Carousel Container */}
            <div
              ref={scrollRef}
              className="w-full overflow-x-auto pb-4 pt-2 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth px-2"
            >
              {/* Inner wrapper using 'min-w-full justify-center' so items center when few, but expand properly when many */}
              <div className="flex min-w-full justify-center md:justify-center items-center gap-6 w-max mx-auto">
                {isPending
                  ? // Skeleton Loader Cards
                    [1, 2, 3, 4, 5, 6].map((_, idx) => (
                      <div
                        key={idx}
                        className="flex-shrink-0 w-52 bg-white p-7 rounded-2xl border border-gray-200 text-center animate-pulse"
                      >
                        <div className="w-24 h-24 mx-auto bg-gray-200 rounded-sm mb-4" />
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                      </div>
                    ))
                  : categories.map((cat, idx) => (
                      <NavLink
                        to={`/food-items/${cat?.category_slug ?? ""}`}
                        key={idx}
                        className="group flex-shrink-0 w-53 bg-white p-5 rounded-2xl border border-gray-200 hover:border-orange-200 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 cursor-pointer text-center"
                      >
                        {/* Image Container */}
                        <div className="w-35 h-35 mx-auto bg-gray-50 rounded-sm flex items-center justify-center text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
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
                        <h3 className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors truncate text-base">
                          {cat?.title}
                        </h3>
                      </NavLink>
                    ))}
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scroll("right")}
              className={`absolute -right-5 top-1/2 -translate-y-1/2 z-10 cursor-pointer w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-800 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-300 shadow-xl ${
                isHovered && canScrollRight
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-3 pointer-events-none"
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight size2={22} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};