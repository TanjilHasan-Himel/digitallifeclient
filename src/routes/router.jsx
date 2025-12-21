// client/src/routes/router.jsx
import { createBrowserRouter } from "react-router-dom";
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

      { path: "/payment-success", element: <PaymentSuccess /> },
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
    ],
  },
]);

export default router;
