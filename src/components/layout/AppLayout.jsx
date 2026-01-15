import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../ui/Navbar";
import { useState } from "react";

const AppLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar stays fixed at the top */}
      <div className="sticky top-0 z-10 px-15 py-5 bg-white">
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      </div>

      <main className="flex-1">
        {/* We pass the state via context so Dashboard or Folder pages can see it */}
        <Outlet context={{ searchTerm, viewMode }} />
      </main>
    </div>
  );
};

export default AppLayout;
