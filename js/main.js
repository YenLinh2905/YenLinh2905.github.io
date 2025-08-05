// ===== PORTFOLIO JAVASCRIPT =====

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
});

// ===== NAVIGATION FUNCTIONALITY =====
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupActiveSection();
    }

    setupScrollEffect() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
    }

    setupMobileMenu() {
        this.navToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
            }
        });
    }

    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupActiveSection() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// ===== SKILL BARS ANIMATION =====
class SkillBars {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-bar');
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBar = entry.target;
                    const level = skillBar.getAttribute('data-level');
                    skillBar.style.width = `${level}%`;
                }
            });
        }, options);

        this.skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }
}

// ===== TYPING ANIMATION =====
class TypingAnimation {
    constructor() {
        this.typewriterElement = document.querySelector('.hero-subtitle');
        this.texts = [
            'Software Engineer',
            'React Developer',
            'Full-Stack Developer',
            'Java Developer',
            'Problem Solver'
        ];
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.typeSpeed = 100;
        this.deleteSpeed = 50;
        this.pauseTime = 2000;
        
        if (this.typewriterElement) {
            this.init();
        }
    }

    init() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            this.typewriterElement.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.typewriterElement.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }

        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            typeSpeed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ===== CONTACT FORM =====
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault(); // Prevent default form submission
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!this.validateForm(data)) {
            return;
        }

        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Submit to Formspree via fetch
        fetch('https://formspree.io/f/xldlpbpe', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                this.showNotification('Message sent successfully!', 'success');
                this.form.reset();
                
                // Reload page after 2 seconds
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                throw new Error('Failed to send message');
            }
        })
        .catch(error => {
            this.showNotification('Failed to send message. Please try again.', 'error');
            console.error('Form submission error:', error);
        })
        .finally(() => {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }

    validateForm(data) {
        const errors = [];
        
        if (!data.name || !data.name.trim()) errors.push('Name is required');
        if (!data.email || !data.email.trim()) errors.push('Email is required');
        if (data.email && !this.isValidEmail(data.email)) errors.push('Valid email is required');
        if (!data.subject && !data._subject) errors.push('Subject is required');
        if (data.subject && !data.subject.trim()) errors.push('Subject is required');
        if (data._subject && !data._subject.trim()) errors.push('Subject is required');
        if (!data.message || !data.message.trim()) errors.push('Message is required');
        
        if (errors.length > 0) {
            this.showNotification(errors.join(', '), 'error');
            return false;
        }
        
        return true;
    }

    isValidEmail(email) {
        if (!email) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            backgroundColor: type === 'success' ? '#28a745' : '#dc3545',
            color: 'white',
            borderRadius: '5px',
            zIndex: '9999',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupParallax();
        this.setupCounters();
    }

    setupParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.avatar-decoration');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    setupCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const options = {
            threshold: 0.7
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const originalText = counter.textContent;
                    
                    // Check if it's a decimal number (like GPA)
                    const isDecimal = originalText.includes('.');
                    let target, suffix;
                    
                    if (isDecimal) {
                        // For decimal numbers like "3.59"
                        target = parseFloat(originalText.replace(/[^\d.]/g, ''));
                        suffix = originalText.replace(/[\d.]/g, '');
                    } else {
                        // For whole numbers like "1+" or "5+"
                        target = parseInt(originalText.replace(/\D/g, ''));
                        suffix = originalText.replace(/\d/g, '');
                    }
                    
                    this.animateCounter(counter, 0, target, 2000, suffix, isDecimal);
                    observer.unobserve(counter);
                }
            });
        }, options);

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(element, start, end, duration, suffix, isDecimal = false) {
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (end - start) * easeOutQuart;
            
            // Format the number based on whether it's decimal or not
            let displayValue;
            if (isDecimal) {
                displayValue = current.toFixed(2);
            } else {
                displayValue = Math.floor(current);
            }
            
            element.textContent = displayValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
}

// ===== PROJECT FILTER (if needed) =====
class ProjectFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        if (this.filterButtons.length > 0) {
            this.setupFiltering();
        }
    }

    setupFiltering() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active button
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter projects
                this.filterProjects(filter);
            });
        });
    }

    filterProjects(filter) {
        this.projectCards.forEach(card => {
            const categories = card.getAttribute('data-category').split(' ');
            
            if (filter === 'all' || categories.includes(filter)) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupPreloading();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.getAttribute('data-src');
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    setupPreloading() {
        // Preload critical resources
        const criticalResources = [
            'styles/main.css',
            'js/main.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }
}

// ===== THEME SWITCHER (Optional) =====
class ThemeSwitcher {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        if (this.themeToggle) {
            const icon = this.themeToggle.querySelector('i');
            icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}

// ===== ANALYTICS TRACKING =====
class Analytics {
    constructor() {
        this.init();
    }

    init() {
        this.trackPageView();
        this.trackUserInteractions();
    }

    trackPageView() {
        // Track page view (integrate with your analytics service)
        console.log('Page view tracked');
    }

    trackUserInteractions() {
        // Track button clicks
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.trackEvent('button_click', {
                    button_text: e.target.textContent,
                    button_location: e.target.closest('section')?.id || 'unknown'
                });
            });
        });

        // Track section views
        const sections = document.querySelectorAll('section');
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.trackEvent('section_view', {
                        section_id: entry.target.id
                    });
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => sectionObserver.observe(section));
    }

    trackEvent(eventName, properties) {
        // Integrate with your analytics service (GA4, Mixpanel, etc.)
        console.log('Event tracked:', eventName, properties);
    }
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    new Navigation();
    new SkillBars();
    new TypingAnimation();
    new ContactForm();
    new ScrollAnimations();
    new ProjectFilter();
    new PerformanceOptimizer();
    new ThemeSwitcher();
    new Analytics();

    // Add loading animation completion
    document.body.classList.add('loaded');
    
    // Error handling
    window.addEventListener('error', (e) => {
        console.error('Portfolio error:', e.error);
    });
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Portfolio loaded in ${loadTime}ms`);
        });
    }
});

// ===== UTILITY FUNCTIONS =====
const Utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    },

    // Format numbers with commas
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Navigation,
        SkillBars,
        TypingAnimation,
        ContactForm,
        ScrollAnimations,
        ProjectFilter,
        PerformanceOptimizer,
        ThemeSwitcher,
        Analytics,
        Utils
    };
}
