export class Player {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.vy = 0;
    this.trail = [];
    this.tilt = 0;
  }

  update(dt, input, scheme, sensitivity, w, h) {
    this.x = w * 0.25;

    const ACCEL = 2800 * sensitivity;
    const MAX_V = 720;
    const FRICTION = 0.86;

    const targetY = input.mouseTargetY(scheme);
    if (targetY !== null) {
      // Мышью — плавное следование к точке
      const cy = this.y;
      const diff = targetY - cy;
      this.vy = diff * 12 * sensitivity;
      this.vy = Math.max(-MAX_V, Math.min(MAX_V, this.vy));
    } else {
      const axis = input.axisY(scheme);
      if (axis !== 0) {
        this.vy += axis * ACCEL * dt;
      } else {
        this.vy *= Math.pow(FRICTION, dt * 60);
      }
      this.vy = Math.max(-MAX_V, Math.min(MAX_V, this.vy));
    }

    this.y += this.vy * dt;

    // Ограничение
    const margin = 20;
    if (this.y < margin) { this.y = margin; this.vy = Math.max(0, this.vy); }
    if (this.y > h - margin) { this.y = h - margin; this.vy = Math.min(0, this.vy); }

    // Наклон для визуала
    this.tilt += ((-this.vy / MAX_V) - this.tilt) * Math.min(1, dt * 10);

    // Трейл
    this.trail.push({ x: this.x, y: this.y, life: 1 });
    if (this.trail.length > 24) this.trail.shift();
    for (const t of this.trail) t.life -= dt * 2.5;
    this.trail = this.trail.filter(t => t.life > 0);
  }

  draw(ctx) {
    // Трейл
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i];
      const a = t.life * (i / this.trail.length) * 0.6;
      ctx.globalAlpha = a;
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 3 * t.life, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Самолёт
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.tilt * 0.6);
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(-12, -10);
    ctx.lineTo(-6, 0);
    ctx.lineTo(-12, 10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
