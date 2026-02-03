import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { locations } from './data/locations.js';
import { activities } from './data/activities.js';
import { sliderToHours } from './utils/formatDuration.js';
import { getUserLocation, getSearchRadiusKm } from './utils/geo.js';
import { fetchWeather } from './utils/weather.js';
import { fetchNearbyPlaces } from './utils/places.js';
import TimeSlider from './components/TimeSlider.jsx';
import SlotReel from './components/SlotReel.jsx';
import SpinButton from './components/SpinButton.jsx';
import ResultCard from './components/ResultCard.jsx';
import ShareButton from './components/ShareButton.jsx';

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function App() {
  const [sliderValue, setSliderValue] = useState(4); // Default: ~6 hours
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [movieTitle, setMovieTitle] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // Pre-determined targets for the current spin
  const [targetActivity, setTargetActivity] = useState(null);
  const [targetLocation, setTargetLocation] = useState(null);

  // Weather and places state
  const [weather, setWeather] = useState(null);
  const [places, setPlaces] = useState(null);
  const [placesLoading, setPlacesLoading] = useState(false);

  const reelsCompletedRef = useRef(0);

  const timeHours = sliderToHours(sliderValue);

  const filteredActivities = useMemo(() => {
    return activities.filter((a) => a.minHours <= timeHours);
  }, [timeHours]);

  const handleSpin = useCallback(() => {
    if (filteredActivities.length === 0) return;

    // Pick activity first, then a compatible location
    const activity = pickRandom(filteredActivities);
    const validLocs = locations.filter((loc) =>
      activity.validLocations.includes(loc.id)
    );
    const location = validLocs.length > 0 ? pickRandom(validLocs) : pickRandom(locations);

    setTargetActivity(activity);
    setTargetLocation(location);
    setShowResult(false);
    setSelectedLocation(null);
    setSelectedActivity(null);
    setMovieTitle(null);
    setWeather(null);
    setPlaces(null);
    setPlacesLoading(false);
    reelsCompletedRef.current = 0;

    // Pre-compute movie title if applicable
    if (activity.movieSuggestions) {
      setMovieTitle(pickRandom(activity.movieSuggestions));
    }

    setIsSpinning(true);
  }, [filteredActivities]);

  const finishIfBothDone = useCallback(() => {
    reelsCompletedRef.current += 1;
    if (reelsCompletedRef.current >= 2) {
      setIsSpinning(false);
    }
  }, []);

  const handleLocationComplete = useCallback((location) => {
    setSelectedLocation(location);
    finishIfBothDone();
  }, [finishIfBothDone]);

  const handleActivityComplete = useCallback(
    (activity) => {
      setSelectedActivity(activity);
      finishIfBothDone();
    },
    [finishIfBothDone],
  );

  // Show result card after spinning stops and both results are in
  useEffect(() => {
    if (selectedLocation && selectedActivity && !isSpinning) {
      const timer = setTimeout(() => setShowResult(true), 250);
      return () => clearTimeout(timer);
    }
  }, [selectedLocation, selectedActivity, isSpinning]);

  // Fetch weather and places after result is shown and location is outdoor
  useEffect(() => {
    if (!showResult || !selectedLocation || !selectedActivity) return;
    if (!selectedLocation.outdoor) return;

    let cancelled = false;

    async function fetchData() {
      let coords;
      try {
        coords = await getUserLocation();
      } catch {
        // GPS denied or unavailable — skip weather and places
        return;
      }

      if (cancelled) return;

      // Fetch weather
      try {
        const w = await fetchWeather(coords.lat, coords.lon);
        if (!cancelled) setWeather(w);
      } catch {
        // Weather fetch failed — continue without it
      }

      // Fetch nearby places if location has an OSM tag
      if (selectedLocation.osmTag) {
        if (!cancelled) setPlacesLoading(true);
        try {
          const radiusKm = getSearchRadiusKm(timeHours);
          const p = await fetchNearbyPlaces(
            coords.lat,
            coords.lon,
            selectedLocation.osmTag,
            radiusKm,
          );
          if (!cancelled) setPlaces(p);
        } catch {
          // Places fetch failed — continue without it
        }
        if (!cancelled) setPlacesLoading(false);
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [showResult, selectedLocation, selectedActivity, timeHours]);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">What To Do</h1>
        <p className="app-subtitle">I'm Bored!</p>
      </header>

      <TimeSlider value={sliderValue} onChange={setSliderValue} />

      <div className="reels-container">
        <SlotReel
          items={locations}
          spinning={isSpinning}
          targetItem={targetLocation}
          onSpinComplete={handleLocationComplete}
          label="WHERE"
          duration={2.5}
        />
        <SlotReel
          items={filteredActivities}
          spinning={isSpinning}
          targetItem={targetActivity}
          onSpinComplete={handleActivityComplete}
          label="WHAT"
          duration={3.2}
        />
      </div>

      <SpinButton
        onClick={handleSpin}
        disabled={isSpinning || filteredActivities.length === 0}
      />

      {showResult && (
        <>
          <ResultCard
            activity={selectedActivity}
            location={selectedLocation}
            movieTitle={movieTitle}
            weather={weather}
            places={places}
            placesLoading={placesLoading}
          />
          <ShareButton
            activity={selectedActivity}
            location={selectedLocation}
            movieTitle={movieTitle}
          />
        </>
      )}

      {filteredActivities.length === 0 && (
        <p className="no-activities">
          No activities fit that time. Try increasing the slider!
        </p>
      )}
    </div>
  );
}
