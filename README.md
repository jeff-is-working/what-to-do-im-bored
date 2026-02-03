# What To Do, I'm Bored

A slot-machine-style activity picker to help you and your partner choose something fun to do — sometimes with your puppy Bernie.

**Live:** https://jeff-is-working.github.io/what-to-do-im-bored/

## How It Works

1. Set how much time you have (1 hour to 1 week)
2. Hit **SPIN!** to randomize two reels: **WHERE** and **WHAT**
3. Get a fun combo like "Let's go stargazing at the lake!"
4. See real weather and nearby place suggestions with directions
5. Share the result via iMessage or text

## Features

- **50+ activities** across 18 locations with slot machine spinning animation
- **Time slider** filters activities by duration — every bracket from 1 hour to 1 week has at least 5 options
- **Smart pairing** — activities only land on locations that make sense (no "play fetch in the car")
- **Weather at destination** — outdoor results show the forecast where you're going, not where you are now
- **Nearby place suggestions** — real places pulled from OpenStreetMap within a time-appropriate radius, with clickable links to Google Maps directions
- **Movie night** — the movie activity suggests a specific film to watch
- **Bernie-friendly** — activities involving the puppy are marked with a paw print
- **Sharing** — Web Share API for native sharing on iPhone, SMS fallback elsewhere
- **Mobile-first** — designed for phones, works everywhere

## Data Sources

| Source | Used For |
|--------|----------|
| [Open-Meteo](https://open-meteo.com/) | Weather forecasts (free, no API key) |
| [Overpass API](https://overpass-api.de/) | Nearby places via OpenStreetMap (free, no API key) |
| Browser Geolocation API | GPS coordinates for weather and place searches |

## Development

```bash
npm install
npm run dev      # Start dev server
npm run build    # Production build
npm run deploy   # Build and deploy to GitHub Pages
```

## Disclaimer

Suggested locations are sourced from [OpenStreetMap](https://www.openstreetmap.org/) via the Overpass API and are not controlled by the I'm Bored team. Please verify destinations independently before visiting.

## Tech

React + Vite, plain CSS, deployed to GitHub Pages via gh-pages.
