import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const getWeatherTool = () => {
  return new DynamicStructuredTool({
    name: "weather",
    description:
      "Get current weather and forecast for a specific location. Input should be a city name (e.g., 'London', 'New York').",
    schema: z.object({
      location: z.string().describe("The city name to get weather for"),
    }),
    func: async ({ location }: { location: string }) => {
      try {
        console.log(`[Weather] Fetching weather for: ${location}`);

        // 1. Geocoding
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          location
        )}&count=1&language=en&format=json`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
          return `Could not find location: ${location}`;
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // 2. Weather Data
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&forecast_days=3`;
        
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        if (weatherData.error) {
          throw new Error(weatherData.reason || "Weather API error");
        }

        const current = weatherData.current;
        const current_units = weatherData.current_units;
        const daily = weatherData.daily;
        const daily_units = weatherData.daily_units;

        // Helper to interpret WMO codes
        const getWeatherDescription = (code: number) => {
            const codes: Record<number, string> = {
                0: "Clear sky",
                1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
                45: "Fog", 48: "Depositing rime fog",
                51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
                61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
                71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
                77: "Snow grains",
                80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
                85: "Slight snow showers", 86: "Heavy snow showers",
                95: "Thunderstorm", 96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail"
            };
            return codes[code] || "Unknown";
        };

        const weatherInfo = {
            location: `${name}, ${country}`,
            coordinates: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
            current: {
                condition: getWeatherDescription(current.weather_code),
                temperature: `${current.temperature_2m}${current_units.temperature_2m}`,
                feels_like: `${current.apparent_temperature}${current_units.apparent_temperature}`,
                humidity: `${current.relative_humidity_2m}${current_units.relative_humidity_2m}`,
                wind_speed: `${current.wind_speed_10m}${current_units.wind_speed_10m}`,
                precipitation: `${current.precipitation}${current_units.precipitation}`,
                cloud_cover: `${current.cloud_cover}${current_units.cloud_cover}`
            },
            forecast: daily.time.map((date: string, index: number) => ({
                date,
                condition: getWeatherDescription(daily.weather_code[index]),
                max_temp: `${daily.temperature_2m_max[index]}${daily_units.temperature_2m_max}`,
                min_temp: `${daily.temperature_2m_min[index]}${daily_units.temperature_2m_min}`,
                sunrise: daily.sunrise[index],
                sunset: daily.sunset[index]
            }))
        };

        return JSON.stringify(weatherInfo);
      } catch (error) {
        console.error("Weather tool error:", error);
        return `Error fetching weather: ${(error as Error).message}`;
      }
    },
  });
};
