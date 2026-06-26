import { create } from "zustand";
import { graphqlInstance, restInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  token: null,
  loading: false,
  checkingAuth: true,
  passwordLoading: false,

  signup: async ({ lastName, firstName, email, password, confirmPassword }) => {
    set({ loading: false });
    if (password !== confirmPassword) {
      return toast.error("passwords do not match");
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/i.test(password)
    ) {
      return toast.error(
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be at least 8 characters long",
      );
    }
    //create graphql mutations
    const mutation = `
            mutation CreateUser($userInput: createUserInput!){
                createUser(userInput:$userInput){
                    userId
                    firstName
                    lastName
                    email
                }
            }
        `;
    const variables = {
      userInput: { firstName, lastName, email, password, confirmPassword },
    };
    try {
      const res = await graphqlInstance.post("", {
        query: mutation,
        variables,
      });
      // GraphQL errors come back as 200 — manually throw them
      if (res.data.errors) {
        set({ loading: false });
        toast.error(res.data.errors[0].message);
        return;
      }
      //console.log(res.data);
      set({ user: null, loading: false });
      toast.success(
        "Account created successfully. Please verify your email before logging in.",
      );
    } catch (error) {
      set({ loading: false });
      //console.log("error obj", error);
      //alert(error)
      const message = error.errors?.[0]?.message || "Error in signup";
      toast.error(message);
    }
  },

  login: async ({ email, password }) => {
    //console.log(email);

    set({ loading: true });
    //create graphql mutations
    const mutation = `
            mutation Login($loginInput: localInput!){
                login(loginInput: $loginInput) {
                    accessToken
                    refreshToken
                }  
            }
        `;
    const variables = {
      loginInput: { email, password },
    };
    try {
      const res = await graphqlInstance.post("", {
        query: mutation,
        variables,
      });
      // GraphQL errors come back as 200 — manually throw them
      if (res.data.errors) {
        set({ loading: false });
        toast.error(res.data.errors[0].message);
        return;
      }
      const { accessToken, refreshToken } = res.data.data.login;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      //decode user token
      const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
      //console.log(decodedToken);
      set({ user: decodedToken, token: accessToken, loading: false });
      toast.success("Logged in successfully");
    } catch (error) {
      set({ loading: false, user: null });
      //console.log("error obj", error);
      //alert(error)
      const message = error.errors?.[0]?.message || "Error in login";
      toast.error(message);
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!token && !refreshToken) {
      set({ user: null, token: null, checkingAuth: false });
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const isExpired = decoded.exp * 1000 < Date.now();

      if (!isExpired) {
        set({ user: decoded, token, checkingAuth: false });
        return;
      }

      if (refreshToken) {
        try {
          const res = await restInstance.post("/auth/refresh", {
            refreshToken,
          });
          const { accessToken } = res.data;

          localStorage.setItem("token", accessToken);
          const newDecoded = JSON.parse(atob(accessToken.split(".")[1]));
          set({ user: newDecoded, token: accessToken, checkingAuth: false });
        } catch (refreshError) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          set({ user: null, token: null, checkingAuth: false });
        }
        return;
      }

      localStorage.removeItem("token");
      set({ user: null, token: null, checkingAuth: false });
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      set({ user: null, token: null, checkingAuth: false });
    }
  },

  logout: async () => {
    const mutation = `
            mutation Logout($refreshToken: String) {
                logout(refreshToken: $refreshToken) {
                    success
                    message
                }
            }
        `;

    try {
      const refreshToken = localStorage.getItem("refreshToken");

      const res = await graphqlInstance.post("", {
        query: mutation,
        variables: { refreshToken },
      });

      if (res.data.errors) {
        throw new Error(res.data.errors[0].message);
      }
    } catch (error) {
      console.error("Logout error:", error.message);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      set({ user: null, token: null });
      toast.success("Logged out successfully");
    }
  },

  googleRedirect: async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    if (!token) return;

    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);

    const decoded = JSON.parse(atob(token.split(".")[1]));
    set({ user: decoded, token });

    //remove the token from the url
    window.history.replaceState({}, "", "/");

    toast.success("Logged in with google successfully");
  },

  forgotPassword: async (email) => {
    set({ loading: true });
    try {
      const res = await restInstance.post("auth/forgot", { email });
      if (res.data.errors) {
        toast.error(res.data.errors[0].message);
        return;
      }
      set({ loading: false });
      toast.success("Your password recovery has been sent your mail");
    } catch (error) {
      set({ loading: false });
      if (/404/i.test(error)) {
        toast.error("Email could not be found please try again");
        return;
      }

      const message = error.errors?.[0]?.message || "Error sending email";
      toast.error(message);
    }
  },

  resetPassword: async ({ token, newPassword, confirmedPassword }) => {
    if (newPassword !== confirmedPassword) {
      toast.error("Passwords do not match");
      return { success: false, error: "Passwords do not match" };
    }
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/i.test(
        newPassword,
      )
    ) {
      toast.error(
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be at least 8 characters long",
      );
      return { success: false, error: "Password validation failed" };
    }
    try {
      const res = await restInstance.post("auth/reset", {
        token,
        newPassword,
        confirmedPassword,
      });
      if (res.data.errors) {
        toast.error(res.data.errors[0].message);
        return { success: false, error: res.data.errors[0].message };
      }
      return { success: true };
    } catch (error) {
      const message = error.errors?.[0]?.message || "Error resetting password";
      toast.error(message);
      return { success: false, error: message };
    }
  },

  changePassword: async ({
    currentPassword,
    newPassword,
    confirmedPassword,
  }) => {
    set({ passwordLoading: true });
    if (newPassword !== confirmedPassword) {
      toast.error("Passwords do not match");
      set({ passwordLoading: false });
      return;
    }
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/i.test(
        newPassword,
      )
    ) {
      toast.error(
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be at least 8 characters long",
      );
      set({ passwordLoading: false });
      return;
    }
    const query = `
            mutation ChangePassword ($passwordInput: changePasswordInput!) {
                changePassword(passwordInput: $passwordInput){
                
                }
            }
        `;
    const variables = {
      passwordInput: { newPassword, confirmedPassword, currentPassword },
    };
    try {
      const res = await graphqlInstance.post("", { query, variables });
      if (res.data.errors) {
        toast.error("Error changing password");
        set({ passwordLoading: false });
        return;
      }
      toast.success("Password changed successfully");
      set({ passwordLoading: false });
    } catch (error) {
      set({ passwordLoading: false });
      const message = error.errors?.[0]?.message || "Error changing password";
      toast.error(message);
    }
  },

  verifyEmail: async (token) => {
    try {
      const res = await restInstance.get(`/auth/verify?token=${token}`);


      return {success:true}
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    }
  },
}));
