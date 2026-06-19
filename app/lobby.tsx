import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const FEATURES = [
  { icon: 'camera',  color: '#FF821D', label: 'Scan makanan dengan AI instan'      },
  { icon: 'trophy',  color: '#F59E0B', label: 'Kumpulkan XP & naik level karakter' },
  { icon: 'heart',   color: '#EF4444', label: 'Pantau kesehatan & nutrisi harian'  },
  { icon: 'ribbon',  color: '#10B981', label: 'Raih badge & pencapaian baru'       },
];

export default function Lobby() {
  const router = useRouter();

  // Subtle entrance animations
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Full-screen gradient background */}
      <LinearGradient
        colors={['#FF821D', '#F26200', '#d4500a']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      />

      {/* Decorative circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      <SafeAreaView style={styles.safe}>
        <Animated.View
          style={[
            styles.inner,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Logo + App Name */}
          <View style={styles.topSection}>
            <View style={styles.logoWrapper}>
              <Image
                source={require('@/assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.appName}>Foodify</Text>
            <Text style={styles.tagline}>Eat Smart, Play Smart 🍱</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Mulai Perjalananmu</Text>
            <Text style={styles.cardDesc}>
              Scan makanan, dapatkan poin, dan jadikan hidupmu lebih sehat.
            </Text>

            {/* Features */}
            <View style={styles.features}>
              {FEATURES.map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <View style={[styles.featureIcon, { backgroundColor: f.color + '18' }]}>
                    <Ionicons name={f.icon as any} size={18} color={f.color} />
                  </View>
                  <Text style={styles.featureText}>{f.label}</Text>
                </View>
              ))}
            </View>

            {/* CTA */}
            <TouchableOpacity
              style={styles.ctaBtn}
              onPress={() => router.push('/login')}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={['#FF821D', '#F26200']}
                style={styles.ctaGradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Ionicons name="rocket" size={18} color="#fff" />
                <Text style={styles.ctaText}>Mulai Sekarang</Text>
                <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.8)" />
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.signInRow}>
              <Text style={styles.signInLabel}>Sudah punya akun?</Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.signInLink}> Masuk</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe:      { flex: 1, justifyContent: 'space-between' },

  // decorative background circles
  circle1: {
    position: 'absolute', width: 320, height: 320, borderRadius: 160,
    backgroundColor: 'rgba(255,255,255,0.06)', top: -80, right: -80,
  },
  circle2: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.06)', bottom: 160, left: -60,
  },
  circle3: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)', top: height * 0.25, left: 30,
  },

  inner: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between', paddingTop: 20, paddingBottom: 16 },

  // Top section
  topSection: { alignItems: 'center', marginTop: 8 },
  logoWrapper: {
    width: 96, height: 96, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2, shadowRadius: 16, elevation: 12,
  },
  logo:    { width: 72, height: 72 },
  appName: { fontSize: 36, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  tagline: { fontSize: 15, color: 'rgba(255,255,255,0.85)', marginTop: 6, fontWeight: '500' },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 20,
  },
  cardTitle: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 6 },
  cardDesc:  { fontSize: 13, color: '#6B7280', lineHeight: 20, marginBottom: 20 },

  // Features
  features:    { gap: 12, marginBottom: 22 },
  featureRow:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  featureText: { fontSize: 13, color: '#374151', fontWeight: '600', flex: 1 },

  // CTA
  ctaBtn: {
    borderRadius: 16, overflow: 'hidden',
    shadowColor: '#FF821D', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 14, elevation: 10,
    marginBottom: 16,
  },
  ctaGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16, paddingHorizontal: 24,
  },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '800', flex: 1, textAlign: 'center' },

  // Sign in
  signInRow:   { flexDirection: 'row', justifyContent: 'center' },
  signInLabel: { color: '#6B7280', fontSize: 13 },
  signInLink:  { color: '#FF821D', fontSize: 13, fontWeight: '700' },
});
