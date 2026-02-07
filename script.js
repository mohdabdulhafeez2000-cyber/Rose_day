document.addEventListener('DOMContentLoaded', () => {
    const stem = document.getElementById('stem');
    const roseHead = document.getElementById('roseHead');
    const screens = document.querySelectorAll('.screen');
    const canvas = document.getElementById('petalCanvas');
    const ctx = canvas.getContext('2d');
    const leafLeft = document.querySelector('.leaf-left');
    const leafRight = document.querySelector('.leaf-right');
    
    // Smooth scroll animation variables
    let currentStemHeight = 0;
    let targetStemHeight = 0;
    let currentLeaf1Scale = 0;
    let currentLeaf2Scale = 0;
    let targetLeaf1Scale = 0;
    let targetLeaf2Scale = 0;
    
    // 1. Handle Scroll-Based Growth
    window.addEventListener('scroll', () => {
        const maxScroll = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = Math.min(window.scrollY / maxScroll, 1);
        
        // Calculate target stem height
        targetStemHeight = scrollPercent * 400;
        
        // Calculate target leaf scales based on stem height
        if (targetStemHeight > 130) {
            targetLeaf1Scale = Math.min((targetStemHeight - 130) / 50, 1);
        } else {
            targetLeaf1Scale = 0;
        }
        
        if (targetStemHeight > 210) {
            targetLeaf2Scale = Math.min((targetStemHeight - 210) / 50, 1);
        } else {
            targetLeaf2Scale = 0;
        }
        
        // Check which section is in view
        screens.forEach(screen => {
            const rect = screen.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.7) {
                screen.classList.add('visible');
            }
        });
    });
    
    // Smooth animation loop
    function animateRose() {
        // Smooth stem growth with easing
        currentStemHeight += (targetStemHeight - currentStemHeight) * 0.1;
        stem.style.height = currentStemHeight + 'px';
        
        // Smooth leaf1 growth with easing
        currentLeaf1Scale += (targetLeaf1Scale - currentLeaf1Scale) * 0.08;
        leafLeft.style.transform = `rotate(-40deg) scale(${currentLeaf1Scale})`;
        leafLeft.style.opacity = currentLeaf1Scale;
        
        // Smooth leaf2 growth with easing
        currentLeaf2Scale += (targetLeaf2Scale - currentLeaf2Scale) * 0.08;
        leafRight.style.transform = `rotate(40deg) scaleX(-${currentLeaf2Scale}) scale(${currentLeaf2Scale})`;
        leafRight.style.opacity = currentLeaf2Scale;
        
        // Calculate scroll percent for rose head
        const scrollPercent = currentStemHeight / 400;
        const roseStartPercent = Math.max(0, (scrollPercent - 0.15) / 0.85);
        const scaleVal = Math.min(roseStartPercent * 1.2, 1.2);
        const rotateVal = roseStartPercent * 360;
        
        // Position rose at the top of the stem with smooth floating
        const floatOffset = Math.sin(Date.now() / 1500) * 8;
        roseHead.style.transform = `translate(-50%, -${currentStemHeight + floatOffset}px) scale(${scaleVal}) rotate(${rotateVal}deg)`;
        roseHead.style.opacity = Math.min(roseStartPercent * 2, 1);
        
        requestAnimationFrame(animateRose);
    }
    
    animateRose();
    
    // 2. Enhanced Petal Rain Effect
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let petals = [];
    
    class Petal {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 15 + 8;
            this.speed = Math.random() * 1.8 + 0.6;
            this.angle = Math.random() * Math.PI * 2;
            this.rotation = Math.random() * 0.03 - 0.015;
            this.swing = Math.random() * 2.5 + 1;
            this.opacity = Math.random() * 0.5 + 0.5;
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.globalAlpha = this.opacity;
            
            // Create gradient petal with more depth
            const gradient = ctx.createRadialGradient(-this.size/4, -this.size/4, 0, 0, 0, this.size);
            gradient.addColorStop(0, 'rgba(255, 182, 193, 0.95)');
            gradient.addColorStop(0.4, 'rgba(255, 204, 213, 0.85)');
            gradient.addColorStop(0.7, 'rgba(255, 218, 224, 0.7)');
            gradient.addColorStop(1, 'rgba(255, 228, 225, 0.4)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size * 1.6, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Add subtle highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.ellipse(-this.size/3, -this.size/3, this.size/3, this.size/2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
        
        update() {
            this.y += this.speed;
            this.x += Math.sin(this.y / 60) * this.swing;
            this.angle += this.rotation;
            
            // Add gentle horizontal drift
            this.x += Math.cos(this.y / 100) * 0.5;
            
            if (this.y > canvas.height + 20) {
                this.reset();
            }
            
            // Fade out near bottom
            if (this.y > canvas.height - 100) {
                this.opacity -= 0.01;
            }
        }
    }
    
    // Create more petals for richer effect
    for (let i = 0; i < 40; i++) {
        petals.push(new Petal());
    }
    
    function animatePetals() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petals.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animatePetals);
    }
    
    animatePetals();
    
    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});