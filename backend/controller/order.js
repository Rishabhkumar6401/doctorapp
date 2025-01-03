const Counter = require('../Model/Counter');
const Order = require('../Model/Order');

const PlaceOrder = async (req, res) => {
  try {
    const { name, age, address, phoneNo, referredBy, category, subcategory, fees, discount, finalPayment, paymentMode, referralFee } = req.body;

    // Get today's date in DDMMYYYY format
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const todayString = `${day}${month}${year}`;

    // Find and update the counter for today's date
    let counter = await Counter.findOne({ date: todayString });
    if (!counter) {
      // Create a new counter if none exists for today
      counter = new Counter({ date: todayString, count: 0 });
    }

    // Increment the count
    counter.count += 1;
    await counter.save();

    // Generate the serial number
    const serialNo = `${todayString}${String(counter.count).padStart(2, '0')}`;

    // Create a new order
    const newOrder = new Order({
      serialNo,
      name,
      age,
      address,
      phoneNo,
      referredBy,
      category,
      subcategory,
      fees,
      discount,
      finalPayment,
      paymentMode,
      referralFee,
    });

    // Save the order
    await newOrder.save();

    // Send success response
    res.status(201).json({
      message: 'Order placed successfully',
      order: newOrder,
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({
      message: 'Error placing order',
      error: error.message,
    });
  }
};




// FetchOrder API to retrieve an order by ID
const fetchOrder = async (req, res) => {
  try {
    const { orderId } = req.params; // Assuming the order ID is passed as a route parameter

    // Find the order by ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    // Send success response with the order data
    res.status(200).json({
      message: 'Order fetched successfully',
      order,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      message: 'Error fetching order',
      error: error.message,
    });
  }
};

const fetchAllOrder = async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find();

    if (orders.length === 0) {
      return res.status(404).json({
        message: 'No orders found',
      });
    }

    // Send success response with all orders
    res.status(200).json({
      message: 'Orders fetched successfully',
      orders,
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({
      message: 'Error fetching all orders',
      error: error.message,
    });
  }
};

const EditOrder = async (req, res) => {
  try {
    const { orderId } = req.params; // Order ID is passed in the URL parameters
    const updateData = req.body;    // The data to update is passed in the request body

    // Find the order by ID and update it with the new data
    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,    // This ensures that the updated order is returned
      runValidators: true, // This ensures the model validation is run during the update
    });

    if (!updatedOrder) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    // Send success response with the updated order data
    res.status(200).json({
      message: 'Order updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      message: 'Error updating order',
      error: error.message,
    });
  }
};

const DeleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params; // Order ID is passed in the URL parameters

    // Find the order by ID and delete it
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    // Send success response
    res.status(200).json({
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      message: 'Error deleting order',
      error: error.message,
    });
  }
};




module.exports = { PlaceOrder, fetchOrder, fetchAllOrder, EditOrder, DeleteOrder};
