import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to fetch patients by phone number
export const fetchPatients = createAsyncThunk(
  'patient/fetchPatients',
  async (phoneNo) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/patients?phoneNo=${phoneNo}`);
      return response.data.patients || [];
    } catch (error) {
      console.error('Error fetching patients:', error);
      return [];
    }
  }
);

// Thunk to add a new patient
export const addPatient = createAsyncThunk(
  'patient/addPatient',
  async (patientData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/patient/add', patientData);
      return response.data; // Assuming the response returns the added patient or success message
    } catch (error) {
      console.error('Error adding patient:', error);
      return rejectWithValue('Failed to add patient');
    }
  }
);

// Thunk to check if the patient is new or exists by phone number
export const checkPatientByPhone = createAsyncThunk(
  'patient/checkPatientByPhone',
  async (phoneNo) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/checkPatient?phoneNo=${phoneNo}`);
      return response.data; // Expecting response like { message: "Patient exists", isNew: false }
    } catch (error) {
      console.error('Error checking patient by phone:', error);
      return { isNew: true }; // Default to new patient if there's an error
    }
  }
);

// Creating a slice
const patientSlice = createSlice({
  name: 'patient',
  initialState: {
    phoneNo: '',
    patients: [],
    isNewEntry: true,
    loading: false, // Add loading state
    error: null, // For capturing errors
  },
  reducers: {
    setPhoneNo: (state, action) => {
      state.phoneNo = action.payload;
    },
    setIsNewEntry: (state, action) => {
      state.isNewEntry = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true; // Set loading to true when the request is pending
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.patients = action.payload;
        state.isNewEntry = action.payload.length === 0;
        state.loading = false; // Set loading to false once the request is fulfilled
      })
      .addCase(fetchPatients.rejected, (state) => {
        state.loading = false; // Set loading to false if the request is rejected
      })
      .addCase(addPatient.pending, (state) => {
        state.loading = true; // Set loading to true when adding a new patient
      })
      .addCase(addPatient.fulfilled, (state, action) => {
        state.patients.push(action.payload); // Add the new patient to the list
        state.loading = false; // Set loading to false once the patient is added
      })
      .addCase(addPatient.rejected, (state, action) => {
        state.loading = false; // Set loading to false if the request is rejected
        state.error = action.payload; // Set error message if the request fails
      })
      .addCase(checkPatientByPhone.pending, (state) => {
        state.loading = true; // Set loading to true when checking patient
      })
      .addCase(checkPatientByPhone.fulfilled, (state, action) => {
        state.isNewEntry = action.payload.isNew; // Update isNewEntry based on the API response
        state.loading = false; // Set loading to false once the check is complete
      })
      .addCase(checkPatientByPhone.rejected, (state) => {
        state.loading = false; // Set loading to false if the request is rejected
        state.error = 'Error checking patient by phone'; // Set error message if the request fails
      });
  },
});

// Exporting the actions and reducer
export const { setPhoneNo, setIsNewEntry } = patientSlice.actions;
export default patientSlice.reducer;
