// const jwt = require('jsonwebtoken');

// const authenticate = (req, res, next) => {
//     const token = req.header('x-auth-token');
//     if (!token) return res.status(401).send('Access denied');

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(400).send('Invalid token');
//     }
// };

// module.exports = authenticate;
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const signup = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        const newUser = new User({ username, password: hashedPassword });

        await newUser.save();
        res.status(200).json({ message: 'Signup successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error during signup', error });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password); // Compare hashed password
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token }); // Send JWT token to frontend
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error });
    }
};

module.exports = { signup, login };
