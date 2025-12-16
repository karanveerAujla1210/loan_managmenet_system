const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema(
  {
    branchId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    branchName: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['Head office', 'Branch'],
      required: true
    }
  },
  { timestamps: true }
);

branchSchema.index({ branchId: 1 }, { unique: true });

module.exports = mongoose.model('Branch', branchSchema);
