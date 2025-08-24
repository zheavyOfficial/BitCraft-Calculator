// BitCraft Rarity Calculator JavaScript
// Updated with correct BitCraft rarity progression rules

// ===== CONFIGURATION & DATA =====

// BitCraft Rarity upgrade rules
const rarityRules = {
    // Upgrade chances per tier
    2: { maxRarity: 'Uncommon', upgradeChances: { 'Common': 0.30 } },
    3: { maxRarity: 'Rare', upgradeChances: { 'Uncommon': 0.15 } },
    4: { maxRarity: 'Epic', upgradeChances: { 'Rare': 0.075 } },
    5: { maxRarity: 'Legendary', upgradeChances: { 'Epic': 0.0375 } },
    6: { maxRarity: 'Mythic', upgradeChances: { 'Legendary': 0.01875 } },
    7: { maxRarity: 'Mythic', upgradeChances: { 'Legendary': 0.01875 } },
    8: { maxRarity: 'Mythic', upgradeChances: { 'Legendary': 0.01875 } },
    9: { maxRarity: 'Mythic', upgradeChances: { 'Legendary': 0.01875 } },
    10: { maxRarity: 'Mythic', upgradeChances: { 'Legendary': 0.01875 } }
};

// Rarity hierarchy
const rarityHierarchy = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];

// Rarity colors (BitCraft specific)
const rarityColors = {
    'Common': '#D1D5DB',
    'Uncommon': '#1EFF00',
    'Rare': '#0070DD',
    'Epic': '#A335EE',
    'Legendary': '#FF8000',
    'Mythic': '#FF0000'
};

// Global state
let selectedTier = 2;
let targetRarity = 'Uncommon';

// Theme Toggle Function
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'dark');
    }
}

// Validation function for probability anchor tests
function validateProbabilityAnchors(probabilities, tier) {
    const tolerance = 0.0001; // 0.01% tolerance for floating point precision
    
    try {
        // Key anchor test: T3 Uncommon should be ~51%
        if (tier === 3) {
            const uncommonT3 = probabilities['Uncommon'] * 100;
            console.assert(Math.abs(uncommonT3 - 51.0) < tolerance * 100, 
                `T3 Uncommon assertion failed: expected ~51%, got ${uncommonT3.toFixed(4)}%`);
        }
        
        // Key anchor test: T3 Rare should be ~4.5%
        if (tier === 3) {
            const rareT3 = probabilities['Rare'] * 100;
            console.assert(Math.abs(rareT3 - 4.5) < tolerance * 100, 
                `T3 Rare assertion failed: expected ~4.5%, got ${rareT3.toFixed(4)}%`);
        }
        
        // Key anchor test: T6+ Mythic should be > 0%
        if (tier >= 6) {
            const mythicT6 = probabilities['Mythic'];
            console.assert(mythicT6 > 0, 
                `T${tier} Mythic assertion failed: expected > 0%, got ${(mythicT6 * 100).toFixed(6)}%`);
        }
        
        // Total probability should always equal 100%
        const total = Object.values(probabilities).reduce((sum, p) => sum + p, 0);
        console.assert(Math.abs(total - 1.0) < tolerance, 
            `T${tier} Total probability assertion failed: expected 100%, got ${(total * 100).toFixed(4)}%`);
            
        // No negative probabilities
        Object.entries(probabilities).forEach(([rarity, prob]) => {
            console.assert(prob >= 0, 
                `T${tier} ${rarity} negative probability: ${(prob * 100).toFixed(6)}%`);
        });
        
    } catch (error) {
        console.error(`Probability validation error for T${tier}:`, error);
    }
}

// Calculate exact probabilities for reaching each rarity at each tier
function calculateRarityProbabilities(tier) {
    const probabilities = {
        'Common': 0,
        'Uncommon': 0,
        'Rare': 0,
        'Epic': 0,
        'Legendary': 0,
        'Mythic': 0
    };
    
    // Handle special cases
    if (tier < 2) {
        probabilities['Common'] = 1.0;
        return probabilities;
    }
    
    // Forward probability propagation with tier-by-tier calculation
    // Start with 100% Common at T1
    let currentDistribution = {
        'Common': 1.0,
        'Uncommon': 0.0,
        'Rare': 0.0,
        'Epic': 0.0,
        'Legendary': 0.0,
        'Mythic': 0.0
    };
    
    // Apply upgrades tier by tier
    for (let currentTier = 2; currentTier <= tier; currentTier++) {
        const newDistribution = { ...currentDistribution };
        
        // T2+: Common → Uncommon (30% chance)
        if (currentTier >= 2) {
            const upgradeAmount = currentDistribution['Common'] * 0.30;
            newDistribution['Common'] -= upgradeAmount;
            newDistribution['Uncommon'] += upgradeAmount;
        }
        
        // T3+: Uncommon → Rare (15% chance)
        if (currentTier >= 3) {
            const upgradeAmount = currentDistribution['Uncommon'] * 0.15;
            newDistribution['Uncommon'] -= upgradeAmount;
            newDistribution['Rare'] += upgradeAmount;
        }
        
        // T4+: Rare → Epic (7.5% chance)
        if (currentTier >= 4) {
            const upgradeAmount = currentDistribution['Rare'] * 0.075;
            newDistribution['Rare'] -= upgradeAmount;
            newDistribution['Epic'] += upgradeAmount;
        }
        
        // T5+: Epic → Legendary (3.75% chance)
        if (currentTier >= 5) {
            const upgradeAmount = currentDistribution['Epic'] * 0.0375;
            newDistribution['Epic'] -= upgradeAmount;
            newDistribution['Legendary'] += upgradeAmount;
        }
        
        // T6+: Legendary → Mythic (1.875% chance)
        if (currentTier >= 6) {
            const upgradeAmount = currentDistribution['Legendary'] * 0.01875;
            newDistribution['Legendary'] -= upgradeAmount;
            newDistribution['Mythic'] += upgradeAmount;
        }
        
        currentDistribution = newDistribution;
    }
    
    // Validate probability calculations with anchor tests
    validateProbabilityAnchors(currentDistribution, tier);
    
    return currentDistribution;
}

// Calculate cumulative probability (at least once across attempts)
function calculateCumulativeProbability(singleChance, attempts) {
    return 1 - Math.pow(1 - singleChance, attempts);
}

// Calculate expected attempts for target probability
function calculateExpectedAttempts(singleChance, targetProb) {
    if (singleChance <= 0) return Infinity;
    return Math.ceil(Math.log(1 - targetProb) / Math.log(1 - singleChance));
}

// Initialize UI
function refreshRarityOptions() {
    const tierSelect = document.getElementById('tier');
    const raritySelect = document.getElementById('rarityGoal');
    
    selectedTier = parseInt(tierSelect.value);
    
    // Store current target rarity if it exists
    const currentTargetRarity = targetRarity;
    
    // Clear rarity options
    raritySelect.innerHTML = '';
    
    // Add available rarities for selected tier
    const maxRarityIndex = getMaxRarityIndexForTier(selectedTier);
    const availableRarities = [];
    
    for (let i = 1; i <= maxRarityIndex; i++) {
        const rarity = rarityHierarchy[i];
        const option = document.createElement('option');
        option.value = rarity;
        option.textContent = rarity;
        option.className = `rarity-${rarity.toLowerCase()}`;
        raritySelect.appendChild(option);
        availableRarities.push(rarity);
    }
    
    // Try to restore the previous target rarity, or clamp to valid option
    if (currentTargetRarity && availableRarities.includes(currentTargetRarity)) {
        raritySelect.value = currentTargetRarity;
        targetRarity = currentTargetRarity;
    } else {
        // Default selection or clamp to available options
        if (maxRarityIndex >= 2) {
            const defaultRarity = rarityHierarchy[Math.min(2, maxRarityIndex)]; // Try for Rare
            raritySelect.value = defaultRarity;
            targetRarity = defaultRarity;
        } else {
            const fallbackRarity = rarityHierarchy[maxRarityIndex];
            raritySelect.value = fallbackRarity;
            targetRarity = fallbackRarity;
        }
    }
    
    // Save the updated state
    try {
        const sharedState = JSON.parse(localStorage.getItem('bcState.v1') || '{}');
        if (!sharedState.rarity) sharedState.rarity = {};
        sharedState.rarity.tier = selectedTier;
        sharedState.rarity.targetRarity = targetRarity;
        sharedState.rarity.customAttempts = document.getElementById('customAttempts')?.value || '50';
        localStorage.setItem('bcState.v1', JSON.stringify(sharedState));
    } catch (error) {
        console.error('Error saving rarity state in refreshRarityOptions:', error);
    }
    
    updateProbabilityDisplay();
}

function getMaxRarityIndexForTier(tier) {
    if (tier < 2) return 0; // T0/T1 = Common only
    if (tier === 2) return 1; // T2 = Uncommon
    if (tier === 3) return 2; // T3 = Rare
    if (tier === 4) return 3; // T4 = Epic
    if (tier === 5) return 4; // T5 = Legendary
    return 5; // T6+ = Mythic
}

function updateProbabilityDisplay() {
    const probabilities = calculateRarityProbabilities(selectedTier);
    const singleChance = probabilities[targetRarity];
    
    // Update main display
    document.getElementById('targetDisplay').textContent = `${targetRarity} at T${selectedTier}`;
    
    // Use adaptive precision for very small probabilities
    const percentage = singleChance * 100;
    let displayText;
    if (percentage < 0.001) {
        displayText = `${percentage.toFixed(6)}%`;
    } else if (percentage < 0.01) {
        displayText = `${percentage.toFixed(4)}%`;
    } else {
        displayText = `${percentage.toFixed(3)}%`;
    }
    document.getElementById('singleChance').textContent = displayText;
    
    // Update probability display card color based on selected rarity
    const probabilityDisplay = document.querySelector('.probability-display');
    if (probabilityDisplay) {
        const rarityColor = rarityColors[targetRarity];
        const rgba = hexToRgba(rarityColor, 0.2);
        const borderRgba = hexToRgba(rarityColor, 0.4);
        probabilityDisplay.style.background = `linear-gradient(135deg, ${rgba}, ${hexToRgba(rarityColor, 0.3)})`;
        probabilityDisplay.style.borderColor = borderRgba;
        
        // Update text color for better contrast
        const targetElement = document.getElementById('targetDisplay');
        const chanceElement = document.getElementById('singleChance');
        if (targetElement) targetElement.style.color = rarityColor;
        if (chanceElement) chanceElement.style.color = rarityColor;
    }
    
    // Update distribution breakdown
    const distributionDiv = document.getElementById('distributionBreakdown');
    distributionDiv.innerHTML = '';
    
    for (const rarity of rarityHierarchy) {
        const prob = probabilities[rarity];
        if (prob > 0) {
            const item = document.createElement('div');
            item.className = 'distribution-item';
            
            // Use adaptive precision for small probabilities
            const percentage = prob * 100;
            let percentText;
            if (percentage < 0.001) {
                percentText = `${percentage.toFixed(6)}%`;
            } else if (percentage < 0.01) {
                percentText = `${percentage.toFixed(4)}%`;
            } else {
                percentText = `${percentage.toFixed(3)}%`;
            }
            
            item.innerHTML = `
                <span class="distribution-rarity rarity-${rarity.toLowerCase()}" style="color: ${rarityColors[rarity]}">${rarity}</span>
                <span class="distribution-chance">${percentText}</span>
            `;
            distributionDiv.appendChild(item);
        }
    }
    
    // Update attempts grid
    updateAttemptsGrid(singleChance);
    
    // Update custom result
    updateCustomResult(singleChance);
    
    // Auto-update results (replace calculateRarity call)
    updateResults();
}

// Helper function to convert hex to rgba
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function updateAttemptsGrid(singleChance) {
    const attemptsGrid = document.getElementById('attemptsGrid');
    const attempts = [3, 5, 10, 25, 50, 100];
    
    attemptsGrid.innerHTML = '';
    
    attempts.forEach(count => {
        const cumulative = calculateCumulativeProbability(singleChance, count);
        
        const item = document.createElement('div');
        item.className = 'attempt-item';
        item.innerHTML = `
            <div class="attempt-count">${count} attempts</div>
            <div class="attempt-chance">${(cumulative * 100).toFixed(1)}%</div>
        `;
        attemptsGrid.appendChild(item);
    });
}

function updateCustomResult(singleChance) {
    const customInput = document.getElementById('customAttempts');
    const customResult = document.getElementById('customResult');
    
    const attempts = parseInt(customInput.value) || 50;
    const cumulative = calculateCumulativeProbability(singleChance, attempts);
    
    customResult.textContent = `${(cumulative * 100).toFixed(2)}% chance with ${attempts} attempts`;
}

function adjustValue(inputId, increment) {
    const input = document.getElementById(inputId);
    let newValue = (parseInt(input.value) || 0) + increment;
    
    if (newValue < 1) newValue = 1;
    if (newValue > 10000) newValue = 10000;
    
    input.value = newValue;
    
    updateCustomResult(calculateRarityProbabilities(selectedTier)[targetRarity]);
}

function updateResults() {
    try {
        const probabilities = calculateRarityProbabilities(selectedTier);
        const singleChance = probabilities[targetRarity];
        
        // Update results
        document.getElementById('resultTarget').textContent = `${targetRarity} at Tier ${selectedTier}`;
        
        // Use adaptive precision for results display
        const resultPercentage = singleChance * 100;
        let resultText;
        if (resultPercentage < 0.001) {
            resultText = `${resultPercentage.toFixed(6)}%`;
        } else if (resultPercentage < 0.01) {
            resultText = `${resultPercentage.toFixed(4)}%`;
        } else {
            resultText = `${resultPercentage.toFixed(3)}%`;
        }
        document.getElementById('resultSingle').textContent = resultText;
        
        // Calculate expected attempts
        document.getElementById('result50').textContent = `${calculateExpectedAttempts(singleChance, 0.5)} attempts`;
        document.getElementById('result90').textContent = `${calculateExpectedAttempts(singleChance, 0.9)} attempts`;
        document.getElementById('result99').textContent = `${calculateExpectedAttempts(singleChance, 0.99)} attempts`;
        
        // Average attempts
        const avgAttempts = singleChance > 0 ? Math.round(1 / singleChance) : Infinity;
        document.getElementById('avgAttempts').textContent = avgAttempts === Infinity ? '∞' : `${avgAttempts}`;
        
        // Placeholder estimates
        document.getElementById('materialsEst').textContent = 'Coming Soon';
        document.getElementById('timeEst').textContent = 'Coming Soon';
        
        // Show results
        document.getElementById('resultContainer').style.display = 'block';
        
        // Create probability visualization
        createProbabilityChart(probabilities);
        
    } catch (error) {
        console.error('Error calculating rarity:', error);
    }
}

function createProbabilityChart(probabilities) {
    const chartDiv = document.getElementById('probabilityChart');
    chartDiv.innerHTML = '<div class="chart-title">Probability Distribution</div>';
    
    const maxProb = Math.max(...Object.values(probabilities));
    
    for (const rarity of rarityHierarchy) {
        const prob = probabilities[rarity];
        if (prob > 0) {
            const width = (prob / maxProb) * 100;
            
            // Use adaptive precision for chart display
            const chartPercentage = prob * 100;
            let chartText;
            if (chartPercentage < 0.001) {
                chartText = `${chartPercentage.toFixed(6)}%`;
            } else if (chartPercentage < 0.01) {
                chartText = `${chartPercentage.toFixed(4)}%`;
            } else {
                chartText = `${chartPercentage.toFixed(3)}%`;
            }
            
            const bar = document.createElement('div');
            bar.className = 'probability-bar';
            bar.innerHTML = `
                <div class="bar-label" style="color: ${rarityColors[rarity]}">${rarity}</div>
                <div class="bar-container">
                    <div class="bar-fill" style="width: ${width}%; background-color: ${rarityColors[rarity]}"></div>
                    <div class="bar-text">${chartText}</div>
                </div>
            `;
            chartDiv.appendChild(bar);
        }
    }
}

// Reset to default values (page-specific localStorage handling)
function resetToDefaults() {
    try {
        // Clear only this page's state from shared storage
        const sharedState = JSON.parse(localStorage.getItem('bcState.v1') || '{}');
        delete sharedState.rarity;
        localStorage.setItem('bcState.v1', JSON.stringify(sharedState));
    } catch (error) {
        console.error('Error clearing page state:', error);
    }
    
    // Reset to default values
    selectedTier = 2;
    targetRarity = 'Uncommon';
    
    // Reset UI elements
    if (document.getElementById('tier')) document.getElementById('tier').value = '2';
    if (document.getElementById('customAttempts')) document.getElementById('customAttempts').value = '50';
    
    // Refresh the rarity options and display
    refreshRarityOptions();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon');
    
    if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        if (themeIcon) themeIcon.textContent = '☀️';
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        if (themeIcon) themeIcon.textContent = '🌙';
    }
    
    // Save state function for rarity calculator
    const saveRarityState = () => {
        try {
            const sharedState = JSON.parse(localStorage.getItem('bcState.v1') || '{}');
            sharedState.rarity = {
                tier: selectedTier,
                targetRarity: targetRarity,
                customAttempts: document.getElementById('customAttempts')?.value || '50'
            };
            localStorage.setItem('bcState.v1', JSON.stringify(sharedState));
        } catch (error) {
            console.error('Error saving rarity state:', error);
        }
    };
    
    // Load state function for rarity calculator  
    const loadRarityState = () => {
        try {
            const sharedState = JSON.parse(localStorage.getItem('bcState.v1') || '{}');
            const state = sharedState.rarity;
            
            if (state) {
                selectedTier = state.tier || 2;
                targetRarity = state.targetRarity || 'Uncommon';
                
                if (document.getElementById('tier')) document.getElementById('tier').value = selectedTier.toString();
                if (document.getElementById('customAttempts')) document.getElementById('customAttempts').value = state.customAttempts || '50';
            }
        } catch (error) {
            console.error('Error loading rarity state:', error);
        }
    };
    
    // Load saved state
    loadRarityState();
    
    // Add event listeners
    document.getElementById('tier')?.addEventListener('change', function() {
        refreshRarityOptions();
        saveRarityState();
    });
    
    document.getElementById('rarityGoal')?.addEventListener('change', function() {
        targetRarity = this.value;
        updateProbabilityDisplay();
        saveRarityState();
    });
    
    document.getElementById('customAttempts')?.addEventListener('input', function() {
        updateCustomResult(calculateRarityProbabilities(selectedTier)[targetRarity]);
        saveRarityState();
    });
    
    // Initialize
    refreshRarityOptions();
});