// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Element selectors - defined once at the top
    const heroTitle = document.querySelector('.hero-content h1');
    const siteTitle = document.querySelector('.logo h1');
    const glitchableElements = document.querySelectorAll('.btn, .course-card, .feature-box');
    const scrollAnimatedElements = document.querySelectorAll('.feature-box, .course-card, .about-content > *, .about-stats > .stat');
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const navLinksForSmoothScroll = document.querySelectorAll('header nav ul li a, footer a[href^="#"]');
    const allNavLinksForActiveState = document.querySelectorAll('nav ul li a');
    const sectionsForActiveState = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('nav ul li a');
    const headerLogo = document.querySelector('.logo h1');

    // Get colors from CSS variables - defined once
    const style = getComputedStyle(document.documentElement);
    const primaryAccent = style.getPropertyValue('--primary-accent').trim();
    const secondaryAccent = style.getPropertyValue('--secondary-accent').trim();
    const textColor = style.getPropertyValue('--text-color').trim();
    const baseBg = style.getPropertyValue('--base-bg').trim();
    const mutedAccent = style.getPropertyValue('--muted-accent').trim();

    // --- ENHANCE LOGO WITH VAMPIRE BLOOD EFFECT ---
    // Create letter-by-letter blood dripping effect for HackForest
    if (headerLogo) {
        // Clear current content
        const logoText = headerLogo.textContent;
        headerLogo.innerHTML = '';
        
        // Create a letter-by-letter layout
        logoText.split('').forEach((letter, index) => {
            const letterSpan = document.createElement('span');
            letterSpan.textContent = letter;
            letterSpan.style.position = 'relative';
            letterSpan.style.display = 'inline-block';
            letterSpan.style.marginRight = letter === ' ' ? '8px' : '1px';
            headerLogo.appendChild(letterSpan);
            
            // Don't add blood to spaces
            if (letter === ' ') return;
            
            // Add blood drips to each letter with different timings
            const createBloodDrip = () => {
                const drip = document.createElement('span');
                drip.style.position = 'absolute';
                drip.style.bottom = '0';
                drip.style.left = '50%';
                drip.style.transform = 'translateX(-50%)';
                drip.style.width = (1 + Math.random()) + 'px';
                drip.style.height = '0';
                drip.style.backgroundColor = 'var(--primary-accent)';
                drip.style.borderRadius = '0 0 2px 2px';
                drip.style.zIndex = '5';
                drip.style.filter = 'drop-shadow(0 0 2px var(--primary-accent))';
                
                // Animate the drip with vampire-like animation
                const animDuration = 3000 + Math.random() * 2000;
                const maxHeight = 15 + Math.random() * 30;
                
                drip.animate([
                    { height: '0', opacity: 0 },
                    { height: maxHeight + 'px', opacity: 0.9 },
                    { height: maxHeight + 'px', opacity: 0.8, transform: 'translateX(-50%)' },
                    { height: '0', opacity: 0, transform: `translateX(-50%) translateY(${maxHeight}px)` }
                ], {
                    duration: animDuration,
                    easing: 'cubic-bezier(0.2, 0.9, 0.4, 1)'
                });
                
                letterSpan.appendChild(drip);
                
                // Remove drip after animation
                setTimeout(() => {
                    if (drip.parentNode === letterSpan) {
                        letterSpan.removeChild(drip);
                    }
                }, animDuration);
            };
            
            // Initial blood drip with staggered timing
            setTimeout(() => {
                createBloodDrip();
            }, 500 + index * 150);
            
            // Periodic blood drips with different frequencies for each letter
            setInterval(() => {
                // Random chance to create drip
                if (Math.random() < 0.3) {
                    createBloodDrip();
                }
            }, 4000 + Math.random() * 4000); // Random interval between 4-8 seconds
            
            // Add subtle blood effect on letter hover
            letterSpan.addEventListener('mouseenter', () => {
                letterSpan.style.color = 'var(--primary-accent)';
                createBloodDrip();
                
                setTimeout(() => {
                    letterSpan.style.color = 'var(--text-color)';
                }, 500);
            });
        });
        
        // Every few seconds, create a cascade of blood drips
        setInterval(() => {
            if (Math.random() < 0.4) { // 40% chance
                const letterSpans = headerLogo.querySelectorAll('span');
                
                // Create cascade effect with staggered timing
                letterSpans.forEach((span, idx) => {
                    if (span.textContent !== ' ') {
                        setTimeout(() => {
                            // Create blood drip for this letter
                            const drip = document.createElement('span');
                            drip.style.position = 'absolute';
                            drip.style.bottom = '0';
                            drip.style.left = '50%';
                            drip.style.transform = 'translateX(-50%)';
                            drip.style.width = '2px';
                            drip.style.height = '0';
                            drip.style.backgroundColor = 'var(--primary-accent)';
                            drip.style.borderRadius = '0 0 2px 2px';
                            drip.style.zIndex = '5';
                            drip.style.filter = 'drop-shadow(0 0 3px var(--primary-accent))';
                            
                            // Extra dramatic cascade drip
                            drip.animate([
                                { height: '0', opacity: 0 },
                                { height: '30px', opacity: 0.9 },
                                { height: '40px', opacity: 0.8, transform: 'translateX(-50%)' },
                                { height: '0', opacity: 0, transform: 'translateX(-50%) translateY(50px)' }
                            ], {
                                duration: 3000,
                                easing: 'cubic-bezier(0.2, 0.9, 0.4, 1)'
                            });
                            
                            span.appendChild(drip);
                            
                            // Briefly change letter color
                            span.style.color = 'var(--primary-accent)';
                            setTimeout(() => {
                                span.style.color = 'var(--text-color)';
                            }, 500);
                            
                            // Remove after animation
                            setTimeout(() => {
                                if (drip.parentNode === span) {
                                    span.removeChild(drip);
                                }
                            }, 3000);
                        }, idx * 100); // Staggered by 100ms per letter
                    }
                });
            }
        }, 10000); // Every 10 seconds
    }

    // --- ENHANCED HEADER ANIMATIONS ---
    // Add terminal-style hover animations to nav items with blood effects
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.classList.add('blood-glitch');
            
            // Create blood drop effect on hover - adjusted for no-box design
            const bloodDrop = document.createElement('span');
            bloodDrop.style.position = 'absolute';
            bloodDrop.style.bottom = '-20px';
            bloodDrop.style.left = Math.random() * 70 + 15 + '%'; // Random position
            bloodDrop.style.width = '2px';
            bloodDrop.style.height = '0';
            bloodDrop.style.backgroundColor = 'var(--primary-accent)';
            bloodDrop.style.zIndex = '2';
            bloodDrop.style.borderRadius = '0 0 2px 2px';
            bloodDrop.style.filter = 'drop-shadow(0 0 2px var(--primary-accent))';
            
            // Animate blood drop
            bloodDrop.animate([
                { height: '0', opacity: 0 },
                { height: '20px', opacity: 0.9 },
                { height: '0', opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out'
            });
            
            item.appendChild(bloodDrop);
            
            // Remove after animation
            setTimeout(() => {
                if (bloodDrop.parentNode === item) {
                    item.removeChild(bloodDrop);
                }
                item.classList.remove('blood-glitch');
            }, 500);
        });
    });

    // Logo glitch effect on hover
    if (headerLogo) {
        // Create additional blood drips for the logo text
        const addBloodDrips = () => {
            // Get the logo text width
            const logoWidth = headerLogo.offsetWidth;
            
            // Create 3-5 random blood drips
            const dripsCount = Math.floor(Math.random() * 3) + 3;
            
            for (let i = 0; i < dripsCount; i++) {
                // Create a blood drip element
                const drip = document.createElement('span');
                drip.style.position = 'absolute';
                drip.style.bottom = '0';
                drip.style.left = (Math.random() * (logoWidth - 10) + 5) + 'px';
                drip.style.width = (1 + Math.random() * 2) + 'px';
                drip.style.height = '0';
                drip.style.backgroundColor = 'var(--primary-accent)';
                drip.style.borderRadius = '0 0 2px 2px';
                drip.style.zIndex = '5';
                drip.style.opacity = '0.9';
                
                // Animated growth and fade
                const animDuration = 2000 + Math.random() * 3000;
                const maxHeight = 10 + Math.random() * 30;
                
                drip.animate([
                    { height: '0', opacity: 0 },
                    { height: maxHeight + 'px', opacity: 0.9 },
                    { height: maxHeight + 'px', opacity: 0.7, transform: 'translateY(' + (maxHeight/2) + 'px)' },
                    { height: '0', opacity: 0, transform: 'translateY(' + maxHeight + 'px)' }
                ], {
                    duration: animDuration,
                    easing: 'ease-in-out'
                });
                
                headerLogo.appendChild(drip);
                
                // Remove after animation
                setTimeout(() => {
                    if (drip.parentNode === headerLogo) {
                        headerLogo.removeChild(drip);
                    }
                }, animDuration);
            }
        };
        
        // Add initial blood drips
        setTimeout(addBloodDrips, 1000);
        
        // Add periodic blood drips
        setInterval(addBloodDrips, 8000);
        
        headerLogo.addEventListener('mouseenter', () => {
            headerLogo.classList.add('blood-glitch');
            addBloodDrips();
            
            setTimeout(() => {
                headerLogo.classList.remove('blood-glitch');
            }, 500);
        });
        
        // Random blood effects for logo
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance every interval
                headerLogo.classList.add('blood-glitch');
                
                setTimeout(() => {
                    headerLogo.classList.remove('blood-glitch');
                }, 500);
                
                // Add a single dramatic blood drip
                if (Math.random() < 0.5) {
                    const drip = document.createElement('span');
                    drip.style.position = 'absolute';
                    drip.style.bottom = '0';
                    drip.style.left = (Math.random() * 80 + 10) + '%';
                    drip.style.width = '3px';
                    drip.style.height = '0';
                    drip.style.backgroundColor = 'var(--primary-accent)';
                    drip.style.borderRadius = '0 0 3px 3px';
                    drip.style.zIndex = '2';
                    drip.style.filter = 'drop-shadow(0 0 3px var(--primary-accent))';
                    
                    // Animated dramatic drip
                    drip.animate([
                        { height: '0', opacity: 0 },
                        { height: '40px', opacity: 0.9 },
                        { height: '0', opacity: 0, transform: 'translateY(50px)' }
                    ], {
                        duration: 3000,
                        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                    });
                    
                    headerLogo.appendChild(drip);
                    
                    // Remove after animation
                    setTimeout(() => {
                        if (drip.parentNode === headerLogo) {
                            headerLogo.removeChild(drip);
                        }
                    }, 3000);
                }
            }
        }, 5000); // Check every 5 seconds
    }
    
    // Random highlight effect for active nav item
    setInterval(() => {
        const activeNavItem = document.querySelector('nav ul li a.active');
        if (activeNavItem && Math.random() < 0.3) { // 30% chance
            activeNavItem.classList.add('blood-glitch');
            
            // Sometimes add a blood puddle under active item
            if (Math.random() < 0.5) {
                const bloodPuddle = document.createElement('div');
                bloodPuddle.style.position = 'absolute';
                bloodPuddle.style.bottom = '-8px';
                bloodPuddle.style.left = '50%';
                bloodPuddle.style.transform = 'translateX(-50%)';
                bloodPuddle.style.width = '0';
                bloodPuddle.style.height = '2px';
                bloodPuddle.style.backgroundColor = 'var(--primary-accent)';
                bloodPuddle.style.borderRadius = '50%';
                bloodPuddle.style.boxShadow = '0 0 5px var(--primary-accent)';
                bloodPuddle.style.zIndex = '1';
                
                // Grow the puddle
                bloodPuddle.animate([
                    { width: '0', opacity: 0 },
                    { width: '80%', opacity: 0.8 },
                    { width: '0', opacity: 0 }
                ], {
                    duration: 1500,
                    easing: 'ease-in-out'
                });
                
                activeNavItem.appendChild(bloodPuddle);
                
                // Remove after animation
                setTimeout(() => {
                    if (bloodPuddle.parentNode === activeNavItem) {
                        activeNavItem.removeChild(bloodPuddle);
                    }
                }, 1500);
            }
            
            setTimeout(() => {
                activeNavItem.classList.remove('blood-glitch');
            }, 500);
        }
    }, 4000);

    // --- Mobile Menu Logic ---
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    function closeMobileMenu() {
        if (nav && nav.classList.contains('active')) {
            nav.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if (icon) { // Ensure icon exists
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    }

    document.addEventListener('click', (event) => {
        if (nav && menuToggle && nav.classList.contains('active')) {
            if (!event.target.closest('nav') && !event.target.closest('.menu-toggle')) {
                closeMobileMenu();
            }
        }
    });

    // --- Smooth Scrolling & Active Nav Link Logic ---
    navLinksForSmoothScroll.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                closeMobileMenu();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const headerOffset = document.querySelector('header')?.offsetHeight || 70;
                    window.scrollTo({
                        top: targetElement.offsetTop - headerOffset,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    function highlightNavLink() {
        let currentSectionId = '';
        const headerOffset = document.querySelector('header')?.offsetHeight || 70;
        const scrollPosition = window.pageYOffset;

        sectionsForActiveState.forEach(section => {
            const sectionTop = section.offsetTop - headerOffset - 50;
            if (scrollPosition >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        allNavLinksForActiveState.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink(); // Initial call

    // Characters for text animations
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{};:\'\\|,.<>/?';
    const codeChars = ['1', '0', '{', '}', '[', ']', '(', ')', '<', '>', '/', '\\', '|', '-', '_', '+', '=', '*', '&', '^', '%', '$', '#', '@', '!'];

    // Debounce function
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // --- Hero Title Vampire Blood Effect ---
    if (heroTitle) {
        // Clear current content and save the original text
        const originalText = heroTitle.textContent;
        heroTitle.innerHTML = '';
        
        // Create a letter-by-letter layout
        originalText.split('').forEach((letter, index) => {
            const letterSpan = document.createElement('span');
            letterSpan.textContent = letter;
            letterSpan.style.position = 'relative';
            letterSpan.style.display = 'inline-block';
            letterSpan.style.marginRight = letter === ' ' ? '8px' : '1px';
            letterSpan.style.opacity = '0';
            letterSpan.style.transform = 'translateY(10px)';
            letterSpan.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
            heroTitle.appendChild(letterSpan);
            
            // Animate letter appearance with a staggered delay
            setTimeout(() => {
                letterSpan.style.opacity = '1';
                letterSpan.style.transform = 'translateY(0)';
                
                // Don't add blood to spaces
                if (letter === ' ') return;
                
                // Add blood drips to each letter with different timings
                const createBloodDrip = () => {
                    const drip = document.createElement('span');
                    drip.style.position = 'absolute';
                    drip.style.bottom = '0';
                    drip.style.left = '50%';
                    drip.style.transform = 'translateX(-50%)';
                    drip.style.width = (1 + Math.random()) + 'px';
                    drip.style.height = '0';
                    drip.style.backgroundColor = 'var(--primary-accent)';
                    drip.style.borderRadius = '0 0 2px 2px';
                    drip.style.zIndex = '5';
                    drip.style.filter = 'drop-shadow(0 0 2px var(--primary-accent))';
                    
                    // Animate the drip with vampire-like animation
                    const animDuration = 3000 + Math.random() * 2000;
                    const maxHeight = 15 + Math.random() * 30;
                    
                    drip.animate([
                        { height: '0', opacity: 0 },
                        { height: maxHeight + 'px', opacity: 0.9 },
                        { height: maxHeight + 'px', opacity: 0.8, transform: 'translateX(-50%)' },
                        { height: '0', opacity: 0, transform: `translateX(-50%) translateY(${maxHeight}px)` }
                    ], {
                        duration: animDuration,
                        easing: 'cubic-bezier(0.2, 0.9, 0.4, 1)'
                    });
                    
                    letterSpan.appendChild(drip);
                    
                    // Remove drip after animation
                    setTimeout(() => {
                        if (drip.parentNode === letterSpan) {
                            letterSpan.removeChild(drip);
                        }
                    }, animDuration);
                };
                
                // Initial blood drip with staggered timing after letter appears
                setTimeout(() => {
                    createBloodDrip();
                }, 1000 + index * 100);
                
                // Periodic blood drips with different frequencies for each letter
                const drippingInterval = setInterval(() => {
                    // Random chance to create drip
                    if (Math.random() < 0.2) {
                        createBloodDrip();
                    }
                }, 5000 + Math.random() * 5000); // Random interval between 5-10 seconds
                
                // Store interval ID in a data attribute to clear it if needed
                letterSpan.dataset.drippingInterval = drippingInterval;
                
                // Add subtle blood effect on letter hover
                letterSpan.addEventListener('mouseenter', () => {
                    letterSpan.style.color = 'var(--primary-accent)';
                    createBloodDrip();
                    
                    setTimeout(() => {
                        letterSpan.style.color = '';
                    }, 500);
                });
            }, 30 + index * 30); // Staggered appearance
        });
        
        // Every few seconds, create a cascade of blood drips
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance
                const letterSpans = heroTitle.querySelectorAll('span');
                
                // Create cascade effect with staggered timing
                letterSpans.forEach((span, idx) => {
                    if (span.textContent !== ' ') {
                        setTimeout(() => {
                            // Create blood drip for this letter
                            const drip = document.createElement('span');
                            drip.style.position = 'absolute';
                            drip.style.bottom = '0';
                            drip.style.left = '50%';
                            drip.style.transform = 'translateX(-50%)';
                            drip.style.width = '2px';
                            drip.style.height = '0';
                            drip.style.backgroundColor = 'var(--primary-accent)';
                            drip.style.borderRadius = '0 0 2px 2px';
                            drip.style.zIndex = '5';
                            drip.style.filter = 'drop-shadow(0 0 3px var(--primary-accent))';
                            
                            // Extra dramatic cascade drip
                            drip.animate([
                                { height: '0', opacity: 0 },
                                { height: '30px', opacity: 0.9 },
                                { height: '40px', opacity: 0.8, transform: 'translateX(-50%)' },
                                { height: '0', opacity: 0, transform: 'translateX(-50%) translateY(50px)' }
                            ], {
                                duration: 3000,
                                easing: 'cubic-bezier(0.2, 0.9, 0.4, 1)'
                            });
                            
                            span.appendChild(drip);
                            
                            // Briefly change letter color
                            span.style.color = 'var(--primary-accent)';
                            setTimeout(() => {
                                span.style.color = '';
                            }, 500);
                            
                            // Remove after animation
                            setTimeout(() => {
                                if (drip.parentNode === span) {
                                    span.removeChild(drip);
                                }
                            }, 3000);
                        }, idx * 100); // Staggered by 100ms per letter
                    }
                });
            }
        }, 12000); // Every 12 seconds
    }

    // --- Subtle Initial Site Title Glitch ---
    if (siteTitle) {
        setTimeout(() => {
            siteTitle.classList.add('glitching-text-active');
            setTimeout(() => {
                siteTitle.classList.remove('glitching-text-active');
            }, 200);
        }, 800);
    }

    // --- Subtle Glitch Effect on Hover ---
    const applyGlitch = (element, isTextSpecific = false) => {
        const glitchClass = isTextSpecific ? 'glitching-text-active' : 'glitching-active';
        element.classList.add(glitchClass);
        setTimeout(() => {
            element.classList.remove(glitchClass);
        }, isTextSpecific ? 150 : 200);
    };
    const debouncedGlitch = debounce(applyGlitch, 100);

    glitchableElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            const isText = el.matches('h1, h2, h3, h4, p, a, span') || el.classList.contains('btn');
            debouncedGlitch(el, isText);
        });
    });

    // --- Scroll-triggered Animations (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for elements appearing in sequence
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 80); // 80ms staggered delay
                observerInstance.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (scrollAnimatedElements.length > 0) {
        scrollAnimatedElements.forEach(el => {
            observer.observe(el);
        });
    }
}); 