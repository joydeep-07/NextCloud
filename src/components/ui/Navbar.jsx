import React from "react";
import { Search } from "lucide-react";
import UserDetail from "./UserDetail";
import Notification from "./Notification";

const Navbar = ({ searchTerm, setSearchTerm }) => {
  return (
    <nav className="w-full px-4 sm:px-6 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Top Row: Logo + Actions */}
        <div className="flex items-center justify-between w-full lg:w-auto">
          {/* Logo */}
          <div>
            <h1
              className=" font-heading text-xl sm:text-2xl font-semibold tracking-wide"
              style={{ color: "var(--accent-primary)" }}
            >
              NEXTCLOUD
            </h1>
            <p
              className="hidden sm:block text-xs opacity-70"
              style={{ color: "var(--text-secondary)" }}
            >
              Your organized digital workspace
            </p>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-3 lg:hidden">
            <Notification />
            <UserDetail />
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 lg:hidden">
          <div className="w-full lg:max-w-2xl">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: "var(--text-secondary)" }}
              />
              <input
                type="text"
                placeholder="Search folders, files, or documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-2 rounded-full focus:outline-none focus:ring-1 transition-all"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="w-full lg:max-w-2xl">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: "var(--text-secondary)" }}
              />
              <input
                type="text"
                placeholder="Search folders, files, or documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-2 rounded-full focus:outline-none focus:ring-1 transition-all"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <Notification />
          <UserDetail />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
