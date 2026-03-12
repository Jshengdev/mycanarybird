import { useEffect, useRef } from 'react';
import { drawBayerDither } from '../lib/bayerDither';

export default function useBayerDither(opts, interactive = false, parentSectionRef = null) {
  const canvasRef = useRef(null);
  const cursorRef = useRef({ x: undefined, y: undefined });
  const rafRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function render() {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width || canvas.parentElement?.offsetWidth || window.innerWidth;
      const h = rect.height || canvas.parentElement?.offsetHeight * 0.75 || window.innerHeight * 0.75;
      if (w === 0 || h === 0) {
        requestAnimationFrame(render);
        return;
      }
      canvas.width = w;
      canvas.height = h;
      drawBayerDither(canvas, opts, cursorRef.current.x, cursorRef.current.y);
    }

    requestAnimationFrame(render);

    const onResize = () => render();
    window.addEventListener('resize', onResize);

    let onMouseMove, onMouseLeave;

    if (interactive && parentSectionRef?.current) {
      const section = parentSectionRef.current;
      onMouseMove = (e) => {
        const canvasRect = canvas.getBoundingClientRect();
        cursorRef.current.x = e.clientX - canvasRect.left;
        cursorRef.current.y = e.clientY - canvasRect.top;

        if (!rafRef.current) {
          rafRef.current = true;
          requestAnimationFrame(() => {
            drawBayerDither(canvas, opts, cursorRef.current.x, cursorRef.current.y);
            rafRef.current = false;
          });
        }
      };
      onMouseLeave = () => {
        cursorRef.current.x = undefined;
        cursorRef.current.y = undefined;
        drawBayerDither(canvas, opts);
      };
      section.addEventListener('mousemove', onMouseMove);
      section.addEventListener('mouseleave', onMouseLeave);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      if (interactive && parentSectionRef?.current) {
        const section = parentSectionRef.current;
        if (onMouseMove) section.removeEventListener('mousemove', onMouseMove);
        if (onMouseLeave) section.removeEventListener('mouseleave', onMouseLeave);
      }
    };
  }, [opts, interactive, parentSectionRef]);

  return canvasRef;
}
