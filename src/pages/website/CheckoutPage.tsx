import React, { useState, useEffect } from "react";
import {
  CreditCard,
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  Lock,
  MapPin,
  Globe,
  User,
  Map,
  Building2,
  Hash,
  Phone,
  X,
  LogOut,
  ChevronDown,
  Tag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddresses } from "../../hooks/website/useAddress";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../../store/slices/authSlice";
import { useLogout } from "../../hooks/auth/useLogin";
import { useCheckout } from "../../hooks/website/useCheckout";
import no_image from "../../assets/images/empty-image.jpg";

export const CheckoutPage: React.FC = () => {
  // =========================================================
  // CART ID
  // =========================================================

  const [cartId, setCartId] = useState<string | undefined>(() =>
    localStorage.getItem("cart_id") ?? undefined
  );

  useEffect(() => {
    const storedCartId = localStorage.getItem("cart_id");

    if (storedCartId) {
      setCartId(storedCartId);
    }
  }, []);

  // =========================================================
  // CHECKOUT API
  // =========================================================

  const {
    data: checkoutData,
    isLoading,
    isError,
  } = useCheckout(cartId);

  // =========================================================
  // CHECKOUT DATA
  // =========================================================

  const checkout = checkoutData?.data;
  const user: any = checkout?.user;
  const cart = checkout?.cart;

  const cartItems = cart?.items || [];

  const subtotal = Number(cart?.summary?.subtotal || 0);

  const shippingFee = Number(
    cart?.summary?.delivery_fee || 0
  );

  const total = Number(
    cart?.summary?.total || subtotal + shippingFee
  );

  // =========================================================
  // TOTAL SAVINGS
  // =========================================================

  const totalSavings = cartItems.reduce(
    (totalSaving: number, item: any) => {
      const regularPrice = Number(
        item?.food_item?.regular_price || 0
      );

      const unitPrice = Number(
        item?.unit_price || 0
      );

      const quantity = Number(
        item?.quantity || 0
      );

      const saving =
        regularPrice > unitPrice
          ? (regularPrice - unitPrice) * quantity
          : 0;

      return totalSaving + saving;
    },
    0
  );

  // =========================================================
  // ADDRESS API
  // =========================================================

  const {
    data: addressResponse,
    isPending: isLoadingAddresses,
  } = useAddresses();

  const savedAddresses = Array.isArray(addressResponse)
    ? addressResponse
    : addressResponse?.data || [];

  // =========================================================
  // NAVIGATION / AUTH
  // =========================================================

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const {
    mutate: mutateLogout,
    isPending: isLoggingOut,
  } = useLogout();

  // =========================================================
  // PAYMENT
  // =========================================================

  const [paymentMethod, setPaymentMethod] = useState<
    "cod" | "online"
  >("cod");

  // =========================================================
  // ADDRESS MODAL
  // =========================================================

  const [isAddressModalOpen, setIsAddressModalOpen] =
    useState(false);

  const [isAnimating, setIsAnimating] =
    useState(false);

  const [isAddressExpanded, setIsAddressExpanded] =
    useState(true);

  // =========================================================
  // VALIDATION ERRORS
  // =========================================================

  const [errors, setErrors] = useState<{
    [key: string]: string;
  }>({});

  // =========================================================
  // SHIPPING ADDRESS
  // =========================================================

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    postcode: "",
    phone: "",
    country: "Pakistan",
  });

  // =========================================================
  // ADDRESS VALIDATION
  // =========================================================

  const validateField = (
    name: string,
    value: string
  ) => {
    let errorMsg = "";

    if (
      [
        "firstName",
        "lastName",
        "address",
        "city",
        "postcode",
        "phone",
        "country",
      ].includes(name)
    ) {
      if (!value || value.trim() === "") {
        errorMsg = "This field is required.";
      }
    }

    return errorMsg;
  };

  // =========================================================
  // SELECT FIRST ADDRESS AUTOMATICALLY
  // =========================================================

  useEffect(() => {
    if (
      Array.isArray(savedAddresses) &&
      savedAddresses.length > 0
    ) {
      const defaultAddr = savedAddresses[0];

      if (defaultAddr) {
        const newAddress = {
          firstName: defaultAddr.first_name || "",
          lastName: defaultAddr.last_name || "",
          address: defaultAddr.address || "",
          apartment: defaultAddr.apartment || "",
          city: defaultAddr.city || "",
          postcode: defaultAddr.postcode || "",
          phone: defaultAddr.phone || "",
          country: defaultAddr.country || "Pakistan",
        };

        setShippingAddress(newAddress);

        const clearedErrors: {
          [key: string]: string;
        } = {};

        Object.keys(newAddress).forEach((key) => {
          clearedErrors[key] = validateField(
            key,
            (newAddress as any)[key]
          );
        });

        setErrors(clearedErrors);
      }
    }
  }, [addressResponse]);

  // =========================================================
  // ADDRESS MODAL
  // =========================================================

  const openAddressModal = () => {
    setIsAddressModalOpen(true);

    requestAnimationFrame(() => {
      setIsAnimating(true);
    });
  };

  const closeAddressModal = () => {
    setIsAnimating(false);

    setTimeout(() => {
      setIsAddressModalOpen(false);
    }, 300);
  };

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));

    const errorMsg = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  // =========================================================
  // SELECT SAVED ADDRESS
  // =========================================================

  const handleSelectSavedAddress = (
    addr: any
  ) => {
    const selected = {
      firstName: addr.first_name || "",
      lastName: addr.last_name || "",
      address: addr.address || "",
      apartment: addr.apartment || "",
      city: addr.city || "",
      postcode: addr.postcode || "",
      phone: addr.phone || "",
      country: addr.country || "Pakistan",
    };

    setShippingAddress(selected);

    const clearedErrors: {
      [key: string]: string;
    } = {};

    Object.keys(selected).forEach((key) => {
      clearedErrors[key] = validateField(
        key,
        (selected as any)[key]
      );
    });

    setErrors(clearedErrors);

    closeAddressModal();

    toast.success(
      "Shipping address selected successfully!"
    );
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    mutateLogout(undefined, {
      onSuccess: () => {
        dispatch(logoutAction());

        localStorage.removeItem("cart_id");

        toast.success(
          "Session terminated successfully"
        );

        navigate("/login", {
          replace: true,
        });
      },

      onError: () => {
        dispatch(logoutAction());

        localStorage.removeItem("cart_id");

        toast.success(
          "Session terminated successfully"
        );

        navigate("/login", {
          replace: true,
        });
      },
    });
  };

  // =========================================================
  // PAY / COMPLETE ORDER
  // =========================================================

  const handlePayNow = () => {
    const newErrors: {
      [key: string]: string;
    } = {};

    let isValid = true;

    Object.keys(shippingAddress).forEach((key) => {
      const value = (shippingAddress as any)[key];

      const errorMsg = validateField(
        key,
        value
      );

      if (errorMsg) {
        newErrors[key] = errorMsg;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (!isValid) {
      toast.error(
        "Please fill in all required shipping fields correctly."
      );

      return;
    }

    if (!cartItems.length) {
      toast.error("Your cart is empty.");

      return;
    }

    if (paymentMethod === "cod") {
      navigate("/order-success");
    } else {
      navigate("/order-success");
    }
  };

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm font-bold text-gray-500">
            Loading checkout...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR STATE
  // =========================================================

  if (isError || !checkout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <ShoppingBag
            size={48}
            className="mx-auto text-gray-300"
          />

          <h2 className="mt-4 text-xl font-black text-gray-900">
            Unable to load checkout
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Please try again or return to your cart.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-5 py-3 rounded-xl bg-gray-950 text-white text-sm font-bold cursor-pointer"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/20 via-white to-white py-10 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">

        {/* =====================================================
            BACK
        ====================================================== */}

        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-orange-600 transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-2xs"
          >
            <ArrowLeft size={14} />

            Back to Cart
          </button>
        </div>

        {/* =====================================================
            MAIN GRID
        ====================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* ===================================================
              LEFT COLUMN
          ==================================================== */}

          <div className="lg:col-span-7 space-y-8 bg-white p-6 sm:p-10 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">

            {/* =================================================
                ACCOUNT
            ================================================== */}

            <div className="flex items-center justify-between pb-5 border-b border-gray-100">

              <div className="flex items-center gap-3.5">

                <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-600 font-black flex items-center justify-center text-base shadow-inner">
                  {user?.first_name
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}
                </div>

                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Account
                  </span>

                  <span className="text-sm font-extrabold text-gray-950 block">
                    {user?.first_name}{" "}
                    {user?.last_name}
                  </span>

                  <span className="text-xs text-gray-400 block mt-0.5">
                    {user?.email}
                  </span>
                </div>

              </div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl border border-red-200/60 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <LogOut size={14} />

                {isLoggingOut
                  ? "Logging out..."
                  : "Logout"}
              </button>

            </div>

            {/* =================================================
                SHIPPING ADDRESS
            ================================================== */}

            <div className="space-y-4">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <h3 className="text-xs font-black uppercase tracking-widest text-orange-600">
                    Shipping Address
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      setIsAddressExpanded(
                        !isAddressExpanded
                      )
                    }
                    className="text-xs font-bold text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                  >
                    {isAddressExpanded
                      ? "Collapse"
                      : "Expand"}

                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${
                        isAddressExpanded
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                </div>

                <button
                  type="button"
                  onClick={openAddressModal}
                  className="text-xs font-extrabold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100/70 px-3.5 py-1.5 rounded-xl border border-orange-200/60 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <MapPin size={13} />

                  Select Address (
                  {savedAddresses.length}
                  )
                </button>

              </div>

              {/* =================================================
                  COLLAPSED ADDRESS
              ================================================== */}

              {!isAddressExpanded && (
                <div
                  onClick={() =>
                    setIsAddressExpanded(true)
                  }
                  className="p-5 rounded-3xl bg-gray-50/90 border border-gray-200/80 flex items-center justify-between cursor-pointer hover:border-orange-200 transition-all shadow-inner group"
                >
                  <div className="flex items-start gap-3">

                    <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin size={18} />
                    </div>

                    <div>
                      <p className="text-xs font-extrabold text-gray-950">
                        {shippingAddress.firstName}{" "}
                        {shippingAddress.lastName}
                      </p>

                      <p className="text-xs text-gray-500 font-medium mt-0.5 line-clamp-1">
                        {shippingAddress.address}

                        {shippingAddress.apartment
                          ? `, ${shippingAddress.apartment}`
                          : ""}

                        , {shippingAddress.city},{" "}
                        {shippingAddress.country}
                      </p>
                    </div>

                  </div>

                  <span className="text-xs font-bold text-orange-600 group-hover:underline shrink-0 pl-2">
                    Edit / Expand
                  </span>
                </div>
              )}

              {/* =================================================
                  ADDRESS FORM
              ================================================== */}

              {isAddressExpanded && (
                <div className="p-6 rounded-3xl bg-gray-50/90 border border-gray-200/80 space-y-4 transition-all shadow-inner">

                  {/* COUNTRY */}

                  <div className="space-y-1">

                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                      <Globe
                        size={12}
                        className="text-orange-600"
                      />

                      Country
                    </label>

                    <select
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                      className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-semibold text-gray-900 focus:outline-none transition-all cursor-pointer ${
                        errors.country
                          ? "border-red-500 bg-red-50/10"
                          : "border-gray-200 focus:border-orange-500"
                      }`}
                    >
                      <option value="Pakistan">
                        Pakistan
                      </option>

                      <option value="United Kingdom">
                        United Kingdom
                      </option>

                      <option value="United States">
                        United States
                      </option>

                      <option value="Canada">
                        Canada
                      </option>
                    </select>

                    {errors.country && (
                      <span className="text-[10px] font-bold text-red-500 pl-1">
                        {errors.country}
                      </span>
                    )}

                  </div>

                  {/* FIRST / LAST NAME */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    <div className="space-y-1">

                      <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                        <User
                          size={12}
                          className="text-orange-600"
                        />

                        First Name
                      </label>

                      <input
                        type="text"
                        name="firstName"
                        value={shippingAddress.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-semibold text-gray-900 focus:outline-none transition-all ${
                          errors.firstName
                            ? "border-red-500 bg-red-50/10"
                            : "border-gray-200 focus:border-orange-500"
                        }`}
                      />

                      {errors.firstName && (
                        <span className="text-[10px] font-bold text-red-500 pl-1">
                          {errors.firstName}
                        </span>
                      )}

                    </div>

                    <div className="space-y-1">

                      <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                        <User
                          size={12}
                          className="text-orange-600"
                        />

                        Last Name
                      </label>

                      <input
                        type="text"
                        name="lastName"
                        value={shippingAddress.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-semibold text-gray-900 focus:outline-none transition-all ${
                          errors.lastName
                            ? "border-red-500 bg-red-50/10"
                            : "border-gray-200 focus:border-orange-500"
                        }`}
                      />

                      {errors.lastName && (
                        <span className="text-[10px] font-bold text-red-500 pl-1">
                          {errors.lastName}
                        </span>
                      )}

                    </div>

                  </div>

                  {/* ADDRESS */}

                  <div className="space-y-1">

                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                      <Map
                        size={12}
                        className="text-orange-600"
                      />

                      Street Address
                    </label>

                    <input
                      type="text"
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleInputChange}
                      className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-semibold text-gray-900 focus:outline-none transition-all ${
                        errors.address
                          ? "border-red-500 bg-red-50/10"
                          : "border-gray-200 focus:border-orange-500"
                      }`}
                    />

                    {errors.address && (
                      <span className="text-[10px] font-bold text-red-500 pl-1">
                        {errors.address}
                      </span>
                    )}

                  </div>

                  {/* APARTMENT */}

                  <div className="space-y-1">

                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                      <Building2
                        size={12}
                        className="text-orange-600"
                      />

                      Apartment, suite, etc.

                      <span className="text-gray-400 lowercase font-normal">
                        (optional)
                      </span>
                    </label>

                    <input
                      type="text"
                      name="apartment"
                      value={shippingAddress.apartment}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-orange-500 transition-all"
                    />

                  </div>

                  {/* CITY / POSTCODE */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    <div className="space-y-1">

                      <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                        <MapPin
                          size={12}
                          className="text-orange-600"
                        />

                        City
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleInputChange}
                        className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-semibold text-gray-900 focus:outline-none transition-all ${
                          errors.city
                            ? "border-red-500 bg-red-50/10"
                            : "border-gray-200 focus:border-orange-500"
                        }`}
                      />

                      {errors.city && (
                        <span className="text-[10px] font-bold text-red-500 pl-1">
                          {errors.city}
                        </span>
                      )}

                    </div>

                    <div className="space-y-1">

                      <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                        <Hash
                          size={12}
                          className="text-orange-600"
                        />

                        Postcode
                      </label>

                      <input
                        type="text"
                        name="postcode"
                        value={shippingAddress.postcode}
                        onChange={handleInputChange}
                        className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-semibold text-gray-900 focus:outline-none transition-all ${
                          errors.postcode
                            ? "border-red-500 bg-red-50/10"
                            : "border-gray-200 focus:border-orange-500"
                        }`}
                      />

                      {errors.postcode && (
                        <span className="text-[10px] font-bold text-red-500 pl-1">
                          {errors.postcode}
                        </span>
                      )}

                    </div>

                  </div>

                  {/* PHONE */}

                  <div className="space-y-1">

                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                      <Phone
                        size={12}
                        className="text-orange-600"
                      />

                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-semibold text-gray-900 focus:outline-none transition-all ${
                        errors.phone
                          ? "border-red-500 bg-red-50/10"
                          : "border-gray-200 focus:border-orange-500"
                      }`}
                    />

                    {errors.phone && (
                      <span className="text-[10px] font-bold text-red-500 pl-1">
                        {errors.phone}
                      </span>
                    )}

                  </div>

                </div>
              )}

            </div>

            {/* =================================================
                PAYMENT METHOD
            ================================================== */}

            <div className="space-y-4 pt-6 border-t border-gray-100">

              <div>
                <h2 className="text-xl font-black text-gray-950 tracking-tight">
                  Payment Method
                </h2>

                <p className="text-xs font-medium text-gray-400 mt-1">
                  All transactions are completely secure,
                  encrypted, and safe.
                </p>
              </div>

              <div className="space-y-3">

                {/* COD */}

                <div
                  onClick={() =>
                    setPaymentMethod("cod")
                  }
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                    paymentMethod === "cod"
                      ? "border-orange-600 bg-orange-50/30 shadow-xs"
                      : "border-gray-200/80 bg-gray-50/40 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    checked={paymentMethod === "cod"}
                    onChange={() =>
                      setPaymentMethod("cod")
                    }
                    className="accent-orange-600 w-4 h-4 cursor-pointer"
                  />

                  <span className="text-sm font-bold text-gray-950">
                    Cash on Delivery (COD)
                  </span>
                </div>

                {/* ONLINE */}

                <div
                  onClick={() =>
                    setPaymentMethod("online")
                  }
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    paymentMethod === "online"
                      ? "border-orange-600 bg-orange-50/30 shadow-xs"
                      : "border-gray-200/80 bg-gray-50/40 hover:bg-gray-50"
                  }`}
                >

                  <div className="flex items-center gap-3.5">

                    <input
                      type="radio"
                      checked={paymentMethod === "online"}
                      onChange={() =>
                        setPaymentMethod("online")
                      }
                      className="accent-orange-600 w-4 h-4 cursor-pointer"
                    />

                    <span className="text-sm font-bold text-gray-950">
                      Online Payment / Cards & Mobile Wallets
                    </span>

                  </div>

                  <div className="flex items-center gap-2 pl-7 flex-wrap pt-1">

                    <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg h-10 w-16 flex items-center justify-center shadow-2xs">
                      <img
                        src="/payment-icons/mastercard.png"
                        alt="Mastercard"
                        className="h-6 object-contain"
                      />
                    </div>

                    <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg h-10 w-16 flex items-center justify-center shadow-2xs">
                      <img
                        src="/payment-icons/visa.png"
                        alt="Visa"
                        className="h-6 object-contain"
                      />
                    </div>

                    <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg h-10 w-16 flex items-center justify-center shadow-2xs">
                      <img
                        src="/payment-icons/easypaisa.jpg"
                        alt="Easypaisa"
                        className="h-6 object-contain"
                      />
                    </div>

                    <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg h-10 w-16 flex items-center justify-center shadow-2xs">
                      <img
                        src="/payment-icons/jazzcash.png"
                        alt="JazzCash"
                        className="h-6 object-contain"
                      />
                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                DELIVERY METHOD
            ================================================== */}

            <div className="space-y-3">

              <h3 className="text-xs font-black uppercase tracking-widest text-orange-600">
                Delivery Method
              </h3>

              <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/60 flex items-center justify-between hover:border-orange-200 transition-all">

                <div>

                  <p className="text-sm font-bold text-gray-950">
                    {paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Standard Delivery"}
                  </p>

                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {shippingFee === 0
                      ? "(Free Shipping)"
                      : "Delivery charges applied"}
                  </p>

                </div>

                <span className="text-sm font-black text-emerald-600">
                  {shippingFee === 0
                    ? "Free"
                    : `Rs. ${shippingFee.toFixed(2)}`}
                </span>

              </div>

            </div>

            {/* =================================================
                NEWSLETTER
            ================================================== */}

            <div className="flex items-center gap-3 pt-2">

              <input
                type="checkbox"
                id="newsletter"
                className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 accent-orange-600 cursor-pointer"
              />

              <label
                htmlFor="newsletter"
                className="text-xs font-semibold text-gray-600 cursor-pointer"
              >
                Email me with news and exclusive offers
              </label>

            </div>

            {/* =================================================
                COMPLETE ORDER
            ================================================== */}

            <button
              type="button"
              onClick={handlePayNow}
              className="w-full bg-gradient-to-r from-gray-950 to-gray-900 text-white py-4 rounded-2xl font-black hover:from-orange-600 hover:to-orange-500 transition-all duration-300 shadow-xl shadow-gray-950/20 active:scale-95 cursor-pointer text-sm tracking-wide"
            >
              {paymentMethod === "cod"
                ? "Complete Order"
                : `Pay Now (Rs ${total.toFixed(2)})`}
            </button>

          </div>

          {/* ===================================================
              RIGHT COLUMN - ORDER SUMMARY
          ==================================================== */}

          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] lg:sticky lg:top-8 space-y-6">

            <div className="flex items-center justify-between">

              <h3 className="text-lg font-black text-gray-950 tracking-tight">
                Order Summary
              </h3>

              <span className="text-xs font-bold text-gray-400">
                {cartItems.length}{" "}
                {cartItems.length === 1
                  ? "Item"
                  : "Items"}
              </span>

            </div>

            {/* =================================================
                CART ITEMS
            ================================================== */}

            <div className="space-y-4 pb-6 border-b border-gray-100">

              {cartItems.length === 0 ? (

                <div className="text-center py-8">

                  <ShoppingBag
                    size={36}
                    className="mx-auto text-gray-300"
                  />

                  <p className="text-sm font-bold text-gray-400 mt-3">
                    Your cart is empty.
                  </p>

                </div>

              ) : (

                cartItems.map((item: any) => {

                  const foodItem =
                    item?.food_item;

                  const imageUrl =
                    foodItem?.image?.media_path
                      ? `${import.meta.env.VITE_API_BASE_URL}/storage/${foodItem.image.media_path}`
                      : no_image;

                  const regularPrice =
                    Number(
                      foodItem?.regular_price || 0
                    );

                  const unitPrice =
                    Number(
                      item?.unit_price || 0
                    );

                  const itemTotal =
                    Number(
                      item?.item_total || 0
                    );

                  const quantity =
                    Number(
                      item?.quantity || 0
                    );

                  const itemSavings =
                    regularPrice > unitPrice
                      ? (regularPrice -
                          unitPrice) *
                        quantity
                      : 0;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4"
                    >

                      {/* PRODUCT */}

                      <div className="flex items-center gap-4 min-w-0">

                        <div className="relative w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex-shrink-0 shadow-2xs">

  <img
    src={imageUrl}
    alt={foodItem?.title || "Product"}
    className="w-full h-full object-cover rounded-2xl"
  />

  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs z-10">
    {quantity}
  </span>

</div>

                        <div className="min-w-0">

                          <h4 className="font-bold text-sm text-gray-950 truncate">
                            {foodItem?.title}
                          </h4>

                          {foodItem?.restaurant?.name && (
                            <p className="text-xs text-gray-500 font-medium mt-0.5">
                              {foodItem.restaurant.name}
                            </p>
                          )}

                          {foodItem?.category?.title && (
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {foodItem.category.title}
                            </p>
                          )}

                          {itemSavings > 0 && (
                            <p className="text-xs text-orange-600 font-bold flex items-center gap-1 mt-0.5">
                              <Tag size={11} />

                              Saved Rs.{" "}
                              {itemSavings.toFixed(
                                2
                              )}
                            </p>
                          )}

                        </div>

                      </div>

                      {/* PRICE */}

                      <div className="text-right flex-shrink-0">

                        {regularPrice >
                          unitPrice && (
                          <span className="text-xs text-gray-400 line-through block font-medium">
                            Rs.{" "}
                            {(
                              regularPrice *
                              quantity
                            ).toFixed(2)}
                          </span>
                        )}

                        <span className="font-black text-sm text-gray-950">
                          Rs.{" "}
                          {itemTotal.toFixed(2)}
                        </span>

                        {quantity > 1 && (
                          <span className="text-[10px] text-gray-400 block">
                            Rs.{" "}
                            {unitPrice.toFixed(
                              2
                            )}{" "}
                            × {quantity}
                          </span>
                        )}

                      </div>

                    </div>
                  );
                })
              )}

            </div>

            {/* =================================================
                CALCULATIONS
            ================================================== */}

            <div className="space-y-3 pt-2 text-sm text-gray-500 font-medium">

              <div className="flex justify-between">

                <span>
                  Subtotal
                </span>

                <span className="font-bold text-gray-950">
                  Rs.{" "}
                  {subtotal.toFixed(2)}
                </span>

              </div>

              <div className="flex justify-between items-center">

                <span className="flex items-center gap-1">
                  Shipping

                  <span className="text-xs text-gray-400">
                    ⓘ
                  </span>
                </span>

                {shippingFee === 0 ? (

                  <span className="font-bold text-emerald-600 uppercase text-xs tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    Free
                  </span>

                ) : (

                  <span className="font-bold text-gray-950">
                    Rs.{" "}
                    {shippingFee.toFixed(2)}
                  </span>

                )}

              </div>

            </div>

            {/* =================================================
                TOTAL
            ================================================== */}

            <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center">

              <div>

                <span className="text-base font-black text-gray-950 block">
                  Total Amount
                </span>

                <span className="text-xs font-bold text-gray-400">
                  PKR
                </span>

              </div>

              <span className="text-2xl font-black text-orange-600">
                Rs.{" "}
                {total.toFixed(2)}
              </span>

            </div>

            {/* =================================================
                SAVINGS
            ================================================== */}

            {totalSavings > 0 && (
              <div className="flex items-center gap-2 text-xs font-black text-emerald-700 bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100 shadow-2xs">

                <Tag
                  size={14}
                  className="text-emerald-600"
                />

                <span>
                  TOTAL SAVINGS Rs.{" "}
                  {totalSavings.toFixed(2)}
                </span>

              </div>
            )}

            {/* =================================================
                SECURITY
            ================================================== */}

            <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-400 text-xs font-semibold">

              <ShieldCheck
                size={16}
                className="text-orange-500"
              />

              <span>
                Safe & Secure Encrypted Checkout
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* =======================================================
          ADDRESS DRAWER
      ======================================================== */}

      {isAddressModalOpen && (

        <div
          className={`fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end items-center pr-3 sm:pr-6 py-4 transition-opacity duration-300 ${
            isAnimating
              ? "opacity-100"
              : "opacity-0"
          }`}
        >

          <div
            className={`w-full max-w-md bg-white h-full max-h-[calc(100vh-2rem)] shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-[2.5rem] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto border border-gray-100 transition-transform duration-300 ease-out ${
              isAnimating
                ? "translate-x-0 scale-100"
                : "translate-x-12 scale-95"
            }`}
          >

            {/* DRAWER HEADER */}

            <div className="space-y-4">

              <div className="flex items-center justify-between pb-4 border-b border-gray-100">

                <h3 className="text-base font-black text-gray-950 flex items-center gap-2">

                  <MapPin
                    size={18}
                    className="text-orange-600"
                  />

                  Select Saved Address

                </h3>

                <button
                  onClick={closeAddressModal}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>

              </div>

              <p className="text-xs text-gray-500 font-medium">
                Choose an address from your saved
                locations to automatically fill out the
                checkout form.
              </p>

              {/* ADDRESS LIST */}

              <div className="space-y-3 pt-2">

                {isLoadingAddresses ? (

                  <p className="text-xs text-gray-400 text-center py-6">
                    Loading saved addresses...
                  </p>

                ) : savedAddresses.length === 0 ? (

                  <p className="text-xs text-gray-400 text-center py-6">
                    No saved addresses found.
                  </p>

                ) : (

                  savedAddresses.map(
                    (addr: any) => {

                      const isSelected =
                        shippingAddress.address ===
                        addr.address;

                      return (
                        <div
                          key={addr.id}
                          onClick={() =>
                            handleSelectSavedAddress(
                              addr
                            )
                          }
                          className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 relative ${
                            isSelected
                              ? "border-orange-600 bg-orange-50/40 shadow-xs"
                              : "border-gray-200/80 bg-gray-50/50 hover:bg-gray-100/60"
                          }`}
                        >

                          <div className="flex items-start justify-between">

                            <p className="text-xs font-bold text-gray-900 leading-relaxed pr-6">

                              {addr.first_name}{" "}
                              {addr.last_name},{" "}
                              {addr.address}

                              {addr.apartment
                                ? `, ${addr.apartment}`
                                : ""}

                              <br />

                              {addr.city},{" "}
                              {addr.country} •{" "}
                              {addr.phone}

                            </p>

                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                                ✓
                              </span>
                            )}

                          </div>

                        </div>
                      );
                    }
                  )
                )}

              </div>

            </div>

            {/* DRAWER FOOTER */}

            <div className="pt-6 border-t border-gray-100 space-y-3 mt-6">

              <button
                type="button"
                onClick={closeAddressModal}
                className="w-full py-3.5 bg-gray-950 text-white text-xs font-black uppercase tracking-wider rounded-2xl hover:bg-orange-600 transition-all cursor-pointer shadow-md"
              >
                Close Drawer
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default CheckoutPage;