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


// Tier colors for material grouping (matching materials page tier cards)
const tierColors = {
    0: { bg: 'rgba(255, 255, 255, 0.1)', border: '#e0e0e0', text: '#f5f5f5' },
    1: { bg: 'rgba(139, 69, 19, 0.2)', border: '#8b4513', text: '#d2691e' },
    2: { bg: 'rgba(255, 152, 0, 0.2)', border: '#ff9800', text: '#ffab40' },
    3: { bg: 'rgba(66, 66, 66, 0.2)', border: '#424242', text: '#757575' },
    4: { bg: 'rgba(33, 150, 243, 0.2)', border: '#2196f3', text: '#64b5f6' },
    5: { bg: 'rgba(76, 175, 80, 0.2)', border: '#4caf50', text: '#81c784' },
    6: { bg: 'rgba(244, 67, 54, 0.2)', border: '#f44336', text: '#ef5350' },
    7: { bg: 'rgba(156, 39, 176, 0.2)', border: '#9c27b0', text: '#ba68c8' },
    8: { bg: 'rgba(255, 235, 59, 0.2)', border: '#ffeb3b', text: '#fff176' },
    9: { bg: 'rgba(121, 85, 72, 0.2)', border: '#795548', text: '#a1887f' },
    10: { bg: 'rgba(255, 255, 255, 0.3)', border: '#ffffff', text: '#ffffff' }
};

// Function to classify materials by tier
function getMaterialTier(materialName) {
    // T0 materials
    if (['Flint', 'Wood', 'Fiber'].includes(materialName)) return 0;
    
    // T1 materials
    if (materialName.includes('Ferralith') || materialName.includes('Rough')) return 1;
    
    // T2 materials 
    if (materialName.includes('Pyrelite') || materialName.includes('Simple')) return 2;
    
    // T3 materials
    if (materialName.includes('Emarium') || materialName.includes('Sturdy')) return 3;
    
    // T4 materials
    if (materialName.includes('Elenvar') || materialName.includes('Fine')) return 4;
    
    // T5 materials
    if (materialName.includes('Luminite') || materialName.includes('Exquisite')) return 5;
    
    // T6 materials
    if (materialName.includes('Rathium') || materialName.includes('Peerless')) return 6;
    
    // T7 materials
    if (materialName.includes('Aurumite') || materialName.includes('Ornate')) return 7;
    
    // T8 materials
    if (materialName.includes('Celestium') || materialName.includes('Pristine')) return 8;
    
    // T9 materials
    if (materialName.includes('Umbracite') || materialName.includes('Magnificient')) return 9;
    
    // T10 materials
    if (materialName.includes('Astralite') || materialName.includes('Flawless')) return 10;
    
    // Default to T0 for unknown materials
    return 0;
}

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
let allItems = []; // Store all items loaded from API

// Load all items from API on page load
async function loadAllItems() {
  try {
    console.log('Loading all items from API...');
    const res = await fetch('http://localhost:3000/proxy/items');
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    allItems = Array.isArray(data) ? data : data?.items ?? [];
    console.log(`Loaded ${allItems.length} items from API`);
    
  } catch (error) {
    console.error("Failed to load items:", error);
    allItems = [];
  }
}

function selectTier(tier) {
    selectedTier = tier;
    
    // Update UI
    document.querySelectorAll('.tier-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelectorAll('.tier-card-compact').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`.tier-card[data-tier="${tier}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    const selectedCompactCard = document.querySelector(`.tier-card-compact[data-tier="${tier}"]`);
    if (selectedCompactCard) {
        selectedCompactCard.classList.add('selected');
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
    if (!input) {
        console.warn('Quantity input not found');
        return;
    }
    
    const currentValue = Number(input.value);
    const safeCurrentValue = Number.isFinite(currentValue) ? currentValue : 1;
    let newValue = safeCurrentValue + change;
    
    // Clamp to valid range
    newValue = Math.max(1, Math.min(1000, newValue));
    
    input.value = newValue;
    quantity = newValue;
    
    if (typeof updatePresetButtonStates === 'function') {
        updatePresetButtonStates();
    }
    
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

    async function calculateMaterials() {
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
    
    // Build materials grid grouped by tier in compact boxes with multiple columns
    let materialsHTML = '';
    
    // Group materials by tier
    const materialsByTier = {};
    Object.entries(finalMaterials).forEach(([material, amount]) => {
        const tier = getMaterialTier(material);
        if (!materialsByTier[tier]) {
            materialsByTier[tier] = [];
        }
        materialsByTier[tier].push([material, amount]);
    });
    
    // Sort tiers and materials within each tier
    const sortedTiers = Object.keys(materialsByTier).sort((a, b) => parseInt(a) - parseInt(b));
    
    for (const tierStr of sortedTiers) {
        const tier = parseInt(tierStr);
        const materials = materialsByTier[tier];
        const colors = tierColors[tier];
        
        // Sort materials within tier alphabetically
        materials.sort(([a], [b]) => a.localeCompare(b));
        
        // Create compact tier box
        materialsHTML += `<div class="tier-box-compact">`;
        
        // Add tier header
        materialsHTML += `
            <div class="tier-box-header" style="background: ${colors.bg}; border-bottom: 2px solid ${colors.border}; color: ${colors.text};">
                <span class="tier-box-title">T${tier} - ${tierNames[tier] || 'Unknown'}</span>
                <span class="tier-box-count">${materials.length} item${materials.length !== 1 ? 's' : ''}</span>
            </div>
        `;
        
        // Create materials grid within the tier box
        materialsHTML += `<div class="tier-materials-grid">`;
        
        // Add materials for this tier in grid layout
        for (const [material, amount] of materials) {
            const icon = materialIcons[material] || '📦';
            
            materialsHTML += `
                <div class="material-item-compact tier-${tier}" style="border-left: 3px solid ${colors.border};">
                    <div class="material-left-compact">
                        <span class="material-icon-compact">${icon}</span>
                        <span class="material-name-compact" style="color: ${colors.text};">${material}</span>
                    </div>
                    <span class="material-amount-compact" style="color: ${colors.text};">${amount.toLocaleString()}</span>
                </div>
            `;
        }
        
        materialsHTML += `</div>`; // Close materials grid
        materialsHTML += `</div>`; // Close tier box
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

function searchForItem(){
  const input = document.getElementById("itemSearch");
  const query = input.value.trim().toLowerCase();
  const materialsGrid = document.getElementById("materialsGrid");
  
  if (!query) {
    materialsGrid.innerHTML = '';
    return;
  }
  
  // Check if items are loaded
  if (allItems.length === 0) {
    materialsGrid.innerHTML = `
      <div class="t0-message">
        <div class="t0-emoji">⏳</div>
        <div class="t0-text">Loading items...</div>
        <div class="t0-subtext">Please wait while items are being loaded from the server</div>
      </div>
    `;
    return;
  }
  
  // Filter items by name containing search query, volume 0 and rarity 1
  const filteredItems = allItems.filter(item => {
    const name = (item.name ?? item.displayName ?? "").toLowerCase();
    const matchesName = name.includes(query);
    // const hasVolumeZero = (item.volume === 0 || item.volume === "0");
    // const hasRarityOne = (item.rarity === 1 || item.rarity === "1");
    
    return matchesName ;//&& hasVolumeZero && hasRarityOne;
  });

  if (filteredItems.length === 0) {
    materialsGrid.innerHTML = `
      <div class="t0-message">
        <div class="t0-emoji">😕</div>
        <div class="t0-text">No items found for "${query}"</div>
        <div class="t0-subtext">with volume 0 and rarity 1</div>
      </div>
    `;
    return;
  }

  // Sort results by name
  filteredItems.sort((a, b) => {
    const nameA = (a.name ?? a.displayName ?? "").toLowerCase();
    const nameB = (b.name ?? b.displayName ?? "").toLowerCase();
    return nameA.localeCompare(nameB);
  });

  // Build markup for filtered items with icons
  const html = filteredItems.map(item => {
    const name = item.name ?? item.displayName ?? "(no name)";
    const tier = item.tier ?? "?";
    var iconPath = item.iconAssetName;
  if (!item.iconAssetName.startsWith("GeneratedIcons/")){
     iconPath=`GeneratedIcons/${item.iconAssetName}`;
  }
  
 
const icon = iconPath
  ? `<img src="https://bitjita.com/${iconPath}.webp" alt="${name}" class="item-icon" />`
  : '';
    return `
      <div class="search-result-item">
        <div class="item-info">
          <div class="item-icon-container">${icon}</div>
          <div class="item-details">
            <div class="item-name">${name}</div>
            <div class="item-tier">T${tier}</div>
          </div>
        </div>
        <div class="item-stats">
          <div class="stat">Vol: ${item.iconAssetName ?? 0}</div>
          
        </div>
      </div>
    `;
  }).join("");

  // Insert into DOM
  materialsGrid.innerHTML = html;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load all items from API on page load
    loadAllItems();
    
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

    // Add input listener for search input with debouncing
    const itemSearch = document.getElementById('itemSearch');
    if (itemSearch) {
        let searchTimeout;
        itemSearch.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchForItem();
            }, 300); // Debounce for 300ms
        });
    }
}); 