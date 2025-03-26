import axios from 'axios';
import * as Location from 'expo-location';
import { Linking, Alert } from 'react-native';

const API_KEY = '936d42f9190a406cd24bd8701831a7d6'; // Replace with your API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export default class WeatherService {
  static async getCurrentLocation() {
    try {
      // Request foreground permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        // If permission is not granted, show an alert
        Alert.alert(
          'Location Permission',
          'Permission to access location was denied. Please enable location services in your device settings.',
          [
            { 
              text: 'Open Settings', 
              onPress: () => Linking.openSettings() 
            },
            { 
              text: 'Cancel', 
              style: 'cancel' 
            }
          ]
        );
        throw new Error('Permission to access location was denied');
      }

      // Get current position with timeout
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 15000 // 15 seconds timeout
      });
      
      return location.coords;
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  }

  // Rest of the code remains the same as in your original implementation
  static async getWeatherByCoords(lat, lon, units = 'metric') {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units
        }
      });
      return this._transformWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw error;
    }
  }

  static async getForecastByCoords(lat, lon, units = 'metric') {
    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units,
          cnt: 8
        }
      });
      return this._transformForecastData(response.data);
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw error;
    }
  }

  static async getWeatherByCity(city, units = 'metric') {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: API_KEY,
          units
        }
      });
      return this._transformWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather by city:', error);
      throw error;
    }
  }

  static _transformWeatherData(data) {
    return {
      id: data.id,
      location: data.name,
      country: data.sys?.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      pressure: data.main.pressure,
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
      coordinates: {
        latitude: data.coord.lat,
        longitude: data.coord.lon
      }
    };
  }

  static _transformForecastData(data) {
    return data.list.map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit' }),
      temperature: Math.round(item.main.temp),
      icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
      description: item.weather[0].description
    }));
  }
}