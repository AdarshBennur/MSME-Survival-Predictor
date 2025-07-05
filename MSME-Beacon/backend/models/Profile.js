const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  personalInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    role: { type: String, default: 'Business Owner' },
    dateOfBirth: { type: Date },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zipCode: { type: String, default: '' },
      country: { type: String, default: '' }
    }
  },
  businessInfo: {
    businessName: { type: String, required: true },
    businessType: { type: String, default: '' },
    industry: { type: String, default: '' },
    businessLocation: { type: String, default: '' },
    businessSize: { 
      type: String, 
      enum: ['Micro (1-9 employees)', 'Small (10-49 employees)', 'Medium (50-249 employees)', 'Large (250+ employees)'],
      default: 'Small (10-49 employees)' 
    },
    registrationNumber: { type: String, default: '' },
    taxId: { type: String, default: '' },
    website: { type: String, default: '' }
  },
  professionalInfo: {
    experience: { type: Number, default: 0 },
    skills: [{ type: String }],
    certifications: [{ type: String }],
    education: { type: String, default: '' }
  },
  preferences: {
    language: { type: String, default: 'English' },
    timezone: { type: String, default: 'UTC+05:30 (India Standard Time)' },
    currency: { type: String, default: 'INR' }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient user-specific queries
ProfileSchema.index({ userId: 1 });

module.exports = mongoose.model('Profile', ProfileSchema); 