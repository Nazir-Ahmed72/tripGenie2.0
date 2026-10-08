const express = require('express');
const { pool } = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

const tripColumns = `
  id AS "_id",
  user_id AS "userId",
  title,
  destination,
  departure_date AS "departureDate",
  return_date AS "returnDate",
  num_travelers AS "numTravelers",
  budget,
  travel_style AS "travelStyle",
  preferences,
  research_data AS "researchData",
  itinerary,
  status,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;

// GET all trips for user
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ${tripColumns} FROM trips WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.userId]
    );
    res.json({ trips: result.rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST save a trip
router.post('/', auth, async (req, res) => {
  try {
    const { title, destination, preferences, researchData, itinerary } = req.body;
    if (!destination) {
      return res.status(400).json({ message: 'Destination is required' });
    }

    const result = await pool.query(
      `INSERT INTO trips (
         user_id, title, destination, departure_date, return_date,
         num_travelers, budget, travel_style, preferences, research_data, itinerary
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING ${tripColumns}`,
      [
        req.user.userId,
        title || `Trip to ${destination}`,
        destination,
        preferences?.departure_date || null,
        preferences?.return_date || null,
        preferences?.num_travelers || 1,
        preferences?.budget ?? null,
        preferences?.travel_style || null,
        preferences ? JSON.stringify(preferences) : null,
        researchData ? JSON.stringify(researchData) : null,
        itinerary ? JSON.stringify(itinerary) : null,
      ]
    );
    const trip = result.rows[0];
    res.status(201).json({ trip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single trip
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ${tripColumns} FROM trips WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.userId]
    );
    const trip = result.rows[0];
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json({ trip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE trip
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.userId]
    );
    if (!result.rowCount) return res.status(404).json({ message: 'Trip not found' });
    res.json({ message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;