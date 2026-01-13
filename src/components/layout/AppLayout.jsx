import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-white p-4">Sidebar</aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
