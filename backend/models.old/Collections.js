const mongoose = require('mongoose');

const CollectionsSchema = new mongoose.Schema({
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  dpd: { type: Number, required: true },
  bucket: { type: String, required: true },
  agentId: String,
  lastContactDate: Date,
  nextFollowUp: Date,
  status: { type: String, default: "open", enum: ["open", "closed", "escalated"] },
  notes: String
}, { timestamps: true });

CollectionsSchema.index({ bucket: 1, dpd: -1 });

module.exports = mongoose.model('Collections', CollectionsSchema);