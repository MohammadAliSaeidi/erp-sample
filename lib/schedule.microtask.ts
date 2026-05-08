export function scheduleMicrotask(fn: () => void) {
  if (typeof queueMicrotask === "function") return queueMicrotask(fn);
  Promise.resolve().then(fn);
}