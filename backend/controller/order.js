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

module.exports = { PlaceOrder, fetchOrder };
