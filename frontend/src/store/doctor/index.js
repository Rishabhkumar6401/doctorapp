// src/redux/doctorsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch doctors from the server
export const fetchDoctors = createAsyncThunk(
  'doctors/fetchDoctors',
  async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/doctors');
      return response.data.doctors; // Assuming the data you need is in response.data
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return [];
    }
  }
);

// Async thunk to fetch a doctor by ID
export const fetchDoctorById = createAsyncThunk(
  'doctors/fetchDoctorById',
  async (doctorId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/doctor/${doctorId}`);
      return response.data.doctor; // Assuming the data you need is the doctor's details
    } catch (error) {
      console.error('Error fetching doctor by ID:', error);
      return null; // Return null or an appropriate error message
    }
  }
);

// Creating the slice
const doctorsSlice = createSlice({
  name: 'doctors',
  initialState: {
    doctors: [],
    doctorDetails: null, // Store the details of a single doctor
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetching all doctors
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetching a single doctor by ID
      .addCase(fetchDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorDetails = action.payload; // Store the doctor details
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default doctorsSlice.reducer;
