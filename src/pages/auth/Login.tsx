import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../assets/images/logo.png"
import banner_login from "../../assets/images/login-cover.jpg"
import { useLogin } from '../../hooks/auth/useLogin';
import { toast } from 'react-toastify';
import Spinner from '../../components/common/Spinner';

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
  const { mutate, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
      email: "",
      password: "",
    });

  // Validation state variables
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateForm = () => {
    let isValid = true;
    let newErrors = { email: '', password: '' };

    // Standard email validation check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData?.email) {
      newErrors.email = 'Email address is required';
      isValid = false;
    } else if (!emailRegex.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation check
    if (!formData?.password) {
      newErrors.password = 'Password field is required';
      isValid = false;
    } else if (formData?.password.length < 5) {
      newErrors.password = 'Password must be at least 5 characters long';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Fire validation before submitting user login state data
    if (validateForm()) {
      mutate(formData, {
              onSuccess: (res) => {
                toast.success(res?.message || "Success");
                navigate("/admin/dashboard");
                setFormData({
                  email: "",
                  password: "",
                });
              },
              onError: (err: any) => {
                const response = err?.response?.data;
                toast.error(
                  response?.errors?.[0] ||
                    response?.message ||
                    "Something went wrong!",
                );
              },
            });
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans selection:bg-orange-100 selection:text-orange-600">
      
      {/* LEFT SIDE: Food Branding Image Banner */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={banner_login}
          alt="Premium Delicious Food Stack Background"
        />
        {/* Transparent Orange Overlay Layer */}
        <div className="absolute inset-0 bg-orange-600/80 flex flex-col justify-center px-16 text-white">
          <div className="max-w-md">
            <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-white leading-[1.15]">
              Hungry? <br />
              <span className="text-orange-200 block mt-2 text-3xl xl:text-4xl font-extrabold normal-case drop-shadow-sm">
                Order Delicious Food <br /> To Your Doorstep
              </span>
            </h1>
            <p className="mt-4 text-lg font-medium text-orange-50/90">
              Discover top local restaurants, customize your favorite meals, and track your delivery rider in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Clean Sign-In Form Container */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-2 xl:px-2 w-full lg:w-[550px] relative">
        
        <div className="mx-auto w-full max-w-md">
          
          {/* Logo & Header Section */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img 
                src={logo} 
                alt="StackFood Logo" 
                className="w-40 sm:w-40 md:w-50 h-auto object-contain transition-all duration-300" 
              />
            </div>
            <h2 className="text-xl font-bold text-gray-700 tracking-tight">
              Sign In To Your Account
            </h2>
          </div>

          {/* Login Credentials Box */}
          <div className="bg-gray-50/70 p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              
              {/* Email Input Field */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData?.email}
                  onChange={(e) => {
                    setFormData((prev)=>({...prev, email: e.target.value}));
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 font-medium ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' 
                      : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500/10'
                  }`}
                  required
                />
                {/* Email Inline Error Message Container */}
                {errors.email && (
                  <p className="mt-1.5 text-xs font-semibold text-red-600 flex items-center gap-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Input Field with Show/Hide Eye Toggle */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData?.password}
                    onChange={(e) => {
                      setFormData((prev)=>({...prev, password: e.target.value}));
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-3 pr-10 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 font-medium ${
                      errors.password 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' 
                        : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500/10'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0" />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Password Inline Error Message Container */}
                {errors.password && (
                  <p className="mt-1.5 text-xs font-semibold text-red-600 flex items-center gap-1">
                   {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forget Password Row */}
              <div className="flex items-center justify-between text-xs font-semibold">
                <label className="flex items-center gap-2 text-gray-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  Remember me
                </label>
                <a href="#forgot" className="text-gray-500 hover:text-orange-500 hover:underline transition-colors">
                  Forget Password ?
                </a>
              </div>

              {/* Submit Orange Action Button */}
              <button
                type="submit"
                disabled={isPending}
                className={`w-full py-3 ${isPending ? 'bg-orange-300' : 'bg-orange-500 hover:bg-orange-600 cursor-pointer'} text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/10 transition-all transform active:scale-[0.99]`}
              >
                {isPending ? (<div className="flex justify-center gap-2"><Spinner size="16px" color="#ffffff" thickness="2px"/> <span>Signing...</span></div>) : <span>Sign in</span>}
              </button>
            </form>
          </div>

          {/* Secondary Footer: Register Link for Customers */}
          <div className="text-center mt-8 space-y-3">
            <p className="text-xs font-semibold text-gray-500">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-orange-500 hover:underline font-bold">
                Register Here
              </Link>
            </p>
            {/* <div className="pt-2 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400">
                Are you an employee?{' '}
                <Link to="/admin-login" className="text-gray-600 hover:text-orange-500 hover:underline font-bold transition-colors">
                  Login as Admin
                </Link>
              </p>
            </div> */}
          </div>

        </div>
      </div>

    </div>
  );
}

export default Login;