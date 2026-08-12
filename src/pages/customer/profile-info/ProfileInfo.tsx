import React, { useState, useEffect, useRef } from "react";
import { User, Mail, Phone, Calendar, Camera, Save, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

// Import hooks from your designated hooks/services files
import { 
  useChangePassword, 
  useProfileInfo, 
  useProfileInfoUpdate, 
  useProfileImageUpdate 
} from "../../../hooks/website/useProfile";

export const ProfileInfo = () => {
  const { data, isLoading } = useProfileInfo();
  const profile = data?.data;

  // Initialize mutations
  const { mutate: updateProfile, isPending: isSaving } = useProfileInfoUpdate();
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();
  const { mutate: updateProfileImage, isPending: isUpdatingImage } = useProfileImageUpdate();

  // Reference for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for user profile information
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    phone: "",
  });

  // State for inline validation errors
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    phone: "",
  });

  // Populate form data once API data is available
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile?.first_name || "",
        lastName: profile?.last_name || "",
        email: profile?.email || "",
        dob: profile?.dob || "",
        phone: profile?.phone || "",
      });
    }
  }, [profile]);

  // State for password change fields
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State for toggling password visibility
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Live inline validation function
  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "firstName":
        if (!value.trim()) error = "First name is required.";
        break;
      case "lastName":
        if (!value.trim()) error = "Last name is required.";
        break;
      case "email":
        if (!value.trim()) {
          error = "Email address is required.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Please enter a valid email address.";
        }
        break;
      case "dob":
        if (!value) error = "Date of birth is required.";
        break;
      case "phone":
        if (!value.trim()) {
          error = "Phone number is required.";
        } else if (!/^\+?[0-9\s-]{10,15}$/.test(value)) {
          error = "Please enter a valid phone number.";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Handle Image Selection and Upload
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  updateProfileImage(file, {
    onSuccess: (res: any) => {
      toast.success(
        res?.message || "Profile picture updated successfully!"
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
        "Failed to update profile picture."
      );
    },
  });
};

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      firstName: validateField("firstName", formData.firstName),
      lastName: validateField("lastName", formData.lastName),
      email: validateField("email", formData.email),
      dob: validateField("dob", formData.dob),
      phone: validateField("phone", formData.phone),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err !== "")) {
      return;
    }

    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      dob: formData.dob,
      phone: formData.phone,
    };

    updateProfile(payload, {
      onSuccess: (res: any) => {
        toast.success(res?.message || "Profile updated successfully!");
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to update profile.");
      },
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    const payload = {
      current_password: passwordData.currentPassword,
      new_password: passwordData.newPassword,
      new_password_confirmation: passwordData.confirmPassword,
    };

    changePassword(payload, {
      onSuccess: (res: any) => {
        toast.success(res?.message || "Password updated successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to update password.");
      },
    });
  };

  return (
    <div className="space-y-10">
      {/* Hidden File Input for Image Upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Page Header */}
      <div className="pb-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-950">Profile Information</h1>
          <p className="text-xs font-semibold text-gray-400 mt-1">
            Manage your personal details and security settings
          </p>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-gray-950 to-gray-900 p-6 sm:p-8 rounded-[2.5rem] text-white flex flex-col sm:flex-row items-center gap-6 shadow-xl relative overflow-hidden">
        <div className="relative">
          {isLoading ? (
            <div className="w-24 h-24 rounded-3xl bg-gray-800 animate-pulse" />
          ) : (
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center font-black text-3xl shadow-lg border-2 border-white/25 overflow-hidden">
              {profile?.image ? (
                <img 
                  src={`${import.meta.env.VITE_API_BASE_URL}/storage/${profile.image}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                formData.firstName ? formData.firstName.charAt(0).toUpperCase() : "U"
              )}
            </div>
          )}
          <button
            type="button"
            onClick={handleImageClick}
            disabled={isUpdatingImage}
            className="absolute -bottom-2 -right-2 w-9 h-9 bg-white text-gray-950 rounded-2xl flex items-center justify-center shadow-md hover:bg-orange-50 hover:text-orange-600 transition-all cursor-pointer disabled:opacity-50"
            title="Update photo"
          >
            <Camera size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="text-center sm:text-left space-y-2">
          <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest inline-block">
            Verified Customer
          </span>
          {isLoading ? (
            <div className="space-y-2 pt-1">
              <div className="w-48 h-7 bg-gray-800 rounded-lg animate-pulse" />
              <div className="w-36 h-4 bg-gray-800 rounded-lg animate-pulse" />
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-black">{`${formData.firstName} ${formData.lastName}`.trim() || "User Profile"}</h2>
              <p className="text-sm text-gray-400 font-medium">{formData.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Personal Info Form */}
      <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border-2 border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <User size={20} />
          </div>
          <div>
            <h3 className="font-black text-gray-950 text-base">Personal Details</h3>
            <p className="text-xs font-semibold text-gray-400">Update your name, email, DOB and phone number</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-5 animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <div className="w-24 h-4 bg-gray-200 rounded" />
                <div className="w-full h-12 bg-gray-100 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <div className="w-24 h-4 bg-gray-200 rounded" />
                <div className="w-full h-12 bg-gray-100 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <div className="w-28 h-4 bg-gray-200 rounded" />
                <div className="w-full h-12 bg-gray-100 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <div className="w-28 h-4 bg-gray-200 rounded" />
                <div className="w-full h-12 bg-gray-100 rounded-2xl" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <div className="w-28 h-4 bg-gray-200 rounded" />
                <div className="w-full h-12 bg-gray-100 rounded-2xl" />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <div className="w-36 h-12 bg-gray-200 rounded-2xl" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* First Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  First Name <span className="text-orange-600">*</span>
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-3 rounded-2xl border-2 bg-gray-50/50 outline-none font-semibold text-sm transition-all ${
                      errors.firstName ? "border-red-500 focus:bg-white" : "border-gray-100 focus:border-orange-500 focus:bg-white"
                    }`}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Last Name <span className="text-orange-600">*</span>
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-3 rounded-2xl border-2 bg-gray-50/50 outline-none font-semibold text-sm transition-all ${
                      errors.lastName ? "border-red-500 focus:bg-white" : "border-gray-100 focus:border-orange-500 focus:bg-white"
                    }`}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.lastName}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Email Address <span className="text-orange-600">*</span>
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-3 rounded-2xl border-2 bg-gray-50/50 outline-none font-semibold text-sm transition-all ${
                      errors.email ? "border-red-500 focus:bg-white" : "border-gray-100 focus:border-orange-500 focus:bg-white"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.email}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Date of Birth <span className="text-orange-600">*</span>
                </label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-3 rounded-2xl border-2 bg-gray-50/50 outline-none font-semibold text-sm transition-all ${
                      errors.dob ? "border-red-500 focus:bg-white" : "border-gray-100 focus:border-orange-500 focus:bg-white"
                    }`}
                  />
                </div>
                {errors.dob && (
                  <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.dob}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Phone Number <span className="text-orange-600">*</span>
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-3 rounded-2xl border-2 bg-gray-50/50 outline-none font-semibold text-sm transition-all ${
                      errors.phone ? "border-red-500 focus:bg-white" : "border-gray-100 focus:border-orange-500 focus:bg-white"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-gray-950 text-white hover:bg-orange-600 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Save size={16} strokeWidth={2.2} />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Change Password Card */}
      <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border-2 border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <Lock size={20} />
          </div>
          <div>
            <h3 className="font-black text-gray-950 text-base">Security & Password</h3>
            <p className="text-xs font-semibold text-gray-400">Ensure your account is using a secure password</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Current Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full pl-4 pr-11 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50/50 outline-none focus:border-orange-500 focus:bg-white font-semibold text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  placeholder="••••••••"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full pl-4 pr-11 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50/50 outline-none focus:border-orange-500 focus:bg-white font-semibold text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full pl-4 pr-11 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50/50 outline-none focus:border-orange-500 focus:bg-white font-semibold text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="flex items-center gap-2 bg-gray-950 text-white hover:bg-orange-600 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Lock size={16} strokeWidth={2.2} />
              {isChangingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileInfo;