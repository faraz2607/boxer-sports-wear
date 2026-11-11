import {
  ADMIN_SECRET,
  DATA_KEY,
  EMPTY_DATA,
  SESSION_KEY,
  SESSION_MS,
} from '../../common/constants';

const deriveKey = async () => {
  if (!ADMIN_SECRET || !window.crypto?.subtle)
    throw new Error(
      'Set REACT_APP_ADMIN_SECRET_KEY and use a secure browser context to enable encrypted storage.',
    );
  const material = await window.crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(ADMIN_SECRET),
  );
  return window.crypto.subtle.importKey('raw', material, 'AES-GCM', false, ['encrypt', 'decrypt']);
};
const encrypt = async (value) => {
  const key = await deriveKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(JSON.stringify(value)),
  );
  const bytes = new Uint8Array(iv.length + ciphertext.byteLength);
  bytes.set(iv);
  bytes.set(new Uint8Array(ciphertext), iv.length);
  return btoa(String.fromCharCode(...bytes));
};
const decrypt = async (stored) => {
  const bytes = Uint8Array.from(atob(stored), (character) => character.charCodeAt(0));
  const key = await deriveKey();
  const plaintext = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: bytes.slice(0, 12) },
    key,
    bytes.slice(12),
  );
  return JSON.parse(new TextDecoder().decode(plaintext));
};

export const saveData = async (data) => localStorage.setItem(DATA_KEY, await encrypt(data));
export const loadData = async () => {
  const stored = localStorage.getItem(DATA_KEY);
  if (!stored) return EMPTY_DATA;
  try {
    const data = { ...EMPTY_DATA, ...(await decrypt(stored)) };
    const migratedAt = new Date().toISOString();
    data.catalog = data.catalog.map((row) => ({
      ...row,
      meeshoProductUrl: row.meeshoProductUrl || row.meeshoUrl || '',
      createdAt: row.createdAt || migratedAt,
      updatedAt: row.updatedAt || migratedAt,
    }));
    return data;
  } catch {
    throw new Error('Saved admin data could not be decrypted. Check the secret key in .env.local.');
  }
};
export const saveSession = async () =>
  localStorage.setItem(SESSION_KEY, await encrypt({ expiresAt: Date.now() + SESSION_MS }));
export const clearSession = () => localStorage.removeItem(SESSION_KEY);
export const isSessionValid = async () => {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return false;
    const session = await decrypt(stored);
    if (session.expiresAt <= Date.now()) {
      clearSession();
      return false;
    }
    return true;
  } catch {
    clearSession();
    return false;
  }
};
