import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  FlatList, 
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import WeatherService from '../services/WeatherService';
import { ThemeContext } from '../context/ThemeContext';
import { SettingsContext } from '../context/SettingsContext';
import { LocationContext } from '../context/LocationContext';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getWeatherBackground = (description) => {
  const weatherBackgrounds = {
    'clear sky': ['#87CEEB', '#1E90FF'],
    'few clouds': ['#87CEEB', '#4682B4'],
    'scattered clouds': ['#B0C4DE', '#778899'],
    'broken clouds': ['#708090', '#2F4F4F'],
    'shower rain': ['#4682B4', '#1E4E8C'],
    'rain': ['#4682B4', '#1E4E8C'],
    'thunderstorm': ['#483D8B', '#191970'],
    'snow': ['#F0F8FF', '#B0E0E6'],
    'mist': ['#B0C4DE', '#708090']
  };

  const lowercaseDesc = description.toLowerCase();
  const backgroundKey = Object.keys(weatherBackgrounds).find(key => 
    lowercaseDesc.includes(key)
  );

  return backgroundKey 
    ? weatherBackgrounds[backgroundKey] 
    : ['#87CEEB', '#1E90FF']; // default clear sky
};

const HomeScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useContext(ThemeContext);
  const { unitSystem } = useContext(SettingsContext);
  const { addLocation } = useContext(LocationContext);
  
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [citySearch, setCitySearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchWeatherByCity = async (city) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentWeather = await WeatherService.getWeatherByCity(city, unitSystem);
      const hourlyForecast = await WeatherService.getForecastByCoords(
        currentWeather.coordinates.latitude, 
        currentWeather.coordinates.longitude, 
        unitSystem
      );
      
      setWeather(currentWeather);
      setForecast(hourlyForecast);
      
      addLocation({
        id: currentWeather.id,
        name: currentWeather.location,
        latitude: currentWeather.coordinates.latitude,
        longitude: currentWeather.coordinates.longitude
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch weather');
      console.error('Error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeatherByCity('New York');
  }, [unitSystem]);

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a city"
        placeholderTextColor="#888"
        value={citySearch}
        onChangeText={setCitySearch}
        onSubmitEditing={() => fetchWeatherByCity(citySearch.trim())}
      />
      <TouchableOpacity 
        style={styles.searchButton}
        onPress={() => fetchWeatherByCity(citySearch.trim())}
      >
        <Ionicons name="search" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <LinearGradient 
        colors={['#87CEEB', '#1E90FF']} 
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="white" />
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient 
        colors={['#FF6B6B', '#FF4136']} 
        style={styles.errorContainer}
      >
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => fetchWeatherByCity('New York')}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  const backgroundColors = weather 
    ? getWeatherBackground(weather.description) 
    : ['#87CEEB', '#1E90FF'];

  return (
    <LinearGradient 
      colors={backgroundColors} 
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              if (weather) {
                fetchWeatherByCity(weather.location);
              }
            }}
            tintColor="white"
          />
        }
      >
        {renderSearchBar()}

        {weather && (
          <View style={styles.weatherContainer}>
            <View style={styles.locationHeader}>
              <Ionicons name="location" size={24} color="white" />
              <Text style={styles.locationText}>
                {weather.location}, {weather.country}
              </Text>
            </View>

            <View style={styles.mainWeatherContainer}>
              <Image 
                source={{ uri: weather.icon }} 
                style={styles.weatherIcon} 
              />
              <Text style={styles.temperatureText}>
                {weather.temperature}°
              </Text>
              <Text style={styles.descriptionText}>
                {weather.description}
              </Text>
            </View>

            <View style={styles.weatherDetailsContainer}>
              <View style={styles.detailItem}>
                <Ionicons name="thermometer" size={24} color="white" />
                <Text style={styles.detailLabel}>Feels Like</Text>
                <Text style={styles.detailValue}>{weather.feelsLike}°</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="water" size={24} color="white" />
                <Text style={styles.detailLabel}>Humidity</Text>
                <Text style={styles.detailValue}>{weather.humidity}%</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="speedometer" size={24} color="white" />
                <Text style={styles.detailLabel}>Wind</Text>
                <Text style={styles.detailValue}>
                  {weather.windSpeed} {unitSystem === 'metric' ? 'm/s' : 'mph'}
                </Text>
              </View>
            </View>

            <View style={styles.forecastContainer}>
              <Text style={styles.forecastTitle}>Hourly Forecast</Text>
              <FlatList
                horizontal
                data={forecast}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                  // Parse the time and format it for better readability
                  const date = new Date(item.time);
                  const hours = date.getHours();
                  const minutes = date.getMinutes();
                  const ampm = hours >= 12 ? 'PM' : 'AM';
                  const formattedHours = hours % 12 || 12;
                  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
                  
                  return (
                    <View style={styles.forecastItem}>
                      <Text style={styles.forecastTime}>
                        {formattedHours}:{formattedMinutes} {ampm}
                      </Text>
                      <Image 
                        source={{ uri: item.icon }} 
                        style={styles.forecastIcon} 
                      />
                      <Text style={styles.forecastTemp}>{item.temperature}°</Text>
                    </View>
                  );
                }}
                showsHorizontalScrollIndicator={false}
              />
            </View>

            <View style={styles.sunInfoContainer}>
              <View style={styles.sunInfoItem}>
                <Ionicons name="sunny" size={24} color="white" />
                <Text style={styles.sunInfoText}>Sunrise</Text>
                <Text style={styles.sunInfoValue}>{weather.sunrise}</Text>
              </View>
              <View style={styles.sunInfoItem}>
                <Ionicons name="moon" size={24} color="white" />
                <Text style={styles.sunInfoText}>Sunset</Text>
                <Text style={styles.sunInfoValue}>{weather.sunset}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 50,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  weatherContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  locationText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  mainWeatherContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  weatherIcon: {
    width: 150,
    height: 150,
  },
  temperatureText: {
    color: 'white',
    fontSize: 80,
    fontWeight: 'bold',
  },
  descriptionText: {
    color: 'white',
    fontSize: 22,
    textTransform: 'capitalize',
  },
  weatherDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 15,
    marginBottom: 30,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  detailValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forecastContainer: {
    marginBottom: 30,
  },
  forecastTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  forecastItem: {
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    padding: 10,
    width: 80,
  },
  forecastTime: {
    color: 'white',
    fontSize: 12,
  },
  forecastIcon: {
    width: 50,
    height: 50,
    marginVertical: 5,
  },
  forecastTemp: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sunInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 15,
  },
  sunInfoItem: {
    alignItems: 'center',
  },
  sunInfoText: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  sunInfoValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;