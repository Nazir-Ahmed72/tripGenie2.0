const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');

const router = express.Router();
const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

const callAI = async (endpoint, body, res) => {
  try {
    console.log(`→ Calling AI: ${AI_URL}${endpoint}`);
    const response = await axios.post(`${AI_URL}${endpoint}`, body, { timeout: 60000 });
    console.log(`✅ AI response from ${endpoint}`);
    return res.json(response.data);
  } catch (err) {
    const detail = err.response?.data?.detail || err.response?.data || err.message;
    console.error(`❌ AI error on ${endpoint}:`, detail);
    return res.status(500).json({ message: typeof detail === 'string' ? detail : JSON.stringify(detail) });
  }
};

router.post('/extract-intent', auth, (req, res) => callAI('/extract-intent', req.body, res));
router.post('/research', auth, (req, res) => callAI('/research', req.body, res));
router.post('/plan', auth, (req, res) => callAI('/plan', req.body, res));

module.exports = router;