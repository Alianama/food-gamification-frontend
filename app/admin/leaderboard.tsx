import { RootState } from '@/store';
import { asyncAdminGetLeaderboard } from '@/store/admin/slice';
import { LeaderboardEntry } from '@/store/admin/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const RANK_COLORS: Record<number, { bg: string; text: string; icon: string }> = {
  1: { bg: '#FFF8E1', text: '#F59E0B', icon: '🥇' },
  2: { bg: '#F3F4F6', text: '#6B7280', icon: '🥈' },
  3: { bg: '#FFF3E0', text: '#EA7C2C', icon: '🥉' },
};

function LeaderboardCard({ entry }: { entry: LeaderboardEntry }) {
  const rank = entry.rank;
  const isTop = rank <= 3;
  const rankStyle = RANK_COLORS[rank] || { bg: '#F8FAFC', text: '#374151', icon: '' };

  const initials = (entry.fullName || entry.username || '?')
    .split(' ')
    .map(w => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const xpPercent = entry.xpPoint > 0
    ? Math.min((entry.xpPoint / (entry.level * 100 + 100)) * 100, 100)
    : 0;

  return (
    <View style={[styles.card, isTop && styles.cardTop]}>
      {/* Rank */}
      <View style={[styles.rankBadge, { backgroundColor: isTop ? rankStyle.bg : '#F3F4F6' }]}>
        {isTop ? (
          <Text style={styles.rankEmoji}>{rankStyle.icon}</Text>
        ) : (
          <Text style={[styles.rankNumber, { color: rankStyle.text }]}>#{rank}</Text>
        )}
      </View>

      {/* Avatar */}
      <LinearGradient
        colors={
          rank === 1
            ? ['#F59E0B', '#EF4444']
            : rank === 2
            ? ['#6B7280', '#9CA3AF']
            : rank === 3
            ? ['#EA7C2C', '#F59E0B']
            : ['#FF821D', '#F26200']
        }
        style={styles.avatar}
      >
        <Text style={styles.avatarText}>{initials}</Text>
      </LinearGradient>

      {/* Info */}
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={1}>{entry.fullName}</Text>
        <Text style={styles.cardUsername}>@{entry.username}</Text>
        <Text style={styles.cardStatus} numberOfLines={1}>{entry.statusName}</Text>
        {/* XP Bar */}
        <View style={styles.xpBarBg}>
          <LinearGradient
            colors={['#FF821D', '#FF915B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.xpBarFill, { width: `${xpPercent}%` as any }]}
          />
        </View>
      </View>

      {/* Stats */}
      <View style={styles.cardStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{entry.level}</Text>
          <Text style={styles.statLabel}>Lv</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#F59E0B' }]}>{entry.xpPoint}</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#EF4444' }]}>{entry.healthPoint}</Text>
          <Text style={styles.statLabel}>HP</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Top 3 Podium ────────────────────────────────────────────────────────────

function Podium({ top3 }: { top3: LeaderboardEntry[] }) {
  if (top3.length < 1) return null;

  const second = top3[1];
  const first = top3[0];
  const third = top3[2];

  const PodiumItem = ({
    entry,
    height,
    emoji,
    color,
  }: {
    entry?: LeaderboardEntry;
    height: number;
    emoji: string;
    color: [string, string];
  }) => {
    if (!entry) return <View style={{ flex: 1 }} />;
    const initials = entry.fullName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    return (
      <View style={[styles.podiumItem, { flex: 1 }]}>
        <Text style={styles.podiumEmoji}>{emoji}</Text>
        <LinearGradient colors={color} style={styles.podiumAvatar}>
          <Text style={styles.podiumAvatarText}>{initials}</Text>
        </LinearGradient>
        <Text style={styles.podiumName} numberOfLines={1}>{entry.fullName.split(' ')[0]}</Text>
        <Text style={styles.podiumXp}>Lv.{entry.level} · {entry.xpPoint} XP</Text>
        <View style={[styles.podiumBase, { height }]}>
          <Text style={styles.podiumRank}>{entry.rank}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.podiumContainer}>
      <PodiumItem entry={second} height={60} emoji="🥈" color={['#6B7280', '#9CA3AF']} />
      <PodiumItem entry={first} height={90} emoji="🥇" color={['#F59E0B', '#EF4444']} />
      <PodiumItem entry={third} height={45} emoji="🥉" color={['#EA7C2C', '#F59E0B']} />
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function AdminLeaderboard() {
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const { leaderboard, leaderboardLoading, leaderboardError } = useSelector(
    (state: RootState) => state.admin,
  );

  useEffect(() => {
    dispatch(asyncAdminGetLeaderboard());
  }, []);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#FF821D', '#F26200']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>🏆 Leaderboard</Text>
          <Text style={styles.headerSubtitle}>{leaderboard.length} player terdaftar</Text>
        </View>
        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={() => dispatch(asyncAdminGetLeaderboard())}
        >
          <Ionicons name="refresh" size={20} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {leaderboardLoading && leaderboard.length === 0 ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#FF821D" />
          <Text style={{ marginTop: 12, color: '#FF821D', fontWeight: '600' }}>Memuat leaderboard...</Text>
        </View>
      ) : leaderboardError ? (
        <View style={styles.centerState}>
          <Ionicons name="alert-circle" size={52} color="#EF4444" />
          <Text style={{ marginTop: 12, color: '#EF4444', fontWeight: '600', textAlign: 'center' }}>
            {leaderboardError}
          </Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => dispatch(asyncAdminGetLeaderboard())}
          >
            <Text style={styles.retryBtnText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : leaderboard.length === 0 ? (
        <View style={styles.centerState}>
          <Ionicons name="trophy-outline" size={52} color="#D1D5DB" />
          <Text style={{ marginTop: 12, color: '#9CA3AF', fontWeight: '600' }}>Belum ada data leaderboard</Text>
        </View>
      ) : (
        <FlatList
          data={rest}
          keyExtractor={item => String(item.userId)}
          renderItem={({ item }) => <LeaderboardCard entry={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={leaderboardLoading}
              onRefresh={() => dispatch(asyncAdminGetLeaderboard())}
              colors={['#FF821D']}
            />
          }
          ListHeaderComponent={
            <>
              {/* Podium */}
              <View style={styles.podiumSection}>
                <Podium top3={top3} />
              </View>
              {rest.length > 0 && (
                <Text style={styles.listSectionTitle}>Peringkat Lainnya</Text>
              )}
            </>
          }
          ListEmptyComponent={
            rest.length === 0 ? (
              <View style={{ alignItems: 'center', padding: 24 }}>
                <Text style={{ color: '#9CA3AF', fontSize: 13 }}>
                  Hanya {top3.length} player yang terdaftar
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  header: {
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  retryBtn: {
    marginTop: 12,
    backgroundColor: '#FF821D',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  retryBtnText: { color: '#fff', fontWeight: '700' },

  listContent: { paddingBottom: 40 },

  // Podium
  podiumSection: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 8,
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
  },
  podiumItem: {
    alignItems: 'center',
    gap: 6,
  },
  podiumEmoji: { fontSize: 24 },
  podiumAvatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumAvatarText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  podiumName: { fontSize: 12, fontWeight: '700', color: '#111827', textAlign: 'center' },
  podiumXp: { fontSize: 10, color: '#6B7280', textAlign: 'center' },
  podiumBase: {
    width: '100%',
    backgroundColor: '#FF821D',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  podiumRank: { color: '#fff', fontWeight: '800', fontSize: 18 },

  listSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },

  // Cards
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 18,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTop: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankEmoji: { fontSize: 20 },
  rankNumber: { fontSize: 14, fontWeight: '800' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 1 },
  cardUsername: { fontSize: 11, color: '#9CA3AF', marginBottom: 3 },
  cardStatus: { fontSize: 11, color: '#6B7280', marginBottom: 5 },
  xpBarBg: {
    height: 4,
    backgroundColor: '#FFF3E8',
    borderRadius: 2,
    overflow: 'hidden',
  },
  xpBarFill: { height: '100%', borderRadius: 2 },
  cardStats: { gap: 4, alignItems: 'flex-end' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 14, fontWeight: '800', color: '#FF821D' },
  statLabel: { fontSize: 9, color: '#9CA3AF', fontWeight: '600', textTransform: 'uppercase' },
});
