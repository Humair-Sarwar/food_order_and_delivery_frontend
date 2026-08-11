import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const TopProgressBar = () => {
  const { pathname } = useLocation();
  const [key, setKey] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    setKey((prev) => prev + 1);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent overflow-hidden pointer-events-none">
      <div 
        key={key}
        className="h-full bg-orange-600 animate-[progress_0.5s_cubic-bezier(0.4,0,0.2,1)_forwards]" 
      />
      <style>{`
        @keyframes progress {
          0% {
            transform: translateX(-100%);
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};