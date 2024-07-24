import { useEffect, useState } from "react";
import { getAuthUser } from "../helper/Storage";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getAuthUser(); // Get the user object from session storage
    setIsAuthenticated(!!user); // Check if user data exists
    setIsLoading(false); // Set loading to false after checking authentication
  }, []);

  return { isAuthenticated, isLoading };
};