import React from "react";
import { motion } from "framer-motion";

export const TextScroll: React.FC = () => {
  return (
    <div className="w-full overflow-hidden py-10 bg-white">
      <motion.div
        className="flex whitespace-nowrap"
        initial={{ x: 0 }}
        animate={{ x: "-50%" }} // 50% shift perfect loop deta hai
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 20,
        }}
      >
        {/* Array(2) kafi hai agar loop sahi ho */}
        {[...Array(2)].map((_, i) => (
          <span
            key={i}
            className="inline-block px-10 shrink-0" // shrink-0 add kiya taaki text dabey nahi
            style={{
              fontWeight: 400,
              fontSize: "60px",
              fontFamily: "'Roboto', sans-serif",
              background: "linear-gradient(90deg, #4a4a4a 0%, #f97316 40%, #f97316 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: "1.5",
            }}
          >
            Your Favourite Cuisines, Right at Your Fingertips – Order Now & Enjoy!
          </span>
        ))}
      </motion.div>
    </div>
  );
};