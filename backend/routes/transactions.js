const express = require('express');
const User = require('../models/User');
const authenticate = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

// Add Transaction (with error handling and atomicity)
router.post('/transaction', authenticate, async (req, res) => {
    const { receiverUsername, amount } = req.body; // Changed receiver field to receiverUsername
    const senderUsername = req.user.username; // Assuming the user is authenticated via JWT

    const session = await mongoose.startSession();  // Start a new session for atomicity
    session.startTransaction();

    try {
        // Fetch the sender and receiver user documents within the same session
        const senderUser = await User.findOne({ username: senderUsername }).session(session);
        const receiverUser = await User.findOne({ username: receiverUsername }).session(session);  // Changed to username

        if (!receiverUser) {
            throw new Error('Receiver not found');
        }

        // Check if the sender has sufficient balance
        if (senderUser.balance < amount) {
            throw new Error('Insufficient balance');
        }

        // Perform the transaction
        senderUser.balance -= amount;
        receiverUser.balance += amount;

        // Add transaction records for both sender and receiver
        senderUser.transactions.push({ sender: senderUser.username, receiver: receiverUser.username, amount });
        receiverUser.transactions.push({ sender: senderUser.username, receiver: receiverUser.username, amount });

        // Save the changes to the database
        await senderUser.save({ session });
        await receiverUser.save({ session });

        // Commit the transaction to apply all changes
        await session.commitTransaction();
        session.endSession(); // End the session

        res.send('Transaction successful');
    } catch (error) {
        // If any error occurs, abort the transaction and rollback all changes
        await session.abortTransaction();
        session.endSession();

        console.error('Transaction error:', error.message);
        res.status(500).send(`Transaction failed: ${error.message}`);
    }
});

// Transaction History (retrieve user transaction history)
router.get('/history', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user.transactions);
    } catch (error) {
        console.error('Error fetching transaction history:', error.message);
        res.status(500).send('Unable to fetch transaction history');
    }
});

module.exports = router;
