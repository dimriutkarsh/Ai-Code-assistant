class CodeGenerator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.initializeAnimations();
    }

    initializeElements() {
        this.languageSelect = document.getElementById('language-select');
        this.promptInput = document.getElementById('prompt-input');
        this.generateBtn = document.getElementById('generate-btn');
        this.copyBtn = document.getElementById('copy-btn');
        this.emptyState = document.getElementById('empty-state');
        this.codeOutput = document.getElementById('code-output');
        this.generatedCode = document.getElementById('generated-code');
        this.toast = document.getElementById('toast');
        this.promptButtons = document.querySelectorAll('.prompt-btn');
        this.generateBtnText = this.generateBtn.querySelector('.button-text');
        this.generateBtnSpinner = this.generateBtn.querySelector('.loading-spinner');
    }

    bindEvents() {
        this.generateBtn.addEventListener('click', () => this.generateCode());
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        
        // Sample prompt buttons
        this.promptButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.useSamplePrompt(e));
        });

        // Enter key to generate
        this.promptInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.generateCode();
            }
        });

        // Auto-resize textarea
        this.promptInput.addEventListener('input', () => {
            this.autoResizeTextarea();
        });
        
        // Add input animation
        this.promptInput.addEventListener('focus', () => {
            this.promptInput.parentElement.style.transform = 'scale(1.02)';
        });
        
        this.promptInput.addEventListener('blur', () => {
            this.promptInput.parentElement.style.transform = 'scale(1)';
        });
    }
    
    initializeAnimations() {
        // Stagger animation for prompt buttons
        this.promptButtons.forEach((btn, index) => {
            btn.style.animationDelay = `${index * 0.1}s`;
            btn.classList.add('animate-in');
        });
        
        // Add typing animation to placeholder
        this.addTypingAnimation();
    }
    
    addTypingAnimation() {
        const placeholder = "e.g., Create a responsive navigation bar with dropdown menu and mobile toggle...";
        let currentText = "";
        let index = 0;
        
        const typeWriter = () => {
            if (index < placeholder.length) {
                currentText += placeholder.charAt(index);
                this.promptInput.setAttribute('placeholder', currentText + '|');
                index++;
                setTimeout(typeWriter, 50);
            } else {
                // Remove cursor and restart after delay
                this.promptInput.setAttribute('placeholder', placeholder);
                setTimeout(() => {
                    currentText = "";
                    index = 0;
                    setTimeout(typeWriter, 3000);
                }, 2000);
            }
        };
        
        // Start typing animation after page load
        setTimeout(typeWriter, 1000);
    }
    
    autoResizeTextarea() {
        this.promptInput.style.height = 'auto';
        this.promptInput.style.height = this.promptInput.scrollHeight + 'px';
        
        // Add subtle animation
        this.promptInput.style.transition = 'height 0.2s ease-out';
    }

    useSamplePrompt(event) {
        const btn = event.target;
        const language = btn.dataset.language;
        const prompt = btn.dataset.prompt;
        
        this.languageSelect.value = language;
        this.promptInput.value = prompt;
        this.promptInput.focus();
        this.autoResizeTextarea();
        
        // Add visual feedback
        btn.style.transform = 'translateX(8px) translateY(-2px) scale(0.98)';
        btn.style.boxShadow = '0 10px 25px rgba(168, 85, 247, 0.3)';
        setTimeout(() => {
            btn.style.transform = 'translateX(8px) translateY(-2px)';
        }, 150);
    }

    async generateCode() {
        const prompt = this.promptInput.value.trim();
        const language = this.languageSelect.value;

        if (!prompt) {
            this.showToast('Please enter a description', 'error');
            this.promptInput.focus();
            return;
        }

        await this.setGenerating(true);

        try {
            // Add button animation
            this.generateBtn.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.generateBtn.style.transform = '';
            }, 100);
            
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    language: language
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate code');
            }

            this.displayCode(data.code, data.language);
            await this.showToast('Code generated successfully! ✨', 'success');
            
        } catch (error) {
            console.error('Generation error:', error);
            await this.showToast(`❌ ${error.message}`, 'error');
        } finally {
            await this.setGenerating(false);
        }
    }

    displayCode(code, language) {
        // Hide empty state, show code output
        this.emptyState.style.opacity = '0';
        this.emptyState.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            this.emptyState.style.display = 'none';
            this.codeOutput.style.display = 'block';
            this.codeOutput.style.opacity = '0';
            this.codeOutput.style.transform = 'translateY(20px)';
            
            // Animate in
            setTimeout(() => {
                this.codeOutput.style.transition = 'all 0.4s ease-out';
                this.codeOutput.style.opacity = '1';
                this.codeOutput.style.transform = 'translateY(0)';
            }, 50);
        }, 200);
        
        // Set the code content
        this.generatedCode.textContent = code;
        this.generatedCode.className = `language-${language}`;
        
        // Enable copy button
        this.copyBtn.disabled = false;
        this.copyBtn.style.animation = 'pulse 0.5s ease-out';
        
        // Trigger Prism.js highlighting
        if (window.Prism) {
            Prism.highlightElement(this.generatedCode);
        }
        
        // Scroll to output on mobile
        if (window.innerWidth <= 1024) {
            this.codeOutput.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    async copyToClipboard() {
        const code = this.generatedCode.textContent;
        
        try {
            await navigator.clipboard.writeText(code);
            await this.showToast('📋 Code copied to clipboard!', 'success');
            
            // Visual feedback
            const originalText = this.copyBtn.innerHTML;
            const originalBg = this.copyBtn.style.background;
            
            // Success state
            this.copyBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            this.copyBtn.style.transform = 'scale(1.05)';
            this.copyBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
                Copied! ✨
            `;
            
            setTimeout(() => {
                this.copyBtn.innerHTML = originalText;
                this.copyBtn.style.background = originalBg;
                this.copyBtn.style.transform = '';
            }, 1500);
            
        } catch (error) {
            console.error('Copy failed:', error);
            await this.showToast('❌ Failed to copy code', 'error');
        }
    }

    async setGenerating(isGenerating) {
        return new Promise((resolve) => {
            if (isGenerating) {
                // Fade out text, fade in spinner
                this.generateBtnText.style.opacity = '0';
                this.generateBtnText.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    this.generateBtnText.style.display = 'none';
                    this.generateBtnSpinner.style.display = 'block';
                    this.generateBtnSpinner.style.opacity = '0';
                    this.generateBtnSpinner.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        this.generateBtnSpinner.style.transition = 'all 0.3s ease-out';
                        this.generateBtnSpinner.style.opacity = '1';
                        this.generateBtnSpinner.style.transform = 'scale(1)';
                        this.generateBtn.disabled = true;
                        resolve();
                    }, 50);
                }, 150);
            } else {
                // Fade out spinner, fade in text
                this.generateBtnSpinner.style.opacity = '0';
                this.generateBtnSpinner.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    this.generateBtnSpinner.style.display = 'none';
                    this.generateBtnText.style.display = 'block';
                    this.generateBtnText.style.opacity = '0';
                    this.generateBtnText.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        this.generateBtnText.style.transition = 'all 0.3s ease-out';
                        this.generateBtnText.style.opacity = '1';
                        this.generateBtnText.style.transform = 'scale(1)';
                        this.generateBtn.disabled = false;
                        resolve();
                    }, 50);
                }, 150);
            }
        });
    }
        

    async showToast(message, type = 'success') {
        return new Promise((resolve) => {
            const toast = this.toast;
            
            // Update toast content
            const span = toast.querySelector('span');
            span.textContent = message;
            
            // Update toast style based on type
            if (type === 'error') {
                toast.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            } else {
                toast.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            }
            
            // Show toast with animation
            toast.classList.add('show');
            
            // Add shake animation for errors
            if (type === 'error') {
                toast.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    toast.style.animation = '';
                }, 500);
            }
            
            // Hide after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(resolve, 300);
            }, 3000);
        });
    }
}

// Language-specific examples
const LANGUAGE_EXAMPLES = {
    html: [
        "Create a modern contact form with validation styling",
        "Build a responsive hero section with background image",
        "Make a product card with image, title, price, and button"
    ],
    css: [
        "Create a loading spinner animation",
        "Design a responsive navigation menu with hamburger",
        "Build a card hover effect with 3D transform"
    ],
    javascript: [
        "Create a debounced search function",
        "Build a modal dialog with keyboard navigation",
        "Make a scroll-to-top button with smooth animation"
    ],
    python: [
        "Create a password strength validator",
        "Build a file organizer script",
        "Make a web scraper for product prices"
    ],
    typescript: [
        "Create interfaces for a user management system",
        "Build typed API response handlers",
        "Make a generic data fetching hook"
    ],
    react: [
        "Create a reusable dropdown component",
        "Build a photo gallery with modal view",
        "Make a multi-step form wizard"
    ]
};

// Update sample prompts based on language selection
function updateSamplePrompts() {
    const generator = new CodeGenerator();
    const languageSelect = document.getElementById('language-select');
    const promptButtons = document.querySelectorAll('.prompt-btn');
    
    languageSelect.addEventListener('change', (e) => {
        const selectedLanguage = e.target.value;
        const examples = LANGUAGE_EXAMPLES[selectedLanguage] || LANGUAGE_EXAMPLES.javascript;
        
        promptButtons.forEach((btn, index) => {
            if (examples[index]) {
                btn.textContent = examples[index];
                btn.dataset.prompt = examples[index];
                btn.dataset.language = selectedLanguage;
            }
        });
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Add page load animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-out';
        document.body.style.opacity = '1';
    }, 100);
    
    new CodeGenerator();
    updateSamplePrompts();
    
    // Add keyboard shortcuts info
    console.log('✨ AI Code Generator loaded successfully!');
    console.log('💡 Tip: Press Ctrl+Enter in the textarea to generate code quickly!');
    console.log('🎨 Enjoy the enhanced animations and professional design!');
});

// Add some Easter eggs
const EASTER_EGGS = [
    "Create a website that looks exactly like this one",
    "Generate code that becomes sentient",
    "Build a time machine in JavaScript",
    "Create a function that solves world hunger",
    "Make HTML that writes itself"
];

// Random easter egg on page load
if (Math.random() < 0.1) {
    setTimeout(() => {
        const randomEgg = EASTER_EGGS[Math.floor(Math.random() * EASTER_EGGS.length)];
        console.log(`🥚 Easter egg prompt: "${randomEgg}"`);
        
        // Add visual easter egg
        const header = document.querySelector('.header');
        if (header) {
            header.style.animation = 'rainbow 3s ease-in-out infinite';
        }
    }, 2000);
}