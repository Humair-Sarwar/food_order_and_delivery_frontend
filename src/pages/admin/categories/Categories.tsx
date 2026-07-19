import React, { useState, useMemo } from "react";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Edit2,
  Trash2,
  Layout,
  Eye,
  Layers2,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  useCategoryDelete,
  useCategoryFetch,
} from "../../../hooks/admin/useCategory";
import ConfirmDeleteModal from "../../../components/common/ConfirmDeleteModal";
import { CategoryFormDrawer } from "./CategoryFormDrawer";
import Button from "../../../components/common/Button";

export interface Category {
  id: string;
  title: string;
  category_slug: string;
  sort_order: number;
  image_id: string | null;
  cover_image_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  page_description: string | null;
  level: number;
  parent_category_id: string | null;
  listing_design: number | null;
  status?: string;
  media?: {
    media_path: string;
  } | null;
  children?: Category[];
}

export const Categories: React.FC = () => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  
  // NEW: View mode control layout toggle
  const [isViewMode, setIsViewMode] = useState(false);
  
  // Triggering the query layer
  const { data, isPending } = useCategoryFetch();

  // Use the pre-built nested tree structure directly from API response safely
  const categoryTree = useMemo(() => data?.data ?? [], [data]);

  const { mutate: deleteCategory, isPending: isDeleting } = useCategoryDelete();

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddNew = () => {
    setCategoryToEdit(null); // Clear active item to switch into Creation mode
    setIsViewMode(false);    // Ensure view mode is disabled
    setIsDrawerOpen(true);
  };

  const handleEdit = (category: Category) => {
    setCategoryToEdit(category); // Load selected node into state for editing
    setIsViewMode(false);        // Ensure view mode is disabled
    setIsDrawerOpen(true);
  };

  // FIX: Form modal trigger layout for read-only visualization layer
  const handleView = (category: Category) => {
    setCategoryToEdit(category);
    setIsViewMode(true);         // Lock drawer layout inside read-only mode
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = (payload: any) => {
    if (categoryToEdit) {
      // Execute update mutation layer here
      console.log("Updating Node ID:", categoryToEdit.id, payload);
    } else {
      // Execute creation mutation layer here
      console.log("Creating New Node:", payload);
    }
  };

  const handleDeleteTrigger = (id: string) => {
    setSelectedCategoryId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedCategoryId) return;

    deleteCategory(selectedCategoryId, {
      onSuccess: (res: any) => {
        toast.success(res?.message || "Category deleted successfully!");
        setIsDeleteOpen(false);
        setSelectedCategoryId(null);
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message || "Failed to delete category."
        );
      },
    });
  };

  const getLayoutDesignLabel = (designCode: number | null) => {
    if (designCode === 1) return "Grid View";
    if (designCode === 2) return "List View";
    return "Default";
  };

  const renderCategoryRow = (category: Category, depth = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = !!expandedRows[category.id];
    const hasImage = category.media && category.media.media_path;
    const imageUrl = hasImage
      ? `${import.meta.env.VITE_API_BASE_URL}/storage/${category?.media?.media_path}`
      : null;

    return (
      <React.Fragment key={category.id}>
        <tr className="border-b border-gray-100 hover:bg-gray-50/60 transition-all duration-200 group">
          <td className="py-3.5 px-6">
            <div
              className="flex items-center gap-3"
              style={{ paddingLeft: `${depth * 24}px` }} 
            >
              {hasChildren ? (
                <button
                  onClick={() => toggleRow(category.id)}
                  className="h-6 w-6 inline-flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-md transition-colors cursor-pointer shrink-0"
                >
                  {isExpanded ? (
                    <ChevronDown size={14} className="stroke-[2.5]" />
                  ) : (
                    <ChevronRight size={14} className="stroke-[2.5]" />
                  )}
                </button>
              ) : (
                <div className="w-6 shrink-0" />
              )}

              <div className="relative h-9 w-9 min-w-[36px] rounded-xl overflow-hidden border border-gray-200/60 bg-gray-50 flex items-center justify-center shadow-inner group-hover:border-orange-200/70 transition-colors duration-300 shrink-0">
                {hasImage ? (
                  <img
                    src={imageUrl!}
                    alt={category.title}
                    className="h-full w-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <Layers2
                    size={15}
                    className="text-gray-400 stroke-[1.8] group-hover:text-orange-500 transition-colors"
                  />
                )}
              </div>

              <div className="flex flex-col min-w-0 overflow-hidden">
                <span className="text-sm font-semibold text-gray-900 group-hover:text-orange-500 transition-colors truncate">
                  {category.title}
                </span>
                <span className="text-[10px] font-medium text-gray-400 mt-0.5 tracking-wide truncate">
                  {category.category_slug
                    ? `/${category.category_slug}`
                    : "/root-slug"}
                </span>
              </div>
            </div>
          </td>

          <td className="py-3.5 px-6">
            <span className="px-2 py-0.5 text-[11px] font-medium bg-gray-100 text-gray-600 rounded-lg whitespace-nowrap">
              Level {category.level}
            </span>
          </td>

          <td className="py-3.5 px-6 font-semibold text-sm text-gray-750">
            {category.sort_order}
          </td>

          <td className="py-3.5 px-6 hidden md:table-cell text-nowrap">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md border border-gray-200/40">
              <Layout size={10} />{" "}
              {getLayoutDesignLabel(category.listing_design)}
            </span>
          </td>

          <td className="py-3.5 px-6 text-right">
            <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleView(category)}
                title="View Details"
                className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-gray-100 text-gray-500 hover:text-orange-600 hover:bg-orange-50 hover:border-orange-100 bg-gray-50/50 shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
              >
                <Eye size={14} className="stroke-[2]" />
              </button>
              <button
                onClick={() => handleEdit(category)}
                title="Edit Category"
                className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-gray-100 text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 bg-gray-50/50 shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
              >
                <Edit2 size={14} className="stroke-[2]" />
              </button>
              <button
                onClick={() => handleDeleteTrigger(category.id)}
                title="Delete Category"
                className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-gray-100 text-gray-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 bg-gray-50/50 shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
              >
                <Trash2 size={14} className="stroke-[2]" />
              </button>
            </div>
          </td>
        </tr>

        {hasChildren &&
          isExpanded &&
          category.children?.map((child) => renderCategoryRow(child, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6 min-h-full">
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Layout */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight sm:text-2xl">
                Categories Management
              </h1>
              <p className="text-xs font-medium text-gray-500 mt-0.5">
                Organize multi-level nesting hierarchies, adjust system
                structures and designs.
              </p>
            </div>

            <Button label="Add New Category" onClick={handleAddNew} />
          </div>

          {/* Database Grid Architecture Layer */}
          <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left table-fixed">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-200 text-xs font-semibold text-gray-400 tracking-wider select-none">
                    <th className="py-3.5 px-6 w-7/12 min-w-[320px]">
                      Category / Route Slug
                    </th>
                    <th className="py-3.5 px-6 w-2/12 text-nowrap">
                      Nesting Depth
                    </th>
                    <th className="py-3.5 px-6 w-1/12">Order</th>
                    <th className="py-3.5 px-6 w-2/12 hidden md:table-cell text-nowrap">
                      Layout Render
                    </th>
                    <th className="py-3.5 px-6 w-2/12 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {isPending ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr
                        key={index}
                        className="animate-pulse border-b border-gray-100"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-gray-100 rounded-md" />
                            <div className="h-9 w-9 bg-gray-100 rounded-xl" />
                            <div className="space-y-2 flex-1 max-w-[200px]">
                              <div className="h-3.5 bg-gray-150 rounded w-3/4" />
                              <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="h-5 bg-gray-100 rounded-lg w-16" />
                        </td>
                        <td className="py-4 px-6">
                          <div className="h-4 bg-gray-150 rounded w-8" />
                        </td>
                        <td className="py-4 px-6 hidden md:table-cell">
                          <div className="h-5 bg-gray-100 rounded-md w-24" />
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-end gap-2">
                            <div className="h-8 w-8 bg-gray-100 rounded-xl" />
                            <div className="h-8 w-8 bg-gray-150 rounded-xl" />
                            <div className="h-8 w-8 bg-gray-150 rounded-xl" />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : categoryTree.length > 0 ? (
                    categoryTree.map((rootCategory: any) =>
                      renderCategoryRow(rootCategory)
                    )
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-16 text-center select-none">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 mb-4 animate-bounce duration-1000">
                          <Layers2 size={24} className="stroke-[1.8]" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-800 tracking-wide">
                          No Categories Available!
                        </h3>
                        <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed">
                          Your nesting tree architecture is currently empty. Get
                          started by adding your first parent node.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        isLoading={isDeleting}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedCategoryId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Category?"
        message="Are you sure you want to delete this category? This action cannot be undone and may affect its subcategories."
      />
      <CategoryFormDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setCategoryToEdit(null);
        }}
        categoryToEdit={categoryToEdit}
        isViewMode={isViewMode} // Sourced conditional lock structure to form drawer
        onSubmit={handleFormSubmit}
        isLoading={false}
      />
    </>
  );
};

export default Categories;