window.onload = () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    // 1. Protection: If not logged in, go back to login page
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // 2. Display all Personal & Medical Info
    document.getElementById('welcome-msg').innerText = `Welcome, ${user.username}!`;
    document.getElementById('user-email-top').innerText = user.email;

    document.getElementById('prof-name').innerText = user.username;
    document.getElementById('prof-email').innerText = user.email;
    document.getElementById('prof-phone').innerText = user.phone || "N/A";
    document.getElementById('prof-blood').innerText = user.bloodType || "Unknown";
    document.getElementById('prof-allergies').innerText = user.allergies || "No allergies reported";

    if (user.dob) {
        document.getElementById('prof-dob').innerText = new Date(user.dob).toLocaleDateString();
    }

    // 3. Vital Chat AI Logic
    const chatIcon = document.getElementById('vital-chat-icon');
    const chatPopup = document.getElementById('chat-popup');
    const closeChat = document.getElementById('close-chat');

    chatIcon.onclick = () => {
        chatPopup.classList.toggle('hidden');
        document.querySelector('.notification-dot').style.display = 'none';
    };
    closeChat.onclick = () => chatPopup.classList.add('hidden');

    // 4. Logout
    document.getElementById('logout').onclick = () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    };
};
const foodUpload = document.getElementById('food-upload');
const resultArea = document.getElementById('analysis-result');
const dropZone = document.getElementById('drop-zone');

foodUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Show the user their photo immediately
    const reader = new FileReader();
    reader.onload = function(event) {
        document.getElementById('preview-img').src = event.target.result;
        
        // Hide upload UI, show result UI
        dropZone.style.display = 'none';
        resultArea.classList.remove('hidden');
        
        // 2. Run the "Showcase" Simulation
        runMockAnalysis();
    };
    reader.readAsDataURL(file);
});

function runMockAnalysis() {
    const spinner = document.getElementById('spinner');
    const summaryData = document.getElementById('summary-data');
    
    spinner.style.display = 'block';
    summaryData.classList.add('hidden');

    // Simulate the "Thinking" time of an AI model
    setTimeout(() => {
        spinner.style.display = 'none';
        summaryData.classList.remove('hidden');

        // Logic for the prototype summary
        const results = [
            { food: "Beef Steak", iron: "3.5mg", tip: "Great choice! Pair with Vitamin C for better absorption." },
            { food: "Boiled Spinach", iron: "2.7mg", tip: "High in iron, but contains oxalates. Cooking helps!" },
            { food: "Chicken Breast", iron: "1.0mg", tip: "Lean protein, but moderate iron content." }
        ];

        const randomResult = results[Math.floor(Math.random() * results.length)];
        
        document.getElementById('detected-food').innerText = `Detected: ${randomResult.food}`;
        document.getElementById('iron-amount').innerText = randomResult.iron;
        document.querySelector('.advice').innerText = `💡 ${randomResult.tip}`;
        
    }, 3000); // 3-second delay to make it feel "intelligent"
}
