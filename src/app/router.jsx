import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout";
import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicRoute from "../components/auth/PublicRoute";

import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import DashboardPage from "../pages/DashboardPage";
import FolderPage from "../pages/FolderPage";
import InvitePage from "../pages/InvitePage";
import TestSupabase from "../pages/TestSupabase";

const router = createBrowserRouter([
  // 🔓 Public-only routes (login/signup)
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/signup", element: <SignupPage /> },
        ],
      },
    ],
  },

  // 🔐 Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
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

  // 🌍 Public routes (no auth required)
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
