import { Link } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* วงกลมตกแต่งฉากหลัง (ตกแต่งเวอร์ๆ) */}
      <View style={[styles.bgCircle, styles.circle1]} />
      <View style={[styles.bgCircle, styles.circle2]} />

      <View style={styles.card}>
        <Text style={styles.iconTop}>✨💖✨</Text>
        <Text style={styles.title}>หน้าแรก</Text>
        <Text style={styles.subtitle}>Welcome to Home</Text>
        
        <View style={styles.buttonGroup}>
          {/* แก้ไขโดยใช้ StyleSheet.flatten() รวม style array ให้เป็น object ก้อนเดียว */}
          <Link href="/explore" asChild>
            <TouchableOpacity style={StyleSheet.flatten([styles.button, styles.btnExplore])}>
              <Text style={styles.buttonText}>🪐 ไปที่หน้า Explore</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/review" asChild>
            <TouchableOpacity style={StyleSheet.flatten([styles.button, styles.btnReview])}>
              <Text style={styles.buttonText}>🎀 ไปที่หน้า Review</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF0F5', 
    position: 'relative',
  },
  bgCircle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.4,
  },
  circle1: {
    width: 250,
    height: 250,
    backgroundColor: '#FFD1DC', 
    top: -50,
    left: -50,
  },
  circle2: {
    width: 200,
    height: 200,
    backgroundColor: '#D4F0F0', 
    bottom: -30,
    right: -40,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    padding: 40,
    borderRadius: 30,
    alignItems: 'center',
    width: '85%',
    shadowColor: '#FFB6C1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  iconTop: {
    fontSize: 32,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#835F7E', 
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#BFA8BA',
    marginBottom: 30,
    fontWeight: '600',
  },
  buttonGroup: {
    width: '100%',
    gap: 15, 
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  btnExplore: {
    backgroundColor: '#D4F0F0', 
  },
  btnReview: {
    backgroundColor: '#FFDAB9', 
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5C6C7B', 
  },
});