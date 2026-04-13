"use client";
import { useState } from "react";
import { Mail, Lock, MessageSquare, ArrowRight, Loader2, ChevronLeft, EyeOff, Eye } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


export default function LoginPage() {
  console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false); // To toggle Forgot Password UI
  const router = useRouter();
const [showPassword, setShowPassword] = useState(false); // For toggling password visibility
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, 
       formData
      );
 console.log("Login Response:", response.data);
      if (response.data.success) {
        if (isForgotMode) {
          alert("Reset link sent to your email!");
          setIsForgotMode(false);
        } else {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          window.dispatchEvent(new Event("storage"));
          toast.success(response.data.message || "Logged in successfully!");
          router.push("/chat");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-8 md:p-10 animate-in fade-in zoom-in duration-500">
      
      {/* Back to Login Button (Only visible in Forgot Mode) */}
      {isForgotMode && (
        <button 
          onClick={() => setIsForgotMode(false)}
          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-4 group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </button>
      )}

      <div className="text-center mb-8">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-3 rounded-2xl w-14 h-14 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
          <MessageSquare className="text-white" size={24} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {isForgotMode ? "Reset Password" : "Welcome Back"}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">
          {isForgotMode 
            ? "Enter your email to receive a reset link" 
            : <>Enter details for <span className="text-indigo-600 font-bold italic">SwiftChat</span></>
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400 ml-1">
            Email Address
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="email"
              value={formData.email}
              required
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 rounded-2xl py-3.5 pl-12 pr-4 transition-all outline-none text-slate-900 dark:text-white font-medium"
              placeholder="Enter your email address"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        {/* Password (Hidden in Forgot Mode) */}
        {!isForgotMode && (
          <div className="space-y-1.5 animate-in slide-in-from-top-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400">
                Password
              </label>
              <button 
                type="button" 
                onClick={() => setIsForgotMode(true)}
                className="text-xs cursor-pointer font-bold text-indigo-600 hover:text-violet-600 hover:underline transition-colors"
              >
                Forgot Password?
              </button>
            </div>
      <div className="relative group">
  {/* Left Side Lock Icon */}
  <Lock 
    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" 
    size={18} 
  />

  {/* Password Input - FIXED: Added value and onChange */}
  <input
    type={showPassword ? "text" : "password"}
    value={formData.password} // Zaroori hai
    onChange={(e) => setFormData({ ...formData, password: e.target.value })} // Iske baghair password khali jayega
    required
    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 rounded-2xl py-3.5 pl-12 pr-12 transition-all outline-none text-slate-900 dark:text-white font-medium"
    placeholder="••••••••"
  />

  {/* Right Side Toggle Button */}
  <button
    type="button" 
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer"
  >
    {showPassword ? (
      <EyeOff size={18} /> 
    ) : (
      <Eye size={18} />
    )}
  </button>
</div>
          </div>
        )}

        <button 
          disabled={loading}
          className="w-full bg-indigo-600 cursor-pointer hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4 flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              {isForgotMode ? "Send Reset Link" : "Sign In"} 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}