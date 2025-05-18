import axios from "axios";

const API_URL = "https://worldexplorer-api.vercel.app/api/auth/";

// Option 1: Keep using credentials (recommended if you need cookies)
axios.defaults.withCredentials = true;

// Option 2 (alternative): Remove credentials and use token-based auth only
// Remove this line if you choose option 2
// axios.defaults.withCredentials = true;

const signup = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

const login = (username, password) => {
  return axios
    .post(API_URL + "signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
  return axios.post(API_URL + "signout").then(() => {
    // Clear local storage
  });
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const authService = {
  signup,
  login,
  logout,
  getCurrentUser,
};

export default authService;
