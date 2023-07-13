export function setLocalStorage(key, item) {
  localStorage.setItem(key, item);
}

export function getLocalStorage(key) {
  return localStorage.getItem(key);
}

export function deleteLocalStorage(key) {
  localStorage.removeItem(key);
}

export function setSessionStorage(key, item) {
  sessionStorage.setItem(key, item);
}

export function getSessionStorage(key) {
  return sessionStorage.getItem(key);
}

export function deleteSessionStorage(key) {
  sessionStorage.removeItem(key);
}
