import * as React from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "./common/utils";

function ProtectedRoutes({ Component }) {

  const navigate = useNavigate();

  let isAuthenticated = checkAuth();

  React.useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/");
    }
  }, []);

  if (isAuthenticated) {
    return <Component />;
  }
}

export default ProtectedRoutes;
