import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";

import Home from "../pages/Home";
import PublicLessons from "../pages/PublicLessons";
import LessonDetails from "../pages/LessonDetails";
import Pricing from "../pages/Pricing";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentCancel from "../pages/PaymentCancel";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";

import DashboardHome from "../pages/dashboard/DashboardHome";
import AddLesson from "../pages/dashboard/AddLesson";
import MyLessons from "../pages/dashboard/MyLessons";
import UpdateLesson from "../pages/dashboard/UpdateLesson";
import Favorites from "../pages/dashboard/Favorites";
import Profile from "../pages/dashboard/Profile";

const router = createBrowserRouter([
  // Normal site with Navbar/Footer
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "public-lessons", element: <PublicLessons /> },

      {
        path: "lesson/:id",
        element: (
          <PrivateRoute>
            <LessonDetails />
          </PrivateRoute>
        ),
      },

      // ✅ Navbar যদি /pricing এ যায়, এখানে redirect করে দাও
      { path: "pricing", element: <Navigate to="/pricing/upgrade" replace /> },

      // ✅ তোমার আগের protected upgrade route
      {
        path: "pricing/upgrade",
        element: (
          <PrivateRoute>
            <Pricing />
          </PrivateRoute>
        ),
      },

      { path: "payment/success", element: <PaymentSuccess /> },
      { path: "payment/cancel", element: <PaymentCancel /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },

  // Dashboard (protected) + Navbar/Footer থাকবে (কারণ MainLayout)
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardHome /> },
          { path: "add-lesson", element: <AddLesson /> },
          { path: "my-lessons", element: <MyLessons /> },

          // ✅ Update route (dynamic id)
          { path: "update-lesson/:id", element: <UpdateLesson /> },

          // ✅ Sidebar এ যেটা আছে (main)
          { path: "my-favorites", element: <Favorites /> },

          // ✅ Navbar যদি /dashboard/favorites এ যায়, redirect করে my-favorites এ পাঠাও
          { path: "favorites", element: <Navigate to="/dashboard/my-favorites" replace /> },

          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },

  // 404 (Navbar/Footer থাকবে না)
  { path: "*", element: <NotFound /> },
]);

export default router;
