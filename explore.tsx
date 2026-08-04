import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// กำหนด Type สำหรับข้อมูลเพลงที่ได้จาก iTunes
interface Track {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
}

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State สำหรับระบบเล่นเสียง
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);

  // ฟังก์ชันค้นหาเพลงจาก iTunes API (ยิงตรง ไม่ผ่าน Proxy แล้ว!)
  const searchiTunes = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      // ยิงตรงไปหา Apple API เลย (ใช้ได้เลยบนมือถือ หรือบนเว็บที่เปิด Allow CORS Extension ไว้)
      const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&media=music&limit=15`;
      
      const response = await fetch(itunesUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTracks(data.results || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("ไม่สามารถดึงข้อมูลได้: แนะนำให้รันบนแอป Expo Go หรือเปิด Allow CORS Extension");
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันเล่น/หยุดเพลง
  const playSound = async (previewUrl: string, trackId: number) => {
    if (playingId === trackId && sound) {
      await sound.stopAsync();
      setPlayingId(null);
      return;
    }

    if (sound) {
      await sound.unloadAsync();
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: previewUrl },
        { shouldPlay: true }
      );
      setSound(newSound);
      setPlayingId(trackId);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingId(null);
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  // เคลียร์เสียงเมื่อออกจากหน้าจอ
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // UI สำหรับแสดงแต่ละเพลง
  const renderItem = ({ item }: { item: Track }) => (
    <View style={styles.trackContainer}>
      <Image source={{ uri: item.artworkUrl100 }} style={styles.artwork} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackName} numberOfLines={1}>{item.trackName}</Text>
        <Text style={styles.artistName} numberOfLines={1}>{item.artistName}</Text>
      </View>
      <TouchableOpacity 
        style={[
          styles.playButton,
          playingId === item.trackId ? styles.playButtonPlaying : null
        ]} 
        onPress={() => playSound(item.previewUrl, item.trackId)}
      >
        <Text style={[
          styles.playButtonText,
          playingId === item.trackId ? styles.playButtonTextPlaying : null
        ]}>
          {playingId === item.trackId ? '🛑 หยุด' : '▶️ เล่น'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          placeholder="ค้นหาศิลปิน, เพลง (เช่น Taylor Swift)"
          placeholderTextColor="#A9B9B0"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={searchiTunes}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchiTunes}>
          <Text style={styles.searchButtonText}>ค้นหา</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFB7B2" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={tracks}
          keyExtractor={(item) => item.trackId.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text style={styles.emptyText}>ไม่มีข้อมูล ลองค้นหาเพลงดูสิ! ✨</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF5',
  },
  searchSection: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#E6FEEF',
    borderBottomWidth: 1,
    borderColor: '#D4EBE1',
    shadowColor: '#C5D8CC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 5,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#C5D8CC',
    marginRight: 10,
    fontSize: 16,
    color: '#4B3F3D',
  },
  searchButton: {
    justifyContent: 'center',
    backgroundColor: '#FFB7B2',
    paddingHorizontal: 25,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButtonText: {
    color: '#6F5B57', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  trackContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#EDEBE8',
    alignItems: 'center',
    shadowColor: '#C5D8CC',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  artwork: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 15,
  },
  trackName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B3F3D',
  },
  artistName: {
    fontSize: 15,
    color: '#8E7C77',
    marginTop: 4,
  },
  playButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#D1EAFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  playButtonText: {
    fontSize: 15,
    color: '#41637F',
    fontWeight: '600',
  },
  playButtonPlaying: {
    backgroundColor: '#8AD1E1',
  },
  playButtonTextPlaying: {
    color: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    color: '#BDA8A4',
    fontSize: 18,
    fontWeight: '500',
  }
});