import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.token = action.payload;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.token = null;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } = authSlice.actions;

export const login = (username, password) => async (dispatch) => {
  // alert(username)
  dispatch(loginRequest());
  try {
    const response = await axios.post('http://localhost:5000/admin/api/login', {
      username:username,
      password:password
    },{
      headers: {
          "Content-Type": "application/json",
          "username": username,  // Send username as a header
          "password": password  
      }
  });  // Assuming the login API is at '/api/admin/login'
    const token = response.data.token;  // The token returned from the server
    dispatch(loginSuccess(token));
    localStorage.setItem('token', token);  // Save token to localStorage
  } catch (error) {
    dispatch(loginFailure(error.response?.data?.message || 'Something went wrong'));
  }
};

export default authSlice.reducer;
