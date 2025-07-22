// AI Code Generator JavaScript

// DOM Elements
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const languageSelect = document.getElementById('language-select');
const promptInput = document.getElementById('prompt-input');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const emptyState = document.getElementById('empty-state');
const codeOutput = document.getElementById('code-output');
const generatedCode = document.getElementById('generated-code');
const toast = document.getElementById('toast');
const loadingOverlay = document.getElementById('loading-overlay');
const promptBtns = document.querySelectorAll('.prompt-btn');

// State
let isGenerating = false;
let currentTheme = 'light';

// Sample code examples for demonstration

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Show page loader for 2 seconds
    const pageLoader = document.getElementById('page-loader');
    setTimeout(() => {
        pageLoader.classList.add('hidden');
        // Remove from DOM after animation
        setTimeout(() => {
            pageLoader.remove();
        }, 500);
    }, 2000);
    
    initializeEventListeners();
    initializeTheme();
});

function initializeEventListeners() {
    // Theme toggle
    themeToggleBtn.addEventListener('click', toggleTheme);
    
    // Generate button click
    generateBtn.addEventListener('click', handleGenerate);

    // Copy button click
    copyBtn.addEventListener('click', handleCopy);

    // Sample prompt buttons
    promptBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const language = this.dataset.language;
            const prompt = this.dataset.prompt;
            
            // Update language selector
            languageSelect.value = language;
            
            // Update prompt input
            promptInput.value = prompt;
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Language change handler
    languageSelect.addEventListener('change', function() {
        // Update code output language class if code is displayed
        if (codeOutput.style.display !== 'none') {
            generatedCode.className = `language-${this.value}`;
            // Re-highlight code
            if (window.Prism) {
                Prism.highlightElement(generatedCode);
            }
        }
    });
}

function initializeTheme() {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    currentTheme = savedTheme;
    document.body.className = `${currentTheme}-theme`;
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.className = `${currentTheme}-theme`;
    localStorage.setItem('theme', currentTheme);
    
    // Add a subtle animation to the toggle
    themeToggleBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        themeToggleBtn.style.transform = '';
    }, 150);
}

function handleGenerate() {
    const language = languageSelect.value;
    const prompt = promptInput.value.trim();
    
    if (!prompt) {
        showToast('Please enter a description first!', 'error');
        return;
    }

    if (isGenerating) return;

    // Start loading state
    isGenerating = true;
    updateGenerateButton(true);
    showLoadingOverlay(true);

    // Simulate API call with timeout
    setTimeout(() => {
        generateCode(language, prompt);
    }, 2000 + Math.random() * 2000); // Random delay between 2-4 seconds
}

function generateCode(language, prompt) {
    try {
        // For demo purposes, use sample codes
        const code = sampleCodes[language] || sampleCodes.javascript;
        
        // Update UI with generated code
        showGeneratedCode(code, language);
        
        // Show success toast
        showToast('Code generated successfully!', 'success');
        
    } catch (error) {
        console.error('Generation error:', error);
        showToast('Failed to generate code. Please try again.', 'error');
    } finally {
        // End loading state
        isGenerating = false;
        updateGenerateButton(false);
        showLoadingOverlay(false);
    }
}

function showLoadingOverlay(show) {
    if (show) {
        loadingOverlay.style.display = 'flex';
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.opacity = '1';
        }, 10);
    } else {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 300);
    }
}

function showGeneratedCode(code, language) {
    // Hide empty state
    emptyState.style.display = 'none';
    
    // Show code output
    codeOutput.style.display = 'block';
    
    // Update code content and language
    generatedCode.textContent = code;
    generatedCode.className = `language-${language}`;
    
    // Enable copy button
    copyBtn.disabled = false;
    
    // Highlight code if Prism is available
    if (window.Prism) {
        Prism.highlightElement(generatedCode);
    }
    
    // Add animation
    codeOutput.style.opacity = '0';
    codeOutput.style.transform = 'translateY(20px)';
    setTimeout(() => {
        codeOutput.style.opacity = '1';
        codeOutput.style.transform = 'translateY(0)';
    }, 50);
}

function handleCopy() {
    const code = generatedCode.textContent;
    
    if (!code) return;
    
    navigator.clipboard.writeText(code).then(() => {
        showToast('Code copied to clipboard!', 'success');
        
        // Visual feedback on copy button
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="20 6L9 17l-5-5"></path>
            </svg>
            Copied!
        `;
        copyBtn.style.background = 'var(--green-500)';
        copyBtn.style.color = 'white';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '';
            copyBtn.style.color = '';
        }, 2000);
        
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Failed to copy code', 'error');
    });
}

function updateGenerateButton(loading) {
    const buttonText = generateBtn.querySelector('.button-text');
    const loadingSpinner = generateBtn.querySelector('.loading-spinner');
    
    if (loading) {
        buttonText.style.display = 'none';
        loadingSpinner.style.display = 'flex';
        generateBtn.disabled = true;
        generateBtn.style.background = 'linear-gradient(135deg, var(--green-600), var(--green-700))';
    } else {
        buttonText.style.display = 'flex';
        loadingSpinner.style.display = 'none';
        generateBtn.disabled = false;
        generateBtn.style.background = '';
    }
}

function showToast(message, type = 'success') {
    const toastSpan = toast.querySelector('span');
    toastSpan.textContent = message;
    
    // Update toast style based on type
    if (type === 'error') {
        toast.className = 'toast error';
    } else {
        toast.className = 'toast';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Export functions for potential use
window.CodeGenerator = {
    handleGenerate,
    showGeneratedCode,
    showToast,
    toggleTheme
};