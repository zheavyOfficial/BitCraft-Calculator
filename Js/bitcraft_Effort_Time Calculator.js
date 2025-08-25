// BitCraft Effort Calculator JavaScript - Updated
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
let currentMode = 'crafting'; // 'crafting' or 'gathering'
let isUpdatingSlider = false; // Guard against recursive updates

// State Persistence Functions - Shared namespace
function saveState() {
    try {
        // Get existing shared state
        const sharedState = JSON.parse(localStorage.getItem('bcState.v1') || '{}');
        
        // Update effort calculator state
        sharedState.time = {
            taskEffortTool: document.getElementById('taskEffortTool')?.value || '10000',
            effortDoneTool: document.getElementById('effortDoneTool')?.value || '0',
            tickTimeTool: document.getElementById('tickTimeTool')?.value || '1.6',
            toolTier: document.getElementById('toolTier')?.value || '1',
            toolRarity: document.getElementById('toolRarity')?.value || 'common',
            toolPowerSlider: document.getElementById('toolPowerSlider')?.value || '1',
            toolPowerManual: document.getElementById('toolPowerManual')?.value || '',
            maxStamina: document.getElementById('maxStamina')?.value || '100',
            currentStamina: document.getElementById('currentStamina')?.value || '100',
            foodType: document.getElementById('foodType')?.value || 'none',
            mode: currentMode
        };
        
        // Save updated shared state
        localStorage.setItem('bcState.v1', JSON.stringify(sharedState));
    } catch (error) {
        console.error('Error saving state:', error);
    }
}

function loadState() {
    try {
        const sharedState = JSON.parse(localStorage.getItem('bcState.v1') || '{}');
        const state = sharedState.time;
        
        if (state) {
            // Restore values
            if (document.getElementById('taskEffortTool')) document.getElementById('taskEffortTool').value = state.taskEffortTool || '10000';
            if (document.getElementById('effortDoneTool')) document.getElementById('effortDoneTool').value = state.effortDoneTool || '0';
            if (document.getElementById('tickTimeTool')) document.getElementById('tickTimeTool').value = state.tickTimeTool || '1.6';
            if (document.getElementById('toolTier')) document.getElementById('toolTier').value = state.toolTier || '1';
            if (document.getElementById('toolRarity')) document.getElementById('toolRarity').value = state.toolRarity || 'common';
            if (document.getElementById('toolPowerSlider')) document.getElementById('toolPowerSlider').value = state.toolPowerSlider || '1';
            if (document.getElementById('toolPowerManual') && state.toolPowerManual) document.getElementById('toolPowerManual').value = state.toolPowerManual;
            if (document.getElementById('maxStamina')) document.getElementById('maxStamina').value = state.maxStamina || '100';
            if (document.getElementById('currentStamina')) document.getElementById('currentStamina').value = state.currentStamina || '100';
            if (document.getElementById('foodType')) document.getElementById('foodType').value = state.foodType || 'none';
            
            // Restore mode
            if (state.mode && state.mode !== currentMode) {
                setMode(state.mode);
            }
        }
    } catch (error) {
        console.error('Error loading state:', error);
    }
}

function resetToDefaults() {
    try {
        // Clear only this page's state from shared storage
        const sharedState = JSON.parse(localStorage.getItem('bcState.v1') || '{}');
        delete sharedState.time;
        localStorage.setItem('bcState.v1', JSON.stringify(sharedState));
    } catch (error) {
        console.error('Error clearing page state:', error);
    }
    
    // Reset to default values
    if (document.getElementById('taskEffortTool')) document.getElementById('taskEffortTool').value = '10000';
    if (document.getElementById('effortDoneTool')) document.getElementById('effortDoneTool').value = '0';
    if (document.getElementById('tickTimeTool')) document.getElementById('tickTimeTool').value = '1.6';
    if (document.getElementById('toolTier')) document.getElementById('toolTier').value = '1';
    if (document.getElementById('toolRarity')) document.getElementById('toolRarity').value = 'common';
    if (document.getElementById('maxStamina')) document.getElementById('maxStamina').value = '100';
    if (document.getElementById('currentStamina')) document.getElementById('currentStamina').value = '100';
    if (document.getElementById('foodType')) document.getElementById('foodType').value = 'none';
    
    setMode('crafting');
    updateToolPower();
    updateFoodStats();
    
    // Calculate once after reset
    setTimeout(calculateTime, 100);
}


// Mode Toggle Function
function setMode(mode) {
    currentMode = mode;
    const craftingBtn = document.getElementById('craftingMode');
    const gatheringBtn = document.getElementById('gatheringMode');
    const effortLabel = document.getElementById('effortLabel');
    
    if (mode === 'crafting') {
        craftingBtn.classList.add('active');
        gatheringBtn.classList.remove('active');
        effortLabel.textContent = 'Effort Completed';
    } else {
        gatheringBtn.classList.add('active');
        craftingBtn.classList.remove('active');
        effortLabel.textContent = 'Effort Remaining';
    }
    
    setTimeout(calculateTime, 100);
}

function getAllValidToolPowers() {
    const validPowers = new Set();
    for (let tier in toolData) {
        for (let rarity in toolData[tier]) {
            validPowers.add(toolData[tier][rarity]);
        }
    }
    return Array.from(validPowers).sort((a, b) => a - b);
}

function updateFromSlider() {
    if (isUpdatingSlider) return; // Prevent recursive updates
    
    const slider = document.getElementById('toolPowerSlider');
    const sliderValue = parseInt(slider.value);
    const validPowers = getAllValidToolPowers();
    
    // Guard against invalid slider values
    if (sliderValue < 0 || sliderValue >= validPowers.length) {
        console.warn('Invalid slider value:', sliderValue);
        return;
    }
    
    const actualPower = validPowers[sliderValue];
    if (!actualPower) {
        console.warn('No valid power found for slider value:', sliderValue);
        return;
    }
    
    document.getElementById('sliderValueDisplay').textContent = actualPower;
    document.getElementById('toolPowerManual').value = actualPower;
    document.getElementById('toolPowerManual').classList.add('manual-power-input');
    
    // Update dropdowns to match closest tool (with guard)
    isUpdatingSlider = true;
    const match = findBestMatchingTool(actualPower);
    if (match && match.power === actualPower) {
        document.getElementById('toolTier').value = match.tier;
        document.getElementById('toolRarity').value = match.rarity;
        document.getElementById('toolPowerDisplay').textContent = `Power: ${actualPower}`;
    }
    isUpdatingSlider = false;
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
        updateToolPower();
    }
}

function updateCurrentStamina() {
    const maxStamina = parseInt(document.getElementById('maxStamina').value) || 100;
    document.getElementById('currentStamina').value = maxStamina;
    setTimeout(calculateTime, 100);
}

function validateTaskEffort() {
    const taskEffortInput = document.getElementById('taskEffortTool');
    const effortCompletedInput = document.getElementById('effortDoneTool');
    
    const taskEffort = parseInt(taskEffortInput.value) || 0;
    const effortCompleted = parseInt(effortCompletedInput.value) || 0;
    
    // Ensure effort completed doesn't exceed task effort
    if (effortCompleted > taskEffort) {
        effortCompletedInput.value = taskEffort;
    }
    
    setTimeout(calculateTime, 100);
}

function validateEffortCompleted() {
    const taskEffortInput = document.getElementById('taskEffortTool');
    const effortCompletedInput = document.getElementById('effortDoneTool');
    
    const taskEffort = parseInt(taskEffortInput.value) || 0;
    let effortCompleted = parseInt(effortCompletedInput.value) || 0;
    
    // Ensure effort completed doesn't exceed task effort
    if (effortCompleted > taskEffort) {
        effortCompleted = taskEffort;
        effortCompletedInput.value = taskEffort;
    }
    
    // Ensure effort completed is non-negative
    if (effortCompleted < 0) {
        effortCompletedInput.value = 0;
    }
    
    setTimeout(calculateTime, 100);
}

function adjustValue(inputId, increment) {
    const input = document.getElementById(inputId);
    const currentValue = parseFloat(input.value) || 0;
    let newValue = currentValue + increment;
    
    if (newValue < 0) newValue = 0;
    
    // Special handling for effort values - prevent exceeding task effort
    if (inputId === 'effortDoneTool') {
        const taskEffort = parseInt(document.getElementById('taskEffortTool').value) || 0;
        if (newValue > taskEffort) newValue = taskEffort;
    }
    
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
    
    // Save state after value change
    saveState();
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
    if (isUpdatingSlider) return; // Prevent recursive updates
    
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
    
    // Update slider to match the power (with guard)
    isUpdatingSlider = true;
    const validPowers = getAllValidToolPowers();
    const sliderIndex = validPowers.indexOf(power);
    if (sliderIndex !== -1) {
        document.getElementById('toolPowerSlider').value = sliderIndex;
        document.getElementById('sliderValueDisplay').textContent = power;
    }
    isUpdatingSlider = false;
    
    setTimeout(calculateTime, 100);
}

function calculateTime() {
    // Always show results container
    const resultContainer = document.getElementById('resultContainer');
    if (resultContainer) {
        resultContainer.classList.add('show');
    }
    
    const taskEffort = parseFloat(document.getElementById('taskEffortTool').value);
    let effortDone = parseFloat(document.getElementById('effortDoneTool').value) || 0;
    
    // Adjust for gathering mode
    if (currentMode === 'gathering') {
        // In gathering mode, the input is "effort remaining"
        // Edge case: if effort remaining = 0, treat it as max effort remaining
        if (effortDone === 0) {
            effortDone = 0; // No effort done (full task remaining)
        } else {
            effortDone = taskEffort - effortDone; // Convert remaining to done
        }
    }
    
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
    
    const container = document.getElementById('resultContainer');
    const errorContainer = document.getElementById('errorContainer');
    const calculateBtn = document.querySelector('.calculate-btn-compact');
    const breaksLabel = document.getElementById('breaksLabel');
    const breaksResult = document.getElementById('breaksNeeded');
    const foodNeededLine = document.getElementById('foodNeededLine');
    const noFoodWarning = document.getElementById('noFoodWarning');
    
    container.classList.remove('show');
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
        showError('Effort values cannot be negative.');
        return;
    }
    
    if (effortDone >= taskEffort) {
        showError('Task is already complete!');
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
        foodNeededLine.className = 'result-line result-line-error';
    }
    
    const remainingTimeFormatted = formatTime(baseRemainingSeconds);
    const totalTimeFormatted = formatTime(baseTotalSeconds);
    const totalTimeWithBreaksFormatted = formatTime(totalTimeWithBreaks);
    const totalBreakTimeFormatted = formatTime(totalBreakTime);
    
    // Calculate initial time with breaks (from start)
    let initialTimeWithBreaks = baseTotalSeconds;
    let initialBreakTime = 0;
    let initialBreaksNeeded = 0;
    
    if (baseTotalSeconds > maxStamina) {
        let staminaNeededForFull = baseTotalSeconds;
        let remainingStaminaForFull = staminaNeededForFull - maxStamina;
        
        while (remainingStaminaForFull > 0) {
            initialBreaksNeeded++;
            const staminaToRestore = Math.min(maxStamina, remainingStaminaForFull);
            const breakTime = staminaToRestore / staminaRegen;
            initialBreakTime += breakTime;
            initialTimeWithBreaks += breakTime;
            remainingStaminaForFull -= maxStamina;
        }
    }
    
    // Calculate food consumptions needed (30 min duration each)
    let foodConsumptions = 0;
    if (foodType !== 'none') {
        const totalTimeMinutes = totalTimeWithBreaks / 60;
        foodConsumptions = Math.ceil(totalTimeMinutes / 30);
    }
    
    // Show/hide secondary time display based on progress
    const initialTimeDisplay = document.getElementById('initialTimeDisplay');
    const initialTimeValue = document.getElementById('initialTimeValue');
    
    if (effortDone > 0) {
        initialTimeDisplay.style.display = 'block';
        initialTimeValue.textContent = formatTime(initialTimeWithBreaks);
    } else {
        initialTimeDisplay.style.display = 'none';
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
        
        container.classList.add('show');
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

// Event listeners - auto-calculate on input changes
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
            calculateTime();
        }, 300);
    });
});

window.addEventListener('load', function() {
    
    // Initialize slider with correct max value
    const validPowers = getAllValidToolPowers();
    const sliderElement = document.getElementById('toolPowerSlider');
    if (sliderElement && validPowers.length > 0) {
        sliderElement.max = validPowers.length - 1;
        const safeIndex = Math.min(1, validPowers.length - 1);
        sliderElement.value = safeIndex; // Start with safe index
        document.getElementById('sliderValueDisplay').textContent = validPowers[safeIndex] || validPowers[0];
    }
    
    // Load saved state
    loadState();
    
    updateToolPower();
    updateFoodStats();
    
    // Run initial calculation to show results immediately
    setTimeout(calculateTime, 200);
    
    // Add event listeners for saving state only (no auto-calculation)
    const slider = document.getElementById('toolPowerSlider');
    if (slider) {
        // Set correct max value based on actual valid powers
        const validPowers = getAllValidToolPowers();
        slider.max = validPowers.length - 1;
        
        slider.addEventListener('input', function() {
            updateFromSlider();
            saveState();
            setTimeout(calculateTime, 100);
        });
    }
    
    const tierSelect = document.getElementById('toolTier');
    if (tierSelect) {
        tierSelect.addEventListener('change', function() {
            updateToolPower();
            saveState();
            setTimeout(calculateTime, 100);
        });
    }
    
    const raritySelect = document.getElementById('toolRarity');
    if (raritySelect) {
        raritySelect.addEventListener('change', function() {
            updateToolPower();
            saveState();
            setTimeout(calculateTime, 100);
        });
    }
    
    const foodSelect = document.getElementById('foodType');
    if (foodSelect) {
        foodSelect.addEventListener('change', function() {
            updateFoodStats();
            saveState();
            setTimeout(calculateTime, 100);
        });
    }
    
    // Save state on mode toggle
    const modeButtons = document.querySelectorAll('.mode-toggle');
    modeButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(() => {
                saveState();
                calculateTime();
            }, 100); // Small delay to let mode change take effect
        });
    });
});