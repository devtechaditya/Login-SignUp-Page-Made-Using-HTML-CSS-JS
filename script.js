// ============================================================
//  Animated Background (floating soft orbs on canvas)
// ============================================================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let orbs = [];
const ORB_COUNT = 18;

function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}

function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
}

function createOrb() {
    return {
        x:      Math.random() * canvas.width,
        y:      Math.random() * canvas.height,
        r:      Math.random() * 80 + 30,
        dx:     (Math.random() - 0.5) * 0.4,
        dy:     (Math.random() - 0.5) * 0.4,
        alpha:  Math.random() * 0.12 + 0.04,
    };
}

function initOrbs() {
    orbs = Array.from({ length: ORB_COUNT }, createOrb);
}

function drawOrbs() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const dark = isDark();
    orbs.forEach(orb => {
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        const color = dark ? `rgba(106,140,110,${orb.alpha})` : `rgba(255,255,255,${orb.alpha})`;
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        orb.x += orb.dx;
        orb.y += orb.dy;
        if (orb.x < -orb.r)               orb.x = canvas.width  + orb.r;
        if (orb.x > canvas.width  + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r)               orb.y = canvas.height + orb.r;
        if (orb.y > canvas.height + orb.r) orb.y = -orb.r;
    });
    requestAnimationFrame(drawOrbs);
}

window.addEventListener('resize', () => { resizeCanvas(); });
resizeCanvas();
initOrbs();
drawOrbs();


// ============================================================
//  Dark Mode Toggle
// ============================================================
const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeIcon   = document.getElementById('darkModeIcon');
const html           = document.documentElement;

// Persist preference
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateDarkIcon(savedTheme);

darkModeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateDarkIcon(next);
});

function updateDarkIcon(theme) {
    darkModeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}


// ============================================================
//  Password Visibility Toggle
// ============================================================
function togglePasswordVisibility(input, icon) {
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

const toggleSignIn     = document.getElementById('toggleSignInPassword');
const signinPassword   = document.getElementById('signin-password');
const toggleSignUp     = document.getElementById('toggleSignUpPassword');
const signupPasswordEl = document.getElementById('signup-password');

toggleSignIn.addEventListener('click', () => togglePasswordVisibility(signinPassword, toggleSignIn));
toggleSignIn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') togglePasswordVisibility(signinPassword, toggleSignIn);
});

toggleSignUp.addEventListener('click', () => togglePasswordVisibility(signupPasswordEl, toggleSignUp));
toggleSignUp.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') togglePasswordVisibility(signupPasswordEl, toggleSignUp);
});


// ============================================================
//  Login / Register Panel Toggle
// ============================================================
const container   = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn    = document.getElementById('login');

registerBtn.addEventListener('click', () => container.classList.add('active'));
loginBtn.addEventListener('click',    () => container.classList.remove('active'));


// ============================================================
//  Utility
// ============================================================
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function markError(input, errorEl, message) {
    errorEl.textContent = message;
    input.classList.add('input-error');
}

function clearError(input, errorEl) {
    errorEl.textContent = '';
    input.classList.remove('input-error');
}


// ============================================================
//  Caps Lock Detection
// ============================================================
function handleCapsLock(e, warningEl) {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
        warningEl.classList.add('visible');
    } else {
        warningEl.classList.remove('visible');
    }
}

const signupCapslock = document.getElementById('signup-capslock');
const signinCapslock = document.getElementById('signin-capslock');

signupPasswordEl.addEventListener('keyup',   e => handleCapsLock(e, signupCapslock));
signupPasswordEl.addEventListener('keydown', e => handleCapsLock(e, signupCapslock));
signupPasswordEl.addEventListener('blur',    () => signupCapslock.classList.remove('visible'));

signinPassword.addEventListener('keyup',   e => handleCapsLock(e, signinCapslock));
signinPassword.addEventListener('keydown', e => handleCapsLock(e, signinCapslock));
signinPassword.addEventListener('blur',    () => signinCapslock.classList.remove('visible'));


// ============================================================
//  Password Strength Indicator (Sign-Up only)
// ============================================================
const strengthWrapper = document.getElementById('signup-strength-wrapper');
const strengthBar     = document.getElementById('signup-strength-bar');
const strengthLabel   = document.getElementById('signup-strength-label');

function getPasswordStrength(password) {
    if (password.length === 0) return null;
    let score = 0;
    if (password.length >= 8)            score++;
    if (/[A-Z]/.test(password))          score++;
    if (/[0-9]/.test(password))          score++;
    if (/[^A-Za-z0-9]/.test(password))   score++;
    if (score <= 1) return 'weak';
    if (score <= 2) return 'fair';
    return 'strong';
}

function updateStrength(password) {
    const level = getPasswordStrength(password);
    if (!level) {
        strengthWrapper.classList.remove('visible');
        strengthWrapper.className = strengthWrapper.className.replace(/strength-\w+/g, '').trim();
        return;
    }
    strengthWrapper.classList.add('visible');
    strengthWrapper.classList.remove('strength-weak', 'strength-fair', 'strength-strong');
    strengthWrapper.classList.add(`strength-${level}`);
    const labels = { weak: 'Weak', fair: 'Fair', strong: 'Strong' };
    strengthLabel.textContent = labels[level];
}


// ============================================================
//  Character Count
// ============================================================
const signupCharCount = document.getElementById('signup-char-count');
const signinCharCount = document.getElementById('signin-char-count');

function updateCharCount(input, countEl) {
    const len = input.value.length;
    countEl.textContent = len === 0 ? '0 characters' : `${len} character${len === 1 ? '' : 's'}`;
}


// ============================================================
//  Sign-Up Real-Time Validation
// ============================================================
const signupName          = document.getElementById('signup-name');
const signupEmail         = document.getElementById('signup-email');
const signupPasswordInput = document.getElementById('signup-password');

const signupNameError     = document.getElementById('signup-name-error');
const signupEmailError    = document.getElementById('signup-email-error');
const signupPasswordError = document.getElementById('signup-password-error');

signupName.addEventListener('input', () => {
    if (signupName.value.trim() === '') {
        markError(signupName, signupNameError, 'Name is required.');
    } else {
        clearError(signupName, signupNameError);
    }
});

signupEmail.addEventListener('input', () => {
    if (!isValidEmail(signupEmail.value)) {
        markError(signupEmail, signupEmailError, 'Please enter a valid email.');
    } else {
        clearError(signupEmail, signupEmailError);
    }
});

signupPasswordInput.addEventListener('input', () => {
    const val = signupPasswordInput.value;
    updateStrength(val);
    updateCharCount(signupPasswordInput, signupCharCount);
    if (val.length < 6) {
        markError(signupPasswordInput, signupPasswordError, 'Password must be at least 6 characters.');
    } else {
        clearError(signupPasswordInput, signupPasswordError);
    }
});

function validateSignup() {
    let valid = true;
    if (signupName.value.trim() === '') {
        markError(signupName, signupNameError, 'Name is required.');
        valid = false;
    }
    if (!isValidEmail(signupEmail.value)) {
        markError(signupEmail, signupEmailError, 'Please enter a valid email.');
        valid = false;
    }
    if (signupPasswordInput.value.length < 6) {
        markError(signupPasswordInput, signupPasswordError, 'Password must be at least 6 characters.');
        valid = false;
    }
    return valid;
}

document.getElementById('signup-form').addEventListener('submit', e => {
    e.preventDefault();
    if (validateSignup()) {
        // All valid — handle submission here
    }
});


// ============================================================
//  Sign-In Real-Time Validation
// ============================================================
const signinEmail         = document.getElementById('signin-email');
const signinPasswordInput = document.getElementById('signin-password');

const signinEmailError    = document.getElementById('signin-email-error');
const signinPasswordError = document.getElementById('signin-password-error');

signinEmail.addEventListener('input', () => {
    if (!isValidEmail(signinEmail.value)) {
        markError(signinEmail, signinEmailError, 'Please enter a valid email.');
    } else {
        clearError(signinEmail, signinEmailError);
    }
});

signinPasswordInput.addEventListener('input', () => {
    updateCharCount(signinPasswordInput, signinCharCount);
    if (signinPasswordInput.value.trim() === '') {
        markError(signinPasswordInput, signinPasswordError, 'Password is required.');
    } else {
        clearError(signinPasswordInput, signinPasswordError);
    }
});

function validateSignin() {
    let valid = true;
    if (!isValidEmail(signinEmail.value)) {
        markError(signinEmail, signinEmailError, 'Please enter a valid email.');
        valid = false;
    }
    if (signinPasswordInput.value.trim() === '') {
        markError(signinPasswordInput, signinPasswordError, 'Password is required.');
        valid = false;
    }
    return valid;
}

document.getElementById('signin-form').addEventListener('submit', e => {
    e.preventDefault();
    if (validateSignin()) {
        // All valid — handle submission here
    }
});


// ============================================================
//  Remember Me — pre-fill email on load
// ============================================================
const rememberCheckbox = document.getElementById('remember-me');
const savedEmail       = localStorage.getItem('rememberedEmail');

if (savedEmail) {
    signinEmail.value        = savedEmail;
    rememberCheckbox.checked = true;
}

document.getElementById('signin-form').addEventListener('submit', () => {
    if (rememberCheckbox.checked) {
        localStorage.setItem('rememberedEmail', signinEmail.value);
    } else {
        localStorage.removeItem('rememberedEmail');
    }
});