import { RootState } from '@/store';
import { asyncGetAchievements } from '@/store/achievement/slice';
import { useAppDispatch } from '@/store/hook';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

const CATEGORY_ORDER = ['Progression', 'Exploration', 'Feeding', 'XP', 'Health'];

const categoryColors: Record<string, [string, string]> = {
  Progression: ['#667eea', '#764ba2'],
  Exploration: ['#11998e', '#38ef7d'],
  Feeding:     ['#f093fb', '#f5576c'],
  XP:          ['#4facfe', '#00f2fe'],
  Health:      ['#43e97b', '#38f9d7'],
};

const categoryIcons: Record<string, string> = {
  Progression: 'trending-up',
  Exploration: 'compass',
  Feeding:     'nutrition',
  XP:          'flash',
  Health:      'heart',
};

export default function AchievementsScreen() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.achievement);

  const fetchAchievements = () => {
    dispatch(asyncGetAchievements());
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const achievements = data?.achievements ?? [];
  const summary = data?.summary;

  // Group by category in defined order
  const grouped = CATEGORY_ORDER.reduce<Record<string, typeof achievements>>((acc, cat) => {
    acc[cat] = achievements.filter(a => a.category === cat);
    return acc;
  }, {});

  if (loading && !data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading Achievements...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchAchievements} tintColor="#667eea" />}
    >
      {/* Header */}
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="trophy" size={36} color="#FFD700" />
          <Text style={styles.headerTitle}>Achievements</Text>
          <Text style={styles.headerSubtitle}>Track your progress and unlock rewards</Text>
        </View>

        {summary && (
          <View style={styles.summaryRow}>
            <View style={styles.summaryChip}>
              <Ionicons name="checkmark-circle" size={16} color="#4ADE80" />
              <Text style={styles.summaryChipText}>{summary.unlocked} Unlocked</Text>
            </View>
            <View style={styles.summaryChip}>
              <Ionicons name="lock-closed" size={16} color="#FDA4AF" />
              <Text style={styles.summaryChipText}>{summary.locked} Locked</Text>
            </View>
            <View style={styles.summaryChip}>
              <Ionicons name="ribbon" size={16} color="#FCD34D" />
              <Text style={styles.summaryChipText}>{summary.total} Total</Text>
            </View>
          </View>
        )}

        {/* Overall progress bar */}
        {summary && (
          <View style={styles.overallProgress}>
            <View style={styles.overallProgressBg}>
              <View
                style={[
                  styles.overallProgressFill,
                  { width: `${Math.round((summary.unlocked / summary.total) * 100)}%` as any },
                ]}
              />
            </View>
            <Text style={styles.overallProgressText}>
              {Math.round((summary.unlocked / summary.total) * 100)}% Complete
            </Text>
          </View>
        )}
      </LinearGradient>

      {/* Categories */}
      {CATEGORY_ORDER.map(category => {
        const items = grouped[category] ?? [];
        if (items.length === 0) return null;
        const colors = categoryColors[category] ?? ['#667eea', '#764ba2'];
        const catIcon = categoryIcons[category] ?? 'star';
        const unlockedInCat = items.filter(a => a.unlocked).length;

        return (
          <View key={category} style={styles.categorySection}>
            {/* Category Header */}
            <View style={styles.categoryHeader}>
              <LinearGradient colors={colors} style={styles.categoryIconBg}>
                <Ionicons name={catIcon as any} size={16} color="#fff" />
              </LinearGradient>
              <Text style={styles.categoryTitle}>{category}</Text>
              <View style={styles.categoryCount}>
                <Text style={styles.categoryCountText}>{unlockedInCat}/{items.length}</Text>
              </View>
            </View>

            {/* Achievement Cards */}
            {items.map(achievement => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  !achievement.unlocked && styles.achievementCardLocked,
                ]}
              >
                {/* Icon */}
                <View
                  style={[
                    styles.iconWrapper,
                    { backgroundColor: achievement.unlocked ? achievement.color + '22' : '#F3F4F6' },
                  ]}
                >
                  <Ionicons
                    name={achievement.icon as any}
                    size={28}
                    color={achievement.unlocked ? achievement.color : '#D1D5DB'}
                  />
                  {!achievement.unlocked && (
                    <View style={styles.lockOverlay}>
                      <Ionicons name="lock-closed" size={12} color="#9CA3AF" />
                    </View>
                  )}
                </View>

                {/* Info */}
                <View style={styles.achievementInfo}>
                  <View style={styles.achievementTitleRow}>
                    <Text
                      style={[
                        styles.achievementName,
                        !achievement.unlocked && styles.textLocked,
                      ]}
                    >
                      {achievement.name}
                    </Text>
                    {achievement.unlocked && (
                      <Ionicons name="checkmark-circle" size={18} color="#4ADE80" />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.achievementDesc,
                      !achievement.unlocked && styles.textLocked,
                    ]}
                  >
                    {achievement.description}
                  </Text>

                  {/* Progress Bar */}
                  <View style={styles.progressRow}>
                    <View style={styles.progressBg}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${achievement.progress.percentage}%` as any,
                            backgroundColor: achievement.unlocked ? achievement.color : '#9CA3AF',
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {achievement.progress.current}/{achievement.progress.max}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        );
      })}

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={32} color="#EF4444" />
          <Text style={styles.errorText}>Failed to load achievements</Text>
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#667eea',
    fontWeight: '600',
  },

  // Header
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 8,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  summaryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  summaryChipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  overallProgress: {
    alignItems: 'center',
    gap: 6,
  },
  overallProgressBg: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  overallProgressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  overallProgressText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '600',
  },

  // Category
  categorySection: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  categoryIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  categoryCount: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },

  // Achievement Card
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  achievementCardLocked: {
    backgroundColor: '#FAFAFA',
    shadowOpacity: 0.03,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  lockOverlay: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 2,
  },
  achievementInfo: {
    flex: 1,
    gap: 4,
  },
  achievementTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  achievementName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  achievementDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  textLocked: {
    color: '#9CA3AF',
  },

  // Progress
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  progressBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    minWidth: 32,
    textAlign: 'right',
  },

  // Error
  errorContainer: {
    alignItems: 'center',
    padding: 32,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
});
