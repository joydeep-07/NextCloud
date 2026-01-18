import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout";
import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import DashboardPage from "../pages/DashboardPage";
import FolderPage from "../pages/FolderPage";
import InvitePage from "../pages/InvitePage";
import TestSupabase from "../pages/TestSupabase";

const router = createBrowserRouter([
  // Auth routes
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
    ],
  },

  // Protected app routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/", // 👈 Dashboard runs on root
            element: <DashboardPage />,
          },
          {
            path: "/folder/:id",
            element: <FolderPage />,
          },
        ],
      },
    ],
  },

  // Public routes
  {
    path: "/invite/:token",
    element: <InvitePage />,
  },
  {
    path: "/test",
    element: <TestSupabase />,
  },
]);

export default router;
