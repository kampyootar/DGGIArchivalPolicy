class PresentationApp {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 12;
        this.slides = document.querySelectorAll('.slide');
        this.slideNavBtns = document.querySelectorAll('.slide-nav-btn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideSpan = document.getElementById('currentSlide');
        this.totalSlidesSpan = document.getElementById('totalSlides');
        
        this.init();
    }
    
    init() {
        this.updateSlideCounter();
        this.bindEvents();
        this.updateNavigationState();
        this.showSlide(0);
    }
    
    bindEvents() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Slide navigation buttons
        this.slideNavBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Touch/swipe support for mobile
        this.addTouchSupport();
        
        // Prevent context menu on right click (common in presentations)
        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    handleKeyboard(e) {
        switch(e.key) {
            case 'ArrowRight':
            case ' ': // Spacebar
            case 'PageDown':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides - 1);
                break;
            case 'Escape':
                e.preventDefault();
                this.exitFullscreen();
                break;
            case 'F5':
                e.preventDefault();
                this.toggleFullscreen();
                break;
        }
    }
    
    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        const slidesContainer = document.querySelector('.slides-container');
        
        slidesContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        slidesContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Only respond to horizontal swipes that are longer than vertical ones
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        });
    }
    
    showSlide(index) {
        // Hide all slides
        this.slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i < index) {
                slide.style.transform = 'translateX(-100%)';
            } else if (i > index) {
                slide.style.transform = 'translateX(100%)';
            }
        });
        
        // Show current slide
        if (this.slides[index]) {
            this.slides[index].classList.add('active');
            this.slides[index].style.transform = 'translateX(0)';
        }
        
        // Update navigation buttons
        this.slideNavBtns.forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });
        
        this.currentSlide = index;
        this.updateSlideCounter();
        this.updateNavigationState();
        
        // Trigger slide-specific animations or actions
        this.onSlideChanged(index);
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.showSlide(this.currentSlide + 1);
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 0) {
            this.showSlide(this.currentSlide - 1);
        }
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.showSlide(index);
        }
    }
    
    updateSlideCounter() {
        this.currentSlideSpan.textContent = this.currentSlide + 1;
        this.totalSlidesSpan.textContent = this.totalSlides;
    }
    
    updateNavigationState() {
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
    }
    
    onSlideChanged(index) {
        // Add any slide-specific functionality here
        switch(index) {
            case 0: // Title slide
                this.animateTitleSlide();
                break;
            case 7: // First cost slide
            case 8: // Second cost slide
                this.highlightCostCharts();
                break;
            case 9: // Timeline slide
                this.animateTimeline();
                break;
        }
        
        // Scroll to top of slide content
        const slideContent = this.slides[index].querySelector('.slide-content');
        if (slideContent) {
            slideContent.scrollTop = 0;
        }
    }
    
    animateTitleSlide() {
        const titleContent = document.querySelector('.title-content');
        if (titleContent) {
            titleContent.style.opacity = '0';
            titleContent.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                titleContent.style.transition = 'all 0.8s ease-out';
                titleContent.style.opacity = '1';
                titleContent.style.transform = 'translateY(0)';
            }, 100);
        }
    }
    
    highlightCostCharts() {
        const charts = document.querySelectorAll('.cost-chart img, .cost-pie-chart img');
        charts.forEach(chart => {
            chart.style.transform = 'scale(0.95)';
            chart.style.transition = 'transform 0.3s ease-out';
            
            setTimeout(() => {
                chart.style.transform = 'scale(1)';
            }, 100);
        });
    }
    
    animateTimeline() {
        const phases = document.querySelectorAll('.timeline-phase');
        phases.forEach((phase, index) => {
            phase.style.opacity = '0';
            phase.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                phase.style.transition = 'all 0.5s ease-out';
                phase.style.opacity = '1';
                phase.style.transform = 'translateX(0)';
            }, index * 200);
        });
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
    
    exitFullscreen() {
        if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
    
    // Progress tracking
    getProgress() {
        return {
            current: this.currentSlide + 1,
            total: this.totalSlides,
            percentage: Math.round(((this.currentSlide + 1) / this.totalSlides) * 100)
        };
    }
    
    // Slide notes management
    toggleSpeakerNotes() {
        const notes = document.querySelectorAll('.speaker-notes');
        notes.forEach(note => {
            note.style.display = note.style.display === 'none' ? 'block' : 'none';
        });
    }
    
    // Print functionality
    printSlides() {
        window.print();
    }
    
    // Export slide data
    exportSlideData() {
        const slideData = [];
        this.slides.forEach((slide, index) => {
            const title = slide.querySelector('h1')?.textContent || `Slide ${index + 1}`;
            const content = slide.querySelector('.slide-content')?.textContent || '';
            const notes = slide.querySelector('.speaker-notes')?.textContent || '';
            
            slideData.push({
                index: index + 1,
                title: title.trim(),
                content: content.trim(),
                notes: notes.trim()
            });
        });
        
        return slideData;
    }
}

// Utility functions for enhanced presentation features
class PresentationUtils {
    static addProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'presentation-progress';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(var(--color-border-rgb, 94, 82, 64), 0.3);
            z-index: 1000;
        `;
        
        const progressFill = progressBar.querySelector('.progress-fill');
        progressFill.style.cssText = `
            height: 100%;
            background: var(--color-primary);
            transition: width 0.3s ease-out;
            width: 0%;
        `;
        
        document.body.appendChild(progressBar);
        return progressFill;
    }
    
    static updateProgressBar(progressFill, current, total) {
        const percentage = (current / total) * 100;
        progressFill.style.width = `${percentage}%`;
    }
    
    static addKeyboardShortcutsHelp() {
        const helpButton = document.createElement('button');
        helpButton.innerHTML = '?';
        helpButton.className = 'help-btn';
        helpButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--color-primary);
            color: var(--color-btn-primary-text);
            border: none;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        
        helpButton.addEventListener('click', () => {
            alert(`Keyboard Shortcuts:
• Arrow Keys / Space: Navigate slides
• Home: First slide
• End: Last slide
• F5: Toggle fullscreen
• Esc: Exit fullscreen
• Swipe: Navigate on mobile`);
        });
        
        document.body.appendChild(helpButton);
    }
    
    static addAutoAdvance(intervalMs = 30000) {
        let autoAdvanceTimer;
        let isAutoAdvancing = false;
        
        const toggleAutoAdvance = () => {
            if (isAutoAdvancing) {
                clearInterval(autoAdvanceTimer);
                isAutoAdvancing = false;
            } else {
                autoAdvanceTimer = setInterval(() => {
                    if (window.presentationApp.currentSlide < window.presentationApp.totalSlides - 1) {
                        window.presentationApp.nextSlide();
                    } else {
                        clearInterval(autoAdvanceTimer);
                        isAutoAdvancing = false;
                    }
                }, intervalMs);
                isAutoAdvancing = true;
            }
        };
        
        // Add auto-advance toggle button
        const autoBtn = document.createElement('button');
        autoBtn.innerHTML = '⏯️';
        autoBtn.className = 'auto-advance-btn';
        autoBtn.style.cssText = `
            position: fixed;
            bottom: 70px;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--color-secondary);
            color: var(--color-text);
            border: 1px solid var(--color-border);
            font-size: 14px;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        
        autoBtn.addEventListener('click', toggleAutoAdvance);
        document.body.appendChild(autoBtn);
        
        // Pause auto-advance on user interaction
        document.addEventListener('keydown', () => {
            if (isAutoAdvancing) {
                clearInterval(autoAdvanceTimer);
                isAutoAdvancing = false;
            }
        });
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main presentation app
    window.presentationApp = new PresentationApp();
    
    // Add enhanced features
    const progressFill = PresentationUtils.addProgressBar();
    PresentationUtils.addKeyboardShortcutsHelp();
    // Uncomment to enable auto-advance (30 seconds per slide)
    // PresentationUtils.addAutoAdvance(30000);
    
    // Update progress bar on slide change
    const originalShowSlide = window.presentationApp.showSlide.bind(window.presentationApp);
    window.presentationApp.showSlide = function(index) {
        originalShowSlide(index);
        PresentationUtils.updateProgressBar(progressFill, index + 1, this.totalSlides);
    };
    
    // Initialize progress bar
    PresentationUtils.updateProgressBar(progressFill, 1, window.presentationApp.totalSlides);
    
    // Add print styles
    const printStyles = document.createElement('style');
    printStyles.textContent = `
        @media print {
            .presentation-header,
            .speaker-notes,
            .presentation-progress,
            .help-btn,
            .auto-advance-btn {
                display: none !important;
            }
            
            .slide {
                position: static !important;
                transform: none !important;
                opacity: 1 !important;
                page-break-after: always;
                height: auto !important;
            }
            
            .slide-content {
                padding: 20px !important;
            }
            
            .slide-content h1 {
                font-size: 24px !important;
            }
        }
    `;
    document.head.appendChild(printStyles);
    
    // Preload images for better performance
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.src && !img.complete) {
            const preloadImg = new Image();
            preloadImg.src = img.src;
        }
    });
    
    // Handle visibility change (pause/resume on tab switch)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause any ongoing animations or auto-advance
            document.body.classList.add('presentation-paused');
        } else {
            // Resume
            document.body.classList.remove('presentation-paused');
        }
    });
    
    // Add error handling for missing resources
    window.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
            console.warn('Failed to load image:', e.target.src);
            // Optionally replace with placeholder or hide
            e.target.style.display = 'none';
        }
    });
    
    // Smooth scrolling for slide content
    document.querySelectorAll('.slide-content').forEach(content => {
        content.style.scrollBehavior = 'smooth';
    });

	    const cards = document.querySelectorAll('.need-problem-card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Collapse all cards first
            cards.forEach(c => c.classList.remove('expanded'));
            // Expand the clicked card
            card.classList.add('expanded');
        });

        // Handle close button inside card
        const closeBtn = card.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering card click
                card.classList.remove('expanded');
            });
        }
    });
    
    console.log('DGGI Digital Archival Policy Presentation loaded successfully');
    console.log('Use keyboard shortcuts or navigation buttons to control the presentation');
    console.log('Press ? for help');
});


