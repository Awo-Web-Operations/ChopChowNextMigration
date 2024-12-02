import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user_type: [],
  selectedUserType: "",
};

const userTypeSlice = createSlice({
  name: "userType",
  initialState,
  reducers: {
    setUserType(state, action) {
      state.user_type = action.payload;
    },
    setSelectedUserType(state, action) {
      return {
        ...state,
        selectedUserType: action.payload,
      };
    },
    initializeUserType(state, action) {
      return {
        ...state,
        selectedUserType: action.payload,
      };
    },
  },
});

export const { setUserType, setSelectedUserType, initializeUserType } =
  userTypeSlice.actions;

export default userTypeSlice.reducer;
