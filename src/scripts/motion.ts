import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Native scrolling is preserved. Without JS every section remains visible.
const media = gsap.matchMedia();
media.add('(prefers-reduced-motion: no-preference)', () => {
  const compact = window.matchMedia('(max-width: 700px)').matches;
  const distance = compact ? 24 : 42;
  const cleanup: Array<() => void> = [];

  gsap.from('.hero-copy > *', {
    y: 25, opacity: 0, duration: 1, stagger: .11, ease: 'power3.out',
    clearProps: 'transform,opacity'
  });
  gsap.from('.hero-photo', {
    y: 35, scale: .97, opacity: 0, duration: 1.25, delay: .12,
    ease: 'power3.out', clearProps: 'transform,opacity'
  });

  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => {
    const tween = gsap.from(element, {
      y: distance,
      opacity: 0,
      duration: .95,
      delay: Number(element.dataset.delay || 0),
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: element, start: 'top 92%', once: true }
    });
    // Keyboard navigation never lands on an invisible call to action.
    const show = () => tween.progress(1);
    element.addEventListener('focusin', show);
    cleanup.push(() => element.removeEventListener('focusin', show));
  });

  gsap.from('.history-art', {
    y: compact ? 25 : 65,
    rotation: compact ? -5 : -8,
    scale: .94,
    ease: 'none',
    scrollTrigger: { trigger: '.history-art', start: 'top 98%', end: 'top 46%', scrub: .7 }
  });
  gsap.from('.gallery-shell', {
    y: distance,
    scale: .97,
    opacity: .5,
    ease: 'none',
    scrollTrigger: { trigger: '.gallery-shell', start: 'top 98%', end: 'top 64%', scrub: .6 }
  });

  const refresh = () => ScrollTrigger.refresh();
  if (document.readyState === 'complete') refresh();
  else window.addEventListener('load', refresh, { once: true });
  return () => {
    window.removeEventListener('load', refresh);
    cleanup.forEach(dispose => dispose());
  };
});

if (import.meta.hot) import.meta.hot.dispose(() => media.revert());
