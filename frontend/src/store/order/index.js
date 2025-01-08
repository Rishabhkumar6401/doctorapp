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
      console.log(response.data);
      return response.data.orders; // Assuming the response contains the array of orders
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return rejectWithValue('Failed to fetch orders');
    }
  }
);

// Thunk to fetch orders by date range
export const fetchOrdersByDate = createAsyncThunk(
  'order/fetchOrdersByDate',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/ordersbydate?startDate=${startDate}&endDate=${endDate}`
      );
      return response.data.orders; // Assuming the response contains the array of filtered orders
    } catch (error) {
      console.error('Error fetching orders by date:', error);
      return rejectWithValue('Failed to fetch orders by date');
    }
  }
);

// Thunk to update an existing order
export const updateOrder = createAsyncThunk(
  'order/updateOrder',
  async ({ orderId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/orders/${orderId}`, updatedData);
      return response.data.order; // Assuming the response contains the updated order data
    } catch (error) {
      console.error('Error updating order:', error);
      return rejectWithValue('Failed to update order');
    }
  }
);

// Creating a slice for order
const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orderDetails: null,
    allOrders: [], // Store all fetched orders
    filteredOrders: [], // Store orders filtered by date
    loading: false,
    error: null, // For capturing errors
    status: 'idle', // New field to track order status
  },
  reducers: {
    // Resets the order state
    resetOrderState: (state) => {
      state.orderDetails = null;
      state.allOrders = [];
      state.filteredOrders = [];
      state.loading = false;
      state.error = null;
      state.status = 'idle';
    },
    // Optimistically update an order in the state
    updateOrderInState: (state, action) => {
      const updatedOrder = action.payload;
      const index = state.allOrders.findIndex(order => order._id === updatedOrder._id);
      if (index !== -1) {
        state.allOrders[index] = updatedOrder;
      }
    }
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
      })
      // Fetch Orders by Date
      .addCase(fetchOrdersByDate.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(fetchOrdersByDate.fulfilled, (state, action) => {
        state.filteredOrders = action.payload;
        state.loading = false;
        state.status = 'success';
      })
      .addCase(fetchOrdersByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = 'failed';
      })
      // Update Order
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        state.allOrders = state.allOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
        state.loading = false;
        state.status = 'success';
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = 'failed';
      });
  },
});

// Exporting the actions and reducer
export const { resetOrderState, updateOrderInState } = orderSlice.actions;
export default orderSlice.reducer;
