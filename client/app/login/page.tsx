"use client";
import { use, useState } from "react";
import Link from "next/link";
import { LogIn, Mail, Lock, MessageSquare } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, formData);
 
    if (response.data.success) {
        const receivedToken = response.data.token;
      localStorage.setItem("token", receivedToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
// Yeh line Navbar ko bataye gi ke storage update ho gayi hai
    window.dispatchEvent(new Event("storage"));
      // Yahan aap user ko dashboard ya home page par redirect kar sakte hain
        router.push("/chat");
    }
    else {
      console.error("Login failed: No token received");
    }   
} catch (error) {
    console.error("Login failed:", error);
}
  };

  return (
    <div className="min-h-screen flex mt-20 items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
           <div className="bg-indigo-600 p-2 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="text-white" size={24} />
                      </div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome Back <span className="text-blue-600 italic">SwiftChat</span></h2>
          <p className="text-slate-500 mt-2">Please enter your details to login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Mail size={16} /> Email Address
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="Enter your email address"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Lock size={16} /> Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="••••••••"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95">
            Sign In
          </button>
        </form>

        <p className="text-center mt-6 text-slate-600">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 font-semibold hover:underline">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}