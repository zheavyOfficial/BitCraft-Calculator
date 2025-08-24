// BitCraft Materials Calculator JavaScript

// Material requirements by tier and tool type (BitCraft specific)
const materialRequirements = {
    0: {
        pickaxe: { 'Flint': 5, 'Wood': 3, 'Fiber': 2 },
        axe: { 'Flint': 4, 'Wood': 4, 'Fiber': 2 },
        hammer: { 'Flint': 6, 'Wood': 3, 'Fiber': 2 },
        sword: { 'Flint': 3, 'Wood': 2, 'Fiber': 1 },
        shovel: { 'Flint': 2, 'Wood': 4, 'Fiber': 1 }
    },
    1: {
        pickaxe: { 'Ferralith Ingot': 4, 'Rough Rope': 2, 'Rough Plank': 2, 'Rough Leather': 2 },
        axe: { 'Ferralith Ingot': 4, 'Rough Rope': 2, 'Rough Plank': 2, 'Rough Leather': 2 },
        hammer: { 'Ferralith Ingot': 4, 'Rough Rope': 2, 'Rough Plank': 2, 'Rough Leather': 2 },
        sword: { 'Ferralith Ingot': 4, 'Rough Rope': 2, 'Rough Plank': 2, 'Rough Leather': 2 },
        shovel: { 'Ferralith Ingot': 4, 'Rough Rope': 2, 'Rough Plank': 2, 'Rough Leather': 2 }
    },
    2: {
        pickaxe: { 'Ferralith T1 Tool': 1, 'Pyrelite Ingot': 4, 'Simple Rope': 2, 'Simple Plank': 2, 'Simple Leather': 2 },
        axe: { 'Ferralith T1 Tool': 1, 'Pyrelite Ingot': 4, 'Simple Rope': 2, 'Simple Plank': 2, 'Simple Leather': 2 },
        hammer: { 'Ferralith T1 Tool': 1, 'Pyrelite Ingot': 4, 'Simple Rope': 2, 'Simple Plank': 2, 'Simple Leather': 2 },
        sword: { 'Ferralith T1 Tool': 1, 'Pyrelite Ingot': 4, 'Simple Rope': 2, 'Simple Plank': 2, 'Simple Leather': 2 },
        shovel: { 'Ferralith T1 Tool': 1, 'Pyrelite Ingot': 4, 'Simple Rope': 2, 'Simple Plank': 2, 'Simple Leather': 2 }
    },
    3: {
        pickaxe: { 'Pyrelite T2 Tool': 1, 'Emarium Ingot': 4, 'Sturdy Rope': 2, 'Sturdy Plank': 2, 'Sturdy Leather': 2 },
        axe: { 'Pyrelite T2 Tool': 1, 'Emarium Ingot': 4, 'Sturdy Rope': 2, 'Sturdy Plank': 2, 'Sturdy Leather': 2 },
        hammer: { 'Pyrelite T2 Tool': 1, 'Emarium Ingot': 4, 'Sturdy Rope': 2, 'Sturdy Plank': 2, 'Sturdy Leather': 2 },
        sword: { 'Pyrelite T2 Tool': 1, 'Emarium Ingot': 4, 'Sturdy Rope': 2, 'Sturdy Plank': 2, 'Sturdy Leather': 2 },
        shovel: { 'Pyrelite T2 Tool': 1, 'Emarium Ingot': 4, 'Sturdy Rope': 2, 'Sturdy Plank': 2, 'Sturdy Leather': 2 }
    },
    4: {
        pickaxe: { 'Emarium T3 Tool': 1, 'Elenvar Ingot': 4, 'Fine Rope': 2, 'Fine Plank': 2, 'Fine Leather': 2 },
        axe: { 'Emarium T3 Tool': 1, 'Elenvar Ingot': 4, 'Fine Rope': 2, 'Fine Plank': 2, 'Fine Leather': 2 },
        hammer: { 'Emarium T3 Tool': 1, 'Elenvar Ingot': 4, 'Fine Rope': 2, 'Fine Plank': 2, 'Fine Leather': 2 },
        sword: { 'Emarium T3 Tool': 1, 'Elenvar Ingot': 4, 'Fine Rope': 2, 'Fine Plank': 2, 'Fine Leather': 2 },
        shovel: { 'Emarium T3 Tool': 1, 'Elenvar Ingot': 4, 'Fine Rope': 2, 'Fine Plank': 2, 'Fine Leather': 2 }
    },
    5: {
        pickaxe: { 'Elenvar T4 Tool': 1, 'Luminite Ingot': 4, 'Exquisite Rope': 2, 'Exquisite Plank': 2, 'Exquisite Leather': 2 },
        axe: { 'Elenvar T4 Tool': 1, 'Luminite Ingot': 4, 'Exquisite Rope': 2, 'Exquisite Plank': 2, 'Exquisite Leather': 2 },
        hammer: { 'Elenvar T4 Tool': 1, 'Luminite Ingot': 4, 'Exquisite Rope': 2, 'Exquisite Plank': 2, 'Exquisite Leather': 2 },
        sword: { 'Elenvar T4 Tool': 1, 'Luminite Ingot': 4, 'Exquisite Rope': 2, 'Exquisite Plank': 2, 'Exquisite Leather': 2 },
        shovel: { 'Elenvar T4 Tool': 1, 'Luminite Ingot': 4, 'Exquisite Rope': 2, 'Exquisite Plank': 2, 'Exquisite Leather': 2 }
    },
    6: {
        pickaxe: { 'Luminite T5 Tool': 1, 'Rathium Ingot': 4, 'Peerless Rope': 2, 'Peerless Plank': 2, 'Peerless Leather': 2 },
        axe: { 'Luminite T5 Tool': 1, 'Rathium Ingot': 4, 'Peerless Rope': 2, 'Peerless Plank': 2, 'Peerless Leather': 2 },
        hammer: { 'Luminite T5 Tool': 1, 'Rathium Ingot': 4, 'Peerless Rope': 2, 'Peerless Plank': 2, 'Peerless Leather': 2 },
        sword: { 'Luminite T5 Tool': 1, 'Rathium Ingot': 4, 'Peerless Rope': 2, 'Peerless Plank': 2, 'Peerless Leather': 2 },
        shovel: { 'Luminite T5 Tool': 1, 'Rathium Ingot': 4, 'Peerless Rope': 2, 'Peerless Plank': 2, 'Peerless Leather': 2 }
    },
    7: {
        pickaxe: { 'Rathium T6 Tool': 1, 'Aurumite Ingot': 4, 'Ornate Rope': 2, 'Ornate Plank': 2, 'Ornate Leather': 2 },
        axe: { 'Rathium T6 Tool': 1, 'Aurumite Ingot': 4, 'Ornate Rope': 2, 'Ornate Plank': 2, 'Ornate Leather': 2 },
        hammer: { 'Rathium T6 Tool': 1, 'Aurumite Ingot': 4, 'Ornate Rope': 2, 'Ornate Plank': 2, 'Ornate Leather': 2 },
        sword: { 'Rathium T6 Tool': 1, 'Aurumite Ingot': 4, 'Ornate Rope': 2, 'Ornate Plank': 2, 'Ornate Leather': 2 },
        shovel: { 'Rathium T6 Tool': 1, 'Aurumite Ingot': 4, 'Ornate Rope': 2, 'Ornate Plank': 2, 'Ornate Leather': 2 }
    },
    8: {
        pickaxe: { 'Aurumite T7 Tool': 1, 'Celestium Ingot': 4, 'Pristine Rope': 2, 'Pristine Plank': 2, 'Pristine Leather': 2 },
        axe: { 'Aurumite T7 Tool': 1, 'Celestium Ingot': 4, 'Pristine Rope': 2, 'Pristine Plank': 2, 'Pristine Leather': 2 },
        hammer: { 'Aurumite T7 Tool': 1, 'Celestium Ingot': 4, 'Pristine Rope': 2, 'Pristine Plank': 2, 'Pristine Leather': 2 },
        sword: { 'Aurumite T7 Tool': 1, 'Celestium Ingot': 4, 'Pristine Rope': 2, 'Pristine Plank': 2, 'Pristine Leather': 2 },
        shovel: { 'Aurumite T7 Tool': 1, 'Celestium Ingot': 4, 'Pristine Rope': 2, 'Pristine Plank': 2, 'Pristine Leather': 2 }
    },
    9: {
        pickaxe: { 'Celestium T8 Tool': 1, 'Umbracite Ingot': 4, 'Magnificient Rope': 2, 'Magnificient Plank': 2, 'Magnificient Leather': 2 },
        axe: { 'Celestium T8 Tool': 1, 'Umbracite Ingot': 4, 'Magnificient Rope': 2, 'Magnificient Plank': 2, 'Magnificient Leather': 2 },
        hammer: { 'Celestium T8 Tool': 1, 'Umbracite Ingot': 4, 'Magnificient Rope': 2, 'Magnificient Plank': 2, 'Magnificient Leather': 2 },
        sword: { 'Celestium T8 Tool': 1, 'Umbracite Ingot': 4, 'Magnificient Rope': 2, 'Magnificient Plank': 2, 'Magnificient Leather': 2 },
        shovel: { 'Celestium T8 Tool': 1, 'Umbracite Ingot': 4, 'Magnificient Rope': 2, 'Magnificient Plank': 2, 'Magnificient Leather': 2 }
    },
    10: {
        pickaxe: { 'Umbracite T9 Tool': 1, 'Astralite Ingot': 4, 'Flawless Rope': 2, 'Flawless Plank': 2, 'Flawless Leather': 2 },
        axe: { 'Umbracite T9 Tool': 1, 'Astralite Ingot': 4, 'Flawless Rope': 2, 'Flawless Plank': 2, 'Flawless Leather': 2 },
        hammer: { 'Umbracite T9 Tool': 1, 'Astralite Ingot': 4, 'Flawless Rope': 2, 'Flawless Plank': 2, 'Flawless Leather': 2 },
        sword: { 'Umbracite T9 Tool': 1, 'Astralite Ingot': 4, 'Flawless Rope': 2, 'Flawless Plank': 2, 'Flawless Leather': 2 },
        shovel: { 'Umbracite T9 Tool': 1, 'Astralite Ingot': 4, 'Flawless Rope': 2, 'Flawless Plank': 2, 'Flawless Leather': 2 }
    }
};

// Material icons for display
const materialIcons = {
    'Flint': '🪨',
    'Wood': '🪵',
    'Fiber': '🧵',
    'Ferralith Ingot': '🟫',
    'Pyrelite Ingot': '🟧',
    'Emarium Ingot': '⬛',
    'Elenvar Ingot': '🔵',
    'Luminite Ingot': '🟢',
    'Rathium Ingot': '🔴',
    'Aurumite Ingot': '🟡',
    'Celestium Ingot': '⚪',
    'Umbracite Ingot': '🟣',
    'Astralite Ingot': '✨',
    'Rough Rope': '🧵',
    'Simple Rope': '🧵',
    'Sturdy Rope': '🧵',
    'Fine Rope': '🧵',
    'Exquisite Rope': '🧵',
    'Peerless Rope': '🧵',
    'Ornate Rope': '🧵',
    'Pristine Rope': '🧵',
    'Magnificient Rope': '🧵',
    'Flawless Rope': '🧵',
    'Rough Plank': '🪵',
    'Simple Plank': '🪵',
    'Sturdy Plank': '🪵',
    'Fine Plank': '🪵',
    'Exquisite Plank': '🪵',
    'Peerless Plank': '🪵',
    'Ornate Plank': '🪵',
    'Pristine Plank': '🪵',
    'Magnificient Plank': '🪵',
    'Flawless Plank': '🪵',
    'Rough Leather': '🟫',
    'Simple Leather': '🟫',
    'Sturdy Leather': '🟫',
    'Fine Leather': '🟫',
    'Exquisite Leather': '🟫',
    'Peerless Leather': '🟫',
    'Ornate Leather': '🟫',
    'Pristine Leather': '🟫',
    'Magnificient Leather': '🟫',
    'Flawless Leather': '🟫',
    'Ferralith T1 Tool': '🔨',
    'Pyrelite T2 Tool': '🔨',
    'Emarium T3 Tool': '🔨',
    'Elenvar T4 Tool': '🔨',
    'Luminite T5 Tool': '🔨',
    'Rathium T6 Tool': '🔨',
    'Aurumite T7 Tool': '🔨',
    'Celestium T8 Tool': '🔨',
    'Umbracite T9 Tool': '🔨'
};

// Tier names (BitCraft)
const tierNames = {
    0: 'Flint',
    1: 'Ferralith',
    2: 'Pyrelite',
    3: 'Emarium',
    4: 'Elenvar',
    5: 'Luminite',
    6: 'Rathium',
    7: 'Aurumite',
    8: 'Celestium',
    9: 'Umbracite',
    10: 'Astralite'
};


// Base effort values by tier
const baseEffort = {
    0: 100,
    1: 250,
    2: 500,
    3: 1000,
    4: 2000,
    5: 4000,
    6: 8000,
    7: 15000,
    8: 25000,
    9: 40000,
    10: 60000
};


let selectedTier = null;
let selectedTool = 'pickaxe'; // Fixed tool since all tools have same costs
let quantity = 1;
let showRawMaterials = false;

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

function selectTier(tier) {
    selectedTier = tier;
    
    // Update UI
    document.querySelectorAll('.tier-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`.tier-card[data-tier="${tier}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    calculateMaterials();
    
    // Save state after tier selection
    try {
        const sharedState = JSON.parse(localStorage.getItem('bcState.v1') || '{}');
        if (!sharedState.materials) sharedState.materials = {};
        sharedState.materials.selectedTier = selectedTier;
        sharedState.materials.quantity = quantity;
        sharedState.materials.showRawMaterials = showRawMaterials;
        localStorage.setItem('bcState.v1', JSON.stringify(sharedState));
    } catch (error) {
        console.error('Error saving tier state:', error);
    }
}

// Removed selectToolType function - all tools use same materials now

function adjustQuantity(change) {
    const input = document.getElementById('quantity');
    let newValue = parseInt(input.value) + change;
    
    if (newValue < 1) newValue = 1;
    if (newValue > 1000) newValue = 1000;
    
    input.value = newValue;
    quantity = newValue;
    
    updatePresetButtonStates();
    
    if (selectedTier !== null) {
        calculateMaterials();
    }
    
    // Save state after quantity change
    try {
        const sharedState = JSON.parse(localStorage.getItem('bcState.v1') || '{}');
        if (!sharedState.materials) sharedState.materials = {};
        sharedState.materials.selectedTier = selectedTier;
        sharedState.materials.quantity = quantity;
        sharedState.materials.showRawMaterials = showRawMaterials;
        localStorage.setItem('bcState.v1', JSON.stringify(sharedState));
    } catch (error) {
        console.error('Error saving quantity state:', error);
    }
}

function setQuantity(value) {
    const input = document.getElementById('quantity');
    input.value = value;
    quantity = value;
    
    updatePresetButtonStates();
    
    if (selectedTier !== null) {
        calculateMaterials();
    }
    
    // Save state after quantity change
    try {
        const sharedState = JSON.parse(localStorage.getItem('bcState.v1') || '{}');
        if (!sharedState.materials) sharedState.materials = {};
        sharedState.materials.selectedTier = selectedTier;
        sharedState.materials.quantity = quantity;
        sharedState.materials.showRawMaterials = showRawMaterials;
        localStorage.setItem('bcState.v1', JSON.stringify(sharedState));
    } catch (error) {
        console.error('Error saving quantity state:', error);
    }
}

function updatePresetButtonStates() {
    const currentQuantity = parseInt(document.getElementById('quantity').value);
    document.querySelectorAll('.preset-btn').forEach(btn => {
        const btnValue = parseInt(btn.textContent);
        if (btnValue === currentQuantity) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Toggle RAW materials mode
function toggleRawMaterials() {
    const toggle = document.getElementById('rawMaterialsToggle');
    showRawMaterials = toggle.checked;
    
    // Recalculate if tier is selected
    if (selectedTier !== null) {
        calculateMaterials();
    }
}

// Recursive function to expand tool dependencies to their materials
function expandToolMaterials(materials, depth = 0) {
    // Prevent infinite recursion
    if (depth > 15) {
        console.warn('Maximum recursion depth reached in tool expansion');
        return materials;
    }
    
    const expandedMaterials = {};
    
    for (const [material, amount] of Object.entries(materials)) {
        // Check if this is a previous tier tool that needs expansion
        const toolMatch = material.match(/^(\w+) T(\d+) Tool$/);
        
        if (toolMatch && materialRequirements[parseInt(toolMatch[2])]) {
            // This is a tool - expand it to its materials
            const toolTier = parseInt(toolMatch[2]);
            const toolMaterials = materialRequirements[toolTier][selectedTool];
            
            // Scale the tool materials by the amount needed
            const scaledToolMaterials = {};
            for (const [toolMat, toolAmount] of Object.entries(toolMaterials)) {
                scaledToolMaterials[toolMat] = toolAmount * amount;
            }
            
            // Recursively expand these materials
            const deeplyExpanded = expandToolMaterials(scaledToolMaterials, depth + 1);
            
            // Merge the expanded materials
            for (const [expandedMat, expandedAmount] of Object.entries(deeplyExpanded)) {
                if (expandedMaterials[expandedMat]) {
                    expandedMaterials[expandedMat] += expandedAmount;
                } else {
                    expandedMaterials[expandedMat] = expandedAmount;
                }
            }
        } else {
            // This is not a tool, add it directly
            if (expandedMaterials[material]) {
                expandedMaterials[material] += amount;
            } else {
                expandedMaterials[material] = amount;
            }
        }
    }
    
    return expandedMaterials;
}

function calculateMaterials() {
    if (selectedTier === null) return;
    
    const resultDiv = document.getElementById('materialsResult');
    const quantityInput = document.getElementById('quantity');
    quantity = parseInt(quantityInput.value) || 1;
    
    // Handle T0 special case
    if (selectedTier === 0) {
        // Update selected info
        document.getElementById('selectedTier').textContent = `T0 - ${tierNames[selectedTier]}`;
        document.getElementById('selectedTool').textContent = 'Tools';
        document.getElementById('selectedQuantity').textContent = `×${quantity}`;
        
        // Show humorous message instead of materials
        document.getElementById('materialsGrid').innerHTML = `
            <div class="t0-message">
                <div class="t0-emoji">😉</div>
                <div class="t0-text">T0: It's just Flint—no shopping list needed!</div>
                <div class="t0-subtext">Just go pick up some sticks and rocks from the ground.</div>
            </div>
        `;
        
        document.getElementById('totalEffort').textContent = 'Minimal';
        document.getElementById('estimatedTime').textContent = 'A few seconds';
        
        // Show results
        resultDiv.style.display = 'block';
        return;
    }
    
    // Get materials for selected tier and tool
    let materials = materialRequirements[selectedTier][selectedTool];
    
    // Apply quantity multiplier first
    const scaledMaterials = {};
    for (const [material, amount] of Object.entries(materials)) {
        scaledMaterials[material] = amount * quantity;
    }
    
    // Expand tool materials if toggle is enabled
    const finalMaterials = showRawMaterials ? expandToolMaterials(scaledMaterials) : scaledMaterials;
    
    // Update selected info
    const materialTypeText = showRawMaterials ? 'Expanded Materials' : 'Crafted Materials';
    document.getElementById('selectedTier').textContent = `T${selectedTier} - ${tierNames[selectedTier]}`;
    document.getElementById('selectedTool').textContent = materialTypeText;
    document.getElementById('selectedQuantity').textContent = `×${quantity}`;
    
    // Build materials grid
    let materialsHTML = '';
    
    // Sort materials for better organization (raw materials first, then alphabetically)
    const sortedMaterials = Object.entries(finalMaterials).sort(([a], [b]) => {
        const rawMaterials = ['Flint', 'Wood', 'Fiber', 'Hide', 'Coal'];
        const orePattern = /Ore$/;
        
        const aIsRaw = rawMaterials.includes(a) || orePattern.test(a);
        const bIsRaw = rawMaterials.includes(b) || orePattern.test(b);
        
        if (aIsRaw && !bIsRaw) return -1;
        if (!aIsRaw && bIsRaw) return 1;
        return a.localeCompare(b);
    });
    
    for (const [material, amount] of sortedMaterials) {
        const icon = materialIcons[material] || '📦';
        
        materialsHTML += `
            <div class="material-item">
                <div class="material-name">
                    <span class="material-icon">${icon}</span>
                    <span>${material}</span>
                </div>
                <div class="material-amount">${amount.toLocaleString()}</div>
            </div>
        `;
    }
    
    document.getElementById('materialsGrid').innerHTML = materialsHTML;
    
    // Update crafting info
    const totalEffort = baseEffort[selectedTier] * quantity;
    document.getElementById('totalEffort').textContent = totalEffort.toLocaleString();
    
    // Calculate estimated time with T10 Mythic tool (power 36, 1.55s tick)
    const toolPower = 36;
    const tickTime = 1.55;
    const ticks = Math.ceil(totalEffort / toolPower);
    const seconds = ticks * tickTime;
    
    let timeStr;
    if (seconds < 60) {
        timeStr = `${seconds.toFixed(1)}s`;
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        timeStr = `${minutes}m ${remainingSeconds}s`;
    } else {
        const hours = Math.floor(seconds / 3600);
        const remainingMinutes = Math.floor((seconds % 3600) / 60);
        timeStr = `${hours}h ${remainingMinutes}m`;
    }
    
    document.getElementById('estimatedTime').textContent = timeStr;
    
    // Show results
    resultDiv.style.display = 'block';
}

// Reset to default values (page-specific localStorage handling)
function resetToDefaults() {
    try {
        // Clear only this page's state from shared storage
        const sharedState = JSON.parse(localStorage.getItem('bcState.v1') || '{}');
        delete sharedState.materials;
        localStorage.setItem('bcState.v1', JSON.stringify(sharedState));
    } catch (error) {
        console.error('Error clearing page state:', error);
    }
    
    // Reset to default values
    selectedTier = null;
    selectedTool = 'pickaxe';
    quantity = 1;
    showRawMaterials = false;
    
    // Reset UI elements
    if (document.getElementById('quantity')) document.getElementById('quantity').value = '1';
    if (document.getElementById('rawMaterialsToggle')) document.getElementById('rawMaterialsToggle').checked = false;
    
    // Clear tier selection
    document.querySelectorAll('.tier-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Update preset button states
    updatePresetButtonStates();
    
    // Hide results
    const resultDiv = document.getElementById('materialsResult');
    if (resultDiv) {
        resultDiv.style.display = 'none';
    }
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
    
    // Save state function for materials calculator
    const saveMaterialsState = () => {
        try {
            const sharedState = JSON.parse(localStorage.getItem('bcState.v1') || '{}');
            sharedState.materials = {
                selectedTier: selectedTier,
                quantity: quantity,
                showRawMaterials: showRawMaterials
            };
            localStorage.setItem('bcState.v1', JSON.stringify(sharedState));
        } catch (error) {
            console.error('Error saving materials state:', error);
        }
    };
    
    // Load state function for materials calculator
    const loadMaterialsState = () => {
        try {
            const sharedState = JSON.parse(localStorage.getItem('bcState.v1') || '{}');
            const state = sharedState.materials;
            
            if (state) {
                selectedTier = state.selectedTier;
                quantity = state.quantity || 1;
                showRawMaterials = state.showRawMaterials || false;
                
                if (document.getElementById('quantity')) document.getElementById('quantity').value = quantity.toString();
                if (document.getElementById('rawMaterialsToggle')) document.getElementById('rawMaterialsToggle').checked = showRawMaterials;
                
                // Restore tier selection
                if (selectedTier !== null) {
                    const tierCard = document.querySelector(`.tier-card[data-tier="${selectedTier}"]`);
                    if (tierCard) {
                        tierCard.classList.add('selected');
                    }
                }
                
                updatePresetButtonStates();
                if (selectedTier !== null) {
                    calculateMaterials();
                }
            }
        } catch (error) {
            console.error('Error loading materials state:', error);
        }
    };
    
    // Load saved state
    loadMaterialsState();
    
    // Add input listener for quantity
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.addEventListener('input', function() {
            quantity = parseInt(this.value) || 1;
            if (selectedTier !== null) {
                calculateMaterials();
            }
            saveMaterialsState();
        });
    }
    
    // Add toggle listener
    const rawToggle = document.getElementById('rawMaterialsToggle');
    if (rawToggle) {
        rawToggle.addEventListener('change', function() {
            saveMaterialsState();
        });
    }
}); 