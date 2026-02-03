import './ShareButton.css';

export default function ShareButton({ activity, location, movieTitle }) {
  if (!activity || !location) return null;

  const handleShare = async () => {
    let text = `Let's ${activity.label.toLowerCase()} ${location.label.toLowerCase()}!`;
    if (movieTitle) {
      text += ` We should watch: ${movieTitle}`;
    }
    if (activity.involvesBernie) {
      text += ' \u{1F43E} Bernie can come too!';
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: "What To Do I'm Bored",
          text,
        });
      } catch {
        // User cancelled share
      }
    } else {
      window.location.href = `sms:?body=${encodeURIComponent(text)}`;
    }
  };

  return (
    <button className="share-button" onClick={handleShare}>
      Share This Plan {'📨'}
    </button>
  );
}
