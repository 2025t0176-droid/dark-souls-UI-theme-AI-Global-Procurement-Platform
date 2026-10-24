// 1. Target your exact canvas layout ID
const canvas = document.getElementById('bg-network-canvas');
const ctx = canvas.getContext('2d');

// 2. Handle monitor scale transformations
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 3. Track mouse positioning coordinates for wind warp physics
const mouse = {
    x: null,
    y: null,
    radius: 120
};

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// 4. Particle Blueprints Engine
class Ember {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 30;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 1.2; 
        this.speedY = -(Math.random() * 2.0 + 0.8); 
        this.life = Math.random() * 180 + 120;
        this.alpha = 1;
        
        const colors = [
            `rgba(230, 92, 23, `, 
            `rgba(240, 150, 40, `, 
            `rgba(255, 200, 50, `, 
            `rgba(180, 40, 20, `   
        ];
        this.baseColor = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;

        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                let force = (mouse.radius - distance) / mouse.radius;
                this.x -= (dx / distance) * force * 2.0;
                this.y -= (dy / distance) * force * 1.0;
                this.alpha = Math.min(1, (mouse.radius / distance) * 0.35); 
            } else {
                this.alpha = 1;
            }
        } else {
            this.alpha = 1;
        }

        if (this.life <= 0 || this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.baseColor + `${this.alpha * (this.life / 200)})`;
        ctx.shadowBlur = this.size * 3;
        ctx.shadowColor = 'rgba(230, 92, 23, 0.8)'; 
        ctx.fill();
        ctx.shadowBlur = 0; 
    }
}

// 5. Initialize the particle array loop
const embers = [];
const maxEmbers = 75;

for (let i = 0; i < maxEmbers; i++) {
    embers.push(new Ember());
    embers[i].y = Math.random() * canvas.height;
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    embers.forEach(ember => {
        ember.update();
        ember.draw();
    });

    requestAnimationFrame(animate);
}

animate();
