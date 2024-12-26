import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to place an order
export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/placeOrder', formData);
      return response.data.order; // Assuming the response contains the order data or success message
    } catch (error) {
      console.error('Error placing order:', error);
      return rejectWithValue('Failed to place order');
    }
  }
);

// Creating a slice for order
const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orderDetails: null,
    loading: false,
    error: null, // For capturing errors
    status: 'idle', // New field to track order status
  },
  reducers: {
    // You can add other reducers if needed
    resetOrderState: (state) => {
      // Resets the order state
      state.orderDetails = null;
      state.loading = false;
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true; // Set loading to true when placing order
        state.status = 'pending'; // Set status to 'pending'
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orderDetails = action.payload; // Store the placed order details
        state.loading = false; // Set loading to false once the order is placed
        state.status = 'success'; // Set status to 'success'
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false; // Set loading to false if the request is rejected
        state.error = action.payload; // Set error message if the request fails
        state.status = 'failed'; // Set status to 'failed'
      });
  },
});

// Exporting the actions and reducer
export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
