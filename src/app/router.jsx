import { createBrowserRouter, Navigate, Route } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout";
import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import DashboardPage from "../pages/DashboardPage";
import FolderPage from "../pages/FolderPage";
import InviteAcceptPage from "../pages/InviteAcceptPage";
import TestSupabase from "../pages/TestSupabase";
import InvitePage from "../pages/InvitePage";

const router = createBrowserRouter([
  // Redirect root to login
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // Auth routes
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
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
            path: "/dashboard",
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

  // Invite route (can be accessed without login)
  
   {
    path: "/invite/:token",
    element: <InvitePage />,
  },
  
  {
    path: "/test",
    element: <TestSupabase />,
  },

  // <Route path="/test" element={<TestSupabase />} />,
]);

export default router;
