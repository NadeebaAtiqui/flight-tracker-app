import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

export default function SavedTripsScreen({ navigation }) {
  const savedTrips = [
    {
      id: '1',
      flightNumber: 'AA1',
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
    {
      id: '2',
      flightNumber: 'DL204',
      airline: 'Delta Air Lines',
      status: 'active',
      departure: {
        airport: 'Los Angeles International',
        iata: 'LAX',
        scheduled: '2026-04-18T12:00:00+00:00',
        actual: '2026-04-18T12:00:00+00:00',
        terminal: '2',
        gate: 'B14',
        delay: null,
      },
      arrival: {
        airport: 'Hartsfield Jackson Atlanta International',
        iata: 'ATL',
        scheduled: '2026-04-18T19:45:00+00:00',
        actual: null,
        terminal: 'S',
        gate: 'S12',
        baggage: null,
      },
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#2ecc71';
      case 'landed': return '#3498db';
      case 'delayed': return '#e67e22';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const renderTrip = ({ item }) => (
    <TouchableOpacity
      style={styles.tripCard}
      onPress={() => navigation.navigate('FlightStatus', { flightData: item })}
    >
      <View style={styles.tripHeader}>
        <Text style={styles.tripFlightNumber}>{item.flightNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.tripAirline}>{item.airline}</Text>
      <View style={styles.tripRoute}>
        <Text style={styles.tripIata}>{item.departure.iata}</Text>
        <Text style={styles.tripArrow}>→</Text>
        <Text style={styles.tripIata}>{item.arrival.iata}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {savedTrips.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved trips yet</Text>
          <Text style={styles.emptySubtext}>
            Search for a flight and tap Save Trip to add it here
          </Text>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.searchButtonText}>Search a Flight</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={savedTrips}
          keyExtractor={(item) => item.id}
          renderItem={renderTrip}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 24,
  },
  tripCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tripFlightNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  tripAirline: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  tripRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tripIata: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  tripArrow: {
    fontSize: 18,
    color: '#2196F3',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  searchButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});