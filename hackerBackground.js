// Halloween-themed blood background
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas-background');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Resize canvas to full window size for HD effect
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Debounce function
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }
    
    // Halloween blood background
    const bloodBackground = {
        bloodDrops: [],
        bloodSplatters: [],
        textureCanvas: null,
        textureCtx: null,
        
        init() {
            // Initialize blood elements
            this.bloodDrops = [];
            this.bloodSplatters = [];
            
            // Create texture canvas
            this.createBackgroundTexture();
            
            // Create random blood drops
            this.createRandomBloodDrops();
        },
        
        createBackgroundTexture() {
            // Create an off-screen canvas for the texture
            this.textureCanvas = document.createElement('canvas');
            this.textureCanvas.width = canvas.width;
            this.textureCanvas.height = canvas.height;
            this.textureCtx = this.textureCanvas.getContext('2d');
            
            // Create dark textured background
            const ctx = this.textureCtx;
            
            // Base dark color with slight blue-purple tint
            ctx.fillStyle = '#0A0208';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add noise texture
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            for (let i = 0; i < data.length; i += 4) {
                // Random noise value
                const noise = Math.random() * 12 - 6;
                
                // Apply noise to RGB channels
                data[i] = Math.max(0, Math.min(255, data[i] + noise));
                data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise * 0.8));
                data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
                
                // Occasional subtle red specs
                if (Math.random() > 0.995) {
                    data[i] += 15;
                    data[i + 1] -= 5;
                    data[i + 2] -= 5;
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
            
            // Add subtle patterns
            for (let i = 0; i < 20; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const radius = 50 + Math.random() * 200;
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                
                gradient.addColorStop(0, 'rgba(20, 0, 5, 0.02)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            
            // Add subtle vertical streaks
            ctx.globalAlpha = 0.03;
            for (let i = 0; i < canvas.width; i += 20) {
                const height = canvas.height * (0.3 + Math.random() * 0.7);
                const width = 1 + Math.random() * 3;
                
                ctx.fillStyle = 'rgba(30, 0, 10, 0.05)';
                ctx.fillRect(i, 0, width, height);
            }
            ctx.globalAlpha = 1.0;
        },
        
        createRandomBloodDrops() {
            // Create occasional random drops that appear at top of screen
            setInterval(() => {
                if (this.bloodDrops.length < 30 && Math.random() > 0.7) {
                    const x = Math.random() * canvas.width;
                    const y = -10;
                    this.createBloodDrop(x, y);
                }
            }, 500);
        },
        
        createBloodDrop(x, y, size) {
            const speedY = 0.5 + Math.random() * 1;
            const speedX = (Math.random() - 0.5) * 0.3;
            const gravity = 0.03 + Math.random() * 0.02;
            
            // Blood color with variation
            const color = {
                h: 0,
                s: 80 + Math.random() * 20,
                l: 25 + Math.random() * 15
            };
            
            this.bloodDrops.push({
                x: x,
                y: y,
                size: size || (2 + Math.random() * 3),
                speedY: speedY,
                speedX: speedX,
                gravity: gravity,
                opacity: 0.8 + Math.random() * 0.2,
                rotation: Math.random() * Math.PI * 2,
                color: color
            });
        },
        
        createBloodSplatter(x, y, color) {
            const particles = 3 + Math.floor(Math.random() * 5);
            const size = 2 + Math.random() * 4;
            
            for (let i = 0; i < particles; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 0.5 + Math.random() * 2;
                const distance = 10 + Math.random() * 20;
                
                this.bloodSplatters.push({
                    x: x,
                    y: y,
                    targetX: x + Math.cos(angle) * distance,
                    targetY: y + Math.sin(angle) * distance,
                    size: size * (0.5 + Math.random() * 0.5),
                    progress: 0,
                    speed: speed / 100,
                    opacity: 0.8 + Math.random() * 0.2,
                    color: color || {
                        h: 0,
                        s: 80 + Math.random() * 20,
                        l: 25 + Math.random() * 15
                    }
                });
            }
        },
        
        update(now) {
            // Update blood drops
            for (let i = this.bloodDrops.length - 1; i >= 0; i--) {
                const drop = this.bloodDrops[i];
                
                drop.speedY += drop.gravity;
                drop.y += drop.speedY;
                drop.x += drop.speedX;
                
                // Create splatter when drop hits bottom
                if (drop.y > canvas.height - 10) {
                    this.createBloodSplatter(drop.x, canvas.height - 5, drop.color);
                    this.bloodDrops.splice(i, 1);
                    continue;
                }
                
                // Remove drops that are too far off screen
                if (drop.y > canvas.height || drop.x < -20 || drop.x > canvas.width + 20) {
                    this.bloodDrops.splice(i, 1);
                }
            }
            
            // Update blood splatters
            for (let i = this.bloodSplatters.length - 1; i >= 0; i--) {
                const splatter = this.bloodSplatters[i];
                
                splatter.progress += splatter.speed;
                
                // Remove completed splatters
                if (splatter.progress >= 1) {
                    this.bloodSplatters.splice(i, 1);
                }
            }
        },
        
        draw() {
            // Draw textured background
            if (this.textureCanvas) {
                ctx.drawImage(this.textureCanvas, 0, 0, canvas.width, canvas.height);
            } else {
                // Fallback if texture not created
                ctx.fillStyle = '#0A0208';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            
            // Draw blood splatters (moving droplets)
            this.bloodSplatters.forEach(splatter => {
                const x = splatter.x + (splatter.targetX - splatter.x) * splatter.progress;
                const y = splatter.y + (splatter.targetY - splatter.y) * splatter.progress;
                
                // Blood splatter droplet
                ctx.beginPath();
                ctx.arc(x, y, splatter.size, 0, Math.PI * 2);
                
                const colorStr = `hsla(${splatter.color.h}, ${splatter.color.s}%, ${splatter.color.l}%, ${splatter.opacity * (1 - splatter.progress * 0.3)})`;
                ctx.fillStyle = colorStr;
                ctx.fill();
            });
            
            // Draw blood drops
            this.bloodDrops.forEach(drop => {
                // Draw tear-shaped blood drop
                ctx.beginPath();
                ctx.moveTo(drop.x, drop.y - drop.size);
                
                // Control points for teardrop shape
                ctx.bezierCurveTo(
                    drop.x - drop.size, drop.y,
                    drop.x - drop.size, drop.y + drop.size,
                    drop.x, drop.y + drop.size * 1.5
                );
                
                ctx.bezierCurveTo(
                    drop.x + drop.size, drop.y + drop.size,
                    drop.x + drop.size, drop.y,
                    drop.x, drop.y - drop.size
                );
                
                // Blood color gradient using HSL
                const dropGradient = ctx.createLinearGradient(
                    drop.x - drop.size, drop.y - drop.size,
                    drop.x + drop.size, drop.y + drop.size * 1.5
                );
                
                const topColor = `hsla(${drop.color.h}, ${drop.color.s}%, ${drop.color.l + 10}%, ${drop.opacity})`;
                const bottomColor = `hsla(${drop.color.h}, ${drop.color.s}%, ${Math.max(10, drop.color.l - 10)}%, ${drop.opacity})`;
                
                dropGradient.addColorStop(0, topColor);
                dropGradient.addColorStop(1, bottomColor);
                
                ctx.fillStyle = dropGradient;
                ctx.fill();
                
                // Add highlight
                ctx.beginPath();
                ctx.arc(
                    drop.x - drop.size * 0.3,
                    drop.y - drop.size * 0.2,
                    drop.size * 0.3,
                    0,
                    Math.PI * 2
                );
                
                const highlightColor = `hsla(${drop.color.h}, ${Math.min(100, drop.color.s - 20)}%, ${Math.min(80, drop.color.l + 40)}%, ${drop.opacity * 0.5})`;
                ctx.fillStyle = highlightColor;
                ctx.fill();
            });
            
            // Add vignette effect for Halloween atmosphere
            const vignetteGradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, canvas.height * 0.3,
                canvas.width / 2, canvas.height / 2, canvas.height
            );
            vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
            vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
            
            ctx.fillStyle = vignetteGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add subtle red tint to the entire scene
            ctx.fillStyle = 'rgba(100, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    };
    
    // Blood effect for titles
    function addBloodEffectToTitles() {
        // Get the main logo title
        const mainLogo = document.querySelector('.main-logo h1');
        if (mainLogo) {
            addBloodDripEffect(mainLogo);
        }
        
        // Get the about section title
        const aboutTitle = document.querySelector('.about-content h2');
        if (aboutTitle) {
            addBloodDripEffect(aboutTitle);
        }
        
        // Get the footer logo
        const footerLogo = document.querySelector('.footer-logo h2');
        if (footerLogo) {
            addBloodDripEffect(footerLogo);
        }
    }
    
    function addBloodDripEffect(element) {
        // Save original text
        const originalText = element.textContent;
        element.innerHTML = '';
        
        // Create letter by letter spans
        originalText.split('').forEach((letter, index) => {
            const letterSpan = document.createElement('span');
            letterSpan.textContent = letter;
            letterSpan.style.position = 'relative';
            letterSpan.style.display = 'inline-block';
            letterSpan.style.marginRight = letter === ' ' ? '8px' : '1px';
            element.appendChild(letterSpan);
            
            // Don't add blood to spaces
            if (letter === ' ') return;
            
            // Add blood drips with different timings
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
                
                // Vampire-like animation
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
                
                // Remove after animation
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
            
            // Periodic blood drips
            setInterval(() => {
                if (Math.random() < 0.15) {
                    createBloodDrip();
                }
            }, 4000 + Math.random() * 4000);
            
            // Blood effect on hover
            letterSpan.addEventListener('mouseenter', () => {
                letterSpan.style.color = 'var(--primary-accent)';
                createBloodDrip();
                
                setTimeout(() => {
                    letterSpan.style.color = '';
                }, 500);
            });
        });
    }
    
    // Setup click effect
    function setupClickEffect() {
        canvas.addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            // Create blood splatter at click position
            for (let i = 0; i < 10; i++) {
                bloodBackground.createBloodSplatter(x, y);
            }
            
            // Create a few blood drops at click position
            for (let i = 0; i < 5; i++) {
                const dropX = x + (Math.random() * 20 - 10);
                const dropY = y - (Math.random() * 10);
                bloodBackground.createBloodDrop(dropX, dropY, 2 + Math.random() * 4);
            }
        });
    }
    
    // Initialize all effects
    function initEffects() {
        bloodBackground.init();
        setupClickEffect();
        addBloodEffectToTitles();
    }
    
    // Main animation loop
    function animate() {
        const now = Date.now();
        
        // Update effects
        bloodBackground.update(now);
        
        // Draw effects
        bloodBackground.draw();
        
        // Continue animation
        requestAnimationFrame(animate);
    }
    
    // Initialize and start animation
    function init() {
        resizeCanvas();
        initEffects();
        animate();
    }
    
    // Handle window resize
    window.addEventListener('resize', debounce(() => {
        resizeCanvas();
        bloodBackground.createBackgroundTexture(); // Recreate texture
    }, 250));
    
    init();
}); 