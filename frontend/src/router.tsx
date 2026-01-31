import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./application/Dashboard/Dashboard";
import Login from "./application/Login/Login";
import AuthCheck from "./components/Auth";
import Analytics from "./application/Analytics/Analytics";
import CustomerChat from "./application/CustomerChat/CustomerChat";
import Profile from "./application/Profile/Profile";
import ConversationView from "./application/ConversationView/ConversationView";

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
      {
        path: "/chat",
        element: <CustomerChat />
      },
      {
        path: '/analytics',
        element: <Analytics />
      },
      {
        path: '/:customer-id/profile',
        element: <Profile />,
      },
      {
        path: '/:conversation_id/view',
        element: <ConversationView />
      }

    ],
  },
]);
