const express = require('express');
const router = express.Router();

const protect = require('../middleware/auth');
const { createReview, getAvgUserReview } = require('../controllers/review');

router.post("/create", protect, createReview);
router.get("/avg", protect, getAvgUserReview);

module.exports = router;
