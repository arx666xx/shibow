const KEY = 'shibow_save_v1';

const defaults = {
  nick: '',
  coins: 0,
  charges: 0,
  control: 'arrows',
  sensitivity: 1.0,
  sound: true,
  bestScore: 0,
  dailyStreak: 0,
  lastClaimDate: '',
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults };
  } catch { return { ...defaults }; }
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

export const Save = {
  data: load(),
  set(patch) {
    Object.assign(this.data, patch);
    save(this.data);
  },
  reload() { this.data = load(); },
};
