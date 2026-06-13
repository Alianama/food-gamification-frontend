import LoveSVG from '@/assets/icons/love.svg';
import StarsSVG from '@/assets/icons/stars.svg';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface Props {
  level: number;
  statusName: string;
  healthPoint: number;
  xpPoint: number;
  xpToNextLevel: number;
}

export default function GameHud({ level, statusName, healthPoint, xpPoint, xpToNextLevel }: Props) {
  const healthPercent = Math.min(healthPoint, 100);
  const xpPercent = Math.min((xpPoint / xpToNextLevel) * 100, 100);

  const hpAnim = useRef(new Animated.Value(healthPercent)).current;
  const xpAnim = useRef(new Animated.Value(xpPercent)).current;

  useEffect(() => {
    Animated.spring(hpAnim, { toValue: healthPercent, friction: 6, useNativeDriver: false }).start();
    Animated.spring(xpAnim, { toValue: xpPercent, friction: 6, useNativeDriver: false }).start();
  }, [healthPercent, xpPercent]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Lv.{level}</Text>
        </View>
        <Text style={styles.statusText}>{statusName}</Text>
      </View>

      <View style={styles.hpWrapper}>
        <View style={styles.iconBg}>
          <LoveSVG width={16} height={16} color="#d9263e" />
        </View>
        <View style={styles.barWrapper}>
          <Animated.View style={[styles.barFill, {
            width: hpAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] })
          }]}>
            <LinearGradient colors={['#FF6B6B', '#EF4444']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
          </Animated.View>
          <Text style={styles.barLabel}>HP {healthPoint}</Text>
        </View>
      </View>

      <View style={styles.hpWrapper}>
        <View style={styles.iconBg}>
          <StarsSVG width={16} height={16} />
        </View>
        <View style={styles.barWrapper}>
          <Animated.View style={[styles.barFill, {
            width: xpAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] })
          }]}>
            <LinearGradient colors={['#FFD93D', '#F59E0B']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
          </Animated.View>
          <Text style={styles.barLabel}>XP {xpPoint}/{xpToNextLevel}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 12,
    borderRadius: 20,
    width: 200,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  levelBadge: {
    backgroundColor: '#667eea',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'capitalize',
  },
  hpWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBg: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  barWrapper: {
    height: 16,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  barFill: {
    height: '100%',
    position: 'absolute',
    left: 0,
    borderRadius: 8,
    overflow: 'hidden',
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
