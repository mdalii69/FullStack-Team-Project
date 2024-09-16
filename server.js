const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const validator = require('validator'); // Add validator for validation
const app = express();

// Middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Connect to MongoDB (replace <username>, <password>, and <dbname> with your own values)
mongoose.connect('mongodb://localhost:27017/user_registration', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error: ', err));

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
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

// Serve the HTML registration form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Validate password strength
const validatePasswordStrength = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= 8 && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
};

// Handle form submission
app.post('/register', async (req, res) => {
    const { name, email, password, confirm_password } = req.body;

    // Check if password matches confirmation password
    if (password !== confirm_password) {
        return res.status(400).send('Passwords do not match.');
    }

    // Validate password strength
    if (!validatePasswordStrength(password)) {
        return res.status(400).send('Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.');
    }

    // Create a new user object
    const newUser = new User({
        name,
        email,
        password
    });

    try {
        // Save the user to the database
        await newUser.save();
        res.send('Registration successful!');
    } catch (err) {
        res.status(400).send('Error: Unable to register user. Email may already be registered.');
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
