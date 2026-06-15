import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  role,
}) {
  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  if (!userInfo) {
    return <Navigate to="/" />;
  }

  if (
    role &&
    userInfo.role !== role
  ) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;