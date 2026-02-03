import WeatherBadge from './WeatherBadge.jsx';
import PlaceSuggestions from './PlaceSuggestions.jsx';
import './ResultCard.css';

export default function ResultCard({ activity, location, movieTitle, weather, places, placesLoading }) {
  if (!activity || !location) return null;

  return (
    <div className="result-card">
      <div className="result-card-emojis">
        <span>{location.emoji}</span>
        <span>{activity.emoji}</span>
      </div>
      <p className="result-card-text">
        Let's <strong>{activity.label.toLowerCase()}</strong> {location.label.toLowerCase()}!
      </p>
      {movieTitle && (
        <p className="result-card-movie">
          We suggest: <strong>{movieTitle}</strong> {'🍿'}
        </p>
      )}
      {activity.involvesBernie && (
        <p className="result-card-bernie">
          {'🐾'} Bring Bernie along!
        </p>
      )}
      <WeatherBadge weather={weather} isOutdoor={location.outdoor} />
      <PlaceSuggestions places={places} loading={placesLoading} />
    </div>
  );
}
