const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming your User model is in models/User.js

const router = express.Router();

// User Signup
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).send('User already exists');

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });

    // Save user to the database
    try {
        await newUser.save();
        res.status(201).send('User created successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving user');
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(404).send('User not found');

    // Check if the password matches
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password');

    // Generate a JWT token for the user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token as a response
    res.json({ token });
});

module.exports = router;
