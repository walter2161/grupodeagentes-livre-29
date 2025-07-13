import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useUserStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const { user } = useAuth();
  const userKey = user ? `${user.id}-${key}` : key;

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(userKey);
      if (item === null) return initialValue;
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error reading localStorage key "${userKey}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(userKey, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${userKey}":`, error);
    }
  };

  // Atualizar dados quando o usuário mudar
  useEffect(() => {
    if (user) {
      const newUserKey = `${user.id}-${key}`;
      try {
        const item = window.localStorage.getItem(newUserKey);
        if (item !== null) {
          setStoredValue(JSON.parse(item));
        } else {
          setStoredValue(initialValue);
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${newUserKey}":`, error);
        setStoredValue(initialValue);
      }
    }
  }, [user?.id, key]);

  return [storedValue, setValue];
}