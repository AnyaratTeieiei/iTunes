import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Modal,
    SafeAreaView,
    StatusBar,
    StyleSheet, Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface Track {
  id: string;
  title: string;
  artist: string;
  image: string;
  videoUrl: string;
  kind: string; 
}

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeVideo, setActiveVideo] = useState<Track | null>(null); 
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [searchType, setSearchType] = useState<'song' | 'musicVideo'>('song');
  
  const videoRef = useRef<Video>(null);

  const performSearch = async (type: 'song' | 'musicVideo') => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&entity=${type}&limit=25&country=th`);
      const data = await response.json();
      
      const formattedResults: Track[] = data.results
        .filter((item: any) => item.previewUrl) 
        .map((item: any) => ({
          id: item.trackId.toString(),
          title: item.trackName,
          artist: item.artistName,
          image: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '600x600bb') : 'https://via.placeholder.com/600',
          videoUrl: item.previewUrl,
          kind: type
        }));

      setSearchResults(formattedResults);
    } catch (error) {
      console.error("Error fetching from iTunes: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = () => performSearch(searchType);

  const handleTypeChange = (type: 'song' | 'musicVideo') => {
    setSearchType(type);
    if (searchQuery.trim().length > 0) performSearch(type);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const renderItem = ({ item }: { item: Track }) => (
    <TouchableOpacity 
      style={styles.trackItem} 
      onPress={() => setActiveVideo(item)} 
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.image }} 
          style={[styles.albumArt, item.kind === 'musicVideo' && styles.videoArt]} 
        />
        {/* เพิ่มไอคอนเล่นทับบนรูปวิดีโอให้ดูน่ากด */}
        {item.kind === 'musicVideo' && (
          <View style={styles.videoOverlay}>
            <Ionicons name="play" size={16} color="#FFF" />
          </View>
        )}
      </View>
      
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.trackArtist} numberOfLines={1}>{item.artist}</Text>
      </View>
      
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-horizontal" size={20} color="#FA243C" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Search</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput} 
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
              placeholder="Artists, Songs, Lyrics"
              placeholderTextColor="#8E8E93"
              autoCorrect={false}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearBtn}>
                <Ionicons name="close-circle" size={18} color="#8E8E93" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.segmentContainer}>
          <TouchableOpacity 
            style={[styles.segmentBtn, searchType === 'song' && styles.segmentBtnActive]}
            onPress={() => handleTypeChange('song')}
          >
            <Text style={[styles.segmentText, searchType === 'song' && styles.segmentTextActive]}>Songs</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.segmentBtn, searchType === 'musicVideo' && styles.segmentBtnActive]}
            onPress={() => handleTypeChange('musicVideo')}
          >
            <Text style={[styles.segmentText, searchType === 'musicVideo' && styles.segmentTextActive]}>Music Videos</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#FA243C" />
            <Text style={styles.loadingText}>Finding best matches...</Text>
          </View>
        ) : hasSearched && searchResults.length === 0 ? (
          <View style={styles.centerState}>
            <Ionicons name="search-outline" size={64} color="#D1D1D6" />
            <Text style={styles.emptyTitle}>No Results Found</Text>
            <Text style={styles.emptySubtitle}>We couldn't find any {searchType === 'song' ? 'songs' : 'videos'} matching "{searchQuery}".</Text>
          </View>
        ) : !hasSearched ? (
           <View style={styles.centerState}>
            <Ionicons name="musical-notes-outline" size={74} color="#F2F2F7" />
            <Text style={styles.emptyTitle}>Discover New Music</Text>
            <Text style={styles.emptySubtitle}>Search for your favorite tracks and music videos.</Text>
          </View>
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
          />
        )}

        {/* --- Immersive Now Playing Modal --- */}
        <Modal 
          visible={activeVideo !== null} 
          animationType="slide" 
          presentationStyle="fullScreen"
          onRequestClose={() => setActiveVideo(null)}
        >
          <View style={styles.modalContainer}>
            
            {/* ลูกเล่น: ภาพพื้นหลังเบลอ สร้างบรรยากาศ */}
            {activeVideo && (
              <Image 
                source={{ uri: activeVideo.image }} 
                style={styles.blurBackground} 
                blurRadius={80} // ทำให้ภาพเบลอจัดๆ เหมือน Apple Music
              />
            )}
            <View style={styles.overlayDark} />

            <SafeAreaView style={styles.modalSafeArea}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setActiveVideo(null)} style={styles.closeBtn}>
                  <Ionicons name="chevron-down" size={32} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.modalHeaderText}>Now Playing</Text>
              </View>

              <View style={styles.videoWrapper}>
                {activeVideo && activeVideo.kind === 'song' && (
                  <Image source={{ uri: activeVideo.image }} style={styles.bigAlbumArt} />
                )}
                
                {activeVideo && (
                  <Video 
                    ref={videoRef} 
                    style={[styles.video, activeVideo.kind === 'musicVideo' && styles.realVideoMode]} 
                    source={{ uri: activeVideo.videoUrl }} 
                    useNativeControls 
                    resizeMode={activeVideo.kind === 'musicVideo' ? ResizeMode.CONTAIN : ResizeMode.COVER} 
                    shouldPlay 
                    isLooping
                  />
                )}
              </View>

              <View style={styles.nowPlayingInfo}>
                <View style={styles.nowPlayingTextContainer}>
                  <Text style={styles.nowPlayingTitle} numberOfLines={2}>{activeVideo?.title}</Text>
                  <Text style={styles.nowPlayingArtist} numberOfLines={1}>{activeVideo?.artist}</Text>
                </View>
                {/* ปุ่มหัวใจจำลอง (ลูกเล่น) */}
                <TouchableOpacity style={styles.favoriteBtn}>
                  <Ionicons name="heart-outline" size={28} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  pageTitle: { fontSize: 34, fontWeight: '800', color: '#000000', letterSpacing: 0.3 },
  
  searchContainer: { paddingHorizontal: 20, paddingBottom: 12 },
  searchBar: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F2F7', 
    borderRadius: 12, paddingHorizontal: 12, height: 44 
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 17, color: '#000000', height: '100%', outlineStyle: 'none' as any },
  clearBtn: { padding: 4 },
  
  segmentContainer: {
    flexDirection: 'row', backgroundColor: '#F2F2F7', borderRadius: 9,
    marginHorizontal: 20, marginBottom: 15, padding: 3,
  },
  segmentBtn: { flex: 1, paddingVertical: 7, alignItems: 'center', borderRadius: 7 },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 3, elevation: 2,
  },
  segmentText: { fontSize: 14, fontWeight: '500', color: '#8E8E93' },
  segmentTextActive: { fontWeight: '600', color: '#000000' },
  
  listContent: { paddingLeft: 20, paddingBottom: 40, paddingTop: 5 },
  trackItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingRight: 20 },
  
  imageContainer: { position: 'relative' },
  albumArt: { 
    width: 64, height: 64, borderRadius: 12, backgroundColor: '#E5E5EA', 
    borderWidth: StyleSheet.hairlineWidth, borderColor: '#C7C7CC' 
  },
  videoArt: { width: 90, height: 55, borderRadius: 8 },
  videoOverlay: {
    position: 'absolute', top: '50%', left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12, padding: 4
  },
  
  trackInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  trackTitle: { fontSize: 17, color: '#000000', marginBottom: 4, fontWeight: '600' },
  trackArtist: { fontSize: 15, color: '#8E8E93', fontWeight: '400' },
  moreButton: { padding: 8, opacity: 0.8 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: '#E5E5EA', marginLeft: 79 },
  
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingBottom: 100 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#000000', marginTop: 15, marginBottom: 6, textAlign: 'center' },
  emptySubtitle: { fontSize: 16, color: '#8E8E93', textAlign: 'center', lineHeight: 22 },
  loadingText: { marginTop: 15, fontSize: 16, color: '#8E8E93', fontWeight: '500' },
  
  // --- Immersive Modal Styles ---
  modalContainer: { flex: 1, backgroundColor: '#000000' },
  blurBackground: { position: 'absolute', top: -50, left: -50, right: -50, bottom: -50, opacity: 0.7 },
  overlayDark: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalSafeArea: { flex: 1, justifyContent: 'space-between' },
  
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 20, paddingBottom: 10, position: 'relative' },
  closeBtn: { position: 'absolute', left: 20, top: 20, zIndex: 10 },
  modalHeaderText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  
  videoWrapper: { 
    width: '100%', aspectRatio: 1, paddingHorizontal: 30, 
    shadowColor: '#000', shadowOffset: { width: 0, height: 25 }, 
    shadowOpacity: 0.4, shadowRadius: 35, elevation: 20,
    justifyContent: 'center', alignItems: 'center', marginTop: 20
  },
  bigAlbumArt: {
    position: 'absolute', width: '85%', height: '85%',
    borderRadius: 20, backgroundColor: '#333',
  },
  video: { 
    width: '85%', height: '85%', borderRadius: 20, 
    backgroundColor: 'rgba(0,0,0,0.2)' 
  },
  realVideoMode: { width: '100%', height: '70%', backgroundColor: '#000000', borderRadius: 16 },
  
  nowPlayingInfo: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 35, paddingBottom: 60 },
  nowPlayingTextContainer: { flex: 1, marginRight: 20 },
  nowPlayingTitle: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', marginBottom: 8, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  nowPlayingArtist: { fontSize: 20, fontWeight: '500', color: 'rgba(255,255,255,0.7)' },
  favoriteBtn: { padding: 5, marginTop: 5 }
});