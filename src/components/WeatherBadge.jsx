import './WeatherBadge.css';

export default function WeatherBadge({ weather, isOutdoor }) {
  if (!weather) return null;

  return (
    <div className="weather-badge">
      <div className="weather-badge-main">
        <span className="weather-badge-emoji">{weather.emoji}</span>
        <span className="weather-badge-temp">{weather.temp}{'°F'}</span>
        <span className="weather-badge-desc">{weather.description}</span>
      </div>
      {weather.isBadWeather && isOutdoor && (
        <p className="weather-badge-warning">
          {'⚠️'} Heads up — it's {weather.description.toLowerCase()} outside! Maybe consider an indoor backup.
        </p>
      )}
    </div>
  );
}
