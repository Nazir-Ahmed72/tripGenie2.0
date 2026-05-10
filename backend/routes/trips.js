const express = require('express');
const Trip = require('../models/Trip');
const auth = require('../middleware/auth');

const router = express.Router();

// GET all trips for user
router.get('/', auth, async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ trips });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST save a trip
router.post('/', auth, async (req, res) => {
  try {
    const { title, destination, preferences, researchData, itinerary } = req.body;
    const trip = await Trip.create({
      userId: req.user.id,
      title: title || `Trip to ${destination}`,
      destination,
      departureDate: preferences?.departure_date,
      returnDate: preferences?.return_date,
      numTravelers: preferences?.num_travelers,
      budget: preferences?.budget,
      travelStyle: preferences?.travel_style,
      preferences,
      researchData,
      itinerary
    });
    res.status(201).json({ trip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single trip
router.get('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json({ trip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE trip
router.delete('/:id', auth, async (req, res) => {
  try {
    await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;