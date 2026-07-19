import React, { useState, useEffect } from "react";
import { Search, Check, ChevronRight, ChevronDown } from "lucide-react";
import RightDrawer from "../common/RightDrawer";
import { useCategoryPanel } from "../../hooks/admin/useCategory";

interface CategorySelectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (categoryId: string, categoryTitle: string) => void;
  selectedValue: string;
  excludeCategoryId?: string;
}

export const CategorySelectorDrawer: React.FC<CategorySelectorDrawerProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedValue,
  excludeCategoryId
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  
  // API hitting process is active when drawer is open
  const { data, isLoading } = useCategoryPanel({ enabled: isOpen });
  const rawCategories = data?.data || data || [];

  // Reset search query and clear states when drawer closes/opens
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checkSearchMatch = (node: any, query: string): boolean => {
    if (!query) return false;
    const title = (node.title || node.name || "").toLowerCase();
    if (title.includes(query.toLowerCase())) return true;
    
    const children = node.children || node.sub_categories || node.subcategories;
    if (children && Array.isArray(children)) {
      return children.some((child) => checkSearchMatch(child, query));
    }
    return false;
  };

  const renderCategoryNode = (node: any, level = 0) => {
    const idStr = String(node.id);
    const title = node.title || node.name || "";
    const children = node.children || node.sub_categories || node.subcategories || [];
    const hasChildren = children.length > 0;
    
    // FIX 1: Instead of hard return null, mark current category as disabled
    const isExcluded = excludeCategoryId && String(excludeCategoryId) === idStr;
    const isSelected = idStr === String(selectedValue);
    const isExpanded = !!expandedIds[idStr];
    const isSearching = searchQuery.trim() !== "";
    
    if (isSearching && !checkSearchMatch(node, searchQuery)) return null;

    const shouldShowChildren = hasChildren && (isExpanded || isSearching);

    return (
      <div key={node.id} className="w-full space-y-1">
        <div
          onClick={() => {
            // FIX 2: Block action if the node is excluded
            if (isExcluded) return; 
            
            if (isSelected) {
              onSelect("", "");
            } else {
              onSelect(idStr, title);
              onClose();
            }
          }}
          className={`group w-full flex items-center justify-between p-3 border rounded-xl text-left transition-all duration-300 ${
            isExcluded
              ? "border-gray-100 bg-gray-50/50 text-gray-400 cursor-not-allowed opacity-60" 
              : isSelected
              ? "border-slate-900 bg-slate-50 text-slate-900 font-semibold shadow-sm cursor-pointer active:scale-[0.995]"
              : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/60 text-slate-600 hover:text-slate-900 cursor-pointer active:scale-[0.995]"
          }`}
          style={{ marginLeft: `${level * 14}px`, width: `calc(100% - ${level * 14}px)` }}
        >
          <div className="flex items-center gap-2.5 overflow-hidden w-full">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => toggleExpand(idStr, e)}
                className="p-1 -ml-1 rounded-md hover:bg-gray-200/60 text-gray-400 hover:text-slate-700 transition-colors duration-200 shrink-0"
              >
                {shouldShowChildren ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              </button>
            ) : (
              <div className="w-6 shrink-0" />
            )}

            <span className="truncate text-[14px] font-semibold tracking-tight">
              {title} {isExcluded && <span className="text-[10px] font-normal text-gray-400 italic">(Current Editing)</span>}
            </span>
          </div>

          {isSelected && !isExcluded && (
            <div className="flex items-center justify-center shrink-0 w-5 h-5 bg-slate-900 rounded-full ml-2 animate-in fade-in zoom-in-75 duration-200">
              <Check size={11} className="stroke-[3] text-white" />
            </div>
          )}
        </div>

        {/* FIX 3: Recursive children nodes will now safely load without breaking the chain */}
        {shouldShowChildren && (
          <div className="space-y-1">
            {children.map((child: any) => renderCategoryNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Category Hierarchy"
      subtitle="Select the layer context within the structural tree system"
      size="md"
    >
      <div className="space-y-5 pb-12 antialiased font-sans">
        
        {/* Premium Minimal Search Component */}
        <div className="relative group">
          <Search size={15} className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-slate-800 transition-colors duration-200" />
          <input
            type="text"
            placeholder="Search category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-[13px] text-slate-800 placeholder-gray-400 border border-gray-200/80 rounded-xl bg-gray-50/40 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 focus:bg-white transition-all duration-300 shadow-sm"
          />
        </div>

        {/* Section Heading Label Block */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-[11px] font-bold text-slate-400/90 tracking-widest uppercase">
            Available Subcategories
          </span>
        </div>

        {/* Categories Dynamic Container Layer */}
        {isLoading ? (
          <div className="space-y-2.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="w-full h-[52px] bg-slate-50 animate-pulse rounded-xl border border-gray-100" />
            ))}
          </div>
        ) : rawCategories.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl text-[13px] text-gray-400 font-normal">
            No categories available.
          </div>
        ) : (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
            {rawCategories.map((cat: any) => renderCategoryNode(cat))}
          </div>
        )}
      </div>
    </RightDrawer>
  );
};