const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const ObjectId = require("mongoose").Types.ObjectId;

// @route GET /users
// @desc Search for users
// @access Private
exports.searchUsers = asyncHandler(async (req, res, next) => {
    const searchString = req.query.search;

    let users;
    if (searchString) {
        users = await User.find({
            username: { $regex: searchString, $options: "i" },
        });
    }

    if (!users) {
        res.status(404);
        throw new Error("No users found in search");
    }

    res.status(200).json({ users: users });
});

// @route GET /users/:userId
// @desc Get users by id
// @access Private
exports.getUserById = asyncHandler(async (req, res, next) => {
    const id = req.params.userId;

    let user;

    user = await User.find({
        _id: ObjectId(id),
    });

    if (!user) {
        res.status(404);
        throw new Error("No users found in search");
    }

    res.status(200).json({ user: user });
});
