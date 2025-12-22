// ===== CONFIGURATION ZONE =====
// Weather will be selected by user on page load via modal

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

// DOM Elements
const ocean = document.getElementById('ocean');
const boat = document.getElementById('boat');
const harborContainer = document.getElementById('harbor-container');
const rain = document.getElementById('rain');
const lightningBolt = document.getElementById('lightning-bolt');
const weatherDisplay = document.getElementById('current-weather');
const weatherIcon = document.getElementById('weather-icon');
const statusDisplay = document.getElementById('boat-status');
const speedDisplay = document.getElementById('speed-display');
const linkNav = document.getElementById('link-nav');
const distanceDisplay = document.getElementById('distance-display');
const integrityFill = document.getElementById('integrity-fill');
const integrityPercentage = document.getElementById('integrity-percentage');
const splashContainer = document.getElementById('splash-container');
const gameOver = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');
const weatherModal = document.getElementById('weather-modal');

// On-screen control buttons
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');
const btnStop = document.getElementById('btn-stop');
const btnEnter = document.getElementById('btn-enter');

// Game state variables
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
let selectedWeather = null;
let speedMultiplier = 1;
let lastKeyPressTime = 0;
let lastKeyPressed = null;
const DOUBLE_TAP_THRESHOLD = 300; // milliseconds

// Weather effects configuration
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
        distanceMultiplier: 1.4, // +40%
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
        distanceMultiplier: 1.9, // +90%
        rain: true, 
        thunder: true, 
        disabled: true,
        bobIntensity: 25,
        lightningStrike: true,
        displayName: "Thunder Storm",
        icon: "⛈️",
        damagePerStrike: 7 // 5-10% damage
    },
    tempest: { 
        speed: 1, 
        distanceMultiplier: 2.5, // +150%
        rain: true, 
        thunder: true, 
        disabled: true,
        bobIntensity: 40,
        lightningStrike: true,
        displayName: "Tempest",
        icon: "🌪️",
        damagePerStrike: 12 // 10-15% damage
    }
};

// Weather selection modal handlers
document.querySelectorAll('.weather-option').forEach(option => {
    option.addEventListener('click', () => {
        const weather = option.getAttribute('data-weather');
        startGame(weather);
    });
});

// Start game with selected weather
function startGame(weather) {
    selectedWeather = weather;
    const currentWeather = weatherEffects[selectedWeather];
    
    // Hide modal
    weatherModal.classList.add('hidden');
    
    // Setup weather display
    weatherDisplay.textContent = currentWeather.displayName;
    weatherIcon.textContent = currentWeather.icon;
    
    // Setup rain
    if (currentWeather.rain) {
        rain.style.display = 'block';
        const dropCount = selectedWeather === 'tempest' ? 150 : 100;
        for (let i = 0; i < dropCount; i++) {
            const drop = document.createElement('div');
            drop.className = 'raindrop';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
            drop.style.animationDelay = Math.random() * 2 + 's';
            rain.appendChild(drop);
        }
    }
    
    // Setup lightning strike chance
    if (currentWeather.lightningStrike) {
        lightningStrikeChance = selectedWeather === 'tempest' ? 0.004 : 0.002;
    }
    
    // Generate harbors
    generateHarbors(currentWeather);
    
    // Generate navigation links
    generateNavigationLinks(currentWeather);
    
    // Initialize displays
    updateDistanceMeter();
    updateBoatIntegrity();
    updateSpeedDisplay();
    
    // Start animation loop
    animate();
}

// Generate harbors based on weather
function generateHarbors(currentWeather) {
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
}

// Generate quick navigation links
function generateNavigationLinks(currentWeather) {
    DESTINATIONS.forEach(dest => {
        const link = document.createElement('a');
        link.href = dest.url;
        link.textContent = dest.name;
        if (currentWeather.disabled) {
            link.classList.add('disabled');
        }
        linkNav.appendChild(link);
    });
}

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

// Update speed display
function updateSpeedDisplay() {
    speedDisplay.textContent = speedMultiplier.toFixed(1) + 'x';
}

// Find nearest harbor
function findNearestHarbor() {
    let nearestHarbor = null;
    let minDistance = Infinity;
    
    harbors.forEach(harbor => {
        const harborScreenPos = harbor.x + containerOffset;
        const distance = Math.abs(harborScreenPos - boatPosition);
        
        if (distance < minDistance) {
            minDistance = distance;
            nearestHarbor = harbor;
        }
    });
    
    return { harbor: nearestHarbor, distance: minDistance };
}

// Update harbor proximity indicators
function updateHarborProximity() {
    const { harbor: nearest, distance } = findNearestHarbor();
    
    harbors.forEach(harbor => {
        harbor.element.classList.remove('nearby');
        const harborScreenPos = harbor.x + containerOffset;
        const dist = Math.abs(harborScreenPos - boatPosition);
        
        if (dist < 150) {
            harbor.element.style.transform = 'scale(1.2)';
            if (harbor === nearest && dist < 100) {
                harbor.element.classList.add('nearby');
            }
        } else {
            harbor.element.style.transform = 'scale(1)';
        }
    });
}

// Navigate to nearest harbor
function navigateToNearestHarbor() {
    const currentWeather = weatherEffects[selectedWeather];
    if (currentWeather.disabled || isGameOver) return;
    
    const { harbor: nearest, distance } = findNearestHarbor();
    
    if (nearest && distance < 100) {
        window.location.href = nearest.destination.url;
    }
}

// Lightning strike function
function strikeBoat() {
    if (isGameOver) return;
    
    const currentWeather = weatherEffects[selectedWeather];
    
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
    const pushBackAmount = selectedWeather === 'tempest' ? 300 : 200;
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

// Handle movement with acceleration
function handleMovement(direction, key) {
    if (isGameOver) return;
    
    const currentTime = Date.now();
    const timeSinceLastPress = currentTime - lastKeyPressTime;
    
    // Check for double tap
    if (lastKeyPressed === key && timeSinceLastPress < DOUBLE_TAP_THRESHOLD) {
        speedMultiplier = 1.5; // 50% acceleration
    } else {
        speedMultiplier = 1;
    }
    
    lastKeyPressTime = currentTime;
    lastKeyPressed = key;
    
    moveDirection = direction;
    isMoving = true;
    updateSpeedDisplay();
    statusDisplay.textContent = direction === 1 ? 'Moving Forward' : 'Moving Backward';
}

// Stop movement
function stopMovement() {
    if (isGameOver) return;
    
    isMoving = false;
    moveDirection = 0;
    speedMultiplier = 1;
    updateSpeedDisplay();
    statusDisplay.textContent = 'Stopped';
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (isGameOver || !selectedWeather) return;
    
    if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleMovement(1, 'right');
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleMovement(-1, 'left');
    } else if (e.key === ' ') {
        e.preventDefault();
        stopMovement();
    } else if (e.key === 'Enter') {
        e.preventDefault();
        navigateToNearestHarbor();
    }
});

// On-screen button controls
btnRight.addEventListener('mousedown', () => {
    handleMovement(1, 'right');
    btnRight.classList.add('active');
});

btnRight.addEventListener('mouseup', () => {
    btnRight.classList.remove('active');
});

btnRight.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleMovement(1, 'right');
    btnRight.classList.add('active');
});

btnRight.addEventListener('touchend', (e) => {
    e.preventDefault();
    btnRight.classList.remove('active');
});

btnLeft.addEventListener('mousedown', () => {
    handleMovement(-1, 'left');
    btnLeft.classList.add('active');
});

btnLeft.addEventListener('mouseup', () => {
    btnLeft.classList.remove('active');
});

btnLeft.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleMovement(-1, 'left');
    btnLeft.classList.add('active');
});

btnLeft.addEventListener('touchend', (e) => {
    e.preventDefault();
    btnLeft.classList.remove('active');
});

btnStop.addEventListener('click', () => {
    stopMovement();
});

btnEnter.addEventListener('click', () => {
    navigateToNearestHarbor();
});

// Animation loop
function animate() {
    if (!selectedWeather) return;
    
    const currentWeather = weatherEffects[selectedWeather];
    
    if (isMoving && !isGameOver) {
        // Check for lightning strike
        if (currentWeather.lightningStrike && Math.random() < lightningStrikeChance) {
            strikeBoat();
            isMoving = false;
            moveDirection = 0;
            speedMultiplier = 1;
            updateSpeedDisplay();
            statusDisplay.textContent = 'Struck by Lightning!';
            
            setTimeout(() => {
                if (!isGameOver) {
                    statusDisplay.textContent = 'Stopped';
                }
            }, 2000);
        }

        // Move the harbor container with speed multiplier
        const actualSpeed = currentWeather.speed * speedMultiplier;
        containerOffset -= moveDirection * actualSpeed;
        
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

        // Update harbor proximity
        updateHarborProximity();
    }

    requestAnimationFrame(animate);
}

// Initialize the game (weather modal will be shown automatically)