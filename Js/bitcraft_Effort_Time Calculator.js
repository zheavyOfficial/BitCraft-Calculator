// BitCraft Effort Calculator JavaScript
// Tool power database (exact values from brico.app)
const toolData = {
    0: { common: 8 },
    1: { common: 10 },
    2: { common: 11, uncommon: 14 },
    3: { common: 12, uncommon: 15, rare: 19 },
    4: { common: 13, uncommon: 16, rare: 20, epic: 25 },
    5: { common: 14, uncommon: 17, rare: 21, epic: 26, legendary: 29 },
    6: { common: 15, uncommon: 18, rare: 22, epic: 27, legendary: 30, mythic: 32 },
    7: { common: 16, uncommon: 19, rare: 23, epic: 28, legendary: 31, mythic: 33 },
    8: { common: 17, uncommon: 20, rare: 24, epic: 29, legendary: 32, mythic: 34 },
    9: { common: 18, uncommon: 21, rare: 25, epic: 30, legendary: 33, mythic: 35 },
    10: { common: 19, uncommon: 22, rare: 26, epic: 31, legendary: 34, mythic: 36 }
};

// Food buff data
const foodData = {
    none: { staminaRegen: 0.25, craftingSpeed: 0 },
    plain: { staminaRegen: 7.25, craftingSpeed: 8.2 },
    savory: { staminaRegen: 9.25, craftingSpeed: 8.4 },
    zesty: { staminaRegen: 11.25, craftingSpeed: 8.6 },
    fine: { staminaRegen: 13.25, craftingSpeed: 8.8 },
    succulent: { staminaRegen: 15.25, craftingSpeed: 9.0 },
    ambrosial: { staminaRegen: 17.25, craftingSpeed: 9.2 }
};

let timeoutId;

function getAllValidToolPowers() {
    const validPowers = new Set();
    for (let tier in toolData) {
        for (let rarity in toolData[tier]) {
            validPowers.add(toolData[tier][rarity]);
        }
    }
    return Array.from(validPowers).sort((a, b) => a - b);
}

function findBestMatchingTool(targetPower) {
    let bestMatch = null;
    let smallestDiff = Infinity;
    
    for (let tier in toolData) {
        for (let rarity in toolData[tier]) {
            const power = toolData[tier][rarity];
            const diff = Math.abs(power - targetPower);
            
            if (diff < smallestDiff) {
                smallestDiff = diff;
                bestMatch = { tier: parseInt(tier), rarity, power };
            }
        }
    }
    return bestMatch;
}

function adjustToolPower(inputId, direction) {
    const input = document.getElementById(inputId);
    const currentValue = parseInt(input.value) || 10;
    const validPowers = getAllValidToolPowers();
    
    let currentIndex = validPowers.indexOf(currentValue);
    
    if (currentIndex === -1) {
        const match = findBestMatchingTool(currentValue);
        currentIndex = validPowers.indexOf(match.power);
    }
    
    let newIndex = currentIndex + direction;
    
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= validPowers.length) newIndex = validPowers.length - 1;
    
    const newValue = validPowers[newIndex];
    input.value = newValue;
    
    if (inputId === 'toolPowerManual') {
        updateToolFromPower();
    } else {
        setTimeout(calculateTime, 100);
    }
}

function updateCurrentStamina() {
    const maxStamina = parseInt(document.getElementById('maxStamina').value) || 100;
    document.getElementById('currentStamina').value = maxStamina;
    setTimeout(calculateTime, 100);
}

function adjustValue(inputId, increment) {
    const input = document.getElementById(inputId);
    const currentValue = parseFloat(input.value) || 0;
    let newValue = currentValue + increment;
    
    if (newValue < 0) newValue = 0;
    
    // Special handling for stamina values
    if (inputId === 'currentStamina') {
        const maxStamina = parseInt(document.getElementById('maxStamina').value) || 100;
        if (newValue > maxStamina) newValue = maxStamina;
    }
    
    if (inputId === 'maxStamina') {
        // Update current stamina to match new max
        setTimeout(() => {
            document.getElementById('currentStamina').value = newValue;
        }, 10);
    }
    
    if (inputId.includes('tickTime') || inputId === 'tickTime') {
        newValue = Math.round(newValue * 100) / 100;
    } else {
        newValue = Math.round(newValue);
    }
    
    input.value = newValue;
    
    if (inputId === 'toolPowerManual') {
        updateToolFromPower();
    } else {
        setTimeout(calculateTime, 100);
    }
}

function updateFoodStats() {
    const foodType = document.getElementById('foodType').value;
    const foodStats = foodData[foodType];
    
    document.getElementById('staminaRegen').textContent = 
        `${foodStats.staminaRegen}/s ${foodType === 'none' ? '(base)' : '(+' + (foodStats.staminaRegen - 0.25) + ' from food)'}`;
    
    document.getElementById('craftingSpeed').textContent = 
        foodStats.craftingSpeed > 0 ? `+${foodStats.craftingSpeed}%` : '0%';
    
    setTimeout(calculateTime, 100);
}

function updateToolFromPower() {
    const manualPower = parseFloat(document.getElementById('toolPowerManual').value);
    
    if (!isNaN(manualPower) && manualPower > 0) {
        const match = findBestMatchingTool(manualPower);
        
        if (match) {
            document.getElementById('toolTier').value = match.tier;
            updateToolPower();
            
            setTimeout(() => {
                document.getElementById('toolRarity').value = match.rarity;
                updateToolPower();
                
                const manualInput = document.getElementById('toolPowerManual');
                manualInput.classList.add('manual-power-input');
                
                const actualPower = toolData[match.tier][match.rarity];
                document.getElementById('toolPowerDisplay').textContent = 
                    `Tool: ${actualPower} | Manual: ${manualPower}`;
            }, 50);
        }
        
        setTimeout(calculateTime, 100);
    } else {
        document.getElementById('toolPowerManual').classList.remove('manual-power-input');
        updateToolPower();
    }
}

function updateToolPower() {
    const tier = parseInt(document.getElementById('toolTier').value);
    const raritySelect = document.getElementById('toolRarity');
    const currentRarity = raritySelect.value;
    
    raritySelect.innerHTML = '';
    const availableRarities = Object.keys(toolData[tier]);
    
    availableRarities.forEach(rarity => {
        const option = document.createElement('option');
        option.value = rarity;
        option.textContent = rarity.charAt(0).toUpperCase() + rarity.slice(1);
        raritySelect.appendChild(option);
    });
    
    if (availableRarities.includes(currentRarity)) {
        raritySelect.value = currentRarity;
    } else {
        raritySelect.value = availableRarities[0];
    }
    
    const rarity = raritySelect.value;
    const power = toolData[tier][rarity];
    
    document.getElementById('toolPowerDisplay').textContent = `Power: ${power}`;
    document.getElementById('toolPowerManual').value = power;
    document.getElementById('toolPowerManual').classList.remove('manual-power-input');
        
    setTimeout(calculateTime, 100);
}

function calculateTime() {
    const taskEffort = parseFloat(document.getElementById('taskEffortTool').value);
    const effortDone = parseFloat(document.getElementById('effortDoneTool').value) || 0;
    
    const manualPowerInput = document.getElementById('toolPowerManual');
    const manualPower = parseFloat(manualPowerInput.value);
    
    let toolPower;
    if (!isNaN(manualPower) && manualPower > 0) {
        toolPower = manualPower;
    } else {
        const tier = parseInt(document.getElementById('toolTier').value);
        const rarity = document.getElementById('toolRarity').value;
        toolPower = toolData[tier][rarity];
    }
    
    let tickTime = parseFloat(document.getElementById('tickTimeTool').value);
    
    // Get food type for stamina calculations
    const foodType = document.getElementById('foodType').value;
    
    // Get stamina values
    const maxStamina = parseInt(document.getElementById('maxStamina').value) || 100;
    const currentStamina = parseInt(document.getElementById('currentStamina').value) || 100;
    const staminaRegen = foodData[foodType].staminaRegen;
    
    const resultContainer = document.getElementById('resultContainer');
    const errorContainer = document.getElementById('errorContainer');
    const calculateBtn = document.querySelector('.calculate-btn');
    const breaksLabel = document.getElementById('breaksLabel');
    const breaksResult = document.getElementById('breaksNeeded');
    const foodNeededLine = document.getElementById('foodNeededLine');
    const noFoodWarning = document.getElementById('noFoodWarning');
    
    resultContainer.classList.remove('show');
    errorContainer.style.display = 'none';
    noFoodWarning.style.display = 'none';
    
    calculateBtn.classList.add('calculating');
    setTimeout(() => calculateBtn.classList.remove('calculating'), 500);
    
    if (isNaN(taskEffort) || isNaN(toolPower) || isNaN(tickTime)) {
        showError('Please enter valid numbers for all fields.');
        return;
    }
    
    if (taskEffort <= 0) {
        showError('Task effort must be greater than 0.');
        return;
    }
    
    if (effortDone < 0) {
        showError('Effort done cannot be negative.');
        return;
    }
    
    if (effortDone >= taskEffort) {
        showError('Effort done cannot be greater than or equal to task effort.');
        return;
    }
    
    if (toolPower <= 0) {
        showError('Tool power must be greater than 0.');
        return;
    }
    
    if (tickTime <= 0) {
        showError('Tick time must be greater than 0.');
        return;
    }
    
    const remainingEffort = taskEffort - effortDone;
    const remainingTicks = Math.ceil(remainingEffort / toolPower);
    const baseRemainingSeconds = remainingTicks * tickTime;
    const totalTicksFromStart = Math.ceil(taskEffort / toolPower);
    const baseTotalSeconds = totalTicksFromStart * tickTime;
    const progressPercent = ((effortDone / taskEffort) * 100).toFixed(1);
    
    // Calculate stamina usage and breaks
    const staminaUsed = baseRemainingSeconds; // 1 stamina per second of crafting
    const staminaDeficit = Math.max(0, staminaUsed - currentStamina);
    
    let totalTimeWithBreaks = baseRemainingSeconds;
    let totalBreakTime = 0;
    let breaksNeeded = 0;
    
    if (staminaDeficit > 0) {
        // Calculate how many breaks are needed and total break time
        let remainingStaminaNeeded = staminaDeficit;
        let workTime = currentStamina; // Can work for current stamina seconds
        
        while (remainingStaminaNeeded > 0) {
            breaksNeeded++;
            const staminaToRestore = Math.min(maxStamina, remainingStaminaNeeded);
            const breakTime = staminaToRestore / staminaRegen;
            totalBreakTime += breakTime;
            totalTimeWithBreaks += breakTime;
            
            remainingStaminaNeeded -= maxStamina;
            if (remainingStaminaNeeded > 0) {
                workTime += maxStamina;
            }
        }
    }
    
    // Highlight breaks needed if > 0
    if (breaksNeeded > 0) {
        breaksLabel.parentElement.className = 'result-line result-line-error';
    } else {
        breaksLabel.parentElement.className = 'result-line result-line-large';
    }
    
    // Highlight food needed and show warning if no food
    if (foodType === 'none') {
        foodNeededLine.className = 'result-line result-line-error';
        noFoodWarning.style.display = 'block';
    } else {
        foodNeededLine.className = 'result-line result-line-error'; // Always red when food is active
    }
    
    const remainingTimeFormatted = formatTime(baseRemainingSeconds);
    const totalTimeFormatted = formatTime(baseTotalSeconds);
    const totalTimeWithBreaksFormatted = formatTime(totalTimeWithBreaks);
    const totalBreakTimeFormatted = formatTime(totalBreakTime);
    
    // Calculate food consumptions needed (30 min duration each)
    let foodConsumptions = 0;
    if (foodType !== 'none') {
        const totalTimeMinutes = totalTimeWithBreaks / 60;
        foodConsumptions = Math.ceil(totalTimeMinutes / 30);
    }
    
    setTimeout(() => {
        document.getElementById('resultValue').textContent = totalTimeWithBreaksFormatted;
        document.getElementById('remainingEffort').textContent = remainingEffort.toLocaleString();
        document.getElementById('remainingTicks').textContent = remainingTicks.toLocaleString();
        document.getElementById('totalTimeFromStart').textContent = totalTimeFormatted;
        document.getElementById('progressPercent').textContent = progressPercent + '%';
        document.getElementById('staminaUsage').textContent = Math.ceil(staminaUsed) + ' stamina';
        document.getElementById('breaksNeeded').textContent = breaksNeeded + (breaksNeeded === 1 ? ' break' : ' breaks');
        document.getElementById('totalBreakTime').textContent = totalBreakTime > 0 ? totalBreakTimeFormatted : 'None';
        document.getElementById('regenRateDisplay').textContent = staminaRegen.toFixed(2) + '/s';
        document.getElementById('foodConsumptions').textContent = foodType === 'none' ? 'None' : foodConsumptions + (foodConsumptions === 1 ? ' meal' : ' meals');
        
        resultContainer.classList.add('show');
    }, 300);
}

function formatTime(seconds) {
    if (seconds < 60) {
        return seconds.toFixed(2) + ' seconds';
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        return `${minutes}m ${remainingSeconds}s`;
    } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        const remainingMinutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${remainingMinutes}m`;
    } else {
        const days = Math.floor(seconds / 86400);
        const remainingHours = Math.floor((seconds % 86400) / 3600);
        return `${days}d ${remainingHours}h`;
    }
}

function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.innerHTML = `<div class="error-message">${message}</div>`;
    errorContainer.style.display = 'block';
    
    setTimeout(() => {
        errorContainer.style.display = 'none';
    }, 5000);
}

// Event listeners
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculateTime();
    }
});

const inputs = document.querySelectorAll('.input-field');
inputs.forEach(input => {
    input.addEventListener('input', function() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            if (document.getElementById('taskEffortTool').value) {
                calculateTime();
            }
        }, 500);
    });
});

window.addEventListener('load', function() {
    updateToolPower();
    updateFoodStats();
    setTimeout(calculateTime, 500);
});