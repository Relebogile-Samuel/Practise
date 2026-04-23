const container = document.querySelector('.container');
const signInBtn = document.getElementById('sign-in');
const signUpBtn = document.getElementById('sign-up');

// --- NAVIGATION TOGGLE ---
signUpBtn.onclick = () => {
    container.classList.add('active'); // Matches most CSS templates
};

signInBtn.onclick = () => {
    container.classList.remove('active');
};

// --- SIGN UP SUBMIT ---
document.querySelector(".signUp").onclick = async () => {
    const data = {
        username: document.getElementById('signup_username').value,
        email: document.getElementById('signup_email').value,
        password: document.getElementById('signup_password').value,
        phone: document.getElementById('signup_phone').value,
        DOB: document.getElementById('signup_dob').value,
        blood_type: document.getElementById('signup_blood_type').value,
        allergies: document.getElementById('signup_allergies').value
    };

    try {
        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        alert(result.message);
        if(response.ok) container.classList.remove('active'); // Switch to login after success
    } catch (err) {
        alert("Server is offline or unreachable.");
    }
};

// --- SIGN IN SUBMIT ---
/* --- SIGN IN LOGIC --- */
document.querySelector(".signIn").onclick = async () => {
    const email = document.getElementById('login_email').value;
    const password = document.getElementById('login_password').value;

    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            // 1. Save user data to browser memory
            localStorage.setItem('currentUser', JSON.stringify(result.user));

            console.log("Login successful! Moving to dashboard...");

            // 2. THIS IS THE REDIRECT - Make sure the file name is exact!
            window.location.href = 'dashboard.html'; 
        } else {
            alert(result.message);
        }
    } catch (err) {
        console.error("Login Error:", err);
        alert("Server is offline or unreachable.");
    }
};