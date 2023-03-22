import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";

type Role = "user" | "company" | "admin";

const Authorization = (Component: React.ComponentType, allowedRoles: Role) => {
  const { user } = useAppContext();
  const userRole = user?.role || "";

  if (allowedRoles.includes(userRole)) {
    return <Component />;
  } else {
    return <Navigate to="/unauthorized" />;
  }
};

export default Authorization;
