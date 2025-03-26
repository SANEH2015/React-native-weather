import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AlertScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather Alerts</Text>
      <Text style={styles.message}>No active alerts in your area</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center'
  }
});

export default AlertScreen;