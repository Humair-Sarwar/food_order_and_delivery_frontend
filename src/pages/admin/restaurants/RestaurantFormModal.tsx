import React, { useState, useEffect } from "react";
import { Upload, Loader2, Image as ImageIcon, X } from "lucide-react";
import { GenericModal } from "../../../components/common/GenericModal";
import { FormField } from "../../../components/common/FormInput";
import { MediaLibraryModal } from "../../../components/common/MediaLibraryModal";
import { Switch } from "../../../components/common/Switch"; // Imported Switch for state handling
import {
  useCreateRestaurant,
  useUpdateRestaurant,
} from "../../../hooks/admin/useRestaurant";
import { toast } from "react-toastify";

interface MediaRelation {
  id: string | number;
  media_path?: string;
  url?: string;
  path?: string;
}

export interface RestaurantFormData {
  id?: string | number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  description: string; // Added description parameter
  logo_id: string | number;
  banner_id: string | number;
  logo?: MediaRelation | null;
  banner?: MediaRelation | null;
  logo_media?: MediaRelation | null;
  banner_media?: MediaRelation | null;
  slug?: string;
  status?: string;
}

interface RestaurantFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: RestaurantFormData) => Promise<void>;
  initialData?: RestaurantFormData | null;
  isReadOnly?: boolean;
}

const defaultState: RestaurantFormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  description: "", // Initialized description string state
  logo_id: "",
  banner_id: "",
  slug: "",
  status: "active",
};

export const RestaurantFormModal: React.FC<RestaurantFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
  isReadOnly = false,
}) => {
  const [formData, setFormData] = useState<RestaurantFormData>(defaultState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<
    "logo_id" | "banner_id" | null
  >(null);

  const { mutate: addRestaurant, isPending: isCreating } =
    useCreateRestaurant();
  const { mutate: updateRestaurant, isPending: isUpdating } =
    useUpdateRestaurant();

  const isSubmitting = isCreating || isUpdating;

  const buildPreviewUrl = (mediaPath: string | undefined): string => {
    if (!mediaPath) return "";
    if (mediaPath.startsWith("http://") || mediaPath.startsWith("https://")) {
      return mediaPath;
    }
    return `${import.meta.env.VITE_API_BASE_URL || ""}/storage/${mediaPath.replace(/^\//, "")}`;
  };

  const openMediaLibrary = (target: "logo_id" | "banner_id") => {
    if (isReadOnly) return;
    setMediaTarget(target);
    setIsMediaOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    if (!validateForm()) return;

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      description: formData.description, // Passed description node downstream
      logo_id: formData.logo_id ? String(formData.logo_id) : "",
      banner_id: formData.banner_id ? String(formData.banner_id) : "",
      status: formData.status || "active",
      slug:
        formData.slug ||
        formData.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-"),
    };

    if (initialData && initialData.id) {
      updateRestaurant(
        { id: String(initialData.id), data: payload },
        {
          onSuccess: (res) => {
            toast.success(res.message || "Restaurant updated successfully.");
            onClose();
          },
          onError: (err: any) => {
            toast.error(
              err?.response?.data?.message || "Failed to update restaurant.",
            );
          },
        },
      );
    } else {
      addRestaurant(payload, {
        onSuccess: (res) => {
          toast.success(res.message || "Restaurant created successfully.");
          onClose();
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || "Failed to create restaurant.",
          );
        },
      });
    }
  };

  const handleMediaSelect = (mediaItem: {
    id: string | number;
    url?: string;
    media_path?: string;
  }) => {
    if (mediaTarget) {
      setFormData((prev) => ({ ...prev, [mediaTarget]: mediaItem.id }));
      const targetPath = mediaItem.url || mediaItem.media_path;
      const finalUrl = buildPreviewUrl(targetPath);

      if (mediaTarget === "logo_id") {
        setLogoPreview(finalUrl);
      } else {
        setBannerPreview(finalUrl);
      }
      setIsMediaOpen(false);
      setMediaTarget(null);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
        city: initialData.city || "",
        description: initialData.description || "", // Populated initial data description
        logo_id: initialData.logo_id || "",
        banner_id: initialData.banner_id || "",
        slug: initialData.slug || "",
        status: initialData.status || "active",
      });

      const logoObj = initialData.logo || initialData.logo_media;
      setLogoPreview(
        buildPreviewUrl(logoObj?.media_path || logoObj?.url || logoObj?.path),
      );

      const bannerObj = initialData.banner || initialData.banner_media;
      setBannerPreview(
        buildPreviewUrl(
          bannerObj?.media_path || bannerObj?.url || bannerObj?.path,
        ),
      );
    } else {
      setFormData(defaultState);
      setLogoPreview("");
      setBannerPreview("");
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Status node state pipeline controller
  const handleStatusToggle = () => {
    if (isReadOnly) return;

    setFormData((prev) => ({
      ...prev,
      status: prev.status === "active" ? "inactive" : "active",
    }));
  };

  const clearMedia = (e: React.MouseEvent, type: "logo_id" | "banner_id") => {
    e.stopPropagation();
    if (isReadOnly) return;
    setFormData((prev) => ({ ...prev, [type]: "" }));
    if (type === "logo_id") setLogoPreview("");
    if (type === "banner_id") setBannerPreview("");
  };

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.phone.trim()) tempErrors.phone = "Phone is required";
    if (!formData.address.trim()) tempErrors.address = "Address is required";
    if (!formData.city.trim()) tempErrors.city = "City is required";

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  return (
    <>
      <GenericModal
        isOpen={isOpen}
        onClose={onClose}
        title={
          isReadOnly
            ? "View Restaurant Details"
            : initialData
              ? "Update Restaurant"
              : "Add New Restaurant"
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5 pb-2">
          {/* --- VISUAL MEDIA COMPOSITOR ZONE --- */}
          <div className="relative pb-16">
            <div
              onClick={() => openMediaLibrary("banner_id")}
              className={`group relative w-full h-44 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 transition-all duration-200 overflow-hidden flex flex-col items-center justify-center gap-2 ${isReadOnly ? "cursor-default" : "hover:border-blue-400 hover:bg-gray-100/50 cursor-pointer"}`}
            >
              {bannerPreview ? (
                <>
                  <img
                    src={bannerPreview}
                    alt="Banner Preview"
                    className="w-full h-full object-cover"
                  />
                  {!isReadOnly && (
                    <>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-150 flex items-center justify-center text-white font-semibold text-xs gap-1.5 backdrop-blur-[2px]">
                        <Upload className="w-4 h-4" /> Change Cover Banner
                      </div>
                      <button
                        type="button"
                        onClick={(e) => clearMedia(e, "banner_id")}
                        className="absolute top-3 right-3 p-1.5 rounded-xl bg-white/90 text-gray-500 hover:text-red-500 hover:bg-white shadow-sm transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center p-4">
                  <div className="mx-auto w-10 h-10 rounded-xl bg-gray-200/60 text-gray-500 flex items-center justify-center mb-2">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-gray-600">
                    Cover Banner
                  </p>
                </div>
              )}
            </div>

            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex justify-center">
              <div className="relative group/logo w-28 h-28">
                <div
                  onClick={() => openMediaLibrary("logo_id")}
                  className={`w-full h-full rounded-full bg-white border-4 border-white shadow-md transition-all duration-300 overflow-hidden flex items-center justify-center ${isReadOnly ? "cursor-default" : "cursor-pointer"} ${logoPreview ? "bg-gray-50 ring-1 ring-gray-100" : "bg-gray-50/80 border-dashed border-gray-300"}`}
                >
                  {logoPreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="w-full h-full object-cover"
                      />
                      {!isReadOnly && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/logo:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white gap-1 rounded-full backdrop-blur-[3px]">
                          <Upload className="w-4 h-4" />
                          <span className="text-[10px] font-bold tracking-wide uppercase">
                            Change
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center p-2 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-extrabold text-gray-400 tracking-wide">
                        No Logo
                      </span>
                    </div>
                  )}
                </div>

                {logoPreview && !isReadOnly && (
                  <button
                    type="button"
                    onClick={(e) => clearMedia(e, "logo_id")}
                    className="absolute top-0 right-0 z-10 p-1.5 rounded-full bg-white text-gray-400 hover:text-rose-500 hover:bg-rose-50 border border-gray-100 shadow-sm transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* --- STATUS TOGGLE BAR NODE --- */}
          <div className="flex items-center justify-between bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-3 shadow-inner">
            <div className="flex flex-col">
              <label className="text-xs font-black text-gray-800 tracking-wide">
                Profile Visibility Status
              </label>
              <span className="text-[11px] font-medium text-gray-400 mt-0.5">
                {formData.status === "active"
                  ? "Vendor is live on the delivery routing directory."
                  : "Vendor is hidden from production application lists."}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-bold tracking-wide ${formData.status === "active" ? "text-emerald-500" : "text-gray-400"}`}
              >
                {formData.status === "active" ? "Active" : "Inactive"}
              </span>
              <Switch
                checked={formData.status === "active"}
                onChange={handleStatusToggle}
                disabled={isReadOnly}
              />
            </div>
          </div>

          {/* --- STRUCTURAL FORM INPUTS AREA --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Restaurant Name"
              name="name"
              required={!isReadOnly}
              disabled={isReadOnly}
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="e.g. Spice Kitchen"
            />
            <FormField
              label="Email Address"
              name="email"
              type="email"
              disabled={isReadOnly}
              optionalText={isReadOnly ? undefined : "optional"}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="vendor@example.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Phone Number"
              name="phone"
              type="tel"
              required={!isReadOnly}
              disabled={isReadOnly}
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="+44 7123 456789"
            />
            <FormField
              label="City"
              name="city"
              required={!isReadOnly}
              disabled={isReadOnly}
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
              placeholder="e.g. London"
            />
          </div>

          <FormField
            label="Full Address"
            name="address"
            type="textarea"
            required={!isReadOnly}
            disabled={isReadOnly}
            rows={2}
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            placeholder="Street address, building, apartment..."
          />

          {/* --- DESCRIPTION FIELD TEXTAREA --- */}
          <FormField
            label="Restaurant Description"
            name="description"
            type="textarea"
            disabled={isReadOnly}
            optionalText={isReadOnly ? undefined : "optional"}
            rows={3}
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            placeholder="Describe the culinary specialties, flavor notes, or operational parameters..."
          />

          {/* Action Buttons Layer */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl cursor-pointer"
            >
              {isReadOnly ? "Close" : "Cancel"}
            </button>

            {!isReadOnly && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 rounded-xl flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : initialData ? (
                  "Update Restaurant"
                ) : (
                  "Add Restaurant"
                )}
              </button>
            )}
          </div>
        </form>
      </GenericModal>

      {!isReadOnly && (
        <MediaLibraryModal
          isOpen={isMediaOpen}
          onClose={() => setIsMediaOpen(false)}
          onSelectImage={handleMediaSelect}
        />
      )}
    </>
  );
};
