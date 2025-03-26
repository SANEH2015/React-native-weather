import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';
import { LocationContext } from '../context/LocationContext';
import { ThemeContext } from '../context/ThemeContext';

const LocationScreen = ({ navigation }) => {
  const { colors } = useContext(ThemeContext);
  const { savedLocations, removeLocation } = useContext(LocationContext);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Saved Locations</Text>
      
      {savedLocations.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.text }]}>
          No locations saved yet. Your current location will be saved automatically.
        </Text>
      ) : (
        <FlatList
          data={savedLocations}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.locationItem, { backgroundColor: colors.card }]}
              onPress={() => navigation.navigate('Home', { location: item })}
            >
              <View style={styles.locationInfo}>
                <Text style={[styles.locationName, { color: colors.text }]}>{item.name}</Text>
                <Text style={{ color: colors.text }}>
                  {item.latitude.toFixed(2)}, {item.longitude.toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => removeLocation(item.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteText}>×</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  deleteButton: {
    padding: 10,
  },
  deleteText: {
    fontSize: 24,
    color: 'red',
  },
});

export default LocationScreen;