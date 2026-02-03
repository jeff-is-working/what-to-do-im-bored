import { useRef, useEffect, useCallback } from 'react';
import './SlotReel.css';

const ITEM_HEIGHT = 80;

export default function SlotReel({ items, spinning, onSpinComplete, label, duration = 3 }) {
  const stripRef = useRef(null);
  const targetIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const currentOffsetRef = useRef(0);
  const prevSpinningRef = useRef(false);

  const totalItems = items.length;

  const handleTransitionEnd = useCallback(() => {
    if (!isAnimatingRef.current) return;
    isAnimatingRef.current = false;

    const strip = stripRef.current;
    if (!strip) return;

    // Silently reposition to the equivalent spot in the middle copy
    const targetIndex = targetIndexRef.current;
    const resetOffset = (totalItems + targetIndex) * ITEM_HEIGHT;
    strip.style.transition = 'none';
    strip.style.transform = `translateY(-${resetOffset}px)`;
    currentOffsetRef.current = resetOffset;

    // Force reflow so the reset is committed before anything else
    strip.offsetHeight;

    onSpinComplete(items[targetIndex]);
  }, [items, totalItems, onSpinComplete]);

  // Detect spinning going from false → true (edge trigger, not level trigger)
  useEffect(() => {
    const wasSpinning = prevSpinningRef.current;
    prevSpinningRef.current = spinning;

    if (!spinning || wasSpinning || items.length === 0) return;

    const strip = stripRef.current;
    if (!strip) return;

    isAnimatingRef.current = true;

    // Pick random target
    const targetIndex = Math.floor(Math.random() * totalItems);
    targetIndexRef.current = targetIndex;

    // Ensure we have a valid starting position (middle copy, first item)
    if (currentOffsetRef.current === 0) {
      const startOffset = totalItems * ITEM_HEIGHT;
      strip.style.transition = 'none';
      strip.style.transform = `translateY(-${startOffset}px)`;
      currentOffsetRef.current = startOffset;
    }

    // Force reflow to commit the starting position
    strip.offsetHeight;

    // Calculate destination: scroll through 3 full rotations + land on target in middle copy
    const fullRotations = 3;
    const destination =
      currentOffsetRef.current + (totalItems * fullRotations + targetIndex) * ITEM_HEIGHT;

    // Double rAF to guarantee the browser has painted the start position
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!strip) return;
        strip.style.transition = `transform ${duration}s cubic-bezier(0.15, 0.85, 0.35, 1)`;
        strip.style.transform = `translateY(-${destination}px)`;
      });
    });
  }, [spinning, items, totalItems, duration]);

  // Set initial position on mount and when items change (filter update)
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || isAnimatingRef.current) return;
    const startOffset = totalItems * ITEM_HEIGHT;
    strip.style.transition = 'none';
    strip.style.transform = `translateY(-${startOffset}px)`;
    currentOffsetRef.current = startOffset;
  }, [items, totalItems]);

  // Repeat items 3x for seamless looping
  const repeatedItems = [...items, ...items, ...items];

  return (
    <div className="slot-reel">
      <div className="slot-reel-label">{label}</div>
      <div className="slot-reel-viewport">
        <div
          className="slot-reel-strip"
          ref={stripRef}
          onTransitionEnd={handleTransitionEnd}
        >
          {repeatedItems.map((item, i) => (
            <div className="slot-reel-item" key={`${item.id}-${i}`}>
              <span className="slot-reel-emoji">{item.emoji}</span>
              <span className="slot-reel-text">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="slot-reel-fade-top" />
        <div className="slot-reel-fade-bottom" />
      </div>
    </div>
  );
}
