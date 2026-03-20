"use client";
import Link from "next/link";
import { MessageSquare, Shield, Zap, ArrowRight, Github, GithubIcon } from "lucide-react";


export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
  {/* Aapka content */}
    
      {/* 2. Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Real-time Chat with NestJS & Socket.io
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight">
            Connect with friends <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              instantly, anywhere.
            </span>
          </h1>
          
          <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience lightning-fast messaging with end-to-end security. 
            Built for developers who value speed, clean UI, and seamless communication.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all hover:-translate-y-1">
              Start Chatting Now <ArrowRight size={20} />
            </Link>
            <button className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-16">Why Choose SwiftChat?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-left">
              <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Ultra Fast</h3>
              <p className="text-slate-500 leading-relaxed">Powered by Socket.io for millisecond latency in every message delivery.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-left">
              <div className="bg-indigo-50 w-12 h-12 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Auth</h3>
              <p className="text-slate-500 leading-relaxed">JWT-based authentication ensures your conversations stay private and protected.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-left">
              <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Modern UI</h3>
              <p className="text-slate-500 leading-relaxed">Clean, minimal, and fully responsive design built with Tailwind CSS.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}