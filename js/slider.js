/* 
   JK Jewellers Chirawa - Testimonial Carousel Script
   Author: Senior UI/UX Designer & Frontend Developer
   Vanilla JS Touch-Swipe Slider
*/

document.addEventListener('DOMContentLoaded', () => {
    initTestimonialSlider();
});

function initTestimonialSlider() {
    const container = document.querySelector('.testimonial-carousel-container');
    const wrapper = document.querySelector('.testimonial-wrapper');
    const slides = document.querySelectorAll('.testimonial-card');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!container || !wrapper || slides.length === 0) return;

    let currentIndex = 0;
    let autoPlayTimer = null;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;
    let animationID = 0;
    
    const slideCount = slides.length;

    // 1. Generate Navigation Dots Dynamically
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to testimonial slide ${i + 1}`);
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        }
    }

    const dots = document.querySelectorAll('.carousel-dot');

    // 2. Main Move Functions
    function goToSlide(index) {
        if (index < 0) {
            currentIndex = slideCount - 1;
        } else if (index >= slideCount) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        
        const translatePercent = -currentIndex * 100;
        wrapper.style.transform = `translateX(${translatePercent}%)`;
        
        // Update Active Dot
        if (dots.length > 0) {
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        prevTranslate = translatePercent;
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // 3. Auto Play Management
    function startAutoPlay() {
        autoPlayTimer = setInterval(nextSlide, 5000); // Shift every 5 seconds
    }

    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
        }
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // Initialize Auto Play
    startAutoPlay();

    // Pause on Hover
    container.addEventListener('mouseenter', stopAutoPlay);
    container.addEventListener('mouseleave', startAutoPlay);

    // 4. Drag & Swipe Support for Responsive Mobile UX
    // Touch Events
    wrapper.addEventListener('touchstart', touchStart, { passive: true });
    wrapper.addEventListener('touchend', touchEnd);
    wrapper.addEventListener('touchmove', touchMove, { passive: true });

    // Mouse Events
    wrapper.addEventListener('mousedown', dragStart);
    wrapper.addEventListener('mouseup', dragEnd);
    wrapper.addEventListener('mouseleave', dragEnd);
    wrapper.addEventListener('mousemove', dragMove);

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
    }

    function dragStart(event) {
        event.preventDefault();
        touchStart(event);
    }

    function touchStart(event) {
        isDragging = true;
        startX = getPositionX(event);
        stopAutoPlay();
        
        // Disable transitions during dragging for fast responsiveness
        wrapper.style.transition = 'none';
        animationID = requestAnimationFrame(animation);
    }

    function dragMove(event) {
        if (isDragging) {
            touchMove(event);
        }
    }

    function touchMove(event) {
        if (!isDragging) return;
        const currentX = getPositionX(event);
        const diffX = currentX - startX;
        
        // Calculate offset translate in pixels converted to viewport relative values
        const containerWidth = container.offsetWidth;
        const currentTranslatePx = (-currentIndex * containerWidth) + diffX;
        currentTranslate = (currentTranslatePx / containerWidth) * 100;
    }

    function dragEnd() {
        if (isDragging) {
            touchEnd();
        }
    }

    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        
        // Restore styling transition
        wrapper.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
        
        // Check threshold for swiping
        const movedBy = currentTranslate - (-currentIndex * 100);
        
        if (movedBy < -15) {
            nextSlide();
        } else if (movedBy > 15) {
            prevSlide();
        } else {
            goToSlide(currentIndex); // Bounce back
        }
        
        startAutoPlay();
    }

    function animation() {
        if (isDragging) {
            wrapper.style.transform = `translateX(${currentTranslate}%)`;
            requestAnimationFrame(animation);
        }
    }

    // 5. Handle Resize (Recalculate slider sizing)
    window.addEventListener('resize', () => {
        goToSlide(currentIndex);
    });
}
