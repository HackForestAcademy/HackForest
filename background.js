// Authentic hacker-style background with matrix rain and terminal effects
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas-background');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Resize canvas to full window size
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
    
    // Classic Matrix Rain Effect
    const matrixRain = {
        characters: '01アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン'.split(''),
        drops: [],
        fontSize: 14,
        columns: 0,
        
        init() {
            this.columns = Math.floor(canvas.width / this.fontSize);
            this.drops = [];
            
            for (let i = 0; i < this.columns; i++) {
                this.drops[i] = Math.floor(Math.random() * -canvas.height / this.fontSize);
            }
        },
        
        update() {
            for (let i = 0; i < this.drops.length; i++) {
                // Draw a random character
                const text = this.characters[Math.floor(Math.random() * this.characters.length)];
                
                // Calculate position
                const x = i * this.fontSize;
                const y = this.drops[i] * this.fontSize;
                
                // Set color based on position - brighter at the top of each stream
                const fadeRatio = this.drops[i] < 1 ? 1 : 0.9;
                ctx.fillStyle = `rgba(50, 255, 120, ${fadeRatio})`;
                
                // Draw the character
                ctx.font = `${this.fontSize}px monospace`;
                ctx.fillText(text, x, y);
                
                // Draw fading characters in the trail
                for (let j = 1; j < 10; j++) {
                    const trailY = y - j * this.fontSize;
                    if (trailY > 0) {
                        const trailOpacity = 0.8 - j * 0.08;
                        if (trailOpacity > 0) {
                            ctx.fillStyle = `rgba(50, 255, 120, ${trailOpacity})`;
                            ctx.fillText(
                                this.characters[Math.floor(Math.random() * this.characters.length)],
                                x, trailY
                            );
                        }
                    }
                }
                
                // Randomly reset a drop back to the top
                if (Math.random() > 0.975) {
                    this.drops[i] = 0;
                }
                
                // Move drop down
                this.drops[i]++;
                
                // Reset if off screen
                if (this.drops[i] * this.fontSize > canvas.height && Math.random() > 0.99) {
                    this.drops[i] = Math.floor(Math.random() * -10);
                }
            }
        }
    };
    
    // Hacker Terminal Windows
    const terminals = {
        windows: [],
        commands: [
            'nmap -sV -sC 192.168.1.1',
            'ssh root@10.0.0.1 -p 2222',
            'sudo tcpdump -i eth0',
            'nc -lvp 4444',
            'msfconsole',
            'hydra -l admin -P rockyou.txt 10.10.10.10 ssh',
            'sqlmap -u "http://target.com/?id=1" --dbs',
            'cd /var/www && ls -la',
            'cat /etc/passwd',
            'ps aux | grep root',
            'john --wordlist=wordlist.txt hash.txt',
            './exploit 0xbfffd1a0 192.168.0.1',
            'echo "Hacked" > index.html',
            'curl -s https://target.com/admin'
        ],
        responses: [
            'Access granted',
            'Starting scan...',
            'PORT 22 open',
            'Connection established',
            'Target acquired',
            '[+] Found 3 vulnerabilities',
            'CVE-2021-4034 : High Risk',
            'Brute force successful',
            'Password cracked: p@ssw0rd123',
            'User enumeration complete',
            'Privilege escalation successful',
            'Data exfiltration in progress...',
            'Shell spawned at /bin/bash',
            'Remote command execution achieved'
        ],
        
        init() {
            this.windows = [];
            
            // Create 3-5 terminal windows
            const terminalCount = 3 + Math.floor(Math.random() * 3);
            for (let i = 0; i < terminalCount; i++) {
                this.createTerminal();
            }
        },
        
        createTerminal() {
            // Create a new terminal at random position
            const width = 300 + Math.floor(Math.random() * 200);
            const height = 180 + Math.floor(Math.random() * 120);
            const x = Math.random() * (canvas.width - width);
            const y = Math.random() * (canvas.height - height);
            
            const terminal = {
                x, y, width, height,
                title: `Terminal - ${['root', 'hacker', 'admin', 'kali', 'anon'][Math.floor(Math.random() * 5)]}@system`,
                lines: [],
                promptChar: ['$', '#', '>', '~$'][Math.floor(Math.random() * 4)],
                cursor: true,
                cursorBlink: 0,
                typingLine: '',
                typingIndex: 0,
                typingCommand: this.commands[Math.floor(Math.random() * this.commands.length)],
                typingSpeed: 70 + Math.random() * 100,
                lastTypingTime: 0,
                lastCursorBlink: 0,
                state: 'typing', // typing, waiting, responding
                waitTime: 0,
                fadeOpacity: 0,
                fadeIn: true,
                lifetime: 15000 + Math.random() * 15000,
                birth: Date.now()
            };
            
            this.windows.push(terminal);
        },
        
        update(now) {
            // Check if we need to create a new terminal
            if (this.windows.length < 3 && Math.random() > 0.995) {
                this.createTerminal();
            }
            
            // Update existing terminals
            for (let i = this.windows.length - 1; i >= 0; i--) {
                const term = this.windows[i];
                
                // Handle fade in/out
                if (term.fadeIn && term.fadeOpacity < 1) {
                    term.fadeOpacity += 0.02;
                    if (term.fadeOpacity >= 1) {
                        term.fadeOpacity = 1;
                        term.fadeIn = true;
                    }
                }
                
                // Remove expired terminals
                if (now - term.birth > term.lifetime) {
                    term.fadeIn = false;
                    term.fadeOpacity -= 0.02;
                    if (term.fadeOpacity <= 0) {
                        this.windows.splice(i, 1);
                        continue;
                    }
                }
                
                // Handle cursor blinking
                if (now - term.lastCursorBlink > 500) {
                    term.cursor = !term.cursor;
                    term.lastCursorBlink = now;
                }
                
                // Handle typing animation
                if (term.state === 'typing' && now - term.lastTypingTime > term.typingSpeed) {
                    if (term.typingIndex < term.typingCommand.length) {
                        term.typingLine += term.typingCommand[term.typingIndex];
                        term.typingIndex++;
                        term.lastTypingTime = now;
                    } else {
                        // Finished typing command
                        term.lines.push(term.promptChar + ' ' + term.typingLine);
                        term.typingLine = '';
                        term.typingIndex = 0;
                        term.state = 'waiting';
                        term.waitTime = now + 500 + Math.random() * 1000;
                    }
                }
                
                // Handle waiting
                if (term.state === 'waiting' && now > term.waitTime) {
                    term.state = 'responding';
                    
                    // Generate response
                    const responseCount = Math.floor(Math.random() * 4) + 1;
                    for (let j = 0; j < responseCount; j++) {
                        const response = this.responses[Math.floor(Math.random() * this.responses.length)];
                        term.lines.push(response);
                    }
                    
                    // Prepare for next command
                    term.typingCommand = this.commands[Math.floor(Math.random() * this.commands.length)];
                    term.state = 'typing';
                    
                    // Limit number of lines
                    if (term.lines.length > 12) {
                        term.lines = term.lines.slice(term.lines.length - 12);
                    }
                }
            }
        },
        
        draw() {
            this.windows.forEach(term => {
                // Skip if fully transparent
                if (term.fadeOpacity <= 0) return;
                
                // Draw terminal background
                ctx.fillStyle = `rgba(10, 15, 20, ${0.85 * term.fadeOpacity})`;
                ctx.fillRect(term.x, term.y, term.width, term.height);
                
                // Draw terminal border
                ctx.strokeStyle = `rgba(0, 180, 100, ${0.6 * term.fadeOpacity})`;
                ctx.lineWidth = 1;
                ctx.strokeRect(term.x, term.y, term.width, term.height);
                
                // Draw terminal header
                ctx.fillStyle = `rgba(0, 30, 15, ${0.9 * term.fadeOpacity})`;
                ctx.fillRect(term.x, term.y, term.width, 20);
                
                // Draw terminal title
                ctx.font = '12px monospace';
                ctx.fillStyle = `rgba(0, 220, 100, ${term.fadeOpacity})`;
                ctx.fillText(term.title, term.x + 10, term.y + 14);
                
                // Draw lines of text
                ctx.font = '12px monospace';
                for (let i = 0; i < term.lines.length; i++) {
                    ctx.fillStyle = `rgba(200, 255, 200, ${term.fadeOpacity})`;
                    ctx.fillText(term.lines[i], term.x + 10, term.y + 40 + i * 16);
                }
                
                // Draw typing line with cursor
                if (term.state === 'typing') {
                    ctx.fillStyle = `rgba(200, 255, 200, ${term.fadeOpacity})`;
                    const lineText = term.promptChar + ' ' + term.typingLine;
                    ctx.fillText(lineText, term.x + 10, term.y + 40 + term.lines.length * 16);
                    
                    // Draw cursor
                    if (term.cursor) {
                        const cursorX = term.x + 10 + ctx.measureText(lineText).width;
                        const cursorY = term.y + 40 + term.lines.length * 16;
                        ctx.fillStyle = `rgba(0, 255, 100, ${term.fadeOpacity})`;
                        ctx.fillRect(cursorX, cursorY - 12, 8, 2);
                    }
                }
            });
        }
    };
    
    // Glitch effects
    const glitchEffects = {
        active: false,
        duration: 0,
        lastGlitch: 0,
        glitchProbability: 0.005,
        rectangles: [],
        
        update(now) {
            // Check if we should start a new glitch
            if (!this.active && Math.random() < this.glitchProbability) {
                this.active = true;
                this.duration = 100 + Math.random() * 200;
                this.lastGlitch = now;
                
                // Create random glitch rectangles
                this.rectangles = [];
                const glitchCount = 3 + Math.floor(Math.random() * 5);
                for (let i = 0; i < glitchCount; i++) {
                    this.rectangles.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        width: 20 + Math.random() * 100,
                        height: 2 + Math.random() * 20,
                        color: Math.random() > 0.5 ? 
                            `rgba(0, 255, 100, ${0.1 + Math.random() * 0.3})` : 
                            `rgba(255, 0, 100, ${0.1 + Math.random() * 0.2})`
                    });
                }
            }
            
            // Check if glitch should end
            if (this.active && now - this.lastGlitch > this.duration) {
                this.active = false;
            }
        },
        
        draw() {
            if (!this.active) return;
            
            // Draw glitch rectangles
            this.rectangles.forEach(rect => {
                ctx.fillStyle = rect.color;
                ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
            });
            
            // Sometimes offset part of the canvas
            if (Math.random() > 0.7) {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const glitchY = Math.floor(Math.random() * canvas.height);
                const glitchHeight = 10 + Math.floor(Math.random() * 20);
                const offset = -20 + Math.floor(Math.random() * 40);
                
                ctx.putImageData(
                    imageData, 
                    offset, 0, 
                    0, glitchY, 
                    canvas.width, glitchHeight
                );
            }
        }
    };
    
    // Scan lines
    const scanLines = {
        draw() {
            // Horizontal scan lines
            ctx.fillStyle = 'rgba(120, 220, 180, 0.03)';
            for (let y = 0; y < canvas.height; y += 2) {
                ctx.fillRect(0, y, canvas.width, 1);
            }
            
            // Moving scan line
            const scanLineY = (Date.now() / 20) % canvas.height;
            ctx.fillStyle = 'rgba(120, 255, 180, 0.12)';
            ctx.fillRect(0, scanLineY, canvas.width, 2);
        }
    };
    
    // Hexadecimal display in corners
    const hexDisplay = {
        data: [],
        lastUpdate: 0,
        updateInterval: 200,
        
        init() {
            this.data = [];
            for (let i = 0; i < 16; i++) {
                this.data.push(Math.floor(Math.random() * 256).toString(16).padStart(2, '0'));
            }
        },
        
        update(now) {
            if (now - this.lastUpdate > this.updateInterval) {
                // Update 1-3 random values
                const count = 1 + Math.floor(Math.random() * 3);
                for (let i = 0; i < count; i++) {
                    const index = Math.floor(Math.random() * this.data.length);
                    this.data[index] = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
                }
                this.lastUpdate = now;
            }
        },
        
        draw() {
            ctx.font = '12px monospace';
            ctx.fillStyle = 'rgba(0, 255, 100, 0.6)';
            
            // Draw in top-left corner
            let text = this.data.slice(0, 4).join(' ');
            ctx.fillText(text, 20, 20);
            text = this.data.slice(4, 8).join(' ');
            ctx.fillText(text, 20, 40);
            
            // Draw in bottom-right corner
            text = this.data.slice(8, 12).join(' ');
            ctx.fillText(text, canvas.width - 120, canvas.height - 40);
            text = this.data.slice(12).join(' ');
            ctx.fillText(text, canvas.width - 120, canvas.height - 20);
        }
    };
    
    // Initialize all effects
    function initEffects() {
        matrixRain.init();
        terminals.init();
        hexDisplay.init();
        resizeCanvas();
    }
    
    // Main animation loop
    function animate() {
        const now = Date.now();
        
        // Clear with fade effect to create trails
        ctx.fillStyle = 'rgba(0, 10, 20, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw effects
        matrixRain.update();
        terminals.update(now);
        glitchEffects.update(now);
        hexDisplay.update(now);
        
        terminals.draw();
        scanLines.draw();
        hexDisplay.draw();
        glitchEffects.draw();
        
        // Loop animation
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
        initEffects();
    }, 250));
    
    init();
});