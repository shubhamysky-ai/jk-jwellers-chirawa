/* 
   JK Jewellers Chirawa - Main Global Script
   Author: Senior UI/UX Designer & Frontend Developer
   Vanilla JS Operations (Sticky Header, Mobile Nav, Custom Cursor, Typing Effect)
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dismiss Page Loader
    const loader = document.querySelector('.loader-wrapper');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
        }, 600); // Elegant delay for loading feel
    }

    // 2. Sticky Glassmorphic Navbar & Scroll Progress
    const header = document.querySelector('.header-wrapper');
    const progressBar = document.querySelector('.progress-bar');
    const backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Sticky Header Toggler
        if (header) {
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Scroll Progress Bar Update
        if (progressBar && docHeight > 0) {
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        }

        // Back To Top Toggler
        if (backToTop) {
            if (scrollTop > 500) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        }
    });

    // Back to top scroll execution
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 3. Hamburger Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.classList.toggle('no-scroll'); // Custom CSS scroll lock
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('no-scroll');
            }
        });
    }

    // 4. Mobile Mega Menu Accordion Click (for tablet/mobile sizes)
    const megaMenuTrigger = document.querySelector('.has-mega-menu');
    if (megaMenuTrigger) {
        const navLink = megaMenuTrigger.querySelector('.nav-link');
        navLink.addEventListener('click', (e) => {
            if (window.innerWidth <= 992) {
                e.preventDefault(); // Stop redirection to link on mobile
                megaMenuTrigger.classList.toggle('open');
            }
        });
    }

    // 5. Custom Cursor Glow (Disabled on Mobile/Tablet for UX/Performance)
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    const cursorFollower = document.createElement('div');
    cursorFollower.className = 'cursor-follower';
    
    // Only append and activate if not a mobile/touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) {
        body.appendChild(cursorGlow);
        body.appendChild(cursorFollower);

        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Core cursor matches exactly
            cursorGlow.style.left = mouseX + 'px';
            cursorGlow.style.top = mouseY + 'px';
        });

        // Smooth lag/follow effect using requestAnimationFrame
        const updateFollower = () => {
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;
            
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            
            requestAnimationFrame(updateFollower);
        };
        updateFollower();

        // Add hover classes for interactive elements
        const hoverables = document.querySelectorAll('a, button, .category-card, .product-card, .faq-header, select, input, textarea');
        hoverables.forEach(item => {
            item.addEventListener('mouseenter', () => {
                body.classList.add('cursor-hover');
            });
            item.addEventListener('mouseleave', () => {
                body.classList.remove('cursor-hover');
            });
        });
    }

    // 6. Typist / Typing Effect for Hero Subheadings
    const typingElement = document.querySelector('.typing-effect');
    if (typingElement) {
        const words = JSON.parse(typingElement.getAttribute('data-words')) || ["Purity", "Legacy", "Trust", "Craftsmanship"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 150;

        const type = () => {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 75; // delete faster
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 150; // typing speed
            }

            // Word finished typing
            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 1800; // hold display
            } 
            // Word deleted completely
            else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // pause before typing next
            }

            setTimeout(type, typeSpeed);
        };

        // Create cursor span next to typist text
        const cursorSpan = document.createElement('span');
        cursorSpan.className = 'typing-cursor';
        cursorSpan.textContent = '';
        typingElement.parentNode.appendChild(cursorSpan);

        type();
    }

    // 7. Interactive Showroom Video Overlay Modal
    const playOverlay = document.querySelector('.video-poster-overlay');
    const showroomVideo = document.getElementById('showroomVideo');
    if (playOverlay && showroomVideo) {
        playOverlay.addEventListener('click', () => {
            playOverlay.style.display = 'none';
            // Start playing: if iframe, append autoplay query, if HTML5, call play()
            if (showroomVideo.tagName === 'IFRAME') {
                const src = showroomVideo.getAttribute('src');
                const separator = src.includes('?') ? '&' : '?';
                showroomVideo.setAttribute('src', src + separator + 'autoplay=1');
            } else if (showroomVideo.tagName === 'VIDEO') {
                showroomVideo.setAttribute('controls', 'true');
                showroomVideo.play();
            }
        });
    }

    // 8. Magnetic Buttons Ripple Effect
    const rippleButtons = document.querySelectorAll('.btn');
    rippleButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});
