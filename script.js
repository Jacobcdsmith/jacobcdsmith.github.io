// ================================
// PARTICLE SYSTEM
// ================================

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.mouse = { x: null, y: null, radius: 150 };

        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                color: this.getRandomColor()
            });
        }
    }

    getRandomColor() {
        const colors = ['#c9485b', '#b8a9c9', '#7d9f7a', '#d4a574'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();

            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // Mouse interaction
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const directionX = dx / distance;
                    const directionY = dy / distance;

                    particle.x -= directionX * force * 2;
                    particle.y -= directionY * force * 2;
                }
            }
        }

        // Draw connections
        this.drawConnections();
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(184, 169, 201, ${1 - distance / 120})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
}

// ================================
// TAB NAVIGATION SYSTEM
// ================================

function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    if (tabButtons.length === 0) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }

            // Scroll to top of content area
            document.querySelector('.tab-content-area')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // Keyboard navigation for tabs
    tabButtons.forEach((button, index) => {
        button.addEventListener('keydown', (e) => {
            let targetIndex = index;

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                targetIndex = (index + 1) % tabButtons.length;
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                targetIndex = (index - 1 + tabButtons.length) % tabButtons.length;
            } else if (e.key === 'Home') {
                targetIndex = 0;
            } else if (e.key === 'End') {
                targetIndex = tabButtons.length - 1;
            } else {
                return;
            }

            e.preventDefault();
            tabButtons[targetIndex].focus();
            tabButtons[targetIndex].click();
        });
    });
}

// ================================
// SCROLL ANIMATIONS FOR TAB CONTENT
// ================================

function initContentAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll('.project-card, .timeline-item, .skill-category, .education-item, .stat, .contact-method');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Re-trigger animations when switching tabs
function refreshTabAnimations(tabId) {
    const panel = document.getElementById(tabId);
    if (!panel) return;

    const animatedElements = panel.querySelectorAll('.project-card, .timeline-item, .skill-category, .education-item, .stat, .contact-method');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 50); // Staggered animation
    });
}

// Enhanced tab click handler with animations
function initEnhancedTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    if (tabButtons.length === 0) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
                
                // Trigger staggered animations for panel content
                setTimeout(() => refreshTabAnimations(targetTab), 50);
            }
        });
    });

    // Initial animation for first tab
    setTimeout(() => {
        const activeTab = document.querySelector('.tab-panel.active');
        if (activeTab) {
            refreshTabAnimations(activeTab.id);
        }
    }, 100);
}

// ================================
// HEADER SCROLL EFFECT
// ================================

function initHeaderScroll() {
    const header = document.querySelector('.app-header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', throttle(() => {
        const currentScroll = window.pageYOffset;

        // Add shadow on scroll
        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 30px rgba(201, 72, 91, 0.15)';
        } else {
            header.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    }, 100));
}

// ================================
// EASTER EGG: KONAMI CODE
// ================================

function initKonamiCode() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateMatrixMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

function activateMatrixMode() {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', '#00FF41');
    root.style.setProperty('--color-secondary', '#00FF41');

    // Show message
    const message = document.createElement('div');
    message.textContent = 'MATRIX MODE ACTIVATED';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #00FF41;
        font-size: 3rem;
        font-weight: bold;
        z-index: 9999;
        text-shadow: 0 0 20px #00FF41;
        animation: fadeOut 2s forwards;
        font-family: 'Courier New', monospace;
    `;
    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
        // Reset to biological theme colors
        root.style.setProperty('--color-primary', '#c9485b');
        root.style.setProperty('--color-secondary', '#b8a9c9');
    }, 3000);
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        30% { transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; }
        100% { opacity: 0; }
    }
`;
document.head.appendChild(style);

// ================================
// PERFORMANCE OPTIMIZATION
// ================================

function initPerformanceOptimizations() {
    // Lazy load images if any are added
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ================================
// UTILITY FUNCTIONS
// ================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ================================
// INITIALIZATION
// ================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    new ParticleSystem();

    // Initialize tab navigation (primary feature)
    initEnhancedTabNavigation();
    
    // Initialize header effects
    initHeaderScroll();
    
    // Initialize easter egg
    initKonamiCode();
    
    // Initialize performance optimizations
    initPerformanceOptimizations();

    console.log('%c⚡ JACOB C. SMITH | PORTFOLIO SYSTEM ONLINE', 'color: #c9485b; font-size: 16px; font-weight: bold;');
    console.log('%c🧠 Systems-Oriented Data Analyst • Consciousness Researcher', 'color: #b8a9c9; font-size: 12px;');
    console.log('%c🌿 Try the Konami code...', 'color: #7d9f7a; font-size: 11px;');
});
