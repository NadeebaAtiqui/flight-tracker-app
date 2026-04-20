import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { saveTrip } from '../utils/api';

export default function FlightStatusScreen({ route, navigation }) {
  const { flightData, onSave } = route.params;
  const [saving, setSaving] = useState(false);

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

  const handleSave = async () => {
    if (!onSave) return;
    try {
      setSaving(true);
      await saveTrip(flightData);
      onSave();
      navigation.navigate('Home');
    } catch (err) {
      console.error('Failed to save trip:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

      <View style={styles.ticket}>
        <View style={styles.ticketTop}>
          <View style={styles.ticketHeader}>
            <Text style={styles.airlineName}>{flightData.airline}</Text>
            <View style={[styles.statusPill, { backgroundColor: getStatusColor(flightData.status) }]}>
              <Text style={styles.statusPillText}>{flightData.status.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.routeRow}>
            <View style={styles.routeAirport}>
              <Text style={styles.iataHero}>{flightData.departure.iata}</Text>
              <Text style={styles.cityName}>
                {flightData.departure.airport.split(' ').slice(0, 2).join(' ')}
              </Text>
            </View>
            <View style={styles.routeMiddle}>
              <Text style={styles.flightNumberSmall}>{flightData.flightNumber}</Text>
              <Text style={styles.planeIcon}>✈</Text>
              <View style={styles.routeLine} />
            </View>
            <View style={[styles.routeAirport, { alignItems: 'flex-end' }]}>
              <Text style={styles.iataHero}>{flightData.arrival.iata}</Text>
              <Text style={styles.cityName}>
                {flightData.arrival.airport.split(' ').slice(0, 2).join(' ')}
              </Text>
            </View>
          </View>

          <View style={styles.timesRow}>
            <View>
              <Text style={styles.timeLabel}>DEPARTS</Text>
              <Text style={styles.timeValue}>{formatTime(flightData.departure.scheduled)}</Text>
              {flightData.departure.actual && (
                <Text style={styles.actualTime}>Actual: {formatTime(flightData.departure.actual)}</Text>
              )}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.timeLabel}>ARRIVES</Text>
              <Text style={styles.timeValue}>{formatTime(flightData.arrival.scheduled)}</Text>
              {flightData.arrival.actual && (
                <Text style={styles.actualTime}>Actual: {formatTime(flightData.arrival.actual)}</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.perforation}>
          <View style={styles.perforationCircleLeft} />
          <View style={styles.perforationLine} />
          <View style={styles.perforationCircleRight} />
        </View>

        <View style={styles.ticketStub}>
          <View style={styles.stubRow}>
            <View style={styles.stubItem}>
              <Text style={styles.stubLabel}>TERMINAL</Text>
              <Text style={styles.stubValue}>{flightData.departure.terminal || 'N/A'}</Text>
            </View>
            <View style={styles.stubItem}>
              <Text style={styles.stubLabel}>GATE</Text>
              <Text style={styles.stubValue}>{flightData.departure.gate || 'N/A'}</Text>
            </View>
            <View style={styles.stubItem}>
              <Text style={styles.stubLabel}>BAGGAGE</Text>
              <Text style={styles.stubValue}>{flightData.arrival.baggage || 'N/A'}</Text>
            </View>
            <View style={styles.stubItem}>
              <Text style={styles.stubLabel}>CLASS</Text>
              <Text style={styles.stubValue}>ECO</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.detailCardTitle}>Arrival details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Airport</Text>
          <Text style={styles.detailValue}>{flightData.arrival.airport}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Terminal</Text>
          <Text style={styles.detailValue}>{flightData.arrival.terminal || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Gate</Text>
          <Text style={styles.detailValue}>{flightData.arrival.gate || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Baggage claim</Text>
          <Text style={styles.detailValue}>{flightData.arrival.baggage || 'N/A'}</Text>
        </View>
        {flightData.departure.delay && (
          <View style={styles.delayBanner}>
            <Text style={styles.delayText}>⚠ Delayed {flightData.departure.delay} min</Text>
          </View>
        )}
      </View>

      {onSave && (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.saveButtonText}>+ Add to Wallet</Text>
          }
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8e3db',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 60,
  },
  ticket: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 16,
  },
  ticketTop: {
    padding: 20,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  airlineName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusPillText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  routeAirport: {
    flex: 1,
  },
  iataHero: {
    fontSize: 42,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -1,
  },
  cityName: {
    fontSize: 10,
    color: '#aaa',
    fontWeight: '500',
    marginTop: 2,
  },
  routeMiddle: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  flightNumberSmall: {
    fontSize: 9,
    color: '#bbb',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  planeIcon: {
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  routeLine: {
    width: 50,
    height: 1,
    backgroundColor: '#eee',
  },
  timesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeLabel: {
    fontSize: 9,
    color: '#bbb',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  timeValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  actualTime: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 2,
  },
  perforation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: -1,
  },
  perforationCircleLeft: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e8e3db',
  },
  perforationLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
  },
  perforationCircleRight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e8e3db',
  },
  ticketStub: {
    padding: 16,
    backgroundColor: '#fafafa',
  },
  stubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stubItem: {
    alignItems: 'center',
  },
  stubLabel: {
    fontSize: 8,
    color: '#bbb',
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  stubValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  detailCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    fontSize: 14,
    color: '#999',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'right',
  },
  delayBanner: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#fffbeb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  delayText: {
    fontSize: 13,
    color: '#d97706',
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  backButton: {
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc8c0',
  },
  backButtonText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '600',
  },
});