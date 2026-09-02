import { Ionicons } from '@expo/vector-icons';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet, Text,
    TouchableOpacity,
    View
} from 'react-native';

// --- Types ---
interface FeaturedContent {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  image: string;
}

interface AlbumContent {
  id: string;
  title: string;
  artist: string;
  image: string;
}

// --- Mock Data ---
const FEATURED_PICKS: FeaturedContent[] = [
  { 
    id: '1', 
    category: 'NEW RELEASE', 
    title: 'The Latest Hits', 
    subtitle: 'Catch up on the biggest new songs.', 
    image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80' 
  },
  { 
    id: '2', 
    category: 'CURATED FOR YOU', 
    title: 'Chill Vibes', 
    subtitle: 'Kick back to the best calm pop and R&B.', 
    image: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f9af?w=800&q=80' 
  },
];

const RECENTLY_PLAYED: AlbumContent[] = [
  { id: '1', title: 'Landokmai EP.1', artist: 'LANDOKMAI', image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80' },
  { id: '2', title: 'Indie Pop Hits', artist: 'Various Artists', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80' },
  { id: '3', title: 'Acoustic Morning', artist: 'Chill Mix', image: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=400&q=80' },
  { id: '4', title: 'Midnight Drive', artist: 'Synthwave', image: 'https://images.unsplash.com/photo-1614613535808-3196b01cb166?w=400&q=80' },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* --- Header Section --- */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            {/* คุณสามารถใช้ไลบรารี Date มาดึงวันที่ปัจจุบันแทนข้อความจำลองได้ในอนาคต */}
            <Text style={styles.dateText}>TUESDAY, AUGUST 4</Text>
            <Text style={styles.pageTitle}>Listen Now</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn} activeOpacity={0.7}>
            <Ionicons name="person-circle" size={38} color="#FA243C" />
          </TouchableOpacity>
        </View>

        {/* --- Top Picks Section (Featured Large Cards) --- */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Top Picks for You</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.horizontalScroll}
            decelerationRate="fast"
            snapToInterval={335} // ความกว้างการ์ด (320) + ระยะห่าง (15) ให้เลื่อนแล้วล็อคพอดี
          >
            {FEATURED_PICKS.map((item) => (
              <TouchableOpacity key={item.id} style={styles.featuredCard} activeOpacity={0.9}>
                <Image source={{ uri: item.image }} style={styles.featuredImage} />
                <View style={styles.featuredOverlay}>
                  <Text style={styles.featuredCategory}>{item.category}</Text>
                  <Text style={styles.featuredTitle}>{item.title}</Text>
                  <Text style={styles.featuredSubtitle}>{item.subtitle}</Text>
                </View>
                <View style={styles.playBadge}>
                  <Ionicons name="play" size={18} color="#000" style={{ marginLeft: 2 }} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* --- Recently Played Section (Square Album Cards) --- */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recently Played</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.horizontalScroll}
          >
            {RECENTLY_PLAYED.map((item) => (
              <TouchableOpacity key={item.id} style={styles.albumCard} activeOpacity={0.7}>
                <View style={styles.albumImageContainer}>
                  <Image source={{ uri: item.image }} style={styles.albumArt} />
                </View>
                <Text style={styles.albumTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.albumArtist} numberOfLines={1}>{item.artist}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Spacer for bottom tab bar */}
        <View style={{ height: 40 }} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  container: { 
    flex: 1 
  },
  
  // --- Header ---
  header: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F2F2F7'
  },
  headerTextContainer: {
    flex: 1,
  },
  dateText: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#8E8E93', 
    marginBottom: 4, 
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  pageTitle: { 
    fontSize: 34, 
    fontWeight: '800', 
    color: '#000000', 
    letterSpacing: 0.3 
  },
  profileBtn: {
    paddingBottom: 4,
  },

  // --- Sections ---
  sectionContainer: {
    marginTop: 25,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20, 
    marginBottom: 15,
  },
  sectionTitle: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#000000',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 16,
    color: '#FA243C',
    fontWeight: '500',
  },
  horizontalScroll: { 
    paddingLeft: 20, 
    paddingRight: 5 
  },

  // --- Featured Cards (Top Picks) ---
  featuredCard: { 
    width: 320, 
    height: 220, 
    marginRight: 15,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  featuredOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    padding: 20,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.2)', // เพิ่มเงาดำให้ตัวหนังสืออ่านง่ายขึ้น
  },
  featuredCategory: {
    color: '#D1D1D6',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  featuredTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featuredSubtitle: {
    color: '#E5E5EA',
    fontSize: 15,
    fontWeight: '400',
  },
  playBadge: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 36,
    height: 36,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  // --- Album Cards (Recently Played) ---
  albumCard: { 
    width: 145,
    marginRight: 15, 
  },
  albumImageContainer: {
    width: 145, 
    height: 145, 
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  albumArt: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 12, 
    backgroundColor: '#E5E5EA',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#D1D1D6',
  },
  albumTitle: { 
    fontSize: 15, 
    color: '#000000', 
    fontWeight: '600', 
    marginBottom: 3 
  },
  albumArtist: { 
    fontSize: 14, 
    color: '#8E8E93',
    fontWeight: '400',
  },
});