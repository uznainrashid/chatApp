"use client";
import React, { useState } from 'react';
import { User, Mail, FileText, Camera, Save, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Navigation ke liye

const ProfileSettings = () => {
  const router = useRouter(); // Router initialize karein

  const [formData, setFormData] = useState({
    username: 'Uznain',
    email: 'uznain@example.com',
    bio: 'Full Stack Developer | MERN & Next.js'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Updating Profile with:", formData);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      
      {/* --- Back Button --- */}
      <button 
        onClick={() => router.back()} // Yeh user ko pichle page par le jayega
        className="flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-6 group"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back</span>
      </button>

      <div className="flex items-center space-x-4 mb-8">
        <div className="relative">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <User size={40} />
          </div>
          <button className="absolute bottom-0 right-0 p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 border-2 border-white">
            <Camera size={16} />
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
          <p className="text-gray-500 text-sm">Update your personal information</p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-5">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <User size={18} />
            </span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Your Name"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Mail size={18} />
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="email@example.com"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <div className="relative">
            <span className="absolute top-3 left-3 text-gray-400">
              <FileText size={18} />
            </span>
            <textarea
              name="bio"
              rows={4}
              value={formData.bio}
                onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-blue-700 transition duration-200 shadow-lg shadow-blue-200"
          >
            <Save size={20} />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;