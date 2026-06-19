import { RootState } from '@/store';
import { asyncGetCharacterStats } from '@/store/food/slice';
import { useAppDispatch } from '@/store/hook';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

const STATUS_COLORS: Record<string, string> = {
  Healthy: '#16a34a',
  Risky:   '#dc2626',
  Normal:  '#ca8a04',
};

export default function StatsScreen() {
  const dispatch = useAppDispatch();
  const { stats, loading } = useSelector((state: RootState) => state.food);
  const userAuth = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!stats) dispatch(asyncGetCharacterStats());
  }, [stats, dispatch]);

  const data = stats?.data;
  const character = data?.character;
  const summary = data?.summary;
  const averages = data?.averages;
  const dailyTargets = data?.dailyTargets;
  const healthInfo = data?.health;
  const weeklyBreakdown = data?.weeklyBreakdown;
  const mostConsumedFoods = data?.mostConsumedFoods;
  const tips = data?.healthRecommendations;

  const xpProgress = character ? (character.xpPoint / character.xpToNextLevel) * 100 : 0;
  const hpProgress = character ? Math.min(character.healthPoint, 100) : 0;

  const healthScore = healthInfo?.weeklyScore ?? 0;
  const healthScoreColor =
    healthScore >= 70 ? '#16a34a' : healthScore >= 40 ? '#ca8a04' : '#dc2626';

  if (loading || !stats) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF821D" />
        <Text style={styles.loadingText}>Loading Stats...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Page Header */}
      <View style={styles.pageHeader}>
        <Ionicons name="analytics" size={26} color="#FF821D" />
        <Text style={styles.pageTitle}>Statistics</Text>
      </View>

      {/* Activity Summary */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="calendar" size={18} color="#FF821D" />
          <Text style={styles.cardTitle}>Activity Summary</Text>
        </View>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryBox, { backgroundColor: '#EFF6FF' }]}>
            <Ionicons name="camera" size={22} color="#3B82F6" />
            <Text style={[styles.summaryCount, { color: '#1D4ED8' }]}>{summary?.totalScanned ?? 0}</Text>
            <Text style={[styles.summaryLabel, { color: '#3B82F6' }]}>Total Scan</Text>
          </View>
          <View style={[styles.summaryBox, { backgroundColor: '#F0FDF4' }]}>
            <Ionicons name="restaurant" size={22} color="#16a34a" />
            <Text style={[styles.summaryCount, { color: '#166534' }]}>{summary?.totalConsumed ?? 0}</Text>
            <Text style={[styles.summaryLabel, { color: '#16a34a' }]}>Consumed</Text>
          </View>
          <View style={[styles.summaryBox, { backgroundColor: '#FEF9EE' }]}>
            <Ionicons name="search" size={22} color="#D97706" />
            <Text style={[styles.summaryCount, { color: '#92400E' }]}>
              {(summary?.totalScanned ?? 0) - (summary?.totalConsumed ?? 0)}
            </Text>
            <Text style={[styles.summaryLabel, { color: '#D97706' }]}>Scan Only</Text>
          </View>
        </View>
      </View>

      {/* Character Stats */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="game-controller" size={18} color="#FF821D" />
          <Text style={styles.cardTitle}>Character Stats</Text>
          <View style={styles.levelPill}>
            <Text style={styles.levelPillText}>Lv.{character?.level}</Text>
          </View>
        </View>

        {/* Status */}
        <View style={styles.statusRow}>
          <Ionicons name="person-circle" size={16} color="#9CA3AF" />
          <Text style={styles.statusText}>{character?.statusName}</Text>
        </View>

        {/* HP */}
        <View style={styles.barBlock}>
          <View style={styles.barLabelRow}>
            <View style={styles.barLabelLeft}>
              <Ionicons name="heart" size={14} color="#EF4444" />
              <Text style={styles.barLabel}>Health Points</Text>
            </View>
            <Text style={styles.barValue}>{character?.healthPoint} HP</Text>
          </View>
          <View style={styles.barBg}>
            <LinearGradient
              colors={['#FF6B6B', '#EF4444']}
              style={[styles.barFill, { width: `${hpProgress}%` as any }]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            />
          </View>
        </View>

        {/* XP */}
        <View style={styles.barBlock}>
          <View style={styles.barLabelRow}>
            <View style={styles.barLabelLeft}>
              <Ionicons name="flash" size={14} color="#F59E0B" />
              <Text style={styles.barLabel}>Experience Points</Text>
            </View>
            <Text style={styles.barValue}>{character?.xpPoint}/{character?.xpToNextLevel} XP</Text>
          </View>
          <View style={styles.barBg}>
            <LinearGradient
              colors={['#FFD93D', '#F59E0B']}
              style={[styles.barFill, { width: `${Math.min(xpProgress, 100)}%` as any }]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            />
          </View>
        </View>
      </View>

      {/* Health Score */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="heart-circle" size={18} color="#FF821D" />
          <Text style={styles.cardTitle}>Weekly Health Score</Text>
        </View>
        <View style={styles.healthScoreRow}>
          <Text style={[styles.healthScore, { color: healthScoreColor }]}>{healthScore}</Text>
          <View style={styles.healthScoreInfo}>
            <View style={[styles.healthStatusBadge, { backgroundColor: healthScoreColor + '18' }]}>
              <Ionicons
                name={healthScore >= 70 ? 'checkmark-circle' : healthScore >= 40 ? 'warning' : 'close-circle'}
                size={14}
                color={healthScoreColor}
              />
              <Text style={[styles.healthStatusText, { color: healthScoreColor }]}>
                {healthInfo?.status}
              </Text>
            </View>
            <Text style={styles.healthScoreCaption}>out of 100</Text>
          </View>
        </View>
      </View>

      {/* Most Consumed Foods */}
      {mostConsumedFoods && mostConsumedFoods.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="pizza" size={18} color="#FF821D" />
            <Text style={styles.cardTitle}>Most Consumed</Text>
          </View>
          {mostConsumedFoods.map((item: any, i: number) => (
            <View key={i} style={styles.listRow}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{i + 1}</Text>
              </View>
              <Text style={styles.listKey} numberOfLines={1}>{item.foodName}</Text>
              <View style={styles.countPill}>
                <Ionicons name="repeat" size={12} color="#FF821D" />
                <Text style={styles.countPillText}>{item.count}x</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Weekly Status */}
      {weeklyBreakdown && weeklyBreakdown.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar-outline" size={18} color="#FF821D" />
            <Text style={styles.cardTitle}>Weekly Intake</Text>
          </View>
          {weeklyBreakdown.map((day: any, i: number) => {
            const color = STATUS_COLORS[day.status] ?? '#6B7280';
            return (
              <View key={i} style={styles.listRow}>
                <Text style={styles.listKey}>{day.name}</Text>
                <View style={[styles.statusPill, { backgroundColor: color + '18' }]}>
                  <View style={[styles.statusDot, { backgroundColor: color }]} />
                  <Text style={[styles.statusPillText, { color }]}>{day.status}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Nutrition Averages vs Targets */}
      {averages && dailyTargets && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="nutrition" size={18} color="#FF821D" />
            <Text style={styles.cardTitle}>Nutrition vs Daily Target</Text>
          </View>
          
          <View style={styles.bodyMassInfo}>
            <Text style={styles.bodyMassText}>BMI Calculation Data:</Text>
            <Text style={styles.bodyMassValue}>Berat: {userAuth?.weight || '-'} kg  |  Tinggi: {userAuth?.height || '-'} cm</Text>
          </View>

          {([
            { key: 'calories',     label: 'Calories',     icon: 'flame',        color: '#FF6B6B', unit: 'kcal' },
            { key: 'protein',      label: 'Protein',      icon: 'barbell',      color: '#4FC3F7', unit: 'g' },
            { key: 'carbohydrate', label: 'Carbo',        icon: 'grid',         color: '#81C784', unit: 'g' },
            { key: 'fat',          label: 'Fat',          icon: 'water',        color: '#E57373', unit: 'g' },
          ] as const).map(({ key, label, icon, color, unit }) => {
            const avgVal = (averages as any)[key];
            const tgtVal = (dailyTargets as any)[key];
            if (avgVal === undefined || tgtVal === undefined) return null;
            
            const safeTgt = tgtVal > 0 ? tgtVal : 1;
            const percent = Math.min((avgVal / safeTgt) * 100, 100);
            const isOver = avgVal > tgtVal;

            return (
              <View key={key} style={styles.nutritionRow}>
                <View style={[styles.nutritionIconBg, { backgroundColor: color + '20' }]}>
                  <Ionicons name={icon as any} size={16} color={color} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={styles.nutritionLabel}>{label}</Text>
                    <Text style={styles.nutritionValue}>
                      <Text style={{ color: isOver ? '#EF4444' : '#111827' }}>{avgVal}</Text> / {tgtVal} {unit}
                    </Text>
                  </View>
                  <View style={{ height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                    <View style={{ width: `${percent}%`, height: '100%', backgroundColor: isOver ? '#EF4444' : color, borderRadius: 3 }} />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Health Tips */}
      {tips && tips.length > 0 && (
        <View style={[styles.card, { marginBottom: 0 }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="bulb" size={18} color="#FF821D" />
            <Text style={styles.cardTitle}>Health Tips</Text>
          </View>
          {tips.map((tip: string, i: number) => (
            <View key={i} style={styles.tipRow}>
              <Ionicons name="checkmark-circle" size={16} color="#16a34a" style={{ marginTop: 1 }} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
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
    paddingHorizontal: 16,
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
    color: '#FF821D',
    fontWeight: '600',
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 60,
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },

  // Cards
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },

  // Summary
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryBox: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  summaryCount: {
    fontSize: 22,
    fontWeight: '900',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },

  // Level pill
  levelPill: {
    backgroundColor: '#FF821D',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  levelPillText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },

  // Status
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  // Bars
  barBlock: { marginBottom: 12 },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  barLabelLeft: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  barLabel: { fontSize: 12, color: '#374151', fontWeight: '600' },
  barValue: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  barBg: {
    width: '100%',
    height: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 5 },

  // Health Score
  healthScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  healthScore: {
    fontSize: 52,
    fontWeight: '900',
  },
  healthScoreInfo: { gap: 6 },
  healthStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  healthStatusText: { fontSize: 13, fontWeight: '700' },
  healthScoreCaption: { fontSize: 12, color: '#9CA3AF' },

  // List rows
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rankText: { fontSize: 12, fontWeight: '800', color: '#3B82F6' },
  listKey: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1F2937' },
  countPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countPillText: { fontSize: 12, fontWeight: '700', color: '#FF821D' },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusPillText: { fontSize: 12, fontWeight: '700' },

  // Nutrition
  nutritionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  nutritionIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nutritionLabel: { fontSize: 13, fontWeight: '700', color: '#374151' },
  nutritionValue: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
  bodyMassInfo: {
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  bodyMassText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 4,
  },
  bodyMassValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
  },

  // Tips
  tipRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
  },
});
