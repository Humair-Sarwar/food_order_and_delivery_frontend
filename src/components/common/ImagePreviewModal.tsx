import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  imageTitle?: string;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  imageTitle = "Image Preview"
}) => {
  // Listen for Escape key press to close the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent rendering if there's no active image url and it's not open
  if (!imageUrl && !isOpen) return null;

  return (
    // Outer Wrapper: Handles viewport placement and master transition animations
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* 1. Backdrop Overlay */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-[4px]"
        onClick={onClose}
      />

      {/* 2. Main White Modal Card (Matches ConfirmDelete UI style) */}
      <div 
        className={`relative w-full max-w-2xl bg-white border border-gray-100 rounded-3xl p-6 shadow-2xl shadow-gray-900/20 z-10 transition-all duration-300 ease-out transform ${
          isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
        }`}
      >
        {/* Header Area with Title & Close Action Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-50 mb-4">
          <div className="flex flex-col pr-8">
            <span className="text-gray-400 text-[10px] font-bold tracking-wider uppercase">
              Image File
            </span>
            <h4 className="text-gray-900 text-sm font-black tracking-tight truncate max-w-[250px] sm:max-w-md">
              {imageTitle}
            </h4>
          </div>

          {/* Top Right Close Button */}
          <div className="flex items-center shrink-0">
            <button 
              onClick={onClose}
              className="h-8 w-8 inline-flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all cursor-pointer"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3. Image Display Canvas (Handles smooth entrance scaling and hover transition effects) */}
        <div className="relative w-full overflow-hidden rounded-2xl bg-gray-50 border border-gray-100/80 flex items-center justify-center p-2">
          <div 
            className={`w-full flex items-center justify-center transition-transform duration-500 ease-out transform ${
              isOpen ? 'scale-100' : 'scale-90'
            }`}
          >
            {imageUrl && (
              <img
                src={imageUrl}
                alt={imageTitle}
                className="max-w-full max-h-[55vh] object-contain rounded-xl select-none transition-transform duration-500 ease-out hover:scale-105"
                loading="lazy"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;