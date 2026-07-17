import { createSlice } from "@reduxjs/toolkit";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  role: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  role: localStorage.getItem("role"),
  user: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setAuth: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.user = action.payload.user;
      
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("role", action.payload.role);
    },

    logout: (state) => {
      state.token = null;
      state.role = null;
      state.user = null;

      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },
  },
});

export const { setAuth, logout } = authSlice.actions;

export default authSlice.reducer;