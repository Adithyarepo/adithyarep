const mongoose = require('mongoose');

// User schema with unique username
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 }, // Balance field to store the user's balance
});

module.exports = mongoose.model('User', userSchema);
