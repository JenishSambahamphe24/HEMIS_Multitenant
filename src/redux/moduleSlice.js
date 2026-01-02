import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  moduleData: null,
  userResponse: null,
  linksMap: null,
  isLoading: false,
};

const moduleSlice = createSlice({
  name: "module",
  initialState,
  reducers: {
    setModules: (state, action) => {
      if (action.payload.moduleData !== undefined) {
        state.moduleData = action.payload.moduleData;
      }
      if (action.payload.userResponse !== undefined) {
        state.userResponse = action.payload.userResponse;
      }
      if (action.payload.linksMap !== undefined) {
        state.linksMap = action.payload.linksMap;
      }
      if (action.payload.isLoading !== undefined) {
        state.isLoading = action.payload.isLoading;
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    clearModules: (state) => {
      state.moduleData = null;
      state.userResponse = null;
      state.linksMap = null;
      state.isLoading = false;
    }
  }
});

export const { setModules, setLoading, clearModules } = moduleSlice.actions;
export default moduleSlice.reducer;