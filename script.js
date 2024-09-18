const themeIcon = document.getElementById('themeIcon');
const body = document.body;
const passwordInput = document.getElementById('password');
const strengthIndicator = document.getElementById('password-strength');

// Default is light mode, so we start with the moon icon
themeIcon.addEventListener('click', () => {
    // Toggle the 'dark' class on the body
    body.classList.toggle('dark');

    // Toggle the icon between sun and moon
    if (body.classList.contains('dark')) {
        themeIcon.textContent = '☀️'; // Sun icon for light mode
    } else {
        themeIcon.textContent = '🌙'; // Moon icon for dark mode
    }
});

// Password strength indicator
if (passwordInput) {
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const strength = checkPasswordStrength(password);

        strengthIndicator.textContent = strength.text;
        strengthIndicator.className = `password-strength ${strength.class}`;
    });
}

function checkPasswordStrength(password) {
    let strength = { text: 'Weak', class: 'weak' };

    const lengthCriteria = password.length >= 8;
    const numberCriteria = /\d/.test(password);
    const lowercaseCriteria = /[a-z]/.test(password);
    const uppercaseCriteria = /[A-Z]/.test(password);
    const specialCharCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (lengthCriteria && numberCriteria && lowercaseCriteria && uppercaseCriteria && specialCharCriteria) {
        strength = { text: 'Strong', class: 'strong' };
    } else if (lengthCriteria && (numberCriteria || lowercaseCriteria || uppercaseCriteria)) {
        strength = { text: 'Medium', class: 'medium' };
    }

    return strength;
}

// Handle login form submission
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the default form submission

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                // Redirect to dashboard on successful login
                window.location.href = result.redirect;
            } else {
                // Show an alert with the error message
                alert(result.message || 'An error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred. Please try again later.');
        }
    });
}

// Handle registration form submission
if (document.getElementById('registrationForm')) {
    document.getElementById('registrationForm').addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the default form submission

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        // Check if passwords match
        if (data.password !== data.confirm_password) {
            alert('Passwords do not match.');
            return; // Stop form submission if passwords do not match
        }

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                // Show success message and redirect
                alert(result.message);
                window.location.href = result.redirect; // Redirect to login page
            } else {
                // Show an alert with the error message
                alert(result.message || 'An error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred. Please try again later.');
        }
    });
}
