import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function FlightStatusScreen({ route, navigation }) {
  const { flightData } = route.params;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#2ecc71';
      case 'landed': return '#3498db';
      case 'delayed': return '#e67e22';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.flightNumber}>{flightData.flightNumber}</Text>
        <Text style={styles.airline}>{flightData.airline}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(flightData.status) }]}>
          <Text style={styles.statusText}>{flightData.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.airport}>
          <Text style={styles.iataCode}>{flightData.departure.iata}</Text>
          <Text style={styles.airportName}>{flightData.departure.airport}</Text>
        </View>
        <Text style={styles.arrow}>→</Text>
        <View style={styles.airport}>
          <Text style={styles.iataCode}>{flightData.arrival.iata}</Text>
          <Text style={styles.airportName}>{flightData.arrival.airport}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Departure</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Scheduled</Text>
          <Text style={styles.value}>{formatTime(flightData.departure.scheduled)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Actual</Text>
          <Text style={styles.value}>{formatTime(flightData.departure.actual)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Terminal</Text>
          <Text style={styles.value}>{flightData.departure.terminal || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Gate</Text>
          <Text style={styles.value}>{flightData.departure.gate || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Arrival</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Scheduled</Text>
          <Text style={styles.value}>{formatTime(flightData.arrival.scheduled)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Actual</Text>
          <Text style={styles.value}>{formatTime(flightData.arrival.actual)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Terminal</Text>
          <Text style={styles.value}>{flightData.arrival.terminal || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Gate</Text>
          <Text style={styles.value}>{flightData.arrival.gate || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Baggage</Text>
          <Text style={styles.value}>{flightData.arrival.baggage || 'N/A'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Trip</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Search Another Flight</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16,
  },
  flightNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  airline: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
  },
  airport: {
    alignItems: 'center',
    flex: 1,
  },
  iataCode: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  airportName: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  arrow: {
    fontSize: 24,
    color: '#2196F3',
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2196F3',
    marginBottom: 32,
  },
  backButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
});