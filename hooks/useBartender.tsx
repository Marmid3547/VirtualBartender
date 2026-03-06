// Powered by OnSpace.AI

import { useContext } from 'react';
import { BartenderContext } from '@/contexts/BartenderContext';

export function useBartender() {
  const context = useContext(BartenderContext);
  if (!context) {
    throw new Error('useBartender must be used within BartenderProvider');
  }
  return context;
}
