import React from "react";
import { Search, Grid, List, Bell } from "lucide-react";
import UserDetail from "./UserDetail";
import Notification from "./Notification";

const Navbar = ({ searchTerm, setSearchTerm, viewMode, setViewMode }) => {
  return (
    <nav className="w-full transition-all">
      {/* Main Navigation Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 ">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1
                className="heading-font text-2xl font-medium tracking-wide"
                style={{ color: "var(--accent-primary)" }}
              >
                NEXTCLOUD
              </h1>
            </div>
            <p
              className="text-sm opacity-70"
              style={{ color: "var(--text-secondary)" }}
            >
              Your organized digital workspace
            </p>
          </div>
        </div>

        {/* View Toggle and User Section */}
        <div className="flex items-center w-2xl gap-4">
          {/* Search and Controls Section */}
          <div className="flex-1 max-w-2xl w-full">
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors"
                style={{ color: "var(--text-secondary)" }}
              />
              <input
                type="text"
                placeholder="Search folders, files, or documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-2 rounded-full focus:outline-none focus:ring-1 transition-all duration-200"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-main)",
                  border: "1px solid var(--border-light)",
                  "--tw-ring-color": "var(--accent-primary)",
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-60 hover:opacity-100"
                  style={{ color: "var(--text-main)" }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

         <Notification/>
          {/* User Profile */}
          <UserDetail />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
