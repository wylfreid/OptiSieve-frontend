import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action) => {
      const newUser = action.payload;
      const existingItem = state.users.find((item) => item.id === newUser.id);

      if (!existingItem) {
        state.users.push({
          id: newUser.id,
          userName: newUser.userName,
          email: newUser.email,
        });
      }
    },
    deleteUser: (state, action) => {
      const id = action.payload;
      const existingItem = state.users.find((item) => item.id === id);

      if (existingItem) {
        state.users = state.users.filter((item) => item.id !== id);
      }
    },

    deleteAllUsers: (state, action) => {
      state.users.length = 0;
    },
  },
});

export const usersActions = userSlice.actions;

export default userSlice.reducer;
