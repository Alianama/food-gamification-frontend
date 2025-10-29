import LoveSVG from '@/assets/icons/love.svg';
import StarsSVG from '@/assets/icons/stars.svg';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  level: number;
  statusName: string;
  healthPoint: number;
  xpPoint: number;
  xpToNextLevel: number;
}

export default function GameHud({ level, statusName, healthPoint, xpPoint, xpToNextLevel }: Props) {
  const healthPercent = Math.min(healthPoint, 100);
  const xpPercent = (xpPoint / xpToNextLevel) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.levelText}>
        Lv.{level} • {statusName}
      </Text>

      <View style={styles.hpWrapper}>
        <View>
          <LoveSVG width={24} height={24} color="#d9263e" />
        </View>
        <View style={styles.barWrapper}>
          <LinearGradient
            colors={['#FF4B4B', '#FF8585']}
            style={[styles.healthBar, { width: `${healthPercent}%` }]}
          />
          <Text style={styles.barLabel}>HP {healthPoint}</Text>
        </View>
      </View>

      <View style={styles.hpWrapper}>
        <View>
          <StarsSVG width={24} height={24} />
        </View>
        <View style={styles.barWrapper}>
          <LinearGradient
            colors={['#FFD93D', '#FFB52E']}
            style={[styles.xpBar, { width: `${xpPercent}%` }]}
          />
          <Text style={styles.barLabel}>
            XP {xpPoint}/{xpToNextLevel}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '10%',
    left: 10,
    padding: 8,
    borderRadius: 16,
    width: 200,
    gap: 2,
  },
  levelText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  barWrapper: {
    height: 18,
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  healthBar: {
    height: '100%',
    position: 'absolute',
    left: 0,
    borderRadius: 16,
  },
  xpBar: {
    height: '100%',
    position: 'absolute',
    left: 0,
    borderRadius: 16,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  hpWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
