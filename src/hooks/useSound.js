import { useCallback } from 'react';
import { playSound } from '../utils/sounds.js';

export default function useSound() {
  return useCallback((name) => playSound(name), []);
}
