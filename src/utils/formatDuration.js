export function formatDuration(hours) {
  if (hours < 1) return '30 min';
  if (hours === 1) return '1 hour';
  if (hours < 24) return `${hours} hours`;
  if (hours < 48) return '1 day';
  if (hours < 72) return '2 days';
  if (hours < 96) return '3 days';
  if (hours < 120) return '4 days';
  if (hours < 144) return '5 days';
  if (hours < 168) return '6 days';
  return '1 week';
}

// Snap points for the slider to make it feel natural
export const SLIDER_STOPS = [1, 2, 3, 4, 6, 8, 12, 24, 48, 72, 120, 168];

export function sliderToHours(sliderValue) {
  const index = Math.round(sliderValue);
  return SLIDER_STOPS[Math.min(index, SLIDER_STOPS.length - 1)];
}
