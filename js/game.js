import { Save } from './storage.js';
import { Input } from './input.js';
import { Player } from './player.js';
import { UI } from './ui.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = 0; this.h = 0;

    this.input = new Input();
    this.player = new Player();
    this.ui = new UI(this);

    this.state = 'menu'; // menu | playing
    this.lastT = 0;
    this.bg = 0;

    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state === 'playing') this.pause();
    });
    this.resize();

    this.ui.init();
  }

  resize() {
    const { canvas, ctx } = this;
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    canvas.width = Math.floor(this.w * this.dpr);
    canvas.height = Math.floor(this.h * this.dpr);
    canvas.style.width = this.w + 'px';
    canvas.style.height = this.h + 'px';
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
  }

  start() {
    requestAnimationFrame(t => this.loop(t));
  }

  loop(t) {
    const dt = Math.min((t - this.lastT) / 1000 || 0, 0.05);
    this.lastT = t;
    this.update(dt);
    this.render();
    requestAnimationFrame(x => this.loop(x));
  }

  update(dt) {
    this.bg += dt;
    if (this.state === 'playing') {
      this.player.update(
        dt,
        this.input,
        Save.data.control,
        Save.data.sensitivity,
        this.w,
        this.h
      );
    }
  }

  render() {
    const { ctx, w, h } = this;
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    this.drawGrid();

    if (this.state === 'playing') {
      this.player.draw(ctx);
    }
  }

  drawGrid() {
    const { ctx, w, h } = this;
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = '#ff00aa';
    ctx.lineWidth = 1;
    const g = 60;
    const off = (this.bg * 40) % g;
    for (let x = -off; x < w; x += g) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += g) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    ctx.restore();
  }

  play() {
    this.state = 'playing';
    this.player.reset();
    this.player.y = this.h / 2;
    this.ui.showHud();
  }

  pause() {
    this.state = 'menu';
    this.ui.hideHud();
    this.ui.show('menu');
  }

  toMenu() {
    this.state = 'menu';
    this.ui.hideHud();
    this.ui.show('menu');
  }
}
