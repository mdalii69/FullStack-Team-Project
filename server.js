const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Serve the HTML registration form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Handle form submission
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

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
        res.status(400).send('Error: Unable to register user');
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
