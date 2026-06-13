import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
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
const IMAGE_HEIGHT = 420;

export default function Lobby() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;

  const imageTranslate = scrollY.interpolate({
    inputRange: [0, IMAGE_HEIGHT],
    outputRange: [0, -IMAGE_HEIGHT / 2],
    extrapolate: 'clamp',
  });

  const FEATURES = [
    { icon: 'camera',         color: '#667eea', label: 'Scan any food instantly with AI'          },
    { icon: 'trophy',         color: '#F59E0B', label: 'Earn XP and level up your character'      },
    { icon: 'heart',          color: '#EF4444', label: 'Track your health & nutrition daily'       },
    { icon: 'ribbon',         color: '#10B981', label: 'Unlock badges and achievements'            },
  ];

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
      >
        {/* Hero Image with parallax */}
        <Animated.View
          style={[styles.headerContainer, { transform: [{ translateY: imageTranslate }] }]}
        >
          <Image
            source={require('@/assets/images/hero.png')}
            style={styles.headerImage}
            resizeMode="cover"
          />
          {/* Gradient overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.95)', '#fff']}
            style={styles.headerOverlay}
          />
        </Animated.View>

        {/* Content */}
        <View style={styles.content}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.appName}>Foodify</Text>
          <Text style={styles.title}>Eat Smart,{'\n'}Play Smart</Text>
          <Text style={styles.description}>
            Your journey to healthier eating habits starts here. Scan food, earn rewards, and level up your character.
          </Text>

          {/* Feature highlights */}
          <View style={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <View key={i} style={styles.featureItem}>
                <View style={[styles.featureIconBg, { backgroundColor: f.color + '18' }]}>
                  <Ionicons name={f.icon as any} size={22} color={f.color} />
                </View>
                <Text style={styles.featureLabel}>{f.label}</Text>
              </View>
            ))}
          </View>

          {/* CTA Button */}
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => router.push('/login')}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.startButtonGradient}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
              <Ionicons name="rocket" size={20} color="#fff" />
              <Text style={styles.startButtonText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={20} color="rgba(255,255,255,0.7)" />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}> Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 20,
  },
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
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  content: {
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: -20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 6,
  },
  appName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#667eea',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 14,
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 28,
  },
  featuresGrid: {
    width: '100%',
    gap: 12,
    marginBottom: 28,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  featureIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    flex: 1,
  },
  startButton: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 20,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  loginText: {
    color: '#6B7280',
    fontSize: 14,
  },
  loginLink: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '700',
  },
});
