// client/src/routes/router.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";

import Home from "../pages/Home";
import PublicLessons from "../pages/PublicLessons";
import LessonDetails from "../pages/LessonDetails";
import Pricing from "../pages/Pricing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";

import DashboardHome from "../pages/dashboard/DashboardHome";
import AddLesson from "../pages/dashboard/AddLesson";
import MyLessons from "../pages/dashboard/MyLessons";
import Favorites from "../pages/dashboard/Favorites";
import Profile from "../pages/dashboard/Profile";
import UpdateLesson from "../pages/dashboard/UpdateLesson";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/public-lessons", element: <PublicLessons /> },
      { path: "/pricing", element: <Pricing /> },

      {
        path: "/lessons/:id",
        element: (
          <PrivateRoute>
            <LessonDetails />
          </PrivateRoute>
        ),
      },

      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "add-lesson", element: <AddLesson /> },
      { path: "my-lessons", element: <MyLessons /> },

      // ✅ Spec route
      { path: "my-favorites", element: <Favorites /> },

      // ✅ Backward-compatible alias (old route)
      { path: "favorites", element: <Navigate to="/dashboard/my-favorites" replace /> },

      { path: "profile", element: <Profile /> },
      { path: "update-lesson/:id", element: <UpdateLesson /> },
    ],
  },
]);

export default router;
