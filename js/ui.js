import { Save } from './storage.js';

const VALID_NICK = /^[A-Za-z0-9_\-]+$/;

export class UI {
  constructor(game) {
    this.game = game;
    this.screens = {
      nick: document.getElementById('screen-nick'),
      menu: document.getElementById('screen-menu'),
      settings: document.getElementById('screen-settings'),
      leaderboard: document.getElementById('screen-leaderboard'),
      shop: document.getElementById('screen-shop'),
    };
    this.hud = document.getElementById('hud');
  }

  init() {
    // Кнопки меню
    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const a = btn.dataset.action;
        if (a === 'play') this.game.play();
        if (a === 'settings') this.show('settings');
        if (a === 'leaderboard') this.show('leaderboard');
        if (a === 'shop') this.show('shop');
        if (a === 'back') this.show('menu');
      });
    });

    // Первый запуск
    if (!Save.data.nick) {
      this.show('nick');
      this.bindNickInput();
    } else {
      this.show('menu');
    }

    this.bindSettings();
    this.refreshMenu();
  }

  bindNickInput() {
    const inp = document.getElementById('nick-input');
    const btn = document.getElementById('nick-confirm');
    const err = document.getElementById('nick-error');

    const confirm = () => {
      const v = inp.value.trim().toUpperCase();
      if (v.length < 2) { err.textContent = 'МИН. 2 СИМВОЛА'; return; }
      if (!VALID_NICK.test(v)) { err.textContent = 'ТОЛЬКО A-Z 0-9 _ -'; return; }
      Save.set({ nick: v });
      this.show('menu');
      this.refreshMenu();
    };
    btn.addEventListener('click', confirm);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') confirm(); });
  }

  bindSettings() {
    const seg = document.getElementById('ctrl-seg');
    const buttons = seg.querySelectorAll('button');
    const apply = () => {
      buttons.forEach(b => b.classList.toggle('active', b.dataset.ctrl === Save.data.control));
    };
    buttons.forEach(b => b.addEventListener('click', () => {
      Save.set({ control: b.dataset.ctrl });
      apply();
    }));
    apply();

    const sens = document.getElementById('sens');
    const sensVal = document.getElementById('sens-val');
    sens.value = Save.data.sensitivity;
    sensVal.textContent = Number(Save.data.sensitivity).toFixed(1);
    sens.addEventListener('input', () => {
      const v = parseFloat(sens.value);
      Save.set({ sensitivity: v });
      sensVal.textContent = v.toFixed(1);
    });

    const nick2 = document.getElementById('nick-input-2');
    nick2.value = Save.data.nick;
    nick2.addEventListener('change', () => {
      const v = nick2.value.trim().toUpperCase();
      if (v.length >= 2 && VALID_NICK.test(v)) {
        Save.set({ nick: v });
        this.refreshMenu();
      } else {
        nick2.value = Save.data.nick;
      }
    });
  }

  refreshMenu() {
    document.getElementById('menu-nick').textContent = Save.data.nick || '—';
    document.getElementById('menu-coins').textContent = (Save.data.coins || 0) + ' ♦';
  }

  show(name) {
    Object.values(this.screens).forEach(s => s.classList.remove('active'));
    if (this.screens[name]) this.screens[name].classList.add('active');
    this.current = name;
  }

  showHud() { this.hud.classList.remove('hidden'); }
  hideHud() { this.hud.classList.add('hidden'); }
}
