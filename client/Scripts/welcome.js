// Particles.js configuration
const particlesConfig = {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#4cc9f0" },
        shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#4cc9f0", opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2, direction: "none" }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "grab" },
            onclick: { enable: true, mode: "push" },
            resize: true
        },
        modes: {
            grab: { distance: 140, line_linked: { opacity: 1 } },
            push: { particles_nb: 4 }
        }
    },
    retina_detect: true
};

// Initialize welcome screen
function initWelcomeScreen() {
    fetch('Components/welcome.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('welcome-screen').innerHTML = html;
            particlesJS("particles-js", particlesConfig);
            
            document.getElementById('enter-gaia-btn').addEventListener('click', () => {
                localStorage.setItem('gaiaEntered', 'true');
                loadMainApp();
            });
        });
}

// Load main application
function loadMainApp() {
    fetch('Components/main.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('main-app').innerHTML = html;
            document.getElementById('welcome-screen').style.display = 'none';
            document.getElementById('main-app').style.display = 'block';
            
            // Load main app styles and scripts
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'Styles/main.css';
            document.head.appendChild(link);
            
            const script = document.createElement('script');
            script.src = 'Scripts/main.js';
            document.body.appendChild(script);
        });
}

// Check if user already entered Gaia
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('gaiaEntered')) {
        loadMainApp();
    } else {
        initWelcomeScreen();
    }
});