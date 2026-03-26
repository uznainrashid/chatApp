"use client";
import { useState } from "react";
import { MessageSquare, Zap, Shield, CheckCircle2 } from "lucide-react";

// Import your existing pages as components
import LoginPage from "./login/page";
import SignupPage from "./signup/page";

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="h-screen w-full bg-white dark:bg-slate-950 flex items-center justify-center overflow-hidden transition-colors duration-500 relative">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-200/20 dark:bg-violet-900/10 rounded-full blur-[120px] -z-10" />

      {/* Main Container */}
      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-8 lg:gap-16 items-center px-8 md:px-16 relative z-10">
        
        {/* --- NOW LEFT SIDE: Form Container --- */}
        <div className="w-full flex justify-center md:justify-start items-center order-2 md:order-1">
          <div className="w-full max-w-[420px] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 overflow-hidden">
            
            <div className="max-h-[85vh] overflow-y-auto overflow-x-hidden no-scrollbar" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
               <style jsx global>{`
                 .no-scrollbar::-webkit-scrollbar {
                   display: none;
                 }
               `}</style>
               {isLogin ? <LoginPage /> : <SignupPage />}
            </div>

            {/* Switcher Button */}
            <div className="p-5 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-semibold">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button 
                  onClick={() => setIsLogin(!isLogin)} 
                  className="text-indigo-600 dark:text-indigo-400 cursor-pointer font-black hover:underline underline-offset-4 ml-1"
                >
                  {isLogin ? "Sign up for free" : "Log in here"}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* --- NOW RIGHT SIDE: Branding --- */}
        <div className="hidden md:flex flex-col space-y-6 order-1 md:order-2">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200/50">
              <MessageSquare className="text-white" size={28} />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              SwiftChat
            </h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-5xl lg:text-6xl font-black leading-tight text-slate-900 dark:text-slate-50 tracking-tighter">
              {isLogin ? "Welcome back to" : "Join the future of"} <br />
              <span className="text-indigo-600">SwiftChat.</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md leading-relaxed font-medium">
              Real-time, encrypted, and incredibly fast. Experience messaging like never before.
            </p>
          </div>

          <ul className="space-y-4 pt-4">
            {[
              { icon: <Zap size={18} className="text-amber-500" />, text: "Instant message delivery" },
              { icon: <Shield size={18} className="text-emerald-500" />, text: "End-to-end encryption" },
              { icon: <CheckCircle2 size={18} className="text-indigo-500" />, text: "Clean distraction-free UI" }
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-semibold text-sm">
                <span className="p-1.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                  {item.icon}
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}