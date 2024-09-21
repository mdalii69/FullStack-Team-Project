const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const validator = require('validator');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();

// Middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // To parse JSON bodies

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/user_registration', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    }
});

const User = mongoose.model('User', userSchema);

// Serve HTML files
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.get('/register', (req, res) => res.sendFile(__dirname + '/public/register.html'));
app.get('/login', (req, res) => res.sendFile(__dirname + '/public/login.html'));
app.get('/dashboard', (req, res) => res.sendFile(__dirname + '/public/dashboard.html'));

// Validate password strength
const validatePasswordStrength = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= 8 && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
};

// Handle registration
app.post('/register', async (req, res) => {
    const { name, email, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }

    if (!validatePasswordStrength(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email: validator.normalizeEmail(email),
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'Successfully registered.', redirect: '/login' });
    } catch (err) {
        res.status(400).json({ message: 'Registration failed. Email may already be registered.' });
    }
});

// Handle login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Successful login
        res.status(200).json({ redirect: '/dashboard' });
    } catch (err) {
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
