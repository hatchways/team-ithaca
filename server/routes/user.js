const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { searchUsers, getUserById } = require("../controllers/user");

router.route("/").get(protect, searchUsers);
router.route("/:userId").get(protect, getUserById);

module.exports = router;
