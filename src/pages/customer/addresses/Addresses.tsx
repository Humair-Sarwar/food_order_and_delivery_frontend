import React, { useState } from "react";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Home,
  CheckCircle2,
  X,
  Globe,
  User,
  Phone,
  Building2,
  Map,
  Hash,
  AlertCircle,
} from "lucide-react";

export const Addresses: React.FC = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      title: "Home Address",
      phone: "+92 300 1234567",
      area: "F-7 Markaz",
      fullAddress: "House #123, Street 4, Islamabad 44000",
      isDefault: true,
      variant: "amber",
    },
    {
      id: 2,
      title: "Office Workplace",
      phone: "+92 321 7654321",
      area: "Blue Area",
      fullAddress: "Office #402, Executive Tower, Islamabad 44000",
      isDefault: false,
      variant: "slate",
    },
  ]);

  // Modal State Management with smooth open/close control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldRenderModal, setShouldRenderModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    postcode: "",
    phone: "",
    country: "Pakistan",
  });

  // Track touched fields for live inline validation
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const handleOpenModal = () => {
    setShouldRenderModal(true);
    setTimeout(() => setIsModalOpen(true), 10);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setShouldRenderModal(false);
      setTouched({});
      setFormData({
        firstName: "",
        lastName: "",
        address: "",
        apartment: "",
        city: "",
        postcode: "",
        phone: "",
        country: "Pakistan",
      });
    }, 300); // match transition duration
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Inline Validation Checks
  const errors = {
    firstName: !formData.firstName.trim() ? "First name is required." : "",
    lastName: !formData.lastName.trim() ? "Last name is required." : "",
    address: !formData.address.trim() ? "Street address is required." : "",
    city: !formData.city.trim() ? "City is required." : "",
    postcode: !formData.postcode.trim() ? "Postcode is required." : "",
    phone: !formData.phone.trim()
      ? "Phone number is required."
      : !/^\+?[0-9\s-]{7,15}$/.test(formData.phone.trim())
      ? "Please enter a valid phone number."
      : "",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mark all fields as touched to display errors if any
    setTouched({
      firstName: true,
      lastName: true,
      address: true,
      city: true,
      postcode: true,
      phone: true,
    });

    const hasErrors = Object.values(errors).some((err) => err !== "");
    if (hasErrors) return;

    // Add address logic here
    handleCloseModal();
  };

  const getCardStyle = (variant: string) => {
    switch (variant) {
      case "amber":
        return "bg-gradient-to-br from-amber-50/80 via-white to-white border-amber-200/80 shadow-[0_4px_20px_rgba(245,158,11,0.05)] hover:border-amber-400";
      case "slate":
        return "bg-gradient-to-br from-slate-50/90 via-white to-white border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:border-slate-400";
      default:
        return "bg-white border-gray-200";
    }
  };

  const getIconContainerStyle = (variant: string) => {
    switch (variant) {
      case "amber":
        return "bg-amber-100 text-amber-700";
      case "slate":
        return "bg-slate-200 text-slate-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto relative">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-inner">
            <MapPin size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-950 tracking-tight">
              My Addresses
            </h1>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">
              Manage your saved shipping locations for quick checkout
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-gray-950 to-gray-900 hover:from-orange-600 hover:to-orange-500 text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-gray-950/15 active:scale-95 cursor-pointer"
        >
          <Plus size={16} /> Add New Address
        </button>
      </div>

      {/* Address Cards List Section */}
      <div className="grid grid-cols-1 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`border rounded-[2rem] p-6 sm:p-7 transition-all duration-300 relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group ${getCardStyle(
              addr.variant
            )}`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-2xs transition-transform group-hover:scale-105 ${getIconContainerStyle(
                    addr.variant
                  )}`}
                >
                  <Home size={16} />
                </div>
                <h3 className="text-base font-extrabold text-gray-950">
                  {addr.title}
                </h3>
                {addr.isDefault && (
                  <span className="flex items-center gap-1 bg-orange-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                    <CheckCircle2 size={10} /> Default
                  </span>
                )}
              </div>

              <div className="pl-12 space-y-1 text-xs">
                <p className="text-gray-600 font-medium">
                  Phone:{" "}
                  <span className="text-gray-950 font-bold">{addr.phone}</span>
                </p>
                <p className="text-gray-500 font-medium">
                  Area: <span className="text-gray-800">{addr.area}</span>
                </p>
                <p className="text-gray-500 font-medium">
                  Location:{" "}
                  <span className="text-gray-800">{addr.fullAddress}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-center pl-12 sm:pl-0">
              <button
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-orange-600 bg-white hover:bg-orange-50 rounded-xl transition-all border border-gray-200/80 hover:border-orange-200 cursor-pointer shadow-2xs"
                aria-label="Edit Address"
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-red-600 bg-white hover:bg-red-50 rounded-xl transition-all border border-gray-200/80 hover:border-red-200 cursor-pointer shadow-2xs"
                aria-label="Delete Address"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Smooth Animated Add New Address Modal */}
      {shouldRenderModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
            isModalOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden transition-all duration-300 transform ${
              isModalOpen
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 translate-y-4"
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-950 tracking-tight">
                    Add New Address
                  </h2>
                  <p className="text-xs text-gray-400 font-semibold">
                    Enter your shipping details below
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={handleSubmit}
              className="p-8 space-y-5 max-h-[75vh] overflow-y-auto"
            >
              {/* Country Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <Globe size={14} className="text-orange-600" /> Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="Pakistan">Pakistan</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
                    <User size={14} className="text-orange-600" /> First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("firstName")}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white transition-all ${
                      touched.firstName && errors.firstName
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-orange-500"
                    }`}
                  />
                  {touched.firstName && errors.firstName && (
                    <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle size={12} /> {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
                    <User size={14} className="text-orange-600" /> Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("lastName")}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white transition-all ${
                      touched.lastName && errors.lastName
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-orange-500"
                    }`}
                  />
                  {touched.lastName && errors.lastName && (
                    <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle size={12} /> {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <Map size={14} className="text-orange-600" /> Address
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Street address, house no, etc."
                  value={formData.address}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("address")}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white transition-all ${
                    touched.address && errors.address
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-orange-500"
                  }`}
                />
                {touched.address && errors.address && (
                  <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.address}
                  </p>
                )}
              </div>

              {/* Apartment, suite, etc. (Optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <Building2 size={14} className="text-orange-600" /> Apartment,
                  suite, etc.{" "}
                  <span className="text-gray-400 font-normal lowercase">
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  name="apartment"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  value={formData.apartment}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                />
              </div>

              {/* City & Postcode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
                    <MapPin size={14} className="text-orange-600" /> City
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("city")}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white transition-all ${
                      touched.city && errors.city
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-orange-500"
                    }`}
                  />
                  {touched.city && errors.city && (
                    <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle size={12} /> {errors.city}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
                    <Hash size={14} className="text-orange-600" /> Postcode
                  </label>
                  <input
                    type="text"
                    name="postcode"
                    placeholder="Enter postal/zip code"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("postcode")}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white transition-all ${
                      touched.postcode && errors.postcode
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-orange-500"
                    }`}
                  />
                  {touched.postcode && errors.postcode && (
                    <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle size={12} /> {errors.postcode}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <Phone size={14} className="text-orange-600" /> Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+92 300 0000000"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("phone")}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white transition-all ${
                    touched.phone && errors.phone
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-orange-500"
                  }`}
                />
                {touched.phone && errors.phone && (
                  <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.phone}
                  </p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-orange-600/20 active:scale-95 cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;