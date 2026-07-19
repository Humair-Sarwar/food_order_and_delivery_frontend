import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  FileText,
  CheckCircle2,
  Image as ImageIcon,
  Globe,
  Layers,
  PackageCheck,
  X,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { CategorySelectorDrawer } from "../../../components/admin/CategorySelectorDrawer";
import { MediaLibraryModal } from "../../../components/common/MediaLibraryModal";
import { useRestaurantPanel } from "../../../hooks/admin/useRestaurant";
import {
  useFoodItemCreate,
  useFoodItemEdit,
  useFoodItemUpdate,
} from "../../../hooks/admin/useFoodItem";

// --- Form State Structure Interface ---
export interface FoodItemFormState {
  title: string;
  category_id: string;
  category_title?: string;
  restaurant_id: string;
  sort_order: number;
  regular_price: number | "";
  sale_price: number | "";
  is_on_sale: boolean;
  is_published: boolean;
  description: string;
  is_available: boolean;
  image_id: string | number | null;
  meta_title: string;
  meta_description: string;
  keywords: string;
}

interface FoodItemFormProps {}

// --- Internal FormInput Reusable Node ---
interface FormInputProps extends React.InputHTMLAttributes<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
> {
  label: string;
  name: string;
  type?: "text" | "number" | "select" | "textarea";
  className?: string;
  children?: React.ReactNode;
  rows?: number;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = "text",
  className = "",
  children,
  rows = 4,
  required,
  ...props
}) => {
  const baseInputStyles =
    "w-full mt-1.5 px-3.5 py-2.5 text-sm font-medium text-gray-800 bg-white border border-gray-200 rounded-xl transition-all outline-none placeholder:text-gray-400 placeholder:font-normal focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed";

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <label
        htmlFor={name}
        className="block text-xs font-bold text-gray-700 tracking-wide select-none"
      >
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      {type === "select" ? (
        <select
          id={name}
          name={name}
          required={required}
          className={`${baseInputStyles} appearance-none cursor-pointer`}
          {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {children}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          required={required}
          className={`${baseInputStyles} resize-none`}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          className={baseInputStyles}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
    </div>
  );
};

// --- Main FoodItemForm Component ---
export const FoodItemForm: React.FC<FoodItemFormProps> = () => {
  const navigate = useNavigate();
  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState<
    string | number | null
  >(null);
  const [errors, setErrors] = useState({
    title: "",
    category_id: "",
    restaurant_id: "",
    regular_price: "",
    sale_price: "",
    sort_order: "",
  });
  // --- Core State Hook Init ---
  const [form, setForm] = useState<FoodItemFormState>({
    title: "",
    category_id: "",
    category_title: "",
    restaurant_id: "",
    sort_order: 1,
    regular_price: "",
    sale_price: "",
    is_on_sale: false,
    is_published: false,
    description: "",
    is_available: true,
    image_id: null,
    meta_title: "",
    meta_description: "",
    keywords: "",
  });

  const { data: restaurantPanelData } = useRestaurantPanel();
  const restaurantsList = restaurantPanelData?.data ?? [];

  const { mutate: createFoodItem, isPending: isCreating } = useFoodItemCreate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { data: editFoodItem, isLoading } = useFoodItemEdit({
    id: id!,
    enabled: !!id,
  });
  const { mutate: updateFoodItem, isPending: isEditing } = useFoodItemUpdate();
  const isSubmitting = isCreating || isEditing;
  const validateField = (name: string, value: any) => {
    switch (name) {
      case "title":
        return value.trim() ? "" : "Title is required.";

      case "category_id":
        return value ? "" : "Please select a category.";

      case "restaurant_id":
        return value ? "" : "Restaurant is required.";

      case "regular_price":
        return Number(value) > 0 ? "" : "Price must be greater than 0.";

      case "sale_price":
        if (value === "") return "Sale price is required.";
        if (Number(value) <= 0) return "Sale price must be greater than 0.";
        if (Number(value) > Number(form.regular_price))
          return "Sale price must be lower or equal than regular price.";
        return "";

      case "sort_order":
        return Number(value) >= 1 ? "" : "Sort order must be at least 1.";

      default:
        return "";
    }
  };

  // --- Populate state from edit hook ---
  useEffect(() => {
    setImagePreview(null);
    setSelectedMediaId(null);
    if (editFoodItem?.data) {
      const data = editFoodItem.data;
      setForm({
        title: data.title || "",
        category_id: data.category_id ? String(data.category_id) : "",
        category_title: data.category?.title || "",
        restaurant_id: data.restaurant_id || "",
        sort_order: data.sort_order || 1,
        regular_price: data.regular_price ?? "",
        sale_price: data.sale_price ?? "",
        is_on_sale: data.is_on_sale || false,
        is_published: data.is_published || false,
        description: data.description || "",
        is_available: data.is_available ?? true,
        image_id: data.image_id || null,
        meta_title: data.meta_title || "",
        meta_description: data.meta_description || "",
        keywords: data.keywords || "",
      });
      if (data.image_id) {
        setSelectedMediaId(data.image_id);
        // Set image preview from image.media_path with full URL
        if (data.image?.media_path) {
          setImagePreview(
            `${import.meta.env.VITE_API_BASE_URL}/storage/${data.image.media_path}`,
          );
        }
      }
    }
  }, [editFoodItem]);

  // --- Standard Form Input Change Handler ---
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    let newValue: any = value;

    if (name === "sort_order") {
      newValue = value.replace(/\D/g, ""); // only integers
    }

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Auto-fill sale price when regular price changes
    if (name === "regular_price" && newValue && Number(newValue) > 0) {
      setForm((prev) => ({
        ...prev,
        sale_price: newValue,
      }));
      setErrors((prev) => ({
        ...prev,
        sale_price: "",
      }));
    }

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, newValue),
    }));
  };

  // --- Checkbox/Toggle Input Change Handler ---
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  // --- Media Library Selection Handler ---
  const handleMediaSelect = (media: { id: string | number; url: string }) => {
    setForm((prev) => ({ ...prev, image_id: media.id }));
    setImagePreview(media.url);
    setSelectedMediaId(media.id);
  };

  // --- Remove Image Handler ---
  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, image_id: null }));
    setImagePreview(null);
    setSelectedMediaId(null);
  };

  const handleAction = (isPublishing: boolean) => {
    // 1. Validation Logic
    const newErrors = {
      title: validateField("title", form.title),
      category_id: validateField("category_id", form.category_id),
      restaurant_id: validateField("restaurant_id", form.restaurant_id),
      regular_price: validateField("regular_price", form.regular_price),
      sale_price: validateField("sale_price", form.sale_price),
      sort_order: validateField("sort_order", form.sort_order),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      return toast.error("Please fix the validation errors before submitting.");
    }

    // 2. Prepare Payload
    const payload = {
      title: form.title,
      category_id: form.category_id,
      sort_order: Number(form.sort_order),
      restaurant_id: form.restaurant_id,
      image_id: form.image_id,
      regular_price: Number(form.regular_price),
      sale_price: Number(form.sale_price),
      is_on_sale: form.is_on_sale,
      description: form.description,
      is_available: form.is_available,
      is_published: isPublishing,
      meta_title: form.meta_title,
      meta_description: form.meta_description,
      keywords: form.keywords,
    };

    // 3. Trigger Mutation
    if (id) {
      // Edit mode
      updateFoodItem(
        { id, data: payload },
        {
          onSuccess: () => {
            toast.success(
              `Item ${isPublishing ? "published" : "saved as draft"} successfully!`,
            );
            navigate("/admin/food-items");
          },
          onError: (error: any) => {
            toast.error(error?.message || "Failed to update food item.");
          },
        },
      );
    } else {
      // Create mode
      createFoodItem(payload, {
        onSuccess: () => {
          toast.success(
            `Item ${isPublishing ? "published" : "saved as draft"} successfully!`,
          );
          navigate("/admin/food-items");
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to save food item.");
        },
      });
    }
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 w-full border border-gray-100">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              {isEditMode ? "Modify Food Item" : "Create New Food Item"}
            </h1>
            <p className="text-xs font-medium text-gray-400 mt-0.5">
              {isEditMode
                ? "Update your global culinary specifications, live pricing tiers, media, and SEO parameters."
                : "Register a fresh full-width entry node inside your active web ecosystem layout."}
            </p>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-lg border ${
            isEditMode
              ? "bg-blue-50 text-blue-600 border-blue-100"
              : "bg-emerald-50 text-emerald-600 border-emerald-100"
          }`}
        >
          {isEditMode ? "Edit Context" : "Fresh Entry"}
        </span>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* SECTION 1: Core Layout & Meta Info */}
        <div className="bg-gray-50/30 p-5 rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-3 flex items-center gap-2 pb-2 border-b border-gray-100">
            <Layers size={14} className="text-orange-500" />
            <span className="text-xs font-bold tracking-wider text-gray-800">
              Food Item Details
            </span>
          </div>

          <div className="md:col-span-3">
            <FormInput
              label="Item Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Grilled Chicken Club Sandwich"
              required
              className={
                errors.title
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                  : ""
              }
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="flex flex-col w-full">
            <label className="block text-xs font-bold text-gray-700 tracking-wide select-none mb-1.5">
              Select Category <span className="text-rose-500">*</span>
            </label>

            <button
              type="button"
              onClick={() => setIsCategoryDrawerOpen(true)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-medium bg-white border rounded-xl transition-all outline-none cursor-pointer ${
                errors.category_id
                  ? "border-red-300 text-red-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                  : "text-gray-800 border-gray-200 hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
              }`}
            >
              <span
                className={
                  form.category_id
                    ? "text-gray-900 font-semibold"
                    : "text-gray-400"
                }
              >
                {form.category_title || "Choose a Category"}
              </span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            {errors.category_id && (
              <p className="mt-1 text-xs text-red-500">{errors.category_id}</p>
            )}
          </div>

          <div>
            <FormInput
              label="Select Restaurant"
              name="restaurant_id"
              type="select"
              value={form.restaurant_id}
              onChange={handleChange}
              required
              className={
                errors.restaurant_id
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                  : ""
              }
            >
              <option value="">Choose a Restaurant Location</option>
              {restaurantsList.map((res: any) => (
                <option key={res.id} value={res.id}>
                  {res.name}
                </option>
              ))}
            </FormInput>
            {errors.restaurant_id && (
              <p className="mt-1 text-xs text-red-500">
                {errors.restaurant_id}
              </p>
            )}
          </div>
          <div>
            <FormInput
              label="Sort Order"
              name="sort_order"
              type="number"
              value={form.sort_order}
              onChange={handleChange}
              min={1}
              step={1}
              placeholder="1"
            />

            {errors.sort_order && (
              <p className="mt-1 text-xs text-red-500">{errors.sort_order}</p>
            )}
          </div>

          <FormInput
            label="Description"
            name="description"
            type="textarea"
            value={form.description}
            onChange={handleChange}
            placeholder="Provide clean layout descriptions about specific presentation nodes, ingredients, or allergens..."
            className="md:col-span-3"
          />
        </div>

        {/* SECTION 2: Media Asset Matrix */}
        <div className="bg-gray-50/30 p-5 rounded-2xl border border-gray-100 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <ImageIcon size={14} className="text-orange-500" />
            <span className="text-xs font-bold tracking-wider text-gray-800">
              Media Assets
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-full sm:w-40 h-28 relative rounded-xl border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center overflow-hidden shrink-0 shadow-inner group">
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview Node"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 h-6 w-6 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all cursor-pointer z-10"
                  >
                    <X size={12} className="text-gray-600 hover:text-red-500" />
                  </button>
                </>
              ) : (
                <div className="text-center p-3">
                  <ImageIcon
                    size={20}
                    className="text-gray-400 mx-auto mb-1 stroke-[1.5]"
                  />
                  <span className="text-[10px] font-bold text-gray-400">
                    No Media Loaded
                  </span>
                </div>
              )}
            </div>
            <div className="w-full">
              <label className="block text-xs font-bold text-gray-700 tracking-wide mb-1.5">
                Food Item Image
              </label>
              <button
                type="button"
                onClick={() => setIsMediaLibraryOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl transition-all cursor-pointer active:scale-98"
              >
                <ImageIcon size={14} className="stroke-[2.5]" />
                Select from Media Library
              </button>
              <p className="text-[10px] font-medium text-gray-400 mt-1.5">
                Click to select an image from your media library. Supports PNG,
                JPG, JPEG, WEBP.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: Logistics, Stock Inventory, & Live Pricing Control */}
        <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200/50">
            <div className="flex items-center gap-2">
              <PackageCheck size={14} className="text-orange-500" />
              <span className="text-xs font-bold tracking-wider text-gray-800">
                Pricing & Inventory Node
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-gray-500 tracking-wider">
                In Stock Status:
              </span>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="is_available"
                  checked={form.is_available}
                  onChange={handleCheckboxChange}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                <span
                  className={`text-[11px] font-bold ml-2 uppercase ${form.is_available ? "text-emerald-600" : "text-rose-500"}`}
                >
                  {form.is_available ? "Available" : "Out of Stock"}
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FormInput
                label="Regular Price (Rs.)"
                name="regular_price"
                type="number"
                value={form.regular_price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                required
                className={
                  errors.regular_price
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                    : ""
                }
              />
              {errors.regular_price && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.regular_price}
                </p>
              )}
            </div>

            <div>
              <FormInput
                label="Sale Price (Rs.)"
                name="sale_price"
                type="number"
                value={form.sale_price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                className={
                  errors.sale_price
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                    : ""
                }
              />
              {errors.sale_price && (
                <p className="mt-1 text-xs text-red-500">{errors.sale_price}</p>
              )}
            </div>
          </div>

          {/* Is On Sale Checkbox */}
          <div className="flex items-center pt-2">
            <label className="relative flex items-center gap-3 cursor-pointer group select-none pl-5">
              <input
                type="checkbox"
                name="is_on_sale"
                checked={form.is_on_sale}
                onChange={handleCheckboxChange}
                className="peer absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-300 bg-white transition-all checked:border-orange-500 checked:bg-orange-500 hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              <svg
                className="pointer-events-none absolute left-[4px] top-1/2 -translate-y-1/2 h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div className="flex flex-col ml-3">
                <span className="text-xs font-bold text-gray-700 tracking-wide group-hover:text-gray-900 transition-colors">
                  Enable Promotional Pricing (Is On Sale)
                </span>
                <span className="text-[10px] font-medium text-gray-400 mt-0.5">
                  Check this switch to instantly cascade active promotional
                  prices to consumer layers.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* SECTION 4: SEO Metadata Sub-panel Accordion */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => setIsSeoOpen(!isSeoOpen)}
            className="w-full flex items-center justify-between px-5 py-4 bg-gray-50/40 hover:bg-gray-50 transition-colors border-b border-gray-100 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-gray-500" />
              <span className="text-xs font-bold tracking-wider text-gray-700">
                SEO & Core Metadata Engineering
              </span>
            </div>
            <span className="text-xs font-bold text-orange-600">
              {isSeoOpen ? "Collapse [-]" : "Expand [+]"}
            </span>
          </button>

          {isSeoOpen && (
            <div className="p-5 space-y-4 border-t border-gray-100 bg-white/50">
              <FormInput
                label="Meta Title"
                name="meta_title"
                value={form.meta_title}
                onChange={handleChange}
                placeholder="Premium SEO Title Tag Target..."
              />

              <FormInput
                label="Meta Keywords"
                name="keywords"
                value={form.keywords}
                onChange={handleChange}
                placeholder="e.g. burger, fastfood, delivery, online meal"
              />

              <FormInput
                label="Meta Description"
                name="meta_description"
                type="textarea"
                value={form.meta_description}
                onChange={handleChange}
                rows={3}
                placeholder="Write indexable snippet descriptors for search algorithm matrices..."
              />
            </div>
          )}
        </div>

        {/* SECTION 5: Operational Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate("/admin/food-items")}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100/80 border border-rose-100 rounded-xl transition-all cursor-pointer active:scale-98"
          >
            <X size={14} className="stroke-[2.5]" />
            Cancel
          </button>

          <button
            type="button"
            disabled={isSubmitting || isCreating || isEditing || isLoading}
            onClick={() => handleAction(false)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200/80 rounded-xl transition-all cursor-pointer active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
          >
            <FileText size={14} className="stroke-[2.5]" />
            Draft Button
          </button>

          <button
            type="button"
            disabled={isSubmitting || isCreating || isEditing || isLoading}
            onClick={() => handleAction(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-xl shadow-md shadow-orange-600/10 hover:shadow-orange-500/20 transition-all cursor-pointer active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isCreating || isEditing || isLoading ? (
              <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : id ? (
              <Save size={14} className="stroke-[2.5]" />
            ) : (
              <CheckCircle2 size={14} className="stroke-[2.5]" />
            )}
            {id ? "Update Item" : "Publish Item"}
          </button>
        </div>
      </form>

      <CategorySelectorDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
        selectedValue={form.category_id}
        onSelect={(id, title) => {
          setForm((prev) => ({
            ...prev,
            category_id: String(id),
            category_title: title,
          }));

          setErrors((prev) => ({
            ...prev,
            category_id: validateField("category_id", String(id)),
          }));
          setIsCategoryDrawerOpen(false);
        }}
      />

      <MediaLibraryModal
        isOpen={isMediaLibraryOpen}
        onClose={() => setIsMediaLibraryOpen(false)}
        onSelectImage={handleMediaSelect}
        selectedId={selectedMediaId ?? undefined}
      />
    </div>
  );
};
