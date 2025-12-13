const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
  installmentNumber: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  principal: Number,
  interest: Number,
  remainingAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  penalty: { type: Number, default: 0 },
  status: { type: String, default: "pending", enum: ["pending", "partial", "paid", "overdue"] }
}, { timestamps: true });

ScheduleSchema.index({ loanId: 1, installmentNumber: 1 });

module.exports = mongoose.model('Schedule', ScheduleSchema);