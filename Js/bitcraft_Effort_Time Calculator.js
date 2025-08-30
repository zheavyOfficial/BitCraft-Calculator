// BitCraft Effort Calculator JavaScript - Clean & Optimized
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

// Stamina drain multipliers by job tier (independent of tool power)
const staminaDrainMultipliers = {
    1: 0.75,
    2: 0.89,
    3: 1.03,
    4: 1.16,
    5: 1.28,
    6: 1.41,
    7: 1.52,
    8: 1.64,
    9: 1.75,
    10: 1.86
};

// Global state
let currentMode = 'crafting'; // 'crafting' or 'gathering'
let isUpdatingSlider = false; // Guard against recursive updates
let timeoutId;

// ===== UTILITY FUNCTIONS =====

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
    const resultContainer = document.getElementById('resultContainer');
    
    if (errorContainer) {
        errorContainer.innerHTML = `<div class="error-message">${message}</div>`;
        errorContainer.style.display = 'block';
        
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 5000);
    }
    
    // Ensure results container is still visible even with errors
    if (resultContainer) {
        resultContainer.classList.add('show');
    }
}

// ===== STATE MANAGEMENT =====

function saveState() {
    try {
        // Get existing shared state
        const sharedState = JSON.parse(localStorage.getItem('bcState.v1') || '{}');
        
        // Update effort calculator state
        sharedState.time = {
            taskEffortTool: document.getElementById('taskEffortTool')?.value || '10000',
            effortDoneTool: document.getElementById('effortDoneTool')?.value || '0',
            tickTimeTool: document.getElementById('tickTimeTool')?.value || '1.6',
            jobTier: document.getElementById('jobTier')?.value || '1',
            toolTier: document.getElementById('toolTier')?.value || '1',
            toolRarity: document.getElementById('toolRarity')?.value || 'common',
            toolPowerSlider: document.getElementById('toolPowerSlider')?.value || '1',
            maxStamina: document.getElementById('maxStamina')?.value || '100',
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
            if (document.getElementById('jobTier')) document.getElementById('jobTier').value = state.jobTier || '1';
            if (document.getElementById('toolTier')) document.getElementById('toolTier').value = state.toolTier || '1';
            if (document.getElementById('toolRarity')) {
                document.getElementById('toolRarity').value = state.toolRarity || 'common';
                // Initialize rarity buttons to match loaded state
                updateRarityButtonStates(state.toolRarity || 'common');
            }
            if (document.getElementById('toolPowerSlider')) document.getElementById('toolPowerSlider').value = state.toolPowerSlider || '1';
            if (document.getElementById('maxStamina')) document.getElementById('maxStamina').value = state.maxStamina || '100';
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
    if (document.getElementById('xpPerTick')) document.getElementById('xpPerTick').value = '1';
    if (document.getElementById('toolTier')) document.getElementById('toolTier').value = '1';
    if (document.getElementById('toolRarity')) document.getElementById('toolRarity').value = 'common';
    if (document.getElementById('maxStamina')) document.getElementById('maxStamina').value = '100';
    if (document.getElementById('foodType')) document.getElementById('foodType').value = 'none';
    
    setMode('crafting');
    updateToolPower();
    updateFoodStats();
    
    // Calculate once after reset
    setTimeout(calculateTime, 100);
}

function resetTaskEffortFields() {
    // Reset only task & effort related fields
    if (document.getElementById('taskEffortTool')) document.getElementById('taskEffortTool').value = '10000';
    if (document.getElementById('effortDoneTool')) document.getElementById('effortDoneTool').value = '0';
    if (document.getElementById('tickTimeTool')) document.getElementById('tickTimeTool').value = '1.6';
    if (document.getElementById('xpPerTick')) document.getElementById('xpPerTick').value = '1';
    if (document.getElementById('jobTier')) document.getElementById('jobTier').value = '1';
    
    // Recalculate after reset
    setTimeout(calculateTime, 100);
}

// ===== MODE TOGGLE =====

function setMode(mode) {
    currentMode = mode;
    const craftingBtn = document.getElementById('craftingMode');
    const gatheringBtn = document.getElementById('gatheringMode');
    const effortLabel = document.getElementById('effortLabel');
    
    if (craftingBtn && gatheringBtn && effortLabel) {
        if (mode === 'crafting') {
            craftingBtn.classList.add('active');
            gatheringBtn.classList.remove('active');
            effortLabel.textContent = 'Effort Completed';
        } else {
            gatheringBtn.classList.add('active');
            craftingBtn.classList.remove('active');
            effortLabel.textContent = 'Effort Remaining';
        }
    }
    
    setTimeout(calculateTime, 100);
}

// ===== RARITY BUTTON CONTROL SYSTEM =====

function getCurrentRarity() {
    const activeButton = document.querySelector('.rarity-btn-small.active');
    if (activeButton) {
        return activeButton.dataset.rarity;
    }
    return document.getElementById('toolRarity')?.value || 'common';
}

function selectRarity(rarity) {
    // Check if button is disabled
    const button = document.querySelector(`.rarity-btn-small[data-rarity="${rarity}"]`);
    if (button && (button.disabled || button.classList.contains('is-disabled'))) {
        return; // Don't allow selection of disabled buttons
    }
    
    // Update hidden input for persistence
    const toolRarityInput = document.getElementById('toolRarity');
    if (toolRarityInput) {
        toolRarityInput.value = rarity;
    }
    
    // Update button states
    updateRarityButtonStates(rarity);
    
    // Sync slider index to the selected power (guard with isUpdatingSlider)
    isUpdatingSlider = true;
    const tierSelect = document.getElementById('toolTier');
    const tier = parseInt(tierSelect?.value) || 1;
    const power = toolData[tier] && toolData[tier][rarity] ? toolData[tier][rarity] : 10;
    
    const validPowers = getAllValidToolPowers();
    const sliderIndex = validPowers.indexOf(power);
    const slider = document.getElementById('toolPowerSlider');
    const sliderDisplay = document.getElementById('sliderValueDisplay');
    
    if (slider && sliderIndex !== -1) {
        slider.value = sliderIndex;
    }
    if (sliderDisplay) {
        sliderDisplay.textContent = power;
    }
    isUpdatingSlider = false;
    
    // Save and recalculate
    saveState();
    setTimeout(calculateTime, 100);
}

function updateRarityButtonStates(selectedRarity) {
    const buttons = document.querySelectorAll('.rarity-btn-small');
    buttons.forEach(btn => {
        const isActive = btn.dataset.rarity === selectedRarity;
        if (isActive) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        } else {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        }
    });
}

// ===== TOOL POWER & SLIDER SYNC =====

function updateFromSlider() {
    if (isUpdatingSlider) return; // Prevent recursive updates
    
    const slider = document.getElementById('toolPowerSlider');
    if (!slider) return;
    
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
    
    // Update slider display
    const sliderDisplay = document.getElementById('sliderValueDisplay');
    if (sliderDisplay) {
        sliderDisplay.textContent = actualPower;
    }
    
    // Update tier and rarity to match closest tool (with guard)
    isUpdatingSlider = true;
    const match = findBestMatchingTool(actualPower);
    if (match && match.power === actualPower) {
        const toolTierSelect = document.getElementById('toolTier');
        const toolRarityInput = document.getElementById('toolRarity');
        
        if (toolTierSelect) {
            toolTierSelect.value = match.tier;
        }
        if (toolRarityInput) {
            toolRarityInput.value = match.rarity;
        }
        
        // Update rarity button availability for new tier
        const tier = match.tier;
        const availableRarities = Object.keys(toolData[tier] || {});
        const buttons = document.querySelectorAll('.rarity-btn-small');
        
        buttons.forEach(btn => {
            const rarity = btn.dataset.rarity;
            const isAvailable = availableRarities.includes(rarity);
            
            if (isAvailable) {
                // Enable button
                btn.disabled = false;
                btn.classList.remove('is-disabled');
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
                btn.style.pointerEvents = 'auto';
            } else {
                // Disable button
                btn.disabled = true;
                btn.classList.add('is-disabled');
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
                btn.style.opacity = '0.3';
                btn.style.cursor = 'not-allowed';
                btn.style.pointerEvents = 'none';
            }
        });
        
        // Update rarity button states to match selection
        updateRarityButtonStates(match.rarity);
    }
    isUpdatingSlider = false;
}

function updateToolPower() {
    if (isUpdatingSlider) return; // Prevent recursive updates
    
    const tierSelect = document.getElementById('toolTier');
    if (!tierSelect) return;
    
    const tier = parseInt(tierSelect.value);
    const currentRarity = getCurrentRarity();
    const availableRarities = Object.keys(toolData[tier] || {});
    
    // Update rarity button availability with proper styling
    const buttons = document.querySelectorAll('.rarity-btn-small');
    buttons.forEach(btn => {
        const rarity = btn.dataset.rarity;
        const isAvailable = availableRarities.includes(rarity);
        
        if (isAvailable) {
            // Enable button
            btn.disabled = false;
            btn.classList.remove('is-disabled');
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            btn.style.pointerEvents = 'auto';
        } else {
            // Disable button with rarity-calculator styling
            btn.disabled = true;
            btn.classList.add('is-disabled');
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
            btn.style.opacity = '0.3';
            btn.style.cursor = 'not-allowed';
            btn.style.pointerEvents = 'none';
        }
    });
    
    // Select appropriate rarity - find nearest available
    let selectedRarity = currentRarity;
    if (!availableRarities.includes(currentRarity)) {
        // Find the closest rarity by index
        const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
        const currentIndex = rarityOrder.indexOf(currentRarity);
        
        // Look for closest available rarity (prefer lower first)
        selectedRarity = availableRarities[0]; // fallback to first available
        for (let i = currentIndex; i >= 0; i--) {
            if (availableRarities.includes(rarityOrder[i])) {
                selectedRarity = rarityOrder[i];
                break;
            }
        }
        
        const toolRarityInput = document.getElementById('toolRarity');
        if (toolRarityInput) {
            toolRarityInput.value = selectedRarity;
        }
        
        // Update button states
        updateRarityButtonStates(selectedRarity);
    }
    
    const power = toolData[tier] && toolData[tier][selectedRarity] ? toolData[tier][selectedRarity] : 10;
    
    // Update slider to match the power (with guard)
    isUpdatingSlider = true;
    const validPowers = getAllValidToolPowers();
    const sliderIndex = validPowers.indexOf(power);
    const slider = document.getElementById('toolPowerSlider');
    const sliderDisplay = document.getElementById('sliderValueDisplay');
    
    if (slider && sliderIndex !== -1) {
        slider.value = sliderIndex;
    }
    if (sliderDisplay) {
        sliderDisplay.textContent = power;
    }
    isUpdatingSlider = false;
    
    setTimeout(calculateTime, 100);
}

// ===== INPUT VALIDATION & ADJUSTMENT =====

function validateTaskEffort() {
    const taskEffortInput = document.getElementById('taskEffortTool');
    const effortCompletedInput = document.getElementById('effortDoneTool');
    
    if (!taskEffortInput || !effortCompletedInput) return;
    
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
    
    if (!taskEffortInput || !effortCompletedInput) return;
    
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
    if (!input) return;
    
    const currentValue = parseFloat(input.value) || 0;
    let newValue = currentValue + increment;
    
    if (newValue < 0) newValue = 0;
    
    // Special handling for effort values - prevent exceeding task effort
    if (inputId === 'effortDoneTool') {
        const taskEffortInput = document.getElementById('taskEffortTool');
        const taskEffort = parseInt(taskEffortInput?.value) || 0;
        if (newValue > taskEffort) newValue = taskEffort;
    }
    
    if (inputId.includes('tickTime') || inputId === 'tickTime') {
        newValue = Math.round(newValue * 100) / 100;
    } else {
        newValue = Math.round(newValue);
    }
    
    input.value = newValue;
    
    setTimeout(calculateTime, 100);
    
    // Save state after value change
    saveState();
}

// ===== FOOD STATS UPDATE =====

function updateFoodStats() {
    const foodTypeSelect = document.getElementById('foodType');
    const staminaRegenDisplay = document.getElementById('staminaRegen');
    const foodStaminaRegenDisplay = document.getElementById('foodStaminaRegen');
    const craftingSpeedDisplay = document.getElementById('craftingSpeed');
    
    if (!foodTypeSelect || !staminaRegenDisplay || !foodStaminaRegenDisplay) return;
    
    const foodType = foodTypeSelect.value;
    const foodStats = foodData[foodType];
    
    if (foodStats) {
        // Always show base regen as 0.25/s
        staminaRegenDisplay.textContent = '0.25/s (base)';
        
        // Show only the food bonus on the second line
        const foodBonus = foodStats.staminaRegen - 0.25;
        foodStaminaRegenDisplay.textContent = foodBonus > 0 ? `+${foodBonus}/s` : '+0/s';
        
        if (craftingSpeedDisplay) {
            craftingSpeedDisplay.textContent = 
                foodStats.craftingSpeed > 0 ? `+${foodStats.craftingSpeed}%` : '0%';
        }
    }
    
    setTimeout(calculateTime, 100);
}

// ===== MAIN CALCULATION FUNCTION =====

function calculateTime() {
    // Always show results container
    const resultContainer = document.getElementById('resultContainer');
    if (resultContainer) {
        resultContainer.classList.add('show');
    }
    
    // Get input values with null checks
    const taskEffortInput = document.getElementById('taskEffortTool');
    const effortDoneInput = document.getElementById('effortDoneTool');
    const tickTimeInput = document.getElementById('tickTimeTool');
    const xpPerTickInput = document.getElementById('xpPerTick');
    const jobTierSelect = document.getElementById('jobTier');
    const toolTierSelect = document.getElementById('toolTier');
    const toolRarityInput = document.getElementById('toolRarity');
    const maxStaminaInput = document.getElementById('maxStamina');
    const foodTypeSelect = document.getElementById('foodType');
    
    if (!taskEffortInput || !effortDoneInput || !tickTimeInput || !xpPerTickInput || !jobTierSelect || 
        !toolTierSelect || !toolRarityInput || !maxStaminaInput || !foodTypeSelect) {
        console.error('Required input elements not found');
        return;
    }
    
    const taskEffort = parseFloat(taskEffortInput.value) || 10000;
    let effortDone = parseFloat(effortDoneInput.value) || 0;
    
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
    
    const tier = parseInt(toolTierSelect.value) || 1;
    const rarity = toolRarityInput.value || 'common';
    const toolPower = toolData[tier] && toolData[tier][rarity] ? toolData[tier][rarity] : toolData[1]['common'];
    
    let tickTime = parseFloat(tickTimeInput.value) || 1.6;
    const xpPerTick = Math.max(0, Math.floor(parseFloat(xpPerTickInput.value) || 1)); // Ensure integer, minimum 0
    
    // Get food type for stamina calculations
    const foodType = foodTypeSelect.value || 'none';
    
    // Get stamina values
    const maxStamina = parseInt(maxStaminaInput.value) || 100;
    const staminaRegen = foodData[foodType].staminaRegen;
    
    const errorContainer = document.getElementById('errorContainer');
    const noFoodWarning = document.getElementById('noFoodWarning');
    
    if (errorContainer) errorContainer.style.display = 'none';
    if (noFoodWarning) noFoodWarning.style.display = 'none';
    
    // Validation
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
    
    // XP calculations
    const totalXpJob = totalTicksFromStart * xpPerTick;
    const remainingXp = remainingTicks * xpPerTick;
    
    // Calculate stamina usage and breaks with job tier multiplier (independent of tool power)
    // Stamina drains at a base of 1 per tick, with job tier multiplier applied
    const jobTier = parseInt(jobTierSelect.value) || 1;
    const staminaDrainMultiplier = staminaDrainMultipliers[jobTier] || 1.0;
    const staminaPerTick = 1 * staminaDrainMultiplier; // Base 1 per tick * multiplier
    const staminaUsed = remainingTicks * staminaPerTick; // Total stamina for remaining ticks
    const staminaDeficit = Math.max(0, staminaUsed - maxStamina);
    
    let totalTimeWithBreaks = baseRemainingSeconds;
    let totalBreakTime = 0;
    let breaksNeeded = 0;
    
    if (staminaDeficit > 0) {
        // Calculate how many breaks are needed and total break time
        // Working in stamina units, not time units
        let remainingStaminaNeeded = staminaDeficit;
        
        while (remainingStaminaNeeded > 0) {
            breaksNeeded++;
            const staminaToRestore = Math.min(maxStamina, remainingStaminaNeeded);
            const breakTime = staminaToRestore / staminaRegen;
            totalBreakTime += breakTime;
            totalTimeWithBreaks += breakTime;
            
            remainingStaminaNeeded -= maxStamina;
        }
    }
    
    // Calculate food consumptions needed (30 min duration each)
    let foodConsumptions = 0;
    if (foodType !== 'none') {
        const totalTimeMinutes = totalTimeWithBreaks / 60;
        foodConsumptions = Math.ceil(totalTimeMinutes / 30);
    }

    // Stamina drain time: how long it takes to drain a full stamina bar (tick-aware)
    // Each tick drains (1 * staminaDrainMultiplier) stamina and takes tickTime seconds
    const ticksToEmptyStamina = Math.ceil(maxStamina / staminaPerTick);
    const staminaPerSitting = ticksToEmptyStamina * tickTime;
    
    // Calculate effort per full stamina sitting
    const ticksPerSitting = Math.floor(maxStamina / staminaPerTick);
    const effortPerSitting = ticksPerSitting * toolPower;
    const xpPerSitting = ticksPerSitting * xpPerTick;
    const percentOfRemaining = (effortPerSitting / remainingEffort) * 100;
    
    // Recharge timer: baseline full-bar recharge time (independent of current stamina)
    const rechargeSeconds = maxStamina / staminaRegen;
    
    // Calculate initial time with breaks (from start)
    let initialTimeWithBreaks = baseTotalSeconds;
    let initialBreakTime = 0;
    
    const totalStaminaNeededFromStart = totalTicksFromStart * staminaPerTick; // Total stamina for full task
    if (totalStaminaNeededFromStart > maxStamina) {
        let remainingStaminaNeededForFull = totalStaminaNeededFromStart - maxStamina;
        
        while (remainingStaminaNeededForFull > 0) {
            const staminaToRestore = Math.min(maxStamina, remainingStaminaNeededForFull);
            const breakTime = staminaToRestore / staminaRegen;
            initialBreakTime += breakTime;
            initialTimeWithBreaks += breakTime;
            remainingStaminaNeededForFull -= maxStamina;
        }
    }
    
    // Show/hide secondary time display based on progress
    const initialTimeDisplay = document.getElementById('initialTimeDisplay');
    const initialTimeValue = document.getElementById('initialTimeValue');
    
    if (initialTimeDisplay && initialTimeValue) {
        if (effortDone > 0) {
            initialTimeDisplay.style.display = 'block';
            initialTimeValue.textContent = formatTime(initialTimeWithBreaks);
        } else {
            initialTimeDisplay.style.display = 'none';
        }
    }
    
    // Show food warning if no food buff
    if (foodType === 'none' && noFoodWarning) {
        noFoodWarning.style.display = 'block';
    }
    
    // Update all result displays with null checks
    setTimeout(() => {
        const elements = {
            'resultValue': formatTime(totalTimeWithBreaks),
            'remainingEffort': remainingEffort.toLocaleString(),
            'remainingTicks': remainingTicks.toLocaleString(),
            'totalXpJob': totalXpJob.toLocaleString() + ' XP',
            'remainingXp': remainingXp.toLocaleString() + ' XP',
            'totalTimeFromStart': formatTime(baseTotalSeconds),
            'progressPercent': progressPercent + '%',
            'staminaUsage': Math.ceil(staminaUsed) + ' stamina' + (staminaDrainMultiplier !== 1.0 ? ` (${staminaPerTick}/tick)` : ''),
            'breaksNeeded': breaksNeeded + (breaksNeeded === 1 ? ' break' : ' breaks'),
            'totalBreakTime': totalBreakTime > 0 ? formatTime(totalBreakTime) : 'None',
            'regenRateDisplay': staminaRegen.toFixed(2) + '/s',
            'foodConsumptions': foodType === 'none' ? 'no food selected' : foodConsumptions + (foodConsumptions === 1 ? ' meal' : ' meals'),
            'staminaPerSitting': formatTime(staminaPerSitting),
            'effortPerSitting': effortPerSitting.toLocaleString() + ` (${percentOfRemaining.toFixed(1)}%)`,
            'xpPerSitting': xpPerSitting.toLocaleString() + ' XP',
            'rechargeTimerValue': formatTime(rechargeSeconds)
        };
        
        // Update elements that exist
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
        
        // Highlight elements with consistent warning styling
        const breaksLabel = document.getElementById('breaksLabel');
        if (breaksLabel && breaksLabel.parentElement) {
            breaksLabel.parentElement.className = 'result-line result-line-large result-line-warning';
        }
        
        const foodNeededLine = document.getElementById('foodNeededLine');
        if (foodNeededLine) {
            foodNeededLine.className = 'result-line result-line-large result-line-warning';
        }
        
        // Highlight stamina drain time if drain rate is high (T7+ = 1.52+)
        const staminaDrainTimeElement = document.getElementById('staminaPerSitting');
        if (staminaDrainTimeElement && staminaDrainTimeElement.parentElement) {
            if (staminaDrainMultiplier >= 1.52) {
                staminaDrainTimeElement.parentElement.className = 'result-line error';
            } else {
                staminaDrainTimeElement.parentElement.className = 'result-line';
            }
        }
        
        if (resultContainer) {
            resultContainer.classList.add('show');
        }
    }, 300);
}

// ===== EVENT LISTENERS & INITIALIZATION =====

document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculateTime();
    }
});

// Debounced input listeners for auto-calculation
function setupInputListeners() {
    const inputs = document.querySelectorAll('.input-field');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Run validation for specific inputs
            if (input.id === 'taskEffortTool') {
                validateTaskEffort();
            } else if (input.id === 'effortDoneTool') {
                validateEffortCompleted();
            }
            
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                calculateTime();
                saveState();
            }, 300);
        });
    });
    
    // Add change listeners for selects
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                // Special handling for tier changes
                if (select.id === 'toolTier') {
                    updateToolPower();
                } else if (select.id === 'foodType') {
                    updateFoodStats();
                }
                calculateTime();
                saveState();
            }, 100);
        });
    });
}

window.addEventListener('load', function() {
    // Initialize slider with correct max value
    const validPowers = getAllValidToolPowers();
    const sliderElement = document.getElementById('toolPowerSlider');
    if (sliderElement && validPowers.length > 0) {
        sliderElement.max = validPowers.length - 1;
        const safeIndex = Math.min(1, validPowers.length - 1);
        sliderElement.value = safeIndex; // Start with safe index
        
        const sliderDisplay = document.getElementById('sliderValueDisplay');
        if (sliderDisplay) {
            sliderDisplay.textContent = validPowers[safeIndex] || validPowers[0];
        }
    }
    
    // Load saved state
    loadState();
    
    // Initialize tool power and rarity button states
    updateToolPower();
    updateFoodStats();
    
    // Setup event listeners
    setupInputListeners();
    
    // Tool power slider - update tier and rarity buttons
    if (sliderElement) {
        sliderElement.addEventListener('input', function() {
            updateFromSlider();
            saveState();
            setTimeout(calculateTime, 100);
        });
    }
    
    // Note: Tier, job tier, and food selectors are now handled by setupInputListeners
    
    // Mode toggle buttons
    const modeButtons = document.querySelectorAll('.mode-toggle');
    modeButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(() => {
                saveState();
                calculateTime();
            }, 100); // Small delay to let mode change take effect
        });
    });
    
    // Run initial calculation to show results immediately
    setTimeout(calculateTime, 200);
});