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
passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const strength = checkPasswordStrength(password);

    strengthIndicator.textContent = strength.text;
    strengthIndicator.className = `password-strength ${strength.class}`;
});

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
