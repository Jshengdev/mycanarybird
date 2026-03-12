import { useState, useEffect, useRef } from 'react';
import { feedItems } from '../data/feedItems';
import { FEED_TICK_MS } from '../lib/constants';

export default function useLiveFeedTicker(initialItems = []) {
  const [items, setItems] = useState(initialItems);
  const idxRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const item = feedItems[idxRef.current % feedItems.length];
      idxRef.current++;

      const timestamp = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });

      setItems(prev => {
        const next = [{ ...item, id: Date.now(), timestamp }, ...prev];
        return next.slice(0, 6);
      });
    }, FEED_TICK_MS);

    return () => clearInterval(interval);
  }, []);

  return items;
}
