import { useRouter } from 'expo-router';
import React from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = 450;

export default function Lobby() {
  const router = useRouter();
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const imageTranslate = scrollY.interpolate({
    inputRange: [0, IMAGE_HEIGHT],
    outputRange: [0, -IMAGE_HEIGHT / 2],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
      >
        <Animated.View
          style={[styles.headerContainer, { transform: [{ translateY: imageTranslate }] }]}
        >
          <Image
            source={require('@/assets/images/hero.png')}
            style={styles.headerImage}
            resizeMode="cover"
          />
        </Animated.View>

        <View style={styles.content}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Welcome to Foodify</Text>

          <Text style={styles.description}>
            Your journey to healthier eating habits starts here. Join us and make nutritious choices
          </Text>

          <TouchableOpacity style={styles.startButton} onPress={() => router.push('/login')}>
            <Text style={styles.startButtonText}>Start Now</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 10 },

  headerContainer: {
    width,
    height: IMAGE_HEIGHT,
    overflow: 'hidden',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerImage: {
    width,
    height: IMAGE_HEIGHT,
  },

  content: {
    padding: 25,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 10,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#ffd454',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 16,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
