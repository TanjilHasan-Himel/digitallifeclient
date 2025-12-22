// client/src/routes/router.jsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

import Home from "../pages/Home";
import PublicLessons from "../pages/PublicLessons";
import LessonDetails from "../pages/LessonDetails";
import Pricing from "../pages/Pricing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentCancel from "../pages/PaymentCancel";

import DashboardHome from "../pages/dashboard/DashboardHome";
import AddLesson from "../pages/dashboard/AddLesson";
import MyLessons from "../pages/dashboard/MyLessons";
import Favorites from "../pages/dashboard/Favorites";
import Profile from "../pages/dashboard/Profile";
import UpdateLesson from "../pages/dashboard/UpdateLesson";
import AdminHome from "../pages/dashboard/admin/AdminHome";
import ManageUsers from "../pages/dashboard/admin/ManageUsers";
import ManageLessons from "../pages/dashboard/admin/ManageLessons";
import ReportedLessons from "../pages/dashboard/admin/ReportedLessons";
import AdminProfile from "../pages/dashboard/admin/AdminProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/public-lessons", element: <PublicLessons /> },
      {
        path: "/pricing",
        element: (
          <PrivateRoute>
            <Pricing />
          </PrivateRoute>
        ),
      },

      {
        path: "/payment-success",
        element: (
          <PrivateRoute>
            <PaymentSuccess />
          </PrivateRoute>
        ),
      },
      { path: "/payment-cancel", element: <PaymentCancel /> },

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
      { path: "favorites", element: <Favorites /> },
      { path: "profile", element: <Profile /> },
      { path: "update-lesson/:id", element: <UpdateLesson /> },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <div />
          </AdminRoute>
        ),
        children: [
          { index: true, element: <AdminHome /> },
          { path: "manage-users", element: <ManageUsers /> },
          { path: "manage-lessons", element: <ManageLessons /> },
          { path: "reported-lessons", element: <ReportedLessons /> },
          { path: "profile", element: <AdminProfile /> },
        ],
      },
    ],
  },
]);

export default router;
