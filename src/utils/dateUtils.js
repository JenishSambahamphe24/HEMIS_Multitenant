
import { store } from "../redux/store";
import { selectCurrentUser } from "../redux/user/userSlice";

export const getAuthConfigSafe = () => {
  try {
    const state = store.getState();
    const currentUser = selectCurrentUser(state);
    if (!currentUser || !currentUser.tokenString) {
      return null;
    }
    return {
      headers: {
        Authorization: `Bearer ${currentUser.tokenString}`,
      },
    };
  } catch (error) {
    console.error('Error getting auth config:', error);
    return null;
  }
};

export const getDateOnly = (timestamp) => {
  if (!timestamp) return null;
  return new Date(timestamp).toISOString().split("T")[0];
};

export const capitaliseFirstLetter = (word) => {
  if (word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
}

export const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffInMs = end - start;
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  return diffInDays;
};

export const getDateOnADForm = (timestamp) => {
  if (!timestamp) return null;

  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US");
};

//for alumni
export const getCurrentUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;

    const parsed = JSON.parse(storedUser);
    const user = parsed.currentUser || parsed.user || parsed;

    return { ...user, token: user.tokenString || null };
  } catch {
    return null; // silently fail if JSON is invalid
  }
};
