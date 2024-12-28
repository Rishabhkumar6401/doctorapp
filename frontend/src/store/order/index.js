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

// Thunk to fetch all orders
export const fetchAllOrders = createAsyncThunk(
  'order/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/api/fetchAllOrder');
      console.log(response.data)
      return response.data.orders; // Assuming the response contains the array of orders
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return rejectWithValue('Failed to fetch orders');
    }
  }
);

// Creating a slice for order
const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orderDetails: null,
    allOrders: [], // Store all fetched orders
    loading: false,
    error: null, // For capturing errors
    status: 'idle', // New field to track order status
  },
  reducers: {
    // You can add other reducers if needed
    resetOrderState: (state) => {
      // Resets the order state
      state.orderDetails = null;
      state.allOrders = [];
      state.loading = false;
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Place Order
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orderDetails = action.payload;
        state.loading = false;
        state.status = 'success';
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = 'failed';
      })
      // Fetch All Orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload;
        state.loading = false;
        state.status = 'success';
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = 'failed';
      });
  },
});

// Exporting the actions and reducer
export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
