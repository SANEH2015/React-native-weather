import React, { useContext } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { SettingsContext } from '../context/SettingsContext';
import { ThemeContext } from '../context/ThemeContext';

const SettingsScreen = () => {
  const { 
    unitSystem, 
    setUnitSystem, 
    notificationsEnabled, 
    setNotificationsEnabled 
  } = useContext(SettingsContext);
  
  const { colors, toggleTheme, isDarkMode } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
        />
      </View>
      
      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: colors.text }]}>Use Metric Units</Text>
        <Switch
          value={unitSystem === 'metric'}
          onValueChange={(value) => setUnitSystem(value ? 'metric' : 'imperial')}
        />
      </View>
      
      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: colors.text }]}>Weather Alerts</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  settingText: {
    fontSize: 16
  }
});

export default SettingsScreen;