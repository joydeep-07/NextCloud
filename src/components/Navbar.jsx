import React from "react";
import { useProfile } from "../utils/useProfile";

const Navbar = () => {
  const { profile, loading } = useProfile();

  return (
    <nav className="z-50 w-full px-6 py-4 ">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Brand Section */}
        <button
         
          className="mt-auto bg-sky-500 w-64 hover:bg-sky-600 text-white px-3 py-2 rounded cursor-pointer"
        >
         Create Folder
        </button>
        {/* Navigation & User Profile */}
        <div className="flex items-center space-x-8">
          {/* Navigation Links */}

          {/* User Profile Section */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="hidden md:block space-y-1">
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-2 w-16 bg-gray-100 rounded animate-pulse"></div>
                </div>
              </div>
            ) : profile ? (
              <div className="flex items-center space-x-3 group">
                {/* User Info - Hidden on mobile */}
                <div className="hidden md:block text-right">
                  <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {profile.first_name} {profile.last_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-xl">
                    {profile.email}
                  </p>
                </div>

                {/* Avatar with Initials */}
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {profile.first_name?.[0]}
                  {profile.last_name?.[0]}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Sign In
                </a>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
