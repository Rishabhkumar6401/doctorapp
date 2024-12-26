import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create async thunk to fetch subcategory detail by ID
export const fetchSubcategoryDetail = createAsyncThunk(
  'subcategory/fetchSubcategoryDetail',
  async (subcategoryId) => {
    const response = await axios.get(`http://localhost:5000/api/subcategory/${subcategoryId}`);
    return response.data.category; // Return the subcategory data
  }
);

const subcategorySlice = createSlice({
  name: 'subcategory',
  initialState: {
    subcategory: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubcategoryDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubcategoryDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategory = action.payload; // Store the fetched subcategory
      })
      .addCase(fetchSubcategoryDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle errors if any
      });
  },
});

export default subcategorySlice.reducer;
