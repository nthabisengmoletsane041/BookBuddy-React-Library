import { useEffect, useState } from 'react';

// Reusable hook: load saved data once and keep localStorage updated.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved === null ? initialValue : JSON.parse(saved);
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (error) { console.error(`Could not save ${key}`, error); }
  }, [key, value]);
  return [value, setValue];
}

export const initialBooks = [
  { id: 1, title: 'The Magic Tree', author: 'L. Motlomelo', genre: 'Fantasy', isbn: '10001', quantity: 4 },
  { id: 2, title: 'Space Explorers', author: 'M. Molapo', genre: 'Science', isbn: '10002', quantity: 2 },
  { id: 3, title: 'The Brave Little Lion', author: 'P. Ndlovu', genre: 'Adventure', isbn: '10003', quantity: 1 },
  { id: 4, title: 'A Garden of Stars', author: 'K. Mokoena', genre: 'Fantasy', isbn: '10004', quantity: 5 }
];
export const initialUsers = [
  { id: 1, name: 'Alex Reader', membershipId: 'BB001', role: 'Member', password: '1234' },
  { id: 2, name: 'Library Admin', membershipId: 'ADMIN', role: 'Admin', password: '1234' }
];
