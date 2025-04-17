
import { WeatherCondition } from "@/types";

// OpenWeatherMap API key (this is just for example, consider using a more secure approach)
const API_KEY = "5a87c92c15b2de1f187e666e89b34d37";

export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherCondition> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Weather data not available");
    }

    const data = await response.json();
    
    // Convert OpenWeatherMap data to our WeatherCondition format
    return {
      windSpeed: Math.round(data.wind.speed), // Convert from m/s
      windGusts: Math.round(data.wind.gust || data.wind.speed * 1.5), // Some APIs don't provide gusts
      windDirection: convertWindDirection(data.wind.deg),
      visibility: convertVisibility(data.visibility),
      precipitation: convertPrecipitation(data.weather[0].id),
      forecast: determineForecast(data.weather[0].id),
      location: {
        lat,
        lon,
        name: data.name
      }
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

// Convert wind direction from degrees to our format
const convertWindDirection = (degrees: number): string => {
  // We're simplifying wind direction to match our options
  // Assuming the runway/takeoff direction is North (0/360 degrees)
  // Headwind: 315-45 degrees, Tailwind: 135-225 degrees, Crosswind: the rest
  if ((degrees >= 315 && degrees <= 360) || (degrees >= 0 && degrees <= 45)) {
    return "headwind";
  } else if (degrees >= 135 && degrees <= 225) {
    return "tailwind";
  } else {
    return "crosswind";
  }
};

// Convert visibility in meters to our format
const convertVisibility = (visibilityInMeters: number): string => {
  if (visibilityInMeters >= 10000) {
    return "good";
  } else if (visibilityInMeters >= 4000) {
    return "moderate";
  } else {
    return "poor";
  }
};

// Convert precipitation based on weather condition code
const convertPrecipitation = (conditionCode: number): string => {
  // Weather condition codes: https://openweathermap.org/weather-conditions
  // 2xx: Thunderstorm, 3xx: Drizzle, 5xx: Rain, 6xx: Snow
  if ([200, 201, 202, 210, 211, 212, 221, 230, 231, 232, 
       500, 501, 502, 503, 504, 511, 520, 521, 522, 531].includes(conditionCode)) {
    return conditionCode >= 502 ? "heavy" : "light"; // Heavy rain
  } else if ([300, 301, 302, 310, 311, 312, 313, 314, 321].includes(conditionCode)) {
    return "light"; // Drizzle is always light
  } else if ([600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622].includes(conditionCode)) {
    return conditionCode >= 602 ? "heavy" : "light"; // Snow
  } else {
    return "none"; // Clear or clouds
  }
};

// Determine forecast trend based on weather condition
const determineForecast = (conditionCode: number): string => {
  // This is simplified - in a real application you would use a forecast API
  // to get the actual weather trend
  if (conditionCode < 700) { // Precipitation codes
    return "worsening";
  } else if (conditionCode >= 800 && conditionCode <= 801) { // Clear or few clouds
    return "improving";
  } else {
    return "stable";
  }
};

export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      { enableHighAccuracy: true }
    );
  });
};
