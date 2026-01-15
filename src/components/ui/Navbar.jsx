import React from "react";
import { Search, Grid, List } from "lucide-react";
import UserDetail from "./UserDetail";

const Navbar = ({ searchTerm, setSearchTerm, viewMode, setViewMode }) => {
  return (
    <nav
      className="w-full mb-8 transition-all"
     
    >
      {/* Main Navigation Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 ">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1
                className="heading-font text-3xl font-bold tracking-tight"
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
              className="w-full pl-12 pr-12 py-3 rounded-full focus:outline-none focus:ring-1 transition-all duration-200"
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

        {/* View Toggle and User Section */}
        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <div
            className="flex items-center p-1 rounded-xl border"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-light)",
            }}
          >
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                viewMode === "grid"
                  ? "shadow-md"
                  : "opacity-60 hover:opacity-100"
              }`}
              style={{
                backgroundColor:
                  viewMode === "grid" ? "var(--bg-main)" : "transparent",
                color:
                  viewMode === "grid"
                    ? "var(--accent-primary)"
                    : "var(--text-main)",
                border:
                  viewMode === "grid"
                    ? "1px solid var(--border-light)"
                    : "1px solid transparent",
              }}
            >
              <Grid className="w-4 h-4" />
              <span className="text-sm font-medium">Grid</span>
            </button>

            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                viewMode === "list"
                  ? "shadow-md"
                  : "opacity-60 hover:opacity-100"
              }`}
              style={{
                backgroundColor:
                  viewMode === "list" ? "var(--bg-main)" : "transparent",
                color:
                  viewMode === "list"
                    ? "var(--accent-primary)"
                    : "var(--text-main)",
                border:
                  viewMode === "list"
                    ? "1px solid var(--border-light)"
                    : "1px solid transparent",
              }}
            >
              <List className="w-4 h-4" />
              <span className="text-sm font-medium">List</span>
            </button>
          </div>

          {/* Divider */}
          <div
            className="h-8 w-px hidden md:block"
            style={{ backgroundColor: "var(--border-light)" }}
          />

          {/* User Profile */}
          <UserDetail />
        </div>
      </div>

      
    </nav>
  );
};

export default Navbar;
