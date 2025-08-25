// BitCraft Calculator - Universal Theme Initialization
// This script runs before page render to prevent theme flash
(function() {
    'use strict';
    
    // Load saved theme immediately before page renders
    const savedTheme = localStorage.getItem('bcState.v1.theme') || 'dark';
    
    // Apply theme to body class immediately
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-mode-loading');
        document.documentElement.classList.remove('dark-mode-loading');
    } else {
        document.documentElement.classList.add('dark-mode-loading');
        document.documentElement.classList.remove('light-mode-loading');
    }
    
    // When DOM is ready, transfer classes to body and update toggle
    function initializeTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle?.querySelector('.theme-icon');
        
        // Transfer theme from html to body
        if (document.documentElement.classList.contains('light-mode-loading')) {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            if (themeIcon) themeIcon.textContent = '☀️';
        } else {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            if (themeIcon) themeIcon.textContent = '🌙';
        }
        
        // Clean up loading classes
        document.documentElement.classList.remove('light-mode-loading', 'dark-mode-loading');
    }
    
    // Initialize theme when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTheme);
    } else {
        initializeTheme();
    }
})();

// Universal theme toggle function
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) {
        console.warn('Theme toggle button not found');
        return;
    }
    
    const themeIcon = themeToggle.querySelector('.theme-icon');
    if (!themeIcon) {
        console.warn('Theme icon not found');
        return;
    }
    
    try {
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            themeIcon.textContent = '☀️';
            localStorage.setItem('bcState.v1.theme', 'light');
        } else {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            themeIcon.textContent = '🌙';
            localStorage.setItem('bcState.v1.theme', 'dark');
        }
    } catch (error) {
        console.error('Error toggling theme:', error);
    }
}