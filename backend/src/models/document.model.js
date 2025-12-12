const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  ownerType: { 
    type: String, 
    enum: ['customer', 'loan', 'user'], 
    required: true 
  },
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    index: true
  },
  documentType: {
    type: String,
    enum: ['aadhaar', 'pan', 'passport', 'driving_license', 'salary_slip', 'bank_statement', 'photo', 'signature', 'other'],
    required: true
  },
  fileName: { type: String, required: true },
  originalName: String,
  fileKey: { type: String, required: true }, // S3 key or local path
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  url: String, // Public URL if applicable
  isVerified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: Date,
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  metadata: { type: Object, default: {} }
}, {
  timestamps: true
});

// Indexes
DocumentSchema.index({ ownerType: 1, ownerId: 1 });
DocumentSchema.index({ documentType: 1 });
DocumentSchema.index({ uploadedBy: 1 });

module.exports = mongoose.model('Document', DocumentSchema);