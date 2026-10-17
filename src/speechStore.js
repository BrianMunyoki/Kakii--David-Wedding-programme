// Live "done" state for speeches, shared by everyone at the event.
// - With VITE_FIREBASE_DB_URL set: Firebase Realtime Database over plain REST + EventSource (no SDK).
// - Without it: localStorage (syncs across tabs on one device) so you can demo/test.
const DB = (import.meta.env.VITE_FIREBASE_DB_URL || "").replace(/\/$/, "");
const LS_KEY = "kd-speeches-done";

export function subscribe(onChange) {
  if (!DB) {
    const read = () => {
      try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch { return {}; }
    };
    onChange(read());
    const h = (e) => (!e.key || e.key === LS_KEY) && onChange(read());
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }

  let state = {};
  const es = new EventSource(`${DB}/speeches.json`);
  es.addEventListener("put", (e) => {
    const { path, data } = JSON.parse(e.data);
    if (path === "/") state = data || {};
    else {
      const id = path.slice(1);
      state = { ...state };
      if (data) state[id] = true; else delete state[id];
    }
    onChange(state);
  });
  es.addEventListener("patch", (e) => {
    const { data } = JSON.parse(e.data);
    state = { ...state };
    Object.entries(data || {}).forEach(([id, v]) => (v ? (state[id] = true) : delete state[id]));
    onChange(state);
  });
  return () => es.close(); // EventSource reconnects on its own if the signal drops
}

export async function setDone(id, done, current) {
  if (!DB) {
    const next = { ...current };
    if (done) next[id] = true; else delete next[id];
    localStorage.setItem(LS_KEY, JSON.stringify(next));
    window.dispatchEvent(new StorageEvent("storage", { key: LS_KEY }));
    return;
  }
  await fetch(`${DB}/speeches.json`, {
    method: "PATCH",
    body: JSON.stringify({ [id]: done ? true : null }),
  });
}

export async function resetAll() {
  if (!DB) { localStorage.removeItem(LS_KEY); window.dispatchEvent(new StorageEvent("storage", { key: LS_KEY })); return; }
  await fetch(`${DB}/speeches.json`, { method: "DELETE" });
}
