import { useEffect, useRef } from 'react';

export default function useScrollReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll('.reveal');
    targets.forEach(t => t.classList.add('reveal-hidden'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const els = entry.target.querySelectorAll('.reveal');
          els.forEach((el, i) => {
            setTimeout(() => el.classList.add('reveal-visible'), i * 150);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
