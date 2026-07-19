import React, { useEffect, useState } from "react";
import {
  Layers2,
  Layout,
  Sliders,
  Image as ImageIcon,
  Upload,
  X,
  ChevronDown,
} from "lucide-react";
import type { Category } from "./Categories";
import RightDrawer from "../../../components/common/RightDrawer";
import { FormField } from "../../../components/common/FormInput";
import { MediaLibraryModal } from "../../../components/common/MediaLibraryModal";
import {
  useCreateCategory,
  useUpdateCategory,
} from "../../../hooks/admin/useCategory";
import { toast } from "react-toastify";
import { CategorySelectorDrawer } from "../../../components/admin/CategorySelectorDrawer";

// Define standard dynamic media structures to satisfy compile-time type checkers
interface FlexibleMedia {
  media_path?: string;
  url?: string;
  path?: string;
}

interface CategoryFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit: Category | null;
  onSubmit: (formData: any) => void;
  isLoading: boolean;
  isViewMode?: boolean; // New visualization framework prop layer
}

export const CategoryFormDrawer: React.FC<CategoryFormDrawerProps> = ({
  isOpen,
  onClose,
  categoryToEdit,
  onSubmit,
  isLoading,
  isViewMode = false,
}) => {
  const isEditMode = !!categoryToEdit && !isViewMode;

  // Form field states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [sortOrder, setSortOrder] = useState<string>("1");
  const [parentCategoryId, setParentCategoryId] = useState<string>("");
  const [listingDesign, setListingDesign] = useState<number>(1);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [pageDescription, setPageDescription] = useState("");

  // Custom nested drawer control layer
  const [isSelectorDrawerOpen, setIsSelectorDrawerOpen] = useState(false);
  const [selectedParentTitle, setSelectedParentTitle] = useState(
    "Select Parent Category",
  );

  // Validation states for FormField engine
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Integrated media state pattern
  const [imageId, setImageId] = useState<string | number>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [coverImageId, setCoverImageId] = useState<string | number>("");
  const [coverPreview, setCoverPreview] = useState<string>("");

  // Modal selector handling state variables
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<"thumbnail" | "cover">(
    "thumbnail",
  );

  // API and Mutation setups
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  // Combine mutation states to secure the form during network requests
  const isFormSubmitting = createMutation.isPending || updateMutation.isPending;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

  // Helper to safely format asset preview URLs
  const buildPreviewUrl = (mediaPath: string | undefined): string => {
    if (!mediaPath) return "";
    if (mediaPath.startsWith("http://") || mediaPath.startsWith("https://")) {
      return mediaPath;
    }
    return `${apiBaseUrl}/storage/${mediaPath.replace(/^\//, "")}`;
  };

  // Populate form fields dynamically when editing or resetting for a new category
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (categoryToEdit) {
        setTitle(categoryToEdit.title || "");
        setSlug(categoryToEdit.category_slug || "");

        const initialSort = Number(categoryToEdit.sort_order);
        setSortOrder(String(initialSort < 1 ? 1 : initialSort));

        setParentCategoryId(categoryToEdit.parent_category_id || "");
        setListingDesign(categoryToEdit.listing_design === 2 ? 2 : 1);
        setMetaTitle(categoryToEdit.meta_title || "");
        setMetaDescription(categoryToEdit.meta_description || "");
        setPageDescription(categoryToEdit.page_description || "");

        setImageId(categoryToEdit.image_id || "");
        setCoverImageId(categoryToEdit.cover_image_id || "");

        // Dynamic type assertions to clear property compilation failures
        const thumbObj = categoryToEdit.media as FlexibleMedia | undefined;
        const coverObj = ((categoryToEdit as any).cover_media ||
          (categoryToEdit as any).cover_image) as FlexibleMedia | undefined;

        setImagePreview(
          buildPreviewUrl(
            thumbObj?.media_path || thumbObj?.url || thumbObj?.path,
          ),
        );
        setCoverPreview(
          buildPreviewUrl(
            coverObj?.media_path || coverObj?.url || coverObj?.path,
          ),
        );

        const parentObj =
          (categoryToEdit as any).parent ||
          (categoryToEdit as any).parent_category;
        if (categoryToEdit.parent_category_id && parentObj) {
          setSelectedParentTitle(
            parentObj.title || parentObj.name || "Parent Assigned",
          );
        } else {
          setSelectedParentTitle("[ Root / Parent Category ]");
        }
      } else {
        setTitle("");
        setSlug("");
        setSortOrder("1");
        setParentCategoryId("");
        setListingDesign(1);
        setMetaTitle("");
        setMetaDescription("");
        setPageDescription("");
        setImageId("");
        setImagePreview("");
        setCoverImageId("");
        setCoverPreview("");
        setSelectedParentTitle("Select Parent Category");
      }
    }
  }, [isOpen, categoryToEdit, apiBaseUrl]);

  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (isViewMode) return;
    const val = e.target.value;
    setTitle(val);

    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: "" }));
    }

    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setSlug(generatedSlug);

    if (errors.slug && generatedSlug.trim()) {
      setErrors((prev) => ({ ...prev, slug: "" }));
    }
  };

  const handleSlugChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (isViewMode) return;
    const val = e.target.value;
    setSlug(val);
    if (errors.slug && val.trim()) {
      setErrors((prev) => ({ ...prev, slug: "" }));
    }
  };

  const handleSortOrderChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (isViewMode) return;
    let val = e.target.value;
    if (val.includes(".")) {
      val = val.split(".")[0];
    }
    val = val.replace(/[^0-9]/g, "");
    if (val !== "" && Number(val) < 1) {
      val = "1";
    }
    setSortOrder(val);

    if (errors.sortOrder && val.trim()) {
      setErrors((prev) => ({ ...prev, sortOrder: "" }));
    }
  };

  const openMediaLibrary = (target: "thumbnail" | "cover") => {
    if (isLoading || isFormSubmitting || isViewMode) return;
    setMediaTarget(target);
    setIsMediaOpen(true);
  };

  const handleMediaSelect = (mediaItem: {
    id: string | number;
    url?: string;
    media_path?: string;
  }) => {
    if (isViewMode) return;
    const targetPath = mediaItem.url || mediaItem.media_path;
    const finalUrl = buildPreviewUrl(targetPath);

    if (mediaTarget === "thumbnail") {
      setImageId(mediaItem.id);
      setImagePreview(finalUrl);
    } else {
      setCoverImageId(mediaItem.id);
      setCoverPreview(finalUrl);
    }
    setIsMediaOpen(false);
  };

  const clearMedia = (e: React.MouseEvent, type: "thumbnail" | "cover") => {
    e.stopPropagation();
    if (isLoading || isFormSubmitting || isViewMode) return;
    if (type === "thumbnail") {
      setImageId("");
      setImagePreview("");
    } else {
      setCoverImageId("");
      setCoverPreview("");
    }
  };

  const handleFormSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading || isFormSubmitting || isViewMode) return;

    if (!title.trim() || !slug.trim() || !sortOrder.trim()) {
      toast.error("Please fill in all required core fields.");
      return;
    }

    const payload = {
      title,
      category_slug: slug,
      sort_order: Number(sortOrder),
      parent_category_id: parentCategoryId || undefined,
      listing_design: listingDesign,
      meta_title: metaTitle || undefined,
      meta_description: metaDescription || undefined,
      page_description: pageDescription || undefined,
      image_id: imageId ? String(imageId) : undefined,
      cover_image_id: coverImageId ? String(coverImageId) : undefined,
    };

    if (!categoryToEdit) {
      createMutation.mutate(payload, {
        onSuccess: (data) => {
          toast.success("Category created successfully!");
          if (onSubmit) onSubmit(data);
          onClose();
        },
        onError: (err: any) => {
          if (err?.response?.data?.errors) {
            setErrors(err.response.data.errors);
            toast.error("Validation failed. Please check fields.");
          } else {
            toast.error(
              err?.response?.data?.message || "Failed to deploy new category.",
            );
          }
        },
      });
    } else {
      if (!categoryToEdit?.id) return;

      updateMutation.mutate(
        { id: categoryToEdit.id, data: payload },
        {
          onSuccess: (data) => {
            if (onSubmit) onSubmit(data);
            onClose();
          },
          onError: (err: any) => {
            if (err?.response?.data?.errors) {
              setErrors(err.response.data.errors);
              toast.error("Validation failed. Please check fields.");
            } else {
              toast.error(
                err?.response?.data?.message ||
                  "Failed to update category structure.",
              );
            }
          },
        },
      );
    }
  };

  const isWorking = isLoading || isFormSubmitting;
  const isInputDisabled = isWorking || isViewMode;

  const getDrawerTitle = () => {
    if (isViewMode) return "View Category Details";
    return isEditMode ? "Update Category Structure" : "Create New Category";
  };

  const getDrawerSubtitle = () => {
    if (isViewMode)
      return `Reading structural configuration node: ${categoryToEdit?.title}`;
    return isEditMode
      ? `Modifying structural layer: ${categoryToEdit?.title}`
      : "Setup a new node inside your system hierarchy.";
  };

  return (
    <>
      <RightDrawer
        isOpen={isOpen}
        onClose={onClose}
        title={getDrawerTitle()}
        subtitle={getDrawerSubtitle()}
        size="lg"
        footer={
          isViewMode ? (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              Close Record View
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                disabled={isWorking}
                className="px-4 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleFormSubmit()}
                disabled={
                  isWorking ||
                  !title.trim() ||
                  !slug.trim() ||
                  !sortOrder.trim()
                }
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isWorking && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {isEditMode ? "Update Changes" : "Create New Category"}
              </button>
            </>
          )
        }
      >
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6 pb-8">
          {/* SECTION 1: CORE ARCHITECTURE */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-800 font-bold text-sm tracking-wide border-b border-gray-50 pb-2.5">
              <Layers2 size={16} className="text-orange-500 stroke-[2]" />
              Core Configuration
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Category Title"
                name="title"
                type="text"
                required={!isViewMode}
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g., Smart Electronics"
                error={errors.title}
                disabled={isInputDisabled}
              />

              <FormField
                label="Route Slug"
                name="slug"
                type="text"
                required={!isViewMode}
                value={slug}
                onChange={handleSlugChange}
                placeholder="e.g., smart-electronics"
                error={errors.slug}
                disabled={isInputDisabled}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full relative">
                <label className="block text-xs font-bold text-gray-500 tracking-wider mb-2 select-none">
                  Parent Category
                </label>

                <button
                  type="button"
                  disabled={isInputDisabled}
                  onClick={() => setIsSelectorDrawerOpen(true)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-xs border transition-all duration-300 rounded-xl text-left focus:outline-none shadow-sm cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed active:scale-[0.99] group ${
                    parentCategoryId
                      ? "bg-orange-50/50 border-orange-200 text-orange-600"
                      : "bg-gray-50 border-gray-200 text-gray-400"
                  }`}
                >
                  <span
                    className={`tracking-tight ${parentCategoryId ? "font-semibold" : "text-gray-400"}`}
                  >
                    {selectedParentTitle}
                  </span>
                  {!isViewMode && (
                    <ChevronDown
                      size={15}
                      className={
                        parentCategoryId
                          ? "text-orange-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      }
                    />
                  )}
                </button>
              </div>

              <FormField
                label="Sorting Priority / Weight"
                name="sortOrder"
                type="number"
                // min="1"
                required={!isViewMode}
                value={sortOrder}
                onChange={handleSortOrderChange}
                placeholder="1"
                error={errors.sortOrder}
                disabled={isInputDisabled}
              />
            </div>
          </div>

          {/* SECTION 2: DIGITAL MEDIA PLATFORM UPLOADS */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-800 font-bold text-sm tracking-wide border-b border-gray-50 pb-2.5">
              <ImageIcon size={16} className="text-orange-500 stroke-[2]" />
              Category Asset Deliverables
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Primary Graphic Thumbnail Box */}
              <div>
                <label className="block text-xs font-bold text-gray-500 tracking-wider mb-2 select-none">
                  Primary Graphic Thumbnail
                </label>
                <div
                  onClick={() => openMediaLibrary("thumbnail")}
                  className={`group relative border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-xl aspect-[4/3] flex flex-col items-center justify-center text-center p-4 overflow-hidden transition-all duration-200 ${
                    isInputDisabled
                      ? "cursor-not-allowed opacity-90"
                      : "cursor-pointer hover:border-orange-400/80 hover:bg-gray-100/30"
                  }`}
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                      {!isViewMode && (
                        <>
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-150 flex items-center justify-center text-white font-semibold text-xs gap-1.5 backdrop-blur-[2px]">
                            <Upload className="w-4 h-4" /> Change Thumbnail
                          </div>
                          <button
                            type="button"
                            onClick={(e) => clearMedia(e, "thumbnail")}
                            className="absolute cursor-pointer top-2 right-2 p-1.5 rounded-lg bg-white/90 text-gray-500 hover:text-red-500 hover:bg-white shadow-sm transition-colors z-10"
                          >
                            <X size={14} className="stroke-[2.5]" />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Upload
                        className="text-gray-400 mb-2 stroke-[1.8]"
                        size={24}
                      />
                      <span className="text-xs font-semibold text-gray-500">
                        No Thumbnail Selected
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Landscape Cover Banner Box */}
              <div>
                <label className="block text-xs font-bold text-gray-500 tracking-wider mb-2 select-none">
                  Landscape Cover Banner
                </label>
                <div
                  onClick={() => openMediaLibrary("cover")}
                  className={`group relative border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-xl aspect-[4/3] flex flex-col items-center justify-center text-center p-4 overflow-hidden transition-all duration-200 ${
                    isInputDisabled
                      ? "cursor-not-allowed opacity-90"
                      : "cursor-pointer hover:border-orange-400/80 hover:bg-gray-100/30"
                  }`}
                >
                  {coverPreview ? (
                    <>
                      <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                      {!isViewMode && (
                        <>
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-150 flex items-center justify-center text-white font-semibold text-xs gap-1.5 backdrop-blur-[2px]">
                            <Upload className="w-4 h-4" /> Change Banner
                          </div>
                          <button
                            type="button"
                            onClick={(e) => clearMedia(e, "cover")}
                            className="absolute cursor-pointer top-2 right-2 p-1.5 rounded-lg bg-white/90 text-gray-500 hover:text-red-500 hover:bg-white shadow-sm transition-colors z-10"
                          >
                            <X size={14} className="stroke-[2.5]" />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Upload
                        className="text-gray-400 mb-2 stroke-[1.8]"
                        size={24}
                      />
                      <span className="text-xs font-semibold text-gray-500">
                        No Banner Selected
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: INTERFACE & VISUAL DESIGN */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-800 font-bold text-sm tracking-wide border-b border-gray-50 pb-2.5">
              <Layout size={16} className="text-orange-500 stroke-[2]" />
              Layout Render Styles
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 tracking-wider mb-3 select-none">
                Listing Presentation Strategy
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 1, label: "Grid View Scheme" },
                  { value: 2, label: "List View Scheme" },
                ].map((design) => (
                  <button
                    key={design.value}
                    type="button"
                    disabled={isInputDisabled}
                    onClick={() => {
                      if (isViewMode) return;
                      setListingDesign(design.value);
                    }}
                    className={`p-3 text-xs font-semibold rounded-xl border text-center transition-all select-none disabled:opacity-75 disabled:cursor-not-allowed ${
                      listingDesign === design.value
                        ? "border-orange-500 bg-orange-50/40 text-orange-600 shadow-sm font-bold"
                        : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                    } ${!isViewMode && "cursor-pointer active:scale-98"}`}
                  >
                    {design.label}
                  </button>
                ))}
              </div>
            </div>

            <FormField
              label="Page Long Description"
              name="pageDescription"
              type="textarea"
              value={pageDescription}
              onChange={(e) => setPageDescription(e.target.value)}
              placeholder="Provide a rich structural HTML summary or introduction text for this specific target category..."
              rows={3}
              disabled={isInputDisabled}
            />
          </div>

          {/* SECTION 4: SEO PROPERTIES */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-800 font-bold text-sm tracking-wide border-b border-gray-50 pb-2.5">
              <Sliders size={16} className="text-orange-500 stroke-[2]" />
              Search Engine Optimization (SEO)
            </div>

            <FormField
              label="Meta Title Tag"
              name="metaTitle"
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Custom browser page window title..."
              disabled={isInputDisabled}
            />

            <FormField
              label="Meta Description Tag"
              name="metaDescription"
              type="textarea"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Brief search indexing engine pitch statement (150-160 characters recommended)..."
              rows={3}
              disabled={isInputDisabled}
            />
          </div>
        </form>
      </RightDrawer>

      <CategorySelectorDrawer
        isOpen={isSelectorDrawerOpen && !isViewMode}
        onClose={() => setIsSelectorDrawerOpen(false)}
        selectedValue={parentCategoryId}
        excludeCategoryId={categoryToEdit?.id}
        onSelect={(id, title) => {
          if (isViewMode) return;
          setParentCategoryId(id);
          if (id && title) {
            setSelectedParentTitle(title);
          } else {
            setSelectedParentTitle("[ Root / Parent Category ]");
          }
        }}
      />

      <MediaLibraryModal
        isOpen={isMediaOpen && !isViewMode}
        onClose={() => setIsMediaOpen(false)}
        onSelectImage={handleMediaSelect}
      />
    </>
  );
};
