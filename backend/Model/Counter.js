const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
  date: {
    type: String, // Format: DDMMYYYY
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    default: 0,
  },
});

const Counter = mongoose.model('Counter', CounterSchema);

module.exports = Counter;
