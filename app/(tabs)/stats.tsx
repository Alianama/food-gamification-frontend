import { RootState } from '@/store';
import { asyncGetCharacterStats } from '@/store/food/slice';
import { useAppDispatch } from '@/store/hook';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function StatsScreen() {
  const dispatch = useAppDispatch();
  const { stats, loading } = useSelector((state: RootState) => state.food);

  useEffect(() => {
    if (!stats) dispatch(asyncGetCharacterStats());
  }, [stats]);

  const character = stats?.data?.character;
  const averages = stats?.data?.averages;
  const healthInfo = stats?.data?.health;

  const xpProgress = character ? (character.xpPoint / character.xpToNextLevel) * 100 : 0;

  if (loading || !stats) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18, color: '#666' }}>Loading Stats...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* XP & Stats Card */}
      <View style={styles.neuDark}>
        <View style={[styles.neuLight, styles.card]}>
          <Text style={styles.title}>Character Stats</Text>

          <Text style={styles.label}>Health</Text>
          <Text style={styles.value}>{character?.healthPoint}</Text>

          <Text style={styles.label}>Level</Text>
          <Text style={styles.value}>{character?.level}</Text>

          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{character?.statusName}</Text>

          {/* XP Bar */}
          <View style={styles.progressOuter}>
            <View style={[styles.progressInner, { width: `${xpProgress}%` }]} />
          </View>
          <Text style={styles.subText}>
            XP: {character?.xpPoint}/{character?.xpToNextLevel}
          </Text>
        </View>
      </View>

      {/* Health Score */}
      <View style={styles.neuDark}>
        <View style={[styles.neuLight, styles.card]}>
          <Text style={styles.title}>Health Score</Text>
          <Text style={styles.healthScore}>{healthInfo?.weeklyScore}</Text>
          <Text style={styles.subText}>Status: {healthInfo?.status}</Text>
        </View>
      </View>

      {/* Nutrition */}
      <View style={styles.neuDark}>
        <View style={[styles.neuLight, styles.card]}>
          <Text style={styles.title}>Nutrition Averages</Text>
          {Object.entries(averages || {}).map(([key, value]) => (
            <View key={key} style={styles.statRow}>
              <Text style={styles.statKey}>{key.toUpperCase()}</Text>
              <Text style={styles.statValue}>{value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recommendations */}
      <View style={styles.neuDark}>
        <View style={[styles.neuLight, styles.card]}>
          <Text style={styles.title}>Health Tips</Text>
          {stats?.data?.healthRecommendations?.map((tip: string, i: number) => (
            <Text key={i} style={styles.tip}>
              • {tip}
            </Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// === Styles ===

const BG = '#fff';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: BG,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /** Neumorphism Container Shadow Dark */
  neuDark: {
    backgroundColor: BG,
    padding: 4,
    borderRadius: 26,
    shadowColor: '#aaaaaa',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    marginBottom: 20,
  },

  /** Neumorphism Inner Shadow Light */
  neuLight: {
    backgroundColor: BG,
    shadowColor: '#fff',
    shadowOffset: { width: -10, height: -10 },
    shadowOpacity: 1,
    shadowRadius: 20,
    borderRadius: 26,
  },

  card: {
    padding: 18,
    borderRadius: 26,
  },

  // Text styles
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#222',
    marginBottom: 10,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
    marginTop: 6,
  },

  value: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111',
  },

  subText: {
    fontSize: 12,
    color: '#444',
    marginTop: 8,
  },

  progressOuter: {
    width: '100%',
    height: 14,
    backgroundColor: '#dcdcdc',
    borderRadius: 12,
    marginTop: 12,
    overflow: 'hidden',
  },

  progressInner: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
  },

  healthScore: {
    fontSize: 44,
    fontWeight: '900',
    color: '#14532D',
  },

  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },

  statKey: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },

  statValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111',
  },

  tip: {
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 8,
  },
});
