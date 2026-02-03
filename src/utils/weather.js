const WEATHER_CODES = {
  0: { description: 'Clear', emoji: '\u2600\uFE0F', bad: false },
  1: { description: 'Mostly Clear', emoji: '\u{1F324}\uFE0F', bad: false },
  2: { description: 'Partly Cloudy', emoji: '\u26C5', bad: false },
  3: { description: 'Overcast', emoji: '\u2601\uFE0F', bad: false },
  45: { description: 'Foggy', emoji: '\u{1F32B}\uFE0F', bad: false },
  48: { description: 'Icy Fog', emoji: '\u{1F32B}\uFE0F', bad: true },
  51: { description: 'Light Drizzle', emoji: '\u{1F326}\uFE0F', bad: false },
  53: { description: 'Drizzle', emoji: '\u{1F327}\uFE0F', bad: true },
  55: { description: 'Heavy Drizzle', emoji: '\u{1F327}\uFE0F', bad: true },
  61: { description: 'Light Rain', emoji: '\u{1F326}\uFE0F', bad: true },
  63: { description: 'Rain', emoji: '\u{1F327}\uFE0F', bad: true },
  65: { description: 'Heavy Rain', emoji: '\u{1F327}\uFE0F', bad: true },
  71: { description: 'Light Snow', emoji: '\u{1F328}\uFE0F', bad: true },
  73: { description: 'Snow', emoji: '\u2744\uFE0F', bad: true },
  75: { description: 'Heavy Snow', emoji: '\u2744\uFE0F', bad: true },
  77: { description: 'Snow Grains', emoji: '\u2744\uFE0F', bad: true },
  80: { description: 'Light Showers', emoji: '\u{1F326}\uFE0F', bad: true },
  81: { description: 'Showers', emoji: '\u{1F327}\uFE0F', bad: true },
  82: { description: 'Heavy Showers', emoji: '\u{1F327}\uFE0F', bad: true },
  85: { description: 'Light Snow Showers', emoji: '\u{1F328}\uFE0F', bad: true },
  86: { description: 'Snow Showers', emoji: '\u2744\uFE0F', bad: true },
  95: { description: 'Thunderstorm', emoji: '\u26C8\uFE0F', bad: true },
  96: { description: 'Thunderstorm w/ Hail', emoji: '\u26C8\uFE0F', bad: true },
  99: { description: 'Severe Thunderstorm', emoji: '\u26C8\uFE0F', bad: true },
};

function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { description: 'Unknown', emoji: '\u{1F321}\uFE0F', bad: false };
}

export async function fetchWeather(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code,wind_speed_10m` +
    `&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) return null;

  const data = await response.json();
  const current = data.current;
  const info = getWeatherInfo(current.weather_code);

  return {
    temp: Math.round(current.temperature_2m),
    windMph: Math.round(current.wind_speed_10m),
    code: current.weather_code,
    description: info.description,
    emoji: info.emoji,
    isBadWeather: info.bad,
  };
}
