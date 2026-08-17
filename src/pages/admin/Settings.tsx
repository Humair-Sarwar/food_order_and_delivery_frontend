import React, { useEffect, useState } from "react";
import {
  Building2,
  CreditCard,
  Save,
  Mail,
  Phone,
  MessageCircle,
  Image as ImageIcon,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "react-toastify";

import {
  useAdminSettings,
  useUpdateSettings,
} from "../../hooks/admin/useSettings";

import { MediaLibraryModal } from "../../components/common/MediaLibraryModal";

type TabId = "general" | "payment";

interface SettingsTab {
  id: TabId;
  name: string;
  icon: LucideIcon;
}

interface MediaSelectData {
  id: string | number;
  url: string;
}

export default function AdminSettings() {
  // =========================================================
  // GET SETTINGS
  // =========================================================

  const {
    data: settingsResponse,
    isPending: isSettingsLoading,
    isError: isSettingsError,
  } = useAdminSettings();

  const settings: any = settingsResponse?.data;

  // =========================================================
  // UPDATE SETTINGS
  // =========================================================

  const updateSettings = useUpdateSettings();

  // =========================================================
  // FORM STATES
  // =========================================================

  const [siteName, setSiteName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [footerDescription, setFooterDescription] = useState("");

  // Logo
  const [logoId, setLogoId] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedMediaId, setSelectedMediaId] = useState<
    string | number | null
  >(null);

  // Media library modal
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);

  // Payment states
  const [codStatus, setCodStatus] = useState(false);
  const [digitalPaymentStatus, setDigitalPaymentStatus] = useState(false);

  // =========================================================
  // ACTIVE TAB
  // =========================================================

  const [activeTab, setActiveTab] = useState<TabId>("general");

  // =========================================================
  // SETTINGS TABS
  // =========================================================

  const settingsTabs: SettingsTab[] = [
    {
      id: "general",
      name: "General Settings",
      icon: Building2,
    },
    {
      id: "payment",
      name: "Payment Gateways",
      icon: CreditCard,
    },
  ];

  // =========================================================
  // LOAD API DATA INTO FORM
  // =========================================================

  useEffect(() => {
    if (!settings) return;

    setSiteName(settings.site_name ?? "");
    setEmail(settings.email ?? "");
    setPhone(settings.phone ?? "");
    setWhatsappNumber(settings.whatsapp_number ?? "");
    setWhatsappEnabled(Boolean(settings.whatsapp_enabled));
    setFooterDescription(settings.footer_description ?? "");

    // =======================================================
    // LOAD LOGO
    // =======================================================

    const currentLogoId = settings.logo_id ?? null;

    setLogoId(currentLogoId);
    setSelectedMediaId(currentLogoId);

    /*
     * If API returns:
     *
     * settings.logo.media_path
     *
     * then preview will be created here.
     *
     * Example:
     * /storage/media/logo.png
     */

    if (settings.logo?.media_path) {
      setLogoPreview(
        `${import.meta.env.VITE_API_BASE_URL}/storage/${settings.logo.media_path}`,
      );
    } else if (settings.logo?.url) {
      setLogoPreview(settings.logo.url);
    } else {
      setLogoPreview(null);
    }

    // =======================================================
    // PAYMENT
    // =======================================================

    setCodStatus(Boolean(settings.cod_enabled));
    setDigitalPaymentStatus(Boolean(settings.digital_payment_enabled));
  }, [settings]);

  // =========================================================
  // MEDIA LIBRARY SELECTION
  // =========================================================

  const handleMediaSelect = (media: MediaSelectData) => {
    setLogoId(String(media.id));
    setSelectedMediaId(media.id);
    setLogoPreview(media.url);

    // Close modal after selection
    setIsMediaLibraryOpen(false);
  };

  // =========================================================
  // REMOVE LOGO
  // =========================================================

  const handleRemoveLogo = () => {
    setLogoId(null);
    setSelectedMediaId(null);
    setLogoPreview(null);
  };

  // =========================================================
  // SAVE SETTINGS
  // =========================================================

  const handleSave = () => {
    updateSettings.mutate(
      {
        site_name: siteName,
        email: email || null,
        phone: phone || null,
        whatsapp_number: whatsappNumber || null,
        whatsapp_enabled: whatsappEnabled,
        footer_description: footerDescription || null,
        logo_id: logoId,
        cod_enabled: codStatus,
        digital_payment_enabled: digitalPaymentStatus,
      },
      {
        onSuccess: () => {
          toast.success("Settings updated successfully!");
        },

        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              error?.message ||
              "Failed to update settings.",
          );
        },
      },
    );
  };

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (isSettingsLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-orange-500" />

          <p className="text-xs font-semibold text-gray-500">
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR STATE
  // =========================================================

  if (isSettingsError) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-5 text-center">
          <p className="text-sm font-black text-red-600">
            Failed to load settings
          </p>

          <p className="mt-1 text-xs font-medium text-red-500">
            Please refresh the page and try again.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
            System Settings
          </h1>

          <p className="mt-0.5 text-xs font-semibold text-gray-500">
            Configure your platform information and payment gateways.
          </p>
        </div>

        {/* Desktop Save Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={updateSettings.isPending}
          className="hidden h-10 items-center gap-2 rounded-xl bg-orange-500 px-4 text-xs font-bold text-white shadow-md shadow-orange-500/10 transition-all hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:flex"
        >
          {updateSettings.isPending ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Save className="h-4 w-4" />
          )}

          <span>
            {updateSettings.isPending ? "Saving..." : "Save Changes"}
          </span>
        </button>
      </div>

      {/* =====================================================
          MAIN GRID
      ====================================================== */}

      <div className="grid items-start gap-6 md:grid-cols-4">
        {/* ===================================================
            LEFT SIDEBAR
        ==================================================== */}

        <div className="flex flex-col gap-1 rounded-2xl border border-gray-200/80 bg-white p-2 shadow-sm md:col-span-1">
          {settingsTabs.map((tab) => {
            const TabIcon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/10"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <TabIcon className="h-4 w-4 shrink-0" />

                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* ===================================================
            RIGHT CONTENT
        ==================================================== */}

        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm md:col-span-3">
          {/* =================================================
              GENERAL SETTINGS
          ================================================== */}

          {activeTab === "general" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Heading */}

              <div>
                <h3 className="text-sm font-black text-gray-800">
                  General Settings
                </h3>

                <p className="mt-0.5 text-[11px] font-bold text-gray-400">
                  Manage your platform identity and contact information.
                </p>
              </div>

              {/* =================================================
                  SITE NAME + LOGO
              ================================================== */}

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Site Name */}

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-gray-500">
                    Site Name
                  </label>

                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="StackFood"
                    className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-xs font-semibold text-gray-700 outline-none transition-all focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  />
                </div>

                {/* =================================================
                    LOGO
                ================================================== */}

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-gray-500">
                    Site Logo
                  </label>

                  <div className="flex items-center gap-3">
                    {/* Logo Preview */}

                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50">
                      {logoPreview ? (
                        <>
                          <img
                            src={logoPreview}
                            alt="Site Logo"
                            className="h-full w-full object-contain p-1"
                          />

                          {/* Remove Button */}

                          <button
                            type="button"
                            onClick={handleRemoveLogo}
                            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md transition-all hover:bg-red-50"
                          >
                            <X className="h-3 w-3 text-gray-500 hover:text-red-500" />
                          </button>
                        </>
                      ) : (
                        <ImageIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </div>

                    {/* Select Button */}

                    <div className="flex flex-col gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsMediaLibraryOpen(true)}
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 text-xs font-bold text-orange-600 transition-all hover:bg-orange-100 active:scale-[0.98]"
                      >
                        <ImageIcon className="h-3.5 w-3.5" />

                        {logoPreview
                          ? "Change Logo"
                          : "Select Logo"}
                      </button>

                      <p className="text-[10px] font-medium text-gray-400">
                        Select your site logo from the media library.
                      </p>
                    </div>
                  </div>

                  {/* Selected Media ID */}

                  {logoId && (
                    <div className="rounded-lg bg-gray-50 px-3 py-2">
                      <p className="truncate text-[10px] font-semibold text-gray-500">
                        Media ID:{" "}
                        <span className="font-bold text-gray-700">
                          {logoId}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* =================================================
                  EMAIL + PHONE
              ================================================== */}

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Email */}

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-gray-500">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="support@example.com"
                      className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3.5 text-xs font-semibold text-gray-700 outline-none transition-all focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                    />
                  </div>
                </div>

                {/* Phone */}

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-gray-500">
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3.5 text-xs font-semibold text-gray-700 outline-none transition-all focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                    />
                  </div>
                </div>
              </div>

              {/* =================================================
                  WHATSAPP
              ================================================== */}

              <div className="grid gap-4 sm:grid-cols-2">
                {/* WhatsApp Number */}

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-gray-500">
                    WhatsApp Number
                  </label>

                  <div className="relative">
                    <MessageCircle className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      value={whatsappNumber}
                      onChange={(e) =>
                        setWhatsappNumber(e.target.value)
                      }
                      placeholder="+92 300 1234567"
                      className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3.5 text-xs font-semibold text-gray-700 outline-none transition-all focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                    />
                  </div>
                </div>

                {/* WhatsApp Enable */}

                <div className="flex items-center justify-between rounded-2xl border border-green-500/10 bg-green-500/[0.03] p-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-800">
                      Enable WhatsApp
                    </span>

                    <span className="mt-0.5 text-[10px] font-bold text-gray-400">
                      Enable WhatsApp contact option.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setWhatsappEnabled((prev) => !prev)
                    }
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                      whatsappEnabled
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                        whatsappEnabled
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* =================================================
                  FOOTER DESCRIPTION
              ================================================== */}

              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-gray-500">
                  Footer Description
                </label>

                <textarea
                  value={footerDescription}
                  onChange={(e) =>
                    setFooterDescription(e.target.value)
                  }
                  rows={4}
                  placeholder="Enter footer description..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-xs font-semibold text-gray-700 outline-none transition-all focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                />
              </div>

              {/* =================================================
                  CURRENT STATUS
              ================================================== */}

              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
                  <div>
                    <p className="text-xs font-black text-gray-800">
                      Configuration Status
                    </p>

                    <p className="mt-0.5 text-[10px] font-semibold text-gray-400">
                      Your general platform settings are ready to save.
                    </p>
                  </div>

                  <span className="rounded-lg bg-green-500/10 px-3 py-1.5 text-[10px] font-black text-green-600">
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================
              PAYMENT GATEWAYS
          ====================================================== */}

          {activeTab === "payment" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Heading */}

              <div>
                <h3 className="text-sm font-black text-gray-800">
                  Payment Gateways
                </h3>

                <p className="mt-0.5 text-[11px] font-bold text-gray-400">
                  Enable or disable available payment methods.
                </p>
              </div>

              {/* =================================================
                  COD
              ================================================== */}

              <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-4 transition-colors hover:border-gray-200">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-xs font-bold text-orange-600">
                    COD
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-800">
                      Cash On Delivery
                    </span>

                    <span className="mt-0.5 text-[11px] font-bold text-gray-400">
                      Allow customers to pay when their order is
                      delivered.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setCodStatus((prev) => !prev)
                  }
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    codStatus
                      ? "bg-orange-500"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                      codStatus
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* =================================================
                  DIGITAL PAYMENT
              ================================================== */}

              <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-4 transition-colors hover:border-gray-200">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-xs font-bold text-blue-600">
                    CC
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-800">
                      Digital Card / Wallet
                    </span>

                    <span className="mt-0.5 text-[11px] font-bold text-gray-400">
                      Allow customers to pay using digital cards or
                      wallets.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setDigitalPaymentStatus((prev) => !prev)
                  }
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    digitalPaymentStatus
                      ? "bg-orange-500"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                      digitalPaymentStatus
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* =================================================
                  PAYMENT STATUS
              ================================================== */}

              <div className="border-t border-gray-100 pt-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                      COD Status
                    </p>

                    <p
                      className={`mt-1 text-xs font-black ${
                        codStatus
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {codStatus ? "Enabled" : "Disabled"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                      Digital Payment Status
                    </p>

                    <p
                      className={`mt-1 text-xs font-black ${
                        digitalPaymentStatus
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {digitalPaymentStatus
                        ? "Enabled"
                        : "Disabled"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          MOBILE SAVE BUTTON
      ========================================================== */}

      <div className="fixed bottom-4 right-4 z-40 sm:hidden">
        <button
          type="button"
          onClick={handleSave}
          disabled={updateSettings.isPending}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-xs font-black text-white shadow-xl shadow-orange-500/20 transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {updateSettings.isPending ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Save className="h-4 w-4" />
          )}

          <span>
            {updateSettings.isPending
              ? "Saving..."
              : "Save Changes"}
          </span>
        </button>
      </div>

      {/* =========================================================
          MEDIA LIBRARY MODAL
      ========================================================== */}

      <MediaLibraryModal
        isOpen={isMediaLibraryOpen}
        onClose={() => setIsMediaLibraryOpen(false)}
        onSelectImage={handleMediaSelect}
        selectedId={selectedMediaId ?? undefined}
      />
    </div>
  );
}