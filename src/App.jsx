import { useState, useMemo, useCallback } from 'react';
import { locations } from './data/locations.js';
import { activities } from './data/activities.js';
import { sliderToHours } from './utils/formatDuration.js';
import TimeSlider from './components/TimeSlider.jsx';
import SlotReel from './components/SlotReel.jsx';
import SpinButton from './components/SpinButton.jsx';
import ResultCard from './components/ResultCard.jsx';
import ShareButton from './components/ShareButton.jsx';

export default function App() {
  const [sliderValue, setSliderValue] = useState(4); // Default: ~6 hours
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [movieTitle, setMovieTitle] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [spinKey, setSpinKey] = useState(0);

  const timeHours = sliderToHours(sliderValue);

  const filteredActivities = useMemo(() => {
    return activities.filter((a) => a.minHours <= timeHours);
  }, [timeHours]);

  // Track which reels have completed
  const [reelsCompleted, setReelsCompleted] = useState(0);

  const handleSpin = useCallback(() => {
    setIsSpinning(true);
    setShowResult(false);
    setSelectedLocation(null);
    setSelectedActivity(null);
    setMovieTitle(null);
    setReelsCompleted(0);
    setSpinKey((k) => k + 1);
  }, []);

  const handleLocationComplete = useCallback((location) => {
    setSelectedLocation(location);
    setReelsCompleted((c) => {
      const next = c + 1;
      if (next >= 2) setIsSpinning(false);
      return next;
    });
  }, []);

  const handleActivityComplete = useCallback(
    (activity) => {
      setSelectedActivity(activity);
      if (activity.movieSuggestions) {
        const movies = activity.movieSuggestions;
        setMovieTitle(movies[Math.floor(Math.random() * movies.length)]);
      }
      setReelsCompleted((c) => {
        const next = c + 1;
        if (next >= 2) setIsSpinning(false);
        return next;
      });
    },
    [],
  );

  // Show result once both reels are done
  const resultReady = selectedLocation && selectedActivity && !isSpinning;

  // Delay result display slightly for dramatic effect
  useState(() => {
    // not used as hook, just initialize
  });

  // Use effect-like pattern: show result when spinning stops
  if (resultReady && !showResult) {
    setTimeout(() => setShowResult(true), 200);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">What To Do</h1>
        <p className="app-subtitle">I'm Bored!</p>
      </header>

      <TimeSlider value={sliderValue} onChange={setSliderValue} />

      <div className="reels-container">
        <SlotReel
          key={`where-${spinKey}`}
          items={locations}
          spinning={isSpinning}
          onSpinComplete={handleLocationComplete}
          label="WHERE"
          duration={2.5}
        />
        <SlotReel
          key={`what-${spinKey}`}
          items={filteredActivities}
          spinning={isSpinning}
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
