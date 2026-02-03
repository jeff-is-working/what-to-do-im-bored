import { useRef, useEffect, useCallback, useState } from 'react';
import './SlotReel.css';

const ITEM_HEIGHT = 80;

export default function SlotReel({ items, spinning, onSpinComplete, label, duration = 3 }) {
  const stripRef = useRef(null);
  const [currentOffset, setCurrentOffset] = useState(0);
  const targetIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);

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
    setCurrentOffset(resetOffset);

    // Force reflow before allowing future transitions
    strip.offsetHeight;

    onSpinComplete(items[targetIndex]);
  }, [items, totalItems, onSpinComplete]);

  useEffect(() => {
    if (!spinning || items.length === 0) return;

    const strip = stripRef.current;
    if (!strip) return;

    isAnimatingRef.current = true;

    // Pick random target
    const targetIndex = Math.floor(Math.random() * totalItems);
    targetIndexRef.current = targetIndex;

    // Calculate destination: scroll through 2-3 full rotations + land on target in middle copy
    const fullRotations = 3;
    const destination = (totalItems * fullRotations + totalItems + targetIndex) * ITEM_HEIGHT;

    // Small delay to ensure any reset has painted
    requestAnimationFrame(() => {
      strip.style.transition = `transform ${duration}s cubic-bezier(0.15, 0.85, 0.35, 1)`;
      strip.style.transform = `translateY(-${destination}px)`;
    });
  }, [spinning, items, totalItems, duration]);

  // Reset position when items change (e.g., filter update)
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || isAnimatingRef.current) return;
    const resetOffset = totalItems * ITEM_HEIGHT; // Start at middle copy, first item
    strip.style.transition = 'none';
    strip.style.transform = `translateY(-${resetOffset}px)`;
    setCurrentOffset(resetOffset);
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
