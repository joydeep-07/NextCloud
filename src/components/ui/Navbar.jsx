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
import UserDropdown from "./UserDropdown";
import UserDetail from "./UserDetail";

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
              className="pl-10 pr-4 py-2.5 w-2xl border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-transparent bg-gray-50 text-sm transition-all duration-200"
            />
          </div>

          {/* Quick Search Button for Mobile */}
          <button className="lg:hidden p-2  text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Search className="w-5 h-5" />
          </button>

       
          {/* User Profile */}
        {/* <UserDropdown/> */}
        <UserDetail/>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


