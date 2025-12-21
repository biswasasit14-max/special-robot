<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ocean Cruise Navigation</title>
    <link rel="stylesheet" href="styles.css">
    <script src="script.js" defer></script>
</head>
<body>
    <div id="ocean">
        <div class="wave"></div>
        <div class="wave"></div>
        
        <div class="rain" id="rain"></div>
        
        <div id="harbor-container">
            <!-- Harbor destinations will be generated here -->
        </div>

        <div id="boat">
            <div class="sail"></div>
            <div class="boat-deck"></div>
            <div class="boat-body"></div>
            <div class="damage-overlay"></div>
        </div>

        <!-- Lightning bolt SVG -->
        <svg id="lightning-bolt" class="lightning-bolt" viewBox="0 0 50 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M25 0 L15 40 L30 40 L20 100 L40 45 L28 45 Z" fill="#FFD700" stroke="#FFF" stroke-width="1"/>
        </svg>
    </div>

    <div id="distance-meter">
        <div class="label">Distance to Final Destination</div>
        <div class="distance" id="distance-display">0 km</div>
    </div>

    <div id="boat-integrity">
        <div class="label">⚓ Boat Integrity</div>
        <div class="integrity-bar">
            <div class="integrity-fill" id="integrity-fill"></div>
        </div>
        <div class="percentage" id="integrity-percentage">100%</div>
    </div>

    <div id="controls">
        <strong>🎮 Controls</strong><br>
        <span class="control-key">→</span> Move Forward<br>
        <span class="control-key">←</span> Move Backward<br>
        <span class="control-key">Space</span> Stop<br>
        <span class="control-key">Click</span> Navigate to Harbor
    </div>

    <div id="weather-info">
        <div class="weather-header">
            <span class="weather-icon" id="weather-icon">☀️</span>
            <strong>Weather:</strong> <span id="current-weather">Clear</span>
        </div>
        <strong>Status:</strong> <span id="boat-status">Stopped</span>
    </div>

    <div id="link-nav">
        <strong style="color: white; display: block; margin-bottom: 10px;">📍 Quick Navigation</strong>
        <!-- Links will be generated here -->
    </div>

    <!-- Splash animation for sinking -->
    <div id="splash-container">
        <div class="splash splash-1"></div>
        <div class="splash splash-2"></div>
        <div class="splash splash-3"></div>
    </div>

    <!-- Game Over overlay -->
    <div id="game-over" class="hidden">
        <div class="game-over-content">
            <h1>🌊 BOAT SUNK! 🌊</h1>
            <p>Your vessel has succumbed to the storm's fury...</p>
            <button id="restart-btn">⚓ Restart Journey</button>
        </div>
    </div>
</body>
</html>
