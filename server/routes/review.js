const express = require('express');
const router = express.Router();

const protect = require('../middleware/auth');
const { createReview } = require('../controllers/review');

router.post("/create", protect, createReview);

module.exports = router;
