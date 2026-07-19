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
  ChevronDown
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CategorySelectorDrawer } from "../../../components/admin/CategorySelectorDrawer";

// --- Form State Structure Interface ---
export interface FoodItemFormState {
  title: string;
  category_id: string;
  category_title?: string;
  restaurant_id: string;
  sort_order: number;
  price: number | "";
  sale_price: number | "";
  is_on_sale: boolean;
  status: "published" | "draft";
  description: string;
  status_stock: boolean;
  image: File | string | null;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

interface FoodItemFormProps {
  initialData?: FoodItemFormState | null; 
  categories: { id: string | number; title: string }[]; // Updated type definition to handle dynamic data types cleanly
  restaurants: { id: string; name: string }[];
  onSubmit: (formData: FoodItemFormState) => void;
  isSubmitting?: boolean;
  onBack?: () => void;
}

// --- Internal FormInput Reusable Node ---
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
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
  const baseInputStyles = "w-full mt-1.5 px-3.5 py-2.5 text-sm font-medium text-gray-800 bg-white border border-gray-200 rounded-xl transition-all outline-none placeholder:text-gray-400 placeholder:font-normal focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed";

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <label htmlFor={name} className="block text-xs font-bold text-gray-700 tracking-wide uppercase select-none">
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
export const FoodItemForm: React.FC<FoodItemFormProps> = ({
  initialData,
  categories = [],
  restaurants = [],
  onSubmit,
  isSubmitting = false,
  onBack
}) => {
  const isEditMode = !!initialData;
  const navigate = useNavigate();
  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
    const [errors, setErrors] = useState({
  title: "",
  category_id: "",
  restaurant_id: "",
  price: "",
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
    price: "",
    sale_price: "",
    is_on_sale: false,
    status: "draft",
    description: "",
    status_stock: true,
    image: null,
    meta_title: "",
    meta_description: "",
    meta_keywords: ""
  });
  const validateField = (name: string, value: any) => {
  switch (name) {
    case "title":
      return value.trim() ? "" : "Title is required.";

    case "category_id":
      return value ? "" : "Please select a category.";

    case "restaurant_id":
      return value ? "" : "Restaurant is required.";

    case "price":
      return Number(value) > 0 ? "" : "Price must be greater than 0.";

    case "sale_price":
      if (!form.is_on_sale) return "";
      if (value === "") return "Sale price is required.";
      if (Number(value) >= Number(form.price))
        return "Sale price must be lower than regular price.";
      return "";

    case "sort_order":
      return Number(value) >= 1 ? "" : "Sort order must be at least 1.";

    default:
      return "";
  }
};
  // --- Populate state if initial dataset is provided ---
  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        // Convert to string safely to ensure consistency across selectors
        category_id: initialData.category_id ? String(initialData.category_id) : "",
        price: initialData.price ?? "",
        sale_price: initialData.sale_price ?? ""
      });
      if (typeof initialData.image === "string") {
        setImagePreview(initialData.image);
      }
    }
  }, [initialData]);

  // --- Standard Form Input Change Handler ---
  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;

  let newValue: any = value;

  if (name === "sort_order") {
    newValue = value.replace(/\D/g, ""); // only integers
  }

  setForm(prev => ({
    ...prev,
    [name]: newValue,
  }));

  setErrors(prev => ({
    ...prev,
    [name]: validateField(name, newValue),
  }));
};

  // --- Checkbox/Toggle Input Change Handler ---
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  // --- Image File Stream Extraction & Preview ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Form submission validation and processing logic ---
  const handleAction = (statusValue: "published" | "draft") => {
    if (!form.title.trim()) return toast.error("Food title field is strictly required.");
    if (!form.category_id) return toast.error("Please select a valid menu category.");
    if (!form.restaurant_id) return toast.error("Please map this item to a restaurant.");
    if (form.price === "" || Number(form.price) <= 0) {
      return toast.error("Regular price must be greater than zero.");
    }
    if (form.is_on_sale && (form.sale_price === "" || Number(form.sale_price) >= Number(form.price))) {
      return toast.error("Sale price must be lower than the regular target price.");
    }

    onSubmit({
      ...form,
      status: statusValue,
      price: Number(form.price),
      sale_price: form.is_on_sale ? Number(form.sale_price) : (null as any),
      sort_order: Number(form.sort_order)
    });
  };
  console.log(form.category_title)
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 w-full border border-gray-100">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-50 transition-all cursor-pointer"
            >
              <ArrowLeft size={16} />
            </button>
          )}
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
            <span className="text-xs font-bold uppercase tracking-wider text-gray-800">Identity Details</span>
          </div>
          
          <FormInput
            label="Item Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Grilled Chicken Club Sandwich"
            required
            className="md:col-span-3"
          />

          <div className="flex flex-col w-full">
            <label className="block text-xs font-bold text-gray-700 tracking-wide uppercase select-none mb-1.5">
              Select Category <span className="text-rose-500">*</span>
            </label>
            
            <button
              type="button"
              onClick={() => setIsCategoryDrawerOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-medium text-gray-800 bg-white border border-gray-200 rounded-xl transition-all outline-none hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 cursor-pointer"
            >
              <span className={form.category_id ? "text-gray-900 font-semibold" : "text-gray-400"}>
                {form.category_title || "Choose a Category"}
              </span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
          </div>

          <FormInput
            label="Select Restaurant"
            name="restaurant_id"
            type="select"
            value={form.restaurant_id}
            onChange={handleChange}
            required
          >
            <option value="">Choose a Restaurant Location</option>
            {restaurants.map((res) => (
              <option key={res.id} value={res.id}>{res.name}</option>
            ))}
          </FormInput>
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
  <p className="mt-1 text-xs text-red-500">
    {errors.sort_order}
  </p>
)}</div>

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
            <span className="text-xs font-bold uppercase tracking-wider text-gray-800">Media Assets</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-full sm:w-40 h-28 relative rounded-xl border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center overflow-hidden shrink-0 shadow-inner group">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview Node" className="h-full w-full object-cover" />
              ) : (
                <div className="text-center p-3">
                  <ImageIcon size={20} className="text-gray-400 mx-auto mb-1 stroke-[1.5]" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">No Media Loaded</span>
                </div>
              )}
            </div>
            <div className="w-full">
              <label className="block text-xs font-bold text-gray-700 tracking-wide mb-1.5 uppercase">
                Upload Product Banner Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-xs font-medium text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 file:cursor-pointer cursor-pointer border border-gray-200 rounded-xl p-1.5 bg-white"
              />
              <p className="text-[10px] font-medium text-gray-400 mt-1.5">
                Supports extensions: PNG, JPG, JPEG, WEBP. Premium crisp aspect targets suggested.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: Logistics, Stock Inventory, & Live Pricing Control */}
        <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200/50">
            <div className="flex items-center gap-2">
              <PackageCheck size={14} className="text-orange-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-800">Pricing & Inventory Node</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">In Stock Status:</span>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="status_stock"
                  checked={form.status_stock}
                  onChange={handleCheckboxChange}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                <span className={`text-[11px] font-bold ml-2 uppercase ${form.status_stock ? "text-emerald-600" : "text-rose-500"}`}>
                  {form.status_stock ? "Available" : "Out of Stock"}
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Regular Price (Rs.)"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              required
            />

            <FormInput
              label="Sale Price (Rs.)"
              name="sale_price"
              type="number"
              value={form.sale_price}
              onChange={handleChange}
              disabled={!form.is_on_sale}
              placeholder={form.is_on_sale ? "0.00" : "Disabled"}
              min="0"
            />
          </div>

          {/* Is On Sale Checkbox */}
          <div className="flex items-center pt-2">
            <label className="relative flex items-center gap-3 cursor-pointer group select-none">
              <input
                type="checkbox"
                name="is_on_sale"
                checked={form.is_on_sale}
                onChange={handleCheckboxChange}
                className="sr-only peer"
              />
              <div className="h-5 w-5 rounded-md border-2 border-gray-300 bg-white flex items-center justify-center transition-all peer-checked:border-orange-500 peer-checked:bg-orange-500 group-hover:border-orange-400 shadow-sm">
                <svg
                  className="h-3 w-3 text-white stroke-[3.5] opacity-0 peer-checked:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-700 tracking-wide group-hover:text-gray-900 transition-colors">
                  Enable Promotional Pricing (Is On Sale)
                </span>
                <span className="text-[10px] font-medium text-gray-400 mt-0.5">
                  Check this switch to instantly cascade active promotional prices to consumer layers.
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
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700">SEO & Core Metadata Engineering</span>
            </div>
            <span className="text-xs font-bold text-orange-600">{isSeoOpen ? "Collapse [-]" : "Expand [+]"}</span>
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
                name="meta_keywords"
                value={form.meta_keywords}
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
            disabled={isSubmitting}
            onClick={() => handleAction("draft")}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200/80 rounded-xl transition-all cursor-pointer active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
          >
            <FileText size={14} className="stroke-[2.5]" />
            Draft Button
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleAction("published")}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-xl shadow-md shadow-orange-600/10 hover:shadow-orange-500/20 transition-all cursor-pointer active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isEditMode ? (
              <Save size={14} className="stroke-[2.5]" />
            ) : (
              <CheckCircle2 size={14} className="stroke-[2.5]" />
            )}
            Publish Item
          </button>
        </div>
      </form>

      <CategorySelectorDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
        selectedValue={form.category_id}
        onSelect={(id, title) => {
  setForm(prev => ({
    ...prev,
    category_id: String(id),
    category_title: title,
  }));

  setIsCategoryDrawerOpen(false);
}}
      />
    </div>
  );
};