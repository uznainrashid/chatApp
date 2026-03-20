"use client"
import { Github, MessageSquare } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation' // 1. Ye import karein

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname(); // 2. Current path get karein

  const checkAuth = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    window.location.href = "/login";
  }

  // 3. Condition: Agar user /chat page par hai, toh Navbar hide kar do
  if (pathname === '/chat') {
    return null;
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Link href="/" className="flex items-center gap-1">
              <MessageSquare className="text-white" size={24} />
            </Link>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">SwiftChat</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <Link href="https://github.com/uznainrashid" target="_blank" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
            <Github size={16} /> GitHub
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-600">Login</Link>
              <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link href="/chat" className="text-sm font-medium text-indigo-600">Chat</Link>
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-600 transition-all"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar;