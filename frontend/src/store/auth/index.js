import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// Async thunk to check authentication
export const checkAuth = createAsyncThunk(
  "auth/checkauth",
  async () => {
    const response = await axios.get("http://localhost:5000/api/checkauth", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    });
    return response.data; // Returning the response data
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState:{
    isAuthenticated: false,
  loading: false,
  error: null,
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
      });
  },
  
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
