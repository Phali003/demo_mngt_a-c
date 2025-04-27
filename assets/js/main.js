/**
 * AccountPro - Account Management Platform
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all the UI components
    initializeLoading();
    initializeMobileMenu();
    initializeSmoothScrolling();
    initializeScrollToTop();
    initializeStickyHeader();
    initializeAnimations();
});

/**
 * Loading Animation
 * Shows a loading spinner before the page is fully loaded
 */
function initializeLoading() {
    // Create loading element if it doesn't exist
    if (!document.querySelector('.loading')) {
        const loadingEl = document.createElement('div');
        loadingEl.className = 'loading';
        loadingEl.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(loadingEl);
    }

    // Hide loading spinner when page is loaded
    window.addEventListener('load', () => {
        const loadingEl = document.querySelector('.loading');
        if (loadingEl) {
            loadingEl.style.opacity = '0';
            setTimeout(() => {
                loadingEl.style.display = 'none';
            }, 500);
        }
    });
}

/**
 * Mobile Menu Toggle
 * Handles the mobile navigation menu and overlay
 */
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Create nav overlay if it doesn't exist
    if (!document.querySelector('.nav-overlay')) {
        const overlayEl = document.createElement('div');
        overlayEl.className = 'nav-overlay';
        document.body.appendChild(overlayEl);
    }
    
    const navOverlay = document.querySelector('.nav-overlay');
    
    if (menuToggle && navMenu) {
        // Toggle menu on button click
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            navOverlay.classList.toggle('active');
            
            // Prevent scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on overlay
        navOverlay.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close menu when clicking on a menu item
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

/**
 * Smooth Scrolling
 * Enables smooth scrolling for all navigation links
 */
function initializeSmoothScrolling() {
    // Get all links that have hash (#) targets
    const scrollLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate the target position with offset for the header
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                // Scroll smoothly to the target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll To Top
 * Shows a button to scroll back to top when user scrolls down
 */
function initializeScrollToTop() {
    // Create scroll to top button if it doesn't exist
    if (!document.querySelector('.scroll-top')) {
        const scrollTopBtn = document.createElement('div');
        scrollTopBtn.className = 'scroll-top';
        scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(scrollTopBtn);
    }
    
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when button is clicked
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Sticky Header
 * Adds a class to the header when scrolling down
 */
function initializeStickyHeader() {
    const header = document.querySelector('.main-header');
    let lastScrollPosition = 0;
    
    window.addEventListener('scroll', () => {
        const currentScrollPosition = window.pageYOffset;
        
        // Add shadow and background change when scrolled
        if (currentScrollPosition > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide header when scrolling down, show when scrolling up
        if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 200) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
        
        lastScrollPosition = currentScrollPosition;
    });
}

/**
 * Element Animations
 * Animates elements as they come into the viewport
 */
function initializeAnimations() {
    // Add animation classes to elements
    const animateElements = document.querySelectorAll('.service-card, .feature-item, .pricing-card, .section-header');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add different animations based on element type
                if (entry.target.classList.contains('section-header')) {
                    entry.target.classList.add('animate-fade-in');
                } else if (entry.target.classList.contains('service-card') || entry.target.classList.contains('pricing-card')) {
                    entry.target.classList.add('animate-slide-in');
                    // Add staggered delay for card animations
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                } else {
                    entry.target.classList.add('animate-slide-in');
                }
                
                // Stop observing after animation is added
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Start observing elements
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Utility Functions
 */

// Debounce function to limit function calls
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func.apply(context, args);
    };
}

