import React from "react";
import { Navigate } from "react-router-dom";
import { User } from "../context/appContext";
import { useAppContext } from "../context/appContext";

const Authorization =
  (allowedRoles: string[]) => (WrappedComponent: React.ComponentType<any>) => {
    return function WithAuthorization(props: any) {
      const { user } = useAppContext();
      const { role } = user as User;

      if (allowedRoles.includes(role)) {
        return <WrappedComponent {...props} />;
      } else {
        return <Navigate to="/unauthorized" />;
      }
    };
  };

export default Authorization;
