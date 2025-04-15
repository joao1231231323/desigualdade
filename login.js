const canvas = document.getElementById("canvas-bg");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

class Particle {
  constructor(x, y, dx, dy, size, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.size = size;
    this.baseSize = size;
    this.color = color;
    this.alpha = 1;
  }

  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.alpha -= 0.01;
    this.size += 0.2;

    if (this.alpha <= 0) {
      this.reset();
    }
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = this.baseSize;
    this.alpha = 1;
    this.dx = (Math.random() - 0.5) * 0.5;
    this.dy = (Math.random() - 0.5) * 0.5;
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < 100; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let dx = (Math.random() - 0.5) * 0.5;
    let dy = (Math.random() - 0.5) * 0.5;
    let size = Math.random() * 2 + 1;
    let color = "white";
    particles.push(new Particle(x, y, dx, dy, size, color));
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}

canvas.addEventListener("mousemove", (e) => {
  for (let i = 0; i < 5; i++) {
    let dx = (Math.random() - 0.5) * 4;
    let dy = (Math.random() - 0.5) * 4;
    let size = Math.random() * 3 + 2;
    let color = "#ff5555";
    particles.push(new Particle(e.x, e.y, dx, dy, size, color));
  }
  if (particles.length > 300) {
    particles.splice(0, 10); // Limpa para não travar
  }
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});

initParticles();
animateParticles();
