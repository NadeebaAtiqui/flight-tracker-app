import { useState, useEffect, useRef } from 'react';
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  PanResponder,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getTrips } from '../utils/api';
import axios from 'axios';

const TICKET_HEIGHT = 280;
const PEEK = 70;
const SWIPE_THRESHOLD = 50;

export default function HomeScreen({ navigation }) {
  const [flightNumber, setFlightNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [savedTrips, setSavedTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);

  const swipeAnim = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy < 0) {
          swipeAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -SWIPE_THRESHOLD) {
          Animated.timing(swipeAnim, {
            toValue: -TICKET_HEIGHT,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            setActiveIndex(prev => Math.min(prev + 1, 999));
            swipeAnim.setValue(0);
          });
        } else {
          Animated.spring(swipeAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    loadTrips();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadTrips();
    }, [])
  );

  const loadTrips = async () => {
    try {
      setLoadingTrips(true);
      const trips = await getTrips();
      setSavedTrips(trips);
      setActiveIndex(0);
    } catch (err) {
      console.error('Failed to load trips:', err);
    } finally {
      setLoadingTrips(false);
    }
  };

  const handleSearch = async () => {
    if (!flightNumber.trim()) {
      setError('Please enter a flight number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `https://fabwnw59qa.execute-api.us-east-1.amazonaws.com/prod/flight`,
        { params: { flightIata: flightNumber.toUpperCase() } }
      );
      setLoading(false);
      setFlightNumber('');
      navigation.navigate('FlightStatus', {
        flightData: response.data,
        onSave: () => loadTrips(),
      });
    } catch (err) {
      setLoading(false);
      setError('Flight not found. Please check the flight number.');
    }
  };

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

  const visibleTrips = savedTrips.slice(activeIndex);

  const renderTicket = (trip, index) => {
    const isTop = index === 0;

    return (
      <Animated.View
        key={trip.id}
        style={[
          styles.ticket,
          {
            top: index * PEEK,
            zIndex: visibleTrips.length - index,
            height: TICKET_HEIGHT,
            transform: [
              { scale: 1 - index * 0.02 },
              ...(isTop ? [{ translateY: swipeAnim }] : []),
            ],
          },
        ]}
        {...(isTop ? panResponder.panHandlers : {})}
      >
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() =>
            isTop &&
            navigation.navigate('FlightStatus', {
              flightData: trip,
              onSave: null,
            })
          }
          style={{ flex: 1 }}
        >
          <View style={styles.ticketTop}>
            <View style={styles.ticketHeader}>
              <Text style={styles.airlineName}>{trip.airline}</Text>
              <View style={[styles.statusPill, { backgroundColor: getStatusColor(trip.status) }]}>
                <Text style={styles.statusPillText}>{trip.status.toUpperCase()}</Text>
              </View>
            </View>

            <View style={styles.routeRow}>
              <View style={styles.routeAirport}>
                <Text style={styles.iataHero}>{trip.departure.iata}</Text>
                <Text style={styles.cityName}>
                  {trip.departure.airport.split(' ').slice(0, 2).join(' ')}
                </Text>
              </View>
              <View style={styles.routeMiddle}>
                <Text style={styles.flightNumberSmall}>{trip.flightNumber}</Text>
                <Text style={styles.planeIcon}>✈</Text>
                <View style={styles.routeLine} />
              </View>
              <View style={[styles.routeAirport, { alignItems: 'flex-end' }]}>
                <Text style={styles.iataHero}>{trip.arrival.iata}</Text>
                <Text style={styles.cityName}>
                  {trip.arrival.airport.split(' ').slice(0, 2).join(' ')}
                </Text>
              </View>
            </View>

            <View style={styles.timesRow}>
              <View>
                <Text style={styles.timeLabel}>DEPARTS</Text>
                <Text style={styles.timeValue}>{formatTime(trip.departure.scheduled)}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.timeLabel}>ARRIVES</Text>
                <Text style={styles.timeValue}>{formatTime(trip.arrival.scheduled)}</Text>
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
                <Text style={styles.stubValue}>{trip.departure.terminal || 'N/A'}</Text>
              </View>
              <View style={styles.stubItem}>
                <Text style={styles.stubLabel}>GATE</Text>
                <Text style={styles.stubValue}>{trip.departure.gate || 'N/A'}</Text>
              </View>
              <View style={styles.stubItem}>
                <Text style={styles.stubLabel}>SEAT</Text>
                <Text style={styles.stubValue}>N/A</Text>
              </View>
              <View style={styles.stubItem}>
                <Text style={styles.stubLabel}>CLASS</Text>
                <Text style={styles.stubValue}>ECO</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const stackHeight = visibleTrips.length > 0
    ? TICKET_HEIGHT + (visibleTrips.length - 1) * PEEK
    : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>Good evening ✈</Text>
        <Text style={styles.subtitle}>Your saved flights</Text>

        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="Search a flight e.g. AA1"
            placeholderTextColor="#aaa"
            value={flightNumber}
            onChangeText={setFlightNumber}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={styles.searchButtonText}>Go</Text>
            }
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loadingTrips && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#1a1a1a" />
            <Text style={styles.loadingText}>Loading your wallet...</Text>
          </View>
        )}

        {!loadingTrips && savedTrips.length > 0 && (
          <View style={styles.walletHeader}>
            <Text style={styles.walletLabel}>MY WALLET</Text>
            <Text style={styles.walletCount}>
              {visibleTrips.length} of {savedTrips.length} pass{savedTrips.length !== 1 ? 'es' : ''}
            </Text>
          </View>
        )}

        {!loadingTrips && visibleTrips.length > 1 && (
          <Text style={styles.swipeHint}>↑ Swipe up to see next pass</Text>
        )}

        {!loadingTrips && savedTrips.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎫</Text>
            <Text style={styles.emptyText}>No saved flights yet</Text>
            <Text style={styles.emptySubtext}>Search for a flight to get started</Text>
          </View>
        )}

        {!loadingTrips && visibleTrips.length > 0 && (
          <View style={{ height: stackHeight, position: 'relative' }}>
            {visibleTrips.map((trip, index) => renderTicket(trip, index))}
          </View>
        )}

        {!loadingTrips && visibleTrips.length === 0 && savedTrips.length > 0 && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => setActiveIndex(0)}
          >
            <Text style={styles.resetButtonText}>↩ Show all passes</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e8e3db',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ddd6cc',
    color: '#1a1a1a',
  },
  searchButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  error: {
    color: '#e74c3c',
    fontSize: 13,
    marginBottom: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#aaa',
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  walletLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#aaa',
    letterSpacing: 1,
  },
  walletCount: {
    fontSize: 11,
    color: '#aaa',
  },
  swipeHint: {
    fontSize: 11,
    color: '#bbb',
    marginBottom: 12,
    textAlign: 'center',
  },
  ticket: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    overflow: 'hidden',
  },
  ticketTop: {
    padding: 20,
    backgroundColor: '#fff',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    marginBottom: 16,
  },
  routeAirport: {
    flex: 1,
  },
  iataHero: {
    fontSize: 38,
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
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#aaa',
  },
  resetButton: {
    marginTop: 24,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc8c0',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
});