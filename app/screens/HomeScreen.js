import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  const [flightNumber, setFlightNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!flightNumber.trim()) {
      setError('Please enter a flight number');
      return;
    }

    setLoading(true);
    setError('');

    // Mock data for now — we'll replace this with real API call later
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('FlightStatus', {
        flightData: {
          flightNumber: flightNumber.toUpperCase(),
          airline: 'American Airlines',
          status: 'landed',
          departure: {
            airport: 'John F Kennedy International',
            iata: 'JFK',
            scheduled: '2026-04-18T07:15:00+00:00',
            actual: '2026-04-18T07:40:00+00:00',
            terminal: '8',
            gate: '4',
            delay: null,
          },
          arrival: {
            airport: 'Los Angeles International',
            iata: 'LAX',
            scheduled: '2026-04-18T10:34:00+00:00',
            actual: '2026-04-18T10:02:00+00:00',
            terminal: '4',
            gate: '43',
            baggage: 'T4C2',
          },
        },
      });
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flight Tracker</Text>
      <Text style={styles.subtitle}>Enter a flight number to get started</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. AA1, DL204, UA100"
        value={flightNumber}
        onChangeText={setFlightNumber}
        autoCapitalize="characters"
        autoCorrect={false}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSearch}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Search Flight</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.savedButton}
        onPress={() => navigation.navigate('SavedTrips')}
      >
        <Text style={styles.savedButtonText}>View Saved Trips</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  error: {
    color: '#e74c3c',
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  savedButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  savedButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
});