import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
  isAuthenticated: false, // Add this flag
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload.user;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = true; // Set authenticated flag

      const expirationTime = Date.now() + 8 * 60 * 60 * 1000; 
      sessionStorage.setItem("expirationTime", expirationTime.toString());
      sessionStorage.setItem("user", JSON.stringify(action.payload.user)); // Store user in session

      if (action.payload.rememberMe) {
        localStorage.setItem("email", action.payload.user.email || "");
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("rememberMe");
      }
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    signOut: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
      state.isAuthenticated = false;

      sessionStorage.removeItem("expirationTime");
      sessionStorage.removeItem("user");
      localStorage.removeItem("email");
      localStorage.removeItem("rememberMe");
    },
    clearErrors: (state) => {
      state.error = null;
    },
    resetLoadingState: (state) => {
      state.loading = false; 
    },
    initializeSession: (state) => {
      try {
        const expirationTime = sessionStorage.getItem("expirationTime");
        const storedUser = sessionStorage.getItem("user");
        
        if (storedUser && expirationTime && Date.now() < parseInt(expirationTime, 10)) {
          state.currentUser = JSON.parse(storedUser);
          state.isAuthenticated = true;
        } else {
          state.currentUser = null;
          state.isAuthenticated = false;
          sessionStorage.removeItem("expirationTime");
          sessionStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Session initialization error:", error);
        state.currentUser = null;
        state.isAuthenticated = false;
        sessionStorage.removeItem("expirationTime");
        sessionStorage.removeItem("user");
      }
    },
    setAuthInitialized: (state) => {
      // This reducer can be used to mark auth as initialized
    }
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signOut,
  clearErrors,
  resetLoadingState,
  initializeSession,
  setAuthInitialized,
} = userSlice.actions;

export const selectCurrentUser = (state) => state.user.currentUser;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectAuthLoading = (state) => state.user.loading;
export const selectAuthError = (state) => state.user.error;

export const setupAuthListeners = () => (dispatch) => {
  const checkSessionExpiration = () => {
    try {
      const expirationTime = sessionStorage.getItem("expirationTime");

      if (expirationTime && Date.now() >= parseInt(expirationTime, 10)) {
        dispatch(signOut());
        return true; 
      }
      return false; 
    } catch (error) {
      console.error("Error checking session expiration:", error);
      dispatch(signOut());
      return true;
    }
  };

  const wasExpired = checkSessionExpiration();

  if (wasExpired) {
    return () => { }; 
  }

  const intervalId = setInterval(checkSessionExpiration, 60 * 1000); 
  window.addEventListener("beforeunload", () => {
    clearInterval(intervalId);
  });

  return () => clearInterval(intervalId);
};

export default userSlice.reducer;