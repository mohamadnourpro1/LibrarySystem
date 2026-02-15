const Storage = {
  get(key, fallback = []) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  uid(prefix = "id") {
    return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
};
