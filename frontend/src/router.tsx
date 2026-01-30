import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./application/Dashboard/Dashboard";
import Login from "./application/Login/Login";
import AuthCheck from "./components/Auth";
import { Navigate } from "react-router-dom";
export const router = createBrowserRouter([

  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <AuthCheck />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);
