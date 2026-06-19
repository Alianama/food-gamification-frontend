import { RootState } from '@/store';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

const MENU_ITEMS = [
  {
    id: 'users',
    title: 'Manajemen User',
    subtitle: 'List, tambah, edit & hapus user',
    icon: 'people' as const,
    color: '#FF821D',
    bg: '#FFF3E8',
    route: '/admin/users',
  },
  {
    id: 'leaderboard',
    title: 'Leaderboard',
    subtitle: 'Ranking user berdasarkan XP & Level',
    icon: 'trophy' as const,
    color: '#F59E0B',
    bg: '#FFFBEB',
    route: '/admin/leaderboard',
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { users } = useSelector((state: RootState) => state.admin);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Selamat Pagi' : hour < 17 ? 'Selamat Siang' : 'Selamat Malam';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#FF821D', '#F26200']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>{greeting}, Admin 👋</Text>
          <Text style={styles.adminName}>{user?.fullName || user?.username}</Text>
          <View style={styles.adminBadge}>
            <Ionicons name="shield-checkmark" size={12} color="#FF821D" />
            <Text style={styles.adminBadgeText}>Administrator</Text>
          </View>
        </View>

        {/* Decorative circles */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Title */}
        <Text style={styles.sectionTitle}>Panel Admin</Text>
        <Text style={styles.sectionSubtitle}>Pilih menu untuk mengelola aplikasi</Text>

        {/* Menu Cards */}
        <View style={styles.menuGrid}>
          {MENU_ITEMS.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuCard}
              activeOpacity={0.85}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.menuIconBg, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon} size={28} color={item.color} />
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <LinearGradient
            colors={['#FF821D', '#F26200']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.infoGradient}
          >
            <Ionicons name="information-circle" size={24} color="rgba(255,255,255,0.9)" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.infoTitle}>Panduan Admin</Text>
              <Text style={styles.infoText}>
                Sebagai admin, Anda memiliki akses penuh untuk mengelola semua user, melihat
                progress mereka, dan memantau leaderboard.
              </Text>
            </View>
          </LinearGradient>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  header: {
    paddingTop: 56,
    paddingBottom: 36,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerContent: { zIndex: 1 },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 4 },
  adminName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 10,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  adminBadgeText: { fontSize: 12, fontWeight: '700', color: '#FF821D' },

  decorCircle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -40,
    right: -40,
  },
  decorCircle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -20,
    right: 60,
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 28 },

  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, color: '#6B7280', marginBottom: 20 },

  menuGrid: { gap: 12, marginBottom: 24 },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  menuIconBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuInfo: { flex: 1 },
  menuTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 3 },
  menuSubtitle: { fontSize: 12, color: '#6B7280', lineHeight: 17 },

  infoCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#FF821D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  infoGradient: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    borderRadius: 20,
  },
  infoTitle: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 6 },
  infoText: { fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 18 },
});
