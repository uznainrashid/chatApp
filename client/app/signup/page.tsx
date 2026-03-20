"use client";
import { useState } from "react";
import Link from "next/link";
import { UserPlus, User, Mail, Lock, MessageSquare } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const router = useRouter();
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Yahan aapki backend register API call aayegi
    try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, formData);
    console.log("Response from backend:", response.data);
    if (response.data.success) {
            const receivedToken = response.data.token;
      localStorage.setItem("token", receivedToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
// Yeh line Navbar ko bataye gi ke storage update ho gayi hai
    window.dispatchEvent(new Event("storage"));
      // Yahan aap user ko dashboard ya home page par redirect kar sakte hain
        router.push("/chat")
      
    } else {
      alert("Registration failed: " + response.data.message);
    }
} catch (error) {
    console.error("Registration error:", error);
    alert("An error occurred during registration. Please try again.");
}

  };

  return (
    <div className="min-h-screen flex items-center justify-center mt-30 bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="bg-indigo-600 p-2 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="text-white" size={24} />
                      </div>
          <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
          <p className="text-slate-500 mt-2">Join us and start chatting today with <span className="text-blue-700 font-semibold">SwiftChat</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <User size={16} /> Full Name
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="Enter your full name"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

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

          <button className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95">
            Create Account
          </button>
        </form>

        <p className="text-center mt-6 text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}