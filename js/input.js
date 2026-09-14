export class Input {
  constructor() {
    this.keys = new Set();
    this.mouseY = null;
    this.mouseActive = false;

    window.addEventListener('keydown', e => {
      this.keys.add(e.code);
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
    });
    window.addEventListener('keyup', e => this.keys.delete(e.code));
    window.addEventListener('blur', () => this.keys.clear());

    window.addEventListener('mousemove', e => {
      this.mouseY = e.clientY;
      this.mouseActive = true;
    });
    window.addEventListener('mouseleave', () => { this.mouseActive = false; });

    window.addEventListener('touchmove', e => {
      if (e.touches[0]) {
        this.mouseY = e.touches[0].clientY;
        this.mouseActive = true;
      }
    }, { passive: true });
    window.addEventListener('touchend', () => { this.mouseActive = false; });
  }

  // -1 вверх, +1 вниз, 0 нейтраль
  axisY(scheme) {
    if (scheme === 'arrows') {
      const up = this.keys.has('ArrowUp');
      const dn = this.keys.has('ArrowDown');
      return (dn ? 1 : 0) - (up ? 1 : 0);
    }
    if (scheme === 'wasd') {
      const up = this.keys.has('KeyW');
      const dn = this.keys.has('KeyS');
      return (dn ? 1 : 0) - (up ? 1 : 0);
    }
    return 0;
  }

  mouseTargetY(scheme) {
    if (scheme !== 'mouse' || !this.mouseActive) return null;
    return this.mouseY;
  }
}
