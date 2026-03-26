"use client";
import { useState } from "react";
import { User, Mail, Lock, MessageSquare, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false); // Loading state for better UX
  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, formData);
      
      if (response.data.success) {
        const receivedToken = response.data.token;
        localStorage.setItem("token", receivedToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        window.dispatchEvent(new Event("storage"));
        toast.success(response.data.message || "Registration successful!");
        router.push("/chat");
      } else {
        toast.error("Registration failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Something went wrong during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Humne yahan se min-h-screen aur extra bg nikaal diya hai */
    <div className="w-full p-8 md:p-10 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <div className="bg-indigo-600 p-3 rounded-2xl w-14 h-14 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
          <MessageSquare className="text-white" size={24} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Create Account</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          Join <span className="text-indigo-600 font-bold">SwiftChat</span> and start chatting today.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400 ml-1">Full Name</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="text"
              required
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 rounded-2xl py-3.5 pl-12 pr-4 transition-all outline-none text-slate-900 dark:text-white font-medium"
              placeholder="Enter your full name"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400 ml-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="email"
              required
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 rounded-2xl py-3.5 pl-12 pr-4 transition-all outline-none text-slate-900 dark:text-white font-medium"
              placeholder="Enter your email address"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400 ml-1">Password</label>
             <div className="relative group">
  {/* Left Side Lock Icon */}
  <Lock 
    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" 
    size={18} 
  />

  {/* Password Input */}
  <input
    type={showPassword ? "text" : "password"} // State ke mutabiq type change hoga
    className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
    placeholder="Enter your password"
  />

  {/* Right Side Toggle Button */}
  <button
    type="button" // Type button lazmi rakhein taake form submit na ho jaye
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer"
  >
    {showPassword ? (
      <EyeOff size={18} /> // Agar dikh raha hai toh EyeOff dikhao
    ) : (
      <Eye size={18} />    // Agar hide hai toh Eye dikhao
    )}
  </button>
</div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] mt-4 flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
          )}
        </button>
      </form>
    </div>
  );
}