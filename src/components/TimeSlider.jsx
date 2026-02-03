import { formatDuration, SLIDER_STOPS, sliderToHours } from '../utils/formatDuration.js';
import './TimeSlider.css';

export default function TimeSlider({ value, onChange }) {
  const hours = sliderToHours(value);

  return (
    <div className="time-slider">
      <div className="time-slider-header">
        <span className="time-slider-label">How much time do you have?</span>
        <span className="time-slider-value">{formatDuration(hours)}</span>
      </div>
      <input
        type="range"
        className="time-slider-input"
        min={0}
        max={SLIDER_STOPS.length - 1}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="time-slider-ticks">
        <span>1hr</span>
        <span>Half Day</span>
        <span>1 Day</span>
        <span>1 Week</span>
      </div>
    </div>
  );
}
