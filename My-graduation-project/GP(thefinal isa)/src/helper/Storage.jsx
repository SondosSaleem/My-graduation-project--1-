export const setAuthUser = (response) => {
  sessionStorage.setItem("user", JSON.stringify(response.user));
  sessionStorage.setItem("token", response.token); // Store the token separately
};

export const getAuthUser = () => {
   if (sessionStorage.getItem("user")) {
    return JSON.parse(sessionStorage.getItem("user"));
  }
   if (sessionStorage.getItem("token")) {
    return JSON.parse(sessionStorage.getItem("token"));
  }
  return null; // Return null if user data doesn't exist
};

export const removeAuthUser = () => {
   sessionStorage.removeItem("user");
   sessionStorage.removeItem("token"); // Remove the token
};
