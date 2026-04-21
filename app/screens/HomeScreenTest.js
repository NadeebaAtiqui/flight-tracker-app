import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const TICKET_HEIGHT = SCREEN_HEIGHT * 0.62;
const SWIPE_THRESHOLD = 80;

const MOCK_TRIPS = [
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
  {
    id: '3',
    flightNumber: 'UA500',
    airline: 'United Airlines',
    status: 'delayed',
    departure: {
      airport: 'Chicago OHare International',
      iata: 'ORD',
      scheduled: '2026-04-18T09:00:00+00:00',
      actual: '2026-04-18T09:47:00+00:00',
      terminal: '1',
      gate: 'C20',
      delay: 47,
    },
    arrival: {
      airport: 'Miami International',
      iata: 'MIA',
      scheduled: '2026-04-18T13:30:00+00:00',
      actual: null,
      terminal: 'D',
      gate: 'D30',
      baggage: null,
    },
  },
  {
    id: '4',
    flightNumber: 'BA175',
    airline: 'British Airways',
    status: 'active',
    departure: {
      airport: 'Heathrow Airport',
      iata: 'LHR',
      scheduled: '2026-04-18T11:00:00+00:00',
      actual: '2026-04-18T11:05:00+00:00',
      terminal: '5',
      gate: 'B22',
      delay: null,
    },
    arrival: {
      airport: 'John F Kennedy International',
      iata: 'JFK',
      scheduled: '2026-04-18T14:00:00+00:00',
      actual: null,
      terminal: '7',
      gate: 'G5',
      baggage: null,
    },
  },
  {
    id: '5',
    flightNumber: 'EK201',
    airline: 'Emirates',
    status: 'cancelled',
    departure: {
      airport: 'Dubai International',
      iata: 'DXB',
      scheduled: '2026-04-18T08:00:00+00:00',
      actual: null,
      terminal: '3',
      gate: 'A10',
      delay: null,
    },
    arrival: {
      airport: 'John F Kennedy International',
      iata: 'JFK',
      scheduled: '2026-04-18T14:30:00+00:00',
      actual: null,
      terminal: '4',
      gate: null,
      baggage: null,
    },
  },
  {
    id: '6',
    flightNumber: 'QR702',
    airline: 'Qatar Airways',
    status: 'active',
    departure: {
      airport: 'Hamad International',
      iata: 'DOH',
      scheduled: '2026-04-18T02:00:00+00:00',
      actual: '2026-04-18T02:10:00+00:00',
      terminal: '1',
      gate: 'D8',
      delay: null,
    },
    arrival: {
      airport: 'Heathrow Airport',
      iata: 'LHR',
      scheduled: '2026-04-18T07:30:00+00:00',
      actual: null,
      terminal: '4',
      gate: 'A20',
      baggage: null,
    },
  },
  {
    id: '7',
    flightNumber: 'SQ321',
    airline: 'Singapore Airlines',
    status: 'landed',
    departure: {
      airport: 'Singapore Changi Airport',
      iata: 'SIN',
      scheduled: '2026-04-17T23:00:00+00:00',
      actual: '2026-04-17T23:05:00+00:00',
      terminal: '3',
      gate: 'C22',
      delay: null,
    },
    arrival: {
      airport: 'Sydney Kingsford Smith',
      iata: 'SYD',
      scheduled: '2026-04-18T09:45:00+00:00',
      actual: '2026-04-18T09:40:00+00:00',
      terminal: '1',
      gate: 'B4',
      baggage: 'B3',
    },
  },
  {
    id: '8',
    flightNumber: 'AF007',
    airline: 'Air France',
    status: 'delayed',
    departure: {
      airport: 'Charles de Gaulle Airport',
      iata: 'CDG',
      scheduled: '2026-04-18T10:30:00+00:00',
      actual: '2026-04-18T11:15:00+00:00',
      terminal: '2E',
      gate: 'G6',
      delay: 45,
    },
    arrival: {
      airport: 'John F Kennedy International',
      iata: 'JFK',
      scheduled: '2026-04-18T13:15:00+00:00',
      actual: null,
      terminal: '1',
      gate: null,
      baggage: null,
    },
  },
];

export default function HomeScreenTest() {
  const [flightNumber, setFlightNumber] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const swipeAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const rotate = swipeAnim.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const nextCardScale = swipeAnim.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: [1, 0.93, 1],
    extrapolate: 'clamp',
  });

  const nextCardOpacity = swipeAnim.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.7, 1],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 8,
      onPanResponderMove: Animated.event(
        [null, { dx: swipeAnim.x, dy: swipeAnim.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
          const direction = gestureState.dx > 0 ? 1 : -1;
          Animated.timing(swipeAnim, {
            toValue: { x: direction * SCREEN_WIDTH * 1.4, y: gestureState.dy },
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            setCurrentIndex(prev => (prev + 1) % MOCK_TRIPS.length);
            swipeAnim.setValue({ x: 0, y: 0 });
          });
        } else {
          Animated.spring(swipeAnim, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(swipeAnim, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

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

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateShort = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
    });
  };

  const generateBars = (id) => {
    return Array.from({ length: 60 }, (_, i) => {
      const v = ((id.charCodeAt(0) * 31 + i * 137 + i * i * 7) % 97);
      return { w: v > 60 ? 3 : v > 30 ? 2 : 1, h: v > 70 ? 36 : v > 40 ? 26 : 18 };
    });
  };

  const getTrip = (offset) => {
    return MOCK_TRIPS[(currentIndex + offset) % MOCK_TRIPS.length];
  };

  const renderStaticCard = (trip, scale, opacity, offsetY) => {
    const statusColor = getStatusColor(trip.status);
    const bars = generateBars(trip.id);

    return (
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale }, { translateY: offsetY }],
            opacity,
            zIndex: 1,
          },
        ]}
      >
        <View style={styles.barcodeContainer}>
          {bars.map((b, i) => (
            <View key={i} style={{ width: b.w, height: b.h, backgroundColor: i % 2 === 0 ? '#1a1a1a' : 'transparent', marginHorizontal: 0.4 }} />
          ))}
        </View>
        <View style={styles.coloredWrapper}>
          <View style={[styles.ticketHeader, { backgroundColor: statusColor }]}>
            <View style={styles.headerTopRow}>
              <Text style={styles.headerPlane}>✈</Text>
              <View style={styles.iataBox}>
                <Text style={styles.iataBoxText}>{trip.arrival.iata}</Text>
              </View>
            </View>
            <View style={styles.headerDash} />
            <Text style={styles.cityHero} numberOfLines={1} adjustsFontSizeToFit>
              {trip.arrival.airport.split(' ')[0].toUpperCase()}
            </Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.headerFlightNum}>{trip.flightNumber}</Text>
          </View>
        </View>
        <View style={styles.ticketInfo}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>FLIGHT</Text>
            <Text style={styles.infoValue}>{trip.flightNumber}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>DATE</Text>
            <Text style={styles.infoValue}>{formatDateShort(trip.departure.scheduled)}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>GATE</Text>
            <Text style={styles.infoValue}>{trip.departure.gate || 'N/A'}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>CLASS</Text>
            <Text style={styles.infoValue}>ECO</Text>
          </View>
        </View>
        <View style={styles.barcodeContainer}>
          {bars.map((b, i) => (
            <View key={i} style={{ width: b.w, height: b.h, backgroundColor: i % 2 === 0 ? '#1a1a1a' : 'transparent', marginHorizontal: 0.4 }} />
          ))}
        </View>
      </Animated.View>
    );
  };

  const renderTopCard = () => {
    const trip = getTrip(0);
    const statusColor = getStatusColor(trip.status);
    const bars = generateBars(trip.id);

    return (
      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              { translateX: swipeAnim.x },
              { translateY: swipeAnim.y },
              { rotate },
            ],
            zIndex: 10,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() => setSelectedTrip(trip)}
          style={{ flex: 1 }}
        >
          <View style={styles.barcodeContainer}>
            {bars.map((b, i) => (
              <View key={i} style={{ width: b.w, height: b.h, backgroundColor: i % 2 === 0 ? '#1a1a1a' : 'transparent', marginHorizontal: 0.4 }} />
            ))}
          </View>
          <View style={styles.coloredWrapper}>
            <View style={[styles.ticketHeader, { backgroundColor: statusColor }]}>
              <View style={styles.headerTopRow}>
                <Text style={styles.headerPlane}>✈</Text>
                <View style={styles.iataBox}>
                  <Text style={styles.iataBoxText}>{trip.arrival.iata}</Text>
                </View>
              </View>
              <View style={styles.headerDash} />
              <Text style={styles.cityHero} numberOfLines={1} adjustsFontSizeToFit>
                {trip.arrival.airport.split(' ')[0].toUpperCase()}
              </Text>
              <View style={{ flex: 1 }} />
              <Text style={styles.headerFlightNum}>{trip.flightNumber}</Text>
            </View>
          </View>
          <View style={styles.ticketInfo}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>FLIGHT</Text>
              <Text style={styles.infoValue}>{trip.flightNumber}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>DATE</Text>
              <Text style={styles.infoValue}>{formatDateShort(trip.departure.scheduled)}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>GATE</Text>
              <Text style={styles.infoValue}>{trip.departure.gate || 'N/A'}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>CLASS</Text>
              <Text style={styles.infoValue}>ECO</Text>
            </View>
          </View>
          <View style={styles.barcodeContainer}>
            {bars.map((b, i) => (
              <View key={i} style={{ width: b.w, height: b.h, backgroundColor: i % 2 === 0 ? '#1a1a1a' : 'transparent', marginHorizontal: 0.4 }} />
            ))}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderExpandedTicket = () => {
    if (!selectedTrip) return null;
    const trip = selectedTrip;

    return (
      <Modal
        visible={!!selectedTrip}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedTrip(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedTrip(null)}
          >
            <Text style={styles.closeButtonText}>✕  Close</Text>
          </TouchableOpacity>

          <View style={styles.expandedTicket}>
            <View style={styles.expandedBody}>
              <View style={styles.expandedLeft}>
                <Text style={styles.flightTicketLabel}>FLIGHT TICKET</Text>
                <Text style={styles.expandedAirline}>{trip.airline}</Text>
                <View style={styles.expandedRouteSection}>
                  <View style={styles.expandedRouteItem}>
                    <Text style={styles.routeLabel}>FROM:</Text>
                    <Text style={styles.expandedIata}>{trip.departure.iata}</Text>
                    <Text style={styles.expandedAirportName}>{trip.departure.airport}</Text>
                  </View>
                  <View style={styles.expandedRouteItem}>
                    <Text style={styles.routeLabel}>TO:</Text>
                    <Text style={styles.expandedIata}>{trip.arrival.iata}</Text>
                    <Text style={styles.expandedAirportName}>{trip.arrival.airport}</Text>
                  </View>
                  <View style={styles.expandedRouteItem}>
                    <Text style={styles.routeLabel}>DATE:</Text>
                    <Text style={styles.expandedDate}>{formatDate(trip.departure.scheduled)}</Text>
                  </View>
                </View>
                <View style={styles.planeContainer}>
                  <Text style={styles.planeSvgLarge}>✈</Text>
                </View>
                {trip.departure.delay && (
                  <View style={styles.delayBanner}>
                    <Text style={styles.delayText}>⚠ Delayed {trip.departure.delay} min</Text>
                  </View>
                )}
              </View>

              <View style={[styles.expandedStrip, { backgroundColor: getStatusColor(trip.status) }]}>
                <View style={styles.boardingPassContainer}>
                  <Text style={styles.boardingPassText}>BOARDING PASS</Text>
                </View>
                <View style={styles.stripFields}>
                  <View style={styles.stripField}>
                    <Text style={styles.stripFieldLabel}>FLIGHT</Text>
                    <Text style={styles.stripFieldValue}>{trip.flightNumber}</Text>
                  </View>
                  <View style={styles.stripDivider} />
                  <View style={styles.stripField}>
                    <Text style={styles.stripFieldLabel}>DEP TIME</Text>
                    <Text style={styles.stripFieldValue}>{formatTime(trip.departure.scheduled)}</Text>
                  </View>
                  <View style={styles.stripDivider} />
                  <View style={styles.stripField}>
                    <Text style={styles.stripFieldLabel}>ARR TIME</Text>
                    <Text style={styles.stripFieldValue}>{formatTime(trip.arrival.scheduled)}</Text>
                  </View>
                  <View style={styles.stripDivider} />
                  <View style={styles.stripField}>
                    <Text style={styles.stripFieldLabel}>TERMINAL</Text>
                    <Text style={styles.stripFieldValue}>{trip.departure.terminal || 'N/A'}</Text>
                  </View>
                  <View style={styles.stripDivider} />
                  <View style={styles.stripField}>
                    <Text style={styles.stripFieldLabel}>GATE</Text>
                    <Text style={styles.stripFieldValue}>{trip.departure.gate || 'N/A'}</Text>
                  </View>
                  <View style={styles.stripDivider} />
                  <View style={styles.stripField}>
                    <Text style={styles.stripFieldLabel}>SEAT</Text>
                    <Text style={styles.stripFieldValue}>N/A</Text>
                  </View>
                  <View style={styles.stripDivider} />
                  <View style={styles.stripField}>
                    <Text style={styles.stripFieldLabel}>STATUS</Text>
                    <Text style={styles.stripFieldValue}>{trip.status.toUpperCase()}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.perforation}>
              <View style={styles.perforationCircleLeft} />
              <View style={styles.perforationLine} />
              <View style={styles.perforationCircleRight} />
            </View>

            <View style={styles.ticketStub}>
              <View style={styles.stubLeft}>
                <Text style={styles.stubRotatedText}>FLIGHT TICKET</Text>
              </View>
              <View style={styles.stubMain}>
                <View style={styles.stubRow}>
                  <View style={styles.stubItem}>
                    <Text style={styles.stubLabel}>FROM:</Text>
                    <Text style={styles.stubValue}>{trip.departure.iata}</Text>
                  </View>
                  <View style={styles.stubItem}>
                    <Text style={styles.stubLabel}>TO:</Text>
                    <Text style={styles.stubValue}>{trip.arrival.iata}</Text>
                  </View>
                  <View style={styles.stubItem}>
                    <Text style={styles.stubLabel}>DATE:</Text>
                    <Text style={styles.stubValue}>{formatDate(trip.departure.scheduled)}</Text>
                  </View>
                </View>
                <View style={styles.stubRow}>
                  <View style={styles.stubItem}>
                    <Text style={styles.stubLabel}>PASSENGER:</Text>
                    <Text style={styles.stubValue}>—</Text>
                  </View>
                  <View style={styles.stubItem}>
                    <Text style={styles.stubLabel}>CLASS:</Text>
                    <Text style={styles.stubValue}>ECO</Text>
                  </View>
                </View>
                <View style={styles.stubRow}>
                  <View style={styles.stubItem}>
                    <Text style={styles.stubLabel}>BAGGAGE:</Text>
                    <Text style={styles.stubValue}>{trip.arrival.baggage || 'N/A'}</Text>
                  </View>
                  <View style={styles.stubItem}>
                    <Text style={styles.stubLabel}>ARR TERMINAL:</Text>
                    <Text style={styles.stubValue}>{trip.arrival.terminal || 'N/A'}</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.stubStrip, { backgroundColor: getStatusColor(trip.status) }]}>
                <Text style={styles.stubStripText}>SEAT</Text>
                <Text style={styles.stubStripValue}>N/A</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topSection}>
        <View style={styles.testBanner}>
          <Text style={styles.testBannerText}>🧪 TEST MODE</Text>
        </View>
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
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Go</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.walletHeader}>
          <Text style={styles.walletLabel}>MY WALLET</Text>
          <Text style={styles.walletCount}>
            {currentIndex + 1} of {MOCK_TRIPS.length} passes
          </Text>
        </View>
        <Text style={styles.swipeHint}>← Swipe to browse →</Text>
      </View>

      <View style={styles.stackContainer}>
        {/* Card 3 — furthest back */}
        {renderStaticCard(
          getTrip(2),
          nextCardScale,
          new Animated.Value(0.5),
          new Animated.Value(16)
        )}
        {/* Card 2 — middle */}
        {renderStaticCard(
          getTrip(1),
          nextCardScale,
          nextCardOpacity,
          new Animated.Value(8)
        )}
        {/* Card 1 — top, draggable */}
        {renderTopCard()}
      </View>

      {renderExpandedTicket()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e8e3db',
  },
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
  },
  testBanner: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  testBannerText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
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
    paddingVertical: 11,
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
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
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
    textAlign: 'center',
    marginTop: 2,
  },
  stackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH - 40,
    height: TICKET_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  barcodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  coloredWrapper: {
    flex: 1,
    paddingHorizontal: 12,
  },
  ticketHeader: {
    flex: 1,
    padding: 18,
    borderRadius: 12,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerPlane: {
    fontSize: 28,
    color: '#fff',
  },
  iataBox: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  iataBoxText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: 1,
  },
  headerDash: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderStyle: 'dashed',
    marginBottom: 12,
  },
  cityHero: {
    fontSize: 52,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  headerFlightNum: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'right',
    letterSpacing: 1,
    marginTop: 4,
  },
  ticketInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  infoCol: {
    alignItems: 'center',
    flex: 1,
  },
  infoDivider: {
    width: 0.5,
    height: 28,
    backgroundColor: '#eee',
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#aaa',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#e8e3db',
    padding: 20,
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  expandedTicket: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  expandedBody: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f0',
  },
  expandedLeft: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  flightTicketLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#bbb',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  expandedAirline: {
    fontSize: 10,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 3,
  },
  expandedRouteSection: {
    marginTop: 16,
    gap: 14,
  },
  expandedRouteItem: {
    marginBottom: 2,
  },
  routeLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#bbb',
    letterSpacing: 1,
    marginBottom: 1,
  },
  expandedIata: {
    fontSize: 40,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -1,
    lineHeight: 44,
  },
  expandedAirportName: {
    fontSize: 10,
    color: '#aaa',
    fontWeight: '500',
  },
  expandedDate: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  planeContainer: {
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  planeSvgLarge: {
    fontSize: 80,
    color: '#1a1a1a',
    opacity: 0.08,
  },
  delayBanner: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  delayText: {
    fontSize: 11,
    color: '#d97706',
    fontWeight: '700',
  },
  expandedStrip: {
    width: 70,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
  },
  boardingPassContainer: {
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  boardingPassText: {
    fontSize: 7,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 2,
    textTransform: 'uppercase',
    transform: [{ rotate: '90deg' }],
    width: 90,
    textAlign: 'center',
  },
  stripFields: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  stripField: {
    alignItems: 'center',
  },
  stripDivider: {
    width: 28,
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.35)',
    marginVertical: 2,
  },
  stripFieldLabel: {
    fontSize: 6,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  stripFieldValue: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  perforation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: -1,
  },
  perforationCircleLeft: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e8e3db',
  },
  perforationLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  perforationCircleRight: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e8e3db',
  },
  ticketStub: {
    flexDirection: 'row',
    backgroundColor: '#eeede8',
    minHeight: 90,
  },
  stubLeft: {
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.5,
    borderRightColor: '#ddd',
  },
  stubRotatedText: {
    fontSize: 6,
    fontWeight: '700',
    color: '#ccc',
    letterSpacing: 1,
    transform: [{ rotate: '-90deg' }],
    width: 70,
    textAlign: 'center',
  },
  stubMain: {
    flex: 1,
    padding: 12,
    gap: 8,
  },
  stubRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stubItem: {
    flex: 1,
  },
  stubLabel: {
    fontSize: 7,
    color: '#bbb',
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  stubValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  stubStrip: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  stubStripText: {
    fontSize: 7,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  stubStripValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '800',
  },
});