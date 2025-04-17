import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import App from "./App";
import token from "./token";

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const tokenValue = token.getUser(); // Retrieve the token

        // If no token is found, redirect to the login page
        if (!tokenValue) {
          setIsAuthenticated(false);
          navigate("/");
          return;
        }

        // Validate the token
        const response = await token.validateToken(tokenValue);

        // If the token is expired or invalid, redirect to the login page
        if (
          response?.auth_key?.payload?.error === "Token Expired" ||
          !response?.auth_key?.payload?.status
        ) {
          setIsAuthenticated(false);
          navigate("/");
        } else {
          // If the token is valid, update the authentication status
          setIsAuthenticated(true);

          // Redirect to the dashboard if the user is on the root page
          if (location.pathname === "/") {
            navigate("/home/dashboard");
          }
        }
      } catch (error) {
        console.error("Error during token verification:", error);
        setIsAuthenticated(false);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [navigate, location.pathname]);

  // Show a loading screen while verifying the token
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  // Show a message if the user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Please sign in to access this page</div>
      </div>
    );
  }

  // Render the main layout if the user is authenticated
  return (
    <div>
      <div className="main-headers">
        <App />
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
