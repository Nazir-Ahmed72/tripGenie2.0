const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  destination: { type: String, required: true },
  departureDate: { type: String },
  returnDate: { type: String },
  numTravelers: { type: Number, default: 1 },
  budget: { type: Number },
  travelStyle: { type: String },
  preferences: { type: mongoose.Schema.Types.Mixed },
  researchData: { type: mongoose.Schema.Types.Mixed },
  itinerary: { type: mongoose.Schema.Types.Mixed },
  status: { type: String, default: 'complete' }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);