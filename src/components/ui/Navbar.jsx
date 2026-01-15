import React from "react";
import { Search, Grid, List, Cloud } from "lucide-react";
import UserDetail from "./UserDetail";

const Navbar = ({ searchTerm, setSearchTerm, viewMode, setViewMode }) => {
  return (
    <nav className="w-full mb-8">
      {/* Main Navigation Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 ">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
         
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                NEXTCLOUD
              </h1>
             
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Your organized digital workspace
            </p>
          </div>
        </div>

        {/* Search and Controls Section */}
        <div className="flex-1 max-w-2xl w-full">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search folders, files, or documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* View Toggle and User Section */}
        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-white shadow-sm text-blue-600 border border-blue-100"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Grid className="w-4 h-4" />
              <span className="text-sm font-medium">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-white shadow-sm text-blue-600 border border-blue-100"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <List className="w-4 h-4" />
              <span className="text-sm font-medium">List</span>
            </button>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-200 hidden md:block" />

          {/* User Profile */}
          <UserDetail />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-6 mt-6 px-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="font-medium">124</span>
          <span className="text-gray-500">Active folders</span>
        </div>
        <div className="h-4 w-px bg-gray-200"></div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="font-medium">89%</span>
          <span className="text-gray-500">Storage used</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
