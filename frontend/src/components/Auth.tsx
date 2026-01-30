import { Navigate, Outlet, useLocation } from "react-router-dom";

const AuthCheck = () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const location = useLocation();

  if (!refreshToken) {
    return (
      <Navigate
        to={`/login?ruri=${encodeURIComponent(
          location.pathname + location.search
        )}`}
        replace
      />
    );
  }

  return <Outlet />;
};

export default AuthCheck;
