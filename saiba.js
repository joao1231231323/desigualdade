const canvas = document.getElementById('explosionCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];
let particles = [];

class Firework {
  constructor(sx, sy, tx, ty) {
    this.x = sx;
    this.y = sy;
    this.sx = sx;
    this.sy = sy;
    this.tx = tx;
    this.ty = ty;
    this.distanceToTarget = calcDistance(sx, sy, tx, ty);
    this.distanceTraveled = 0;
    this.coordinates = Array.from({ length: 5 }, () => [sx, sy]);
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 3;
    this.acceleration = 1.08;
    this.brightness = random(60, 80);
    this.targetRadius = 2;
    this.hue = random(0, 360);
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    this.speed *= this.acceleration;
    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;

    this.distanceTraveled = calcDistance(this.sx, this.sy, this.x + vx, this.y + vy);

    if (this.distanceTraveled >= this.distanceToTarget) {
      this.explode();
      fireworks.splice(index, 1);
    } else {
      this.x += vx;
      this.y += vy;
    }
  }

  explode() {
    const type = Math.floor(Math.random() * 3); // tipos de explosões
    const count = 100;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      switch (type) {
        case 0: // padrão circular
          particles.push(new Particle(this.tx, this.ty, angle, this.hue));
          break;
        case 1: // estrela
          if (i % 5 === 0)
            particles.push(new Particle(this.tx, this.ty, angle, this.hue, true));
          break;
        case 2: // caos total
          particles.push(new Particle(this.tx, this.ty, random(0, Math.PI * 2), random(0, 360)));
          break;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsl(${this.hue}, 100%, ${this.brightness}%)`;
    ctx.stroke();
  }
}

class Particle {
  constructor(x, y, angle, hue, longTrail = false) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = random(2, 10);
    this.friction = 0.95;
    this.gravity = 0.6;
    this.hue = hue;
    this.brightness = random(60, 90);
    this.alpha = 1;
    this.decay = random(0.015, 0.03);
    this.coordinates = Array.from({ length: longTrail ? 10 : 5 }, () => [x, y]);
    this.longTrail = longTrail;
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;

    if (this.alpha <= 0.05) {
      particles.splice(index, 1);
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
    ctx.shadowColor = `hsla(${this.hue}, 100%, 60%, ${this.alpha})`;
    ctx.shadowBlur = 15;
    ctx.stroke();
  }
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function calcDistance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

function loop() {
  requestAnimationFrame(loop);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'lighter';

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].draw();
    fireworks[i].update(i);
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].draw();
    particles[i].update(i);
  }

  // lança fogos automaticamente
  if (Math.random() < 0.04) {
    const x = random(canvas.width * 0.1, canvas.width * 0.9);
    const y = random(canvas.height * 0.1, canvas.height * 0.5);
    fireworks.push(new Firework(canvas.width / 2, canvas.height, x, y));
  }
}

// Clique do usuário
canvas.addEventListener('click', (e) => {
  fireworks.push(new Firework(canvas.width / 2, canvas.height, e.clientX, e.clientY));
});

// Redimensiona
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

loop();
