/* 
   JK Jewellers Chirawa - Performance Animation Engine
   Author: Senior UI/UX Designer & Frontend Developer
   Vanilla JS Scroll Triggers, Counters & Performance Optimizations
*/

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveals();
    initAnimatedCounters();
    initParallaxEffect();
    initLazyLoading();
});

// 1. Scroll-Triggered Reveal Animations using IntersectionObserver
function initScrollReveals() {
    const revealElements = document.querySelectorAll('.reveal, .image-reveal-wrapper');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Stop observing once animated to save performance
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15, // Trigger when 15% of element is visible
            rootMargin: '0px 0px -50px 0px' // Offset trigger point slightly
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }
}

// 2. Animated Numerical Counters (Statistics)
function initAnimatedCounters() {
    const counterElements = document.querySelectorAll('.stat-number');
    
    if (counterElements.length === 0) return;

    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseFloat(counter.getAttribute('data-target'));
                    const duration = 2000; // 2 seconds count duration
                    const decimals = counter.getAttribute('data-decimals') ? parseInt(counter.getAttribute('data-decimals')) : 0;
                    const suffix = counter.getAttribute('data-suffix') || '';
                    
                    animateCounter(counter, target, duration, decimals, suffix);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counterElements.forEach(counter => counterObserver.observe(counter));
    } else {
        // Fallback without animations
        counterElements.forEach(counter => {
            const target = counter.getAttribute('data-target');
            const suffix = counter.getAttribute('data-suffix') || '';
            counter.textContent = target + suffix;
        });
    }
}

function animateCounter(element, target, duration, decimals, suffix) {
    let start = 0;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // EaseOutQuad function for luxury deceleration feel
        const easeProgress = progress * (2 - progress);
        const currentValue = start + easeProgress * (target - start);
        
        element.textContent = currentValue.toFixed(decimals) + suffix;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toFixed(decimals) + suffix;
        }
    }

    requestAnimationFrame(updateCounter);
}

// 3. High Performance Parallax Effect for Banner Backgrounds
function initParallaxEffect() {
    const parallaxBanners = document.querySelectorAll('.parallax-bg');
    
    if (parallaxBanners.length === 0) return;

    // Use passive scroll listener to avoid layout thrashing
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        parallaxBanners.forEach(banner => {
            const rect = banner.getBoundingClientRect();
            // Only perform calculation if element is within viewport
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const parentTop = scrolled + rect.top;
                const offset = (scrolled - parentTop) * 0.15; // Speed multiplier
                banner.style.backgroundPositionY = `calc(50% + ${offset}px)`;
            }
        });
    }, { passive: true });
}

// 4. Custom Lazy Loading for Performance Optimization
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (lazyImages.length === 0) return;

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.onload = () => {
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                    };
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px 0px 100px 0px' // Load images 100px before they enter viewport
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback
        lazyImages.forEach(img => {
            img.src = img.getAttribute('data-src');
        });
    }
}
