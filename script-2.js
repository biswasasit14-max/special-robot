// ===== CONFIGURATION ZONE =====
// Change weather here: "clear", "partial", "thunder", or "tempestas_innavigabilis"
const WEATHER = "tempestas-innavigabilis"; // CHANGE THIS VALUE

// Define your destinations here
// To add more destinations, simply add more objects to this array
const DESTINATIONS = [
    { name: "Home", url: "status.html" },
    { name: "Dashboard", url: "dashboard.html" },
    { name: "Analytics", url: "analytics.html" },
    { name: "Security", url: "security.html" },
    { name: "Settings", url: "#settings" }
    // ADD MORE DESTINATIONS LIKE THIS:
    // { name: "Your Page Name", url: "#your-url" },
    // { name: "Another Page", url: "#another-page" },
];
// ==============================

const ocean = document.getElementById('ocean');
const boat = document.getElementById('boat');
const harborContainer = document.getElementById('harbor-container');
const rain = document.getElementById('rain');
const lightningBolt = document.getElementById('lightning-bolt');
const weatherDisplay = document.getElementById('current-weather');
const weatherIcon = document.getElementById('weather-icon');
const statusDisplay = document.getElementById('boat-status');
const linkNav = document.getElementById('link-nav');
const distanceDisplay = document.getElementById('distance-display');
const integrityFill = document.getElementById('integrity-fill');
const integrityPercentage = document.getElementById('integrity-percentage');
const splashContainer = document.getElementById('splash-container');
const gameOver = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');

let boatPosition = 100;
let containerOffset = 0;
let isMoving = false;
let moveDirection = 0;
let rippleOffset = 0;
let harbors = [];
let lightningStrikeChance = 0;
let totalDistance = 0;
let boatIntegrity = 100;
let isGameOver = false;

// Weather effects
const weatherEffects = {
    clear: { 
        speed: 3, 
        distanceMultiplier: 1, 
        rain: false, 
        thunder: false, 
        disabled: false,
        bobIntensity: 8,
        lightningStrike: false,
        displayName: "Clear",
        icon: "☀️",
        damagePerStrike: 0
    },
    partial: { 
        speed: 2, 
        distanceMultiplier: 1.275, 
        rain: true, 
        thunder: false, 
        disabled: false,
        bobIntensity: 15,
        lightningStrike: false,
        displayName: "Partial (Rainy)",
        icon: "🌧️",
        damagePerStrike: 0
    },
    thunder: { 
        speed: 1.5, 
        distanceMultiplier: 1.35, 
        rain: true, 
        thunder: true, 
        disabled: true,
        bobIntensity: 25,
        lightningStrike: true,
        displayName: "Thunder Storm",
        icon: "⛈️",
        damagePerStrike: 7 // 5-10% damage
    },
    tempestas_innavigabilis: { 
        speed: 1, 
        distanceMultiplier: 1.5, 
        rain: true, 
        thunder: true, 
        disabled: true,
        bobIntensity: 40,
        lightningStrike: true,
        displayName: "Tempestas Innavigabilis",
        icon: "🌪️",
        damagePerStrike: 12 // 10-15% damage
    }
};

const currentWeather = weatherEffects[WEATHER] || weatherEffects.clear;
const screenWidth = window.innerWidth;

// Setup weather
weatherDisplay.textContent = currentWeather.displayName;
weatherIcon.textContent = currentWeather.icon;

if (currentWeather.rain) {
    rain.style.display = 'block';
    const dropCount = WEATHER === 'tempestas_innavigabilis' ? 150 : 100;
    for (let i = 0; i < dropCount; i++) {
        const drop = document.createElement('div');
        drop.className = 'raindrop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
        drop.style.animationDelay = Math.random() * 2 + 's';
        rain.appendChild(drop);
    }
}

// Lightning strike mechanic
if (currentWeather.lightningStrike) {
    lightningStrikeChance = WEATHER === 'tempestas_innavigabilis' ? 0.004 : 0.002;
}

// Generate harbors
const baseDistance = 600;
let currentX = 400;

DESTINATIONS.forEach((dest, index) => {
    const distance = baseDistance * currentWeather.distanceMultiplier;
    currentX += distance;

    const harbor = document.createElement('div');
    harbor.className = 'harbor';
    if (currentWeather.disabled) {
        harbor.classList.add('disabled');
    }
    harbor.style.left = currentX + 'px';
    
    const structure = document.createElement('div');
    structure.className = 'harbor-structure';
    
    const roof = document.createElement('div');
    roof.className = 'harbor-roof';
    
    const label = document.createElement('div');
    label.className = 'harbor-label';
    label.textContent = currentWeather.disabled ? `${dest.name} (Closed)` : dest.name;
    
    structure.appendChild(roof);
    harbor.appendChild(structure);
    harbor.appendChild(label);
    harborContainer.appendChild(harbor);

    harbor.addEventListener('click', () => {
        if (!currentWeather.disabled && !isGameOver) {
            window.location.href = dest.url;
        }
    });

    harbors.push({ element: harbor, x: currentX, destination: dest });
});

// Calculate total distance
totalDistance = harbors[harbors.length - 1].x;

// Update distance meter
function updateDistanceMeter() {
    const distanceToEnd = totalDistance + containerOffset;
    const distanceInKm = Math.max(0, Math.round(distanceToEnd / 10));
    distanceDisplay.textContent = distanceInKm + " km";
}

// Update boat integrity display
function updateBoatIntegrity() {
    integrityFill.style.width = boatIntegrity + '%';
    integrityPercentage.textContent = Math.round(boatIntegrity) + '%';
    
    // Update colors based on integrity
    integrityFill.classList.remove('damaged', 'critical');
    integrityPercentage.classList.remove('damaged', 'critical');
    
    if (boatIntegrity <= 30) {
        integrityFill.classList.add('critical');
        integrityPercentage.classList.add('critical');
    } else if (boatIntegrity <= 60) {
        integrityFill.classList.add('damaged');
        integrityPercentage.classList.add('damaged');
    }
    
    // Update damage overlay opacity
    const damageOverlay = boat.querySelector('.damage-overlay');
    damageOverlay.style.opacity = (100 - boatIntegrity) / 100;
}

// Lightning strike function
function strikeBoat() {
    if (isGameOver) return;
    
    // Position lightning bolt above boat
    const boatRect = boat.getBoundingClientRect();
    lightningBolt.style.left = (boatRect.left + boatRect.width / 2 - 25) + 'px';
    lightningBolt.style.top = (boatRect.top - 100) + 'px';
    lightningBolt.style.display = 'block';
    
    // Create flash effect
    const flash = document.createElement('div');
    flash.className = 'flash';
    ocean.appendChild(flash);
    setTimeout(() => flash.remove(), 200);
    
    // Hide lightning after animation
    setTimeout(() => {
        lightningBolt.style.display = 'none';
    }, 400);
    
    // Apply damage
    const damageAmount = currentWeather.damagePerStrike + Math.random() * 3;
    boatIntegrity = Math.max(0, boatIntegrity - damageAmount);
    updateBoatIntegrity();
    
    // Push boat back
    const pushBackAmount = WEATHER === 'tempestas_innavigabilis' ? 300 : 200;
    containerOffset += pushBackAmount;
    
    // Check if boat is destroyed
    if (boatIntegrity <= 0) {
        sinkBoat();
    }
}

// Sink boat function
function sinkBoat() {
    isGameOver = true;
    isMoving = false;
    moveDirection = 0;
    statusDisplay.textContent = 'SINKING!';
    
    // Start sinking animation
    boat.classList.add('sinking');
    
    // Show splash after a delay
    setTimeout(() => {
        splashContainer.style.display = 'block';
        setTimeout(() => {
            splashContainer.style.display = 'none';
        }, 1000);
    }, 1000);
    
    // Show game over screen
    setTimeout(() => {
        gameOver.classList.remove('hidden');
    }, 2500);
}

// Restart game
restartBtn.addEventListener('click', () => {
    location.reload();
});

updateDistanceMeter();
updateBoatIntegrity();

// Generate quick navigation links
DESTINATIONS.forEach(dest => {
    const link = document.createElement('a');
    link.href = dest.url;
    link.textContent = dest.name;
    if (currentWeather.disabled) {
        link.classList.add('disabled');
    }
    linkNav.appendChild(link);
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (isGameOver) return;
    
    if (e.key === 'ArrowRight') {
        moveDirection = 1;
        isMoving = true;
        statusDisplay.textContent = 'Moving Forward';
    } else if (e.key === 'ArrowLeft') {
        moveDirection = -1;
        isMoving = true;
        statusDisplay.textContent = 'Moving Backward';
    } else if (e.key === ' ') {
        e.preventDefault();
        isMoving = false;
        moveDirection = 0;
        statusDisplay.textContent = 'Stopped';
    }
});

// Animation loop
function animate() {
    if (isMoving && !isGameOver) {
        // Check for lightning strike
        if (currentWeather.lightningStrike && Math.random() < lightningStrikeChance) {
            strikeBoat();
            isMoving = false;
            moveDirection = 0;
            statusDisplay.textContent = 'Struck by Lightning!';
            
            setTimeout(() => {
                if (!isGameOver) {
                    statusDisplay.textContent = 'Stopped';
                }
            }, 2000);
        }

        // Move the harbor container (background) in opposite direction
        containerOffset -= moveDirection * currentWeather.speed;
        
        // Set bounds for container movement
        const maxOffset = 0;
        const minOffset = -(harbors[harbors.length - 1].x + 500);
        
        if (containerOffset > maxOffset) containerOffset = maxOffset;
        if (containerOffset < minOffset) containerOffset = minOffset;
        
        harborContainer.style.transform = `translateX(${containerOffset}px)`;

        // Update distance meter
        updateDistanceMeter();

        // Ripple effect on boat - intensity varies by weather
        rippleOffset += 0.1;
        const ripple = Math.sin(rippleOffset) * currentWeather.bobIntensity;
        const baseBottom = window.innerWidth <= 768 ? 60 : 80;
        boat.style.bottom = (baseBottom + ripple) + 'px';

        // Check proximity to harbors
        harbors.forEach(harbor => {
            const harborScreenPos = harbor.x + containerOffset;
            const distance = Math.abs(harborScreenPos - boatPosition);
            
            if (distance < 100) {
                harbor.element.style.transform = 'scale(1.2)';
            } else {
                harbor.element.style.transform = 'scale(1)';
            }
        });
    }

    requestAnimationFrame(animate);
}

animate();
