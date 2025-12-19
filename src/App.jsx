import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import router from "./routes/router";
import AuthProvider from "./providers/AuthProvider";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
