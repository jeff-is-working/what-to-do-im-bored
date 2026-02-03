import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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

  const reelsCompletedRef = useRef(0);

  const timeHours = sliderToHours(sliderValue);

  const filteredActivities = useMemo(() => {
    return activities.filter((a) => a.minHours <= timeHours);
  }, [timeHours]);

  const handleSpin = useCallback(() => {
    setIsSpinning(true);
    setShowResult(false);
    setSelectedLocation(null);
    setSelectedActivity(null);
    setMovieTitle(null);
    reelsCompletedRef.current = 0;
  }, []);

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
      if (activity.movieSuggestions) {
        const movies = activity.movieSuggestions;
        setMovieTitle(movies[Math.floor(Math.random() * movies.length)]);
      }
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
          onSpinComplete={handleLocationComplete}
          label="WHERE"
          duration={2.5}
        />
        <SlotReel
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
