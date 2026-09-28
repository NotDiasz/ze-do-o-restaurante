'use client';

// Adapted from the React Bits AccordionGallery source supplied by the client.
// Adds responsive measurement, keyboard focus navigation and live reduced-motion support.
import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import './AccordionGallery.css';

export default function AccordionGallery({
  items = [],
  defaultIndex = 2,
  accentColor = '#efac34',
  overlayColor = '#24170f',
  textColor = '#fff8ec',
  height = 500,
  gap = 10,
  radius = 6,
  expandRatio = 0.48,
  orientation = 'horizontal',
  duration = 0.75,
  ease = 'power3.out',
  parallax = 0.3,
  tilt = 4,
  stagger = 0.06,
  trigger = 'hover',
  showLabels = true,
  grayscale = false,
  className = '',
  ariaLabel = 'Galeria de fotos do Zé do Ó'
}) {
  const rootRef = useRef(null);
  const panelRefs = useRef([]);
  const mediaRefs = useRef([]);
  const barRefs = useRef([]);
  const textRefs = useRef([]);
  const timelineRef = useRef(null);
  const layoutRef = useRef(null);
  const firstRunRef = useRef(true);
  const count = items.length;
  const initial = Math.min(Math.max(defaultIndex, 0), Math.max(0, count - 1));
  const [active, setActive] = useState(initial);
  const [mobile, setMobile] = useState(false);
  const [reduced, setReduced] = useState(false);
  const vertical = orientation === 'vertical' || mobile;
  const ratio = Math.min(Math.max(expandRatio, 0.2), 0.9);
  const grow = count > 1 ? (ratio * (count - 1)) / (1 - ratio) : 1;

  useEffect(() => {
    const smallScreen = matchMedia('(max-width: 700px)');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setMobile(smallScreen.matches);
      setReduced(reducedMotion.matches);
    };
    update();
    smallScreen.addEventListener('change', update);
    reducedMotion.addEventListener('change', update);
    return () => {
      smallScreen.removeEventListener('change', update);
      reducedMotion.removeEventListener('change', update);
    };
  }, []);

  const applyLayout = useCallback((animate) => {
    const root = rootRef.current;
    if (!root || !count) return;
    const rect = root.getBoundingClientRect();
    const usable = Math.max((vertical ? rect.height : rect.width) - gap * (count - 1), 0);
    const mediaSize = Math.max(140, usable * ratio * 1.22);
    root.style.setProperty('--ag-media-size', `${mediaSize}px`);
    timelineRef.current?.kill();
    const dur = animate && !reduced ? duration : 0;
    const timeline = gsap.timeline();

    panelRefs.current.slice(0, count).forEach((panel, i) => {
      if (!panel) return;
      const opened = i === active;
      const rotation = opened || mobile || reduced ? 0 : i < active ? tilt : -tilt;
      timeline.to(panel, {
        flexGrow: opened ? grow : 1,
        rotateX: vertical ? -rotation : 0,
        rotateY: vertical ? 0 : rotation,
        '--ag-dim': opened ? 0 : 0.2,
        duration: dur,
        ease
      }, 0);
      const media = mediaRefs.current[i];
      if (media) {
        const drift = Math.max(-1.5, Math.min(1.5, active - i));
        const shift = reduced ? 0 : drift * parallax * mediaSize * 0.06;
        timeline.to(media, {
          xPercent: -50,
          yPercent: -50,
          x: vertical || opened ? 0 : shift,
          y: !vertical || opened ? 0 : shift,
          '--ag-gray': grayscale && !opened ? 1 : 0,
          duration: dur,
          ease
        }, 0);
      }
      if (showLabels && barRefs.current[i] && textRefs.current[i]) {
        timeline.to([barRefs.current[i], textRefs.current[i]], {
          opacity: opened ? 1 : 0,
          x: opened ? 0 : -10,
          duration: opened ? dur : dur * 0.6,
          stagger: reduced ? 0 : stagger,
          ease
        }, 0);
      }
    });
    timelineRef.current = timeline;
  }, [active, count, duration, ease, gap, grayscale, grow, mobile, parallax, ratio, reduced, showLabels, stagger, tilt, vertical]);

  useEffect(() => {
    layoutRef.current = applyLayout;
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => layoutRef.current?.(false));
    });
    observer.observe(root);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      timelineRef.current?.kill();
    };
  }, []);

  const navigate = (i, event) => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (i + 1) % count;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (i - 1 + count) % count;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = count - 1;
    if (next !== undefined) {
      event.preventDefault();
      panelRefs.current[next]?.focus({ preventScroll: true });
      setActive(next);
    }
  };

  if (!count) return null;
  return (
    <div
      ref={rootRef}
      className={`accordion-gallery${vertical ? ' accordion-gallery--vertical' : ''}${className ? ` ${className}` : ''}`}
      style={{
        '--ag-accent': accentColor,
        '--ag-overlay': overlayColor,
        '--ag-text': textColor,
        '--ag-gap': `${gap}px`,
        '--ag-radius': `${radius}px`,
        '--ag-height': `${height}px`,
        '--ag-open-grow': grow,
        '--ag-count': count
      }}
      role="group"
      aria-label={ariaLabel}
    >
      {items.map((item, i) => {
        const opened = i === active;
        const Tag = item.link ? 'a' : 'button';
        return (
          <Tag
            key={item.image}
            ref={el => { panelRefs.current[i] = el; }}
            className={`ag-panel${opened ? ' ag-panel--active' : ''}`}
            href={item.link || undefined}
            type={item.link ? undefined : 'button'}
            onPointerEnter={event => {
              if (trigger === 'hover' && event.pointerType === 'mouse') setActive(i);
            }}
            onClick={event => {
              if (!opened) event.preventDefault();
              setActive(i);
            }}
            onFocus={() => setActive(i)}
            onKeyDown={event => navigate(i, event)}
            aria-pressed={item.link ? undefined : opened}
            aria-current={item.link && opened ? 'true' : undefined}
            aria-label={`Ver foto: ${item.label || item.alt || i + 1}`}
          >
            <span className="ag-panel__frame">
              <span className="ag-panel__media" ref={el => { mediaRefs.current[i] = el; }}>
                <img src={item.image} alt={item.alt || item.label || ''} loading="lazy" decoding="async" draggable="false" style={{ objectPosition: item.position || 'center' }} />
              </span>
              <span className="ag-panel__overlay" aria-hidden="true" />
            </span>
            <span className="ag-panel__number" aria-hidden="true">0{i + 1}</span>
            {showLabels && <>
              <span className="ag-panel__compact" aria-hidden="true">{item.label}</span>
              <span className="ag-panel__label" aria-hidden="true">
                <span className="ag-panel__bar" ref={el => { barRefs.current[i] = el; }} />
                <span className="ag-panel__text" ref={el => { textRefs.current[i] = el; }}>{item.label}</span>
              </span>
            </>}
          </Tag>
        );
      })}
    </div>
  );
}
