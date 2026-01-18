import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../ui/Navbar";
import { useState } from "react";

const AppLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const location = useLocation();

  // Hide navbar only on /dashboard route
  const isDashboard = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Show Navbar everywhere except /dashboard */}
      {isDashboard && (
        <div className="sticky top-0 z-10">
          <Navbar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </div>
      )}

      <main className={isDashboard ? "flex-1 pt-0" : "flex-1"}>
        <Outlet context={{ searchTerm, viewMode }} />
      </main>
    </div>
  );
};

export default AppLayout;
