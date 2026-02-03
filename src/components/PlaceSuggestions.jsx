import './PlaceSuggestions.css';

export default function PlaceSuggestions({ places, loading }) {
  if (loading) {
    return (
      <div className="place-suggestions">
        <p className="place-suggestions-loading">Finding nearby spots...</p>
      </div>
    );
  }

  if (!places || places.length === 0) return null;

  return (
    <div className="place-suggestions">
      <p className="place-suggestions-header">Nearby options:</p>
      <ul className="place-suggestions-list">
        {places.map((place, i) => (
          <li key={i} className="place-suggestions-item">
            <span className="place-suggestions-name">{place.name}</span>
            <span className="place-suggestions-distance">{place.distLabel}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
