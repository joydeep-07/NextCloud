import React from "react";
import { useProfile } from "../../utils/useProfile";
import {
  FolderPlus,
  Bell,
  Search,
  ChevronDown,
  LayoutDashboard,
  Database,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import CreateFolderButton from "./CreateFolderButton";

const Navbar = () => {
  const { profile, loading } = useProfile();

  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4 bg-white border-b border-gray-100 shadow-sm backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          {/* Quick Actions */}
          <div className="hidden md:flex border rounded border-gray-800/20 items-center space-x-4">
            <CreateFolderButton/>
          
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Search Bar */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files, folders..."
              className="pl-10 pr-4 py-2.5 w-2xl border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-sm transition-all duration-200"
            />
          </div>

          {/* Quick Search Button for Mobile */}
          <button className="lg:hidden p-2  text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Search className="w-5 h-5" />
          </button>

       
          {/* User Profile */}
          <div className="flex items-center space-x-3">
            {loading ? (
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                <div className="hidden md:block space-y-1">
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-2 w-20 bg-gray-100 rounded animate-pulse"></div>
                </div>
              </div>
            ) : profile ? (
              <div className="flex items-center space-x-3 group cursor-pointer">
                {/* User Info */}
                <div className="hidden md:block text-right">
                  <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {profile.first_name} {profile.last_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[140px]">
                    {profile.email}
                  </p>
                </div>

                {/* Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:shadow-lg transition-shadow">
                    {profile.first_name?.[0]}
                    {profile.last_name?.[0]}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

              
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/" className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium">
                  Sign In
                </Link>
               
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


