const mongoose = require('mongoose');

const collectionsSchema = new mongoose.Schema({
  loanId: mongoose.Schema.Types.ObjectId,
  customerId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Collections', collectionsSchema);
