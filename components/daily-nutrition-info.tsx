import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, Pressable } from 'react-native';
import { FoodStatsData } from '@/store/food/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  statsData: FoodStatsData;
  onPressLog?: () => void;
  onPressChar?: () => void;
  onPressTheme?: () => void;
}

export default function UnifiedStatsPanel({ statsData, onPressLog, onPressChar, onPressTheme }: Props) {
  const targets = statsData.dailyTargets;
  const today = statsData.todayNutrition;
  const char = statsData.character;

  // Animasi Bar HP & XP
  const healthPercent = Math.min(char.healthPoint, 100);
  const xpPercent = Math.min((char.xpPoint / char.xpToNextLevel) * 100, 100);

  const hpAnim = useRef(new Animated.Value(healthPercent)).current;
  const xpAnim = useRef(new Animated.Value(xpPercent)).current;

  useEffect(() => {
    Animated.spring(hpAnim, { toValue: healthPercent, friction: 6, useNativeDriver: false }).start();
    Animated.spring(xpAnim, { toValue: xpPercent, friction: 6, useNativeDriver: false }).start();
  }, [healthPercent, xpPercent]);

  const renderNutrientRow = (
    name: string,
    icon: keyof typeof Ionicons.glyphMap,
    iconColor: string,
    current: number,
    target: number,
    unit: string
  ) => {
    const safeTarget = target > 0 ? target : 1;
    const percent = Math.min((current / safeTarget) * 100, 100);
    const isOver = current > target;
    const displayCurrent = Math.round(current);
    const displayTarget = Math.round(target);

    return (
      <View style={styles.nutrientBox}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={14} color={iconColor} />
        </View>
        <View style={styles.rowContent}>
          <Text style={styles.rowTitle}>{name}</Text>
          <Text style={[styles.rowValue, isOver && styles.rowValueOver]}>
            {displayCurrent}<Text style={styles.rowTarget}>/{displayTarget}{unit}</Text>
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card3d}>
        {/* Top Section: Character Info & Bars */}
        <View style={styles.topSection}>
          <View style={styles.charHeader}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Lv.{char.level}</Text>
            </View>
            <Text style={styles.statusText}>{char.statusName}</Text>
          </View>

          <View style={styles.barsContainer}>
            {/* HP Bar */}
            <View style={styles.mainBarWrapper}>
              <View style={styles.mainIconBg}>
                <Ionicons name="heart" size={12} color="#EF4444" />
              </View>
              <View style={styles.mainBarBg}>
                <Animated.View style={[styles.mainBarFill, { width: hpAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]}>
                  <LinearGradient colors={['#FF6B6B', '#EF4444']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
                </Animated.View>
                <Text style={styles.mainBarLabel}>HP {char.healthPoint}</Text>
              </View>
            </View>

            {/* XP Bar */}
            <View style={styles.mainBarWrapper}>
              <View style={styles.mainIconBg}>
                <Ionicons name="flash" size={12} color="#F59E0B" />
              </View>
              <View style={styles.mainBarBg}>
                <Animated.View style={[styles.mainBarFill, { width: xpAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]}>
                  <LinearGradient colors={['#FFD93D', '#F59E0B']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
                </Animated.View>
                <Text style={styles.mainBarLabel}>XP {char.xpPoint}/{char.xpToNextLevel}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Middle Section: Nutrients (Horizontal Scroll or Grid) */}
        <View style={styles.nutrientGrid}>
          {renderNutrientRow('Kalori', 'flame', '#FF821D', today.calories, targets.calories, 'kcal')}
          {renderNutrientRow('Protein', 'fish', '#3B82F6', today.protein, targets.protein, 'g')}
          {renderNutrientRow('Karbo', 'leaf', '#10B981', today.carbohydrate, targets.carbohydrate, 'g')}
          {renderNutrientRow('Lemak', 'water', '#F59E0B', today.fat, targets.fat, 'g')}
        </View>

        <View style={styles.divider} />

        {/* Bottom Section: Action Buttons */}
        <View style={styles.actionsRow}>
          <Pressable style={styles.actionBtn} onPress={onPressLog}>
            <Ionicons name="list" size={18} color="#fff" />
            <Text style={styles.actionBtnText}>Food Logs</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={onPressChar}>
            <Ionicons name="paw" size={18} color="#fff" />
            <Text style={styles.actionBtnText}>Character</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={onPressTheme}>
            <Ionicons name="color-palette" size={18} color="#fff" />
            <Text style={styles.actionBtnText}>Theme</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  card3d: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderBottomWidth: 6,
    borderBottomColor: '#D1D5DB', // 3D effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  charHeader: {
    alignItems: 'center',
    gap: 4,
  },
  levelBadge: {
    backgroundColor: '#FF821D',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E66A15',
    borderBottomWidth: 3, // 3D effect
  },
  levelText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#fff',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
    textTransform: 'capitalize',
  },
  barsContainer: {
    flex: 1,
    gap: 6,
  },
  mainBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mainIconBg: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  mainBarBg: {
    height: 14,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 7,
    overflow: 'hidden',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  mainBarFill: {
    height: '100%',
    position: 'absolute',
    left: 0,
    borderRadius: 7,
  },
  mainBarLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  divider: {
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginVertical: 10,
    borderRadius: 1,
  },
  nutrientGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  nutrientBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%', // 2 columns
    backgroundColor: 'rgba(243, 244, 246, 0.8)',
    borderRadius: 10,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderBottomWidth: 3, // 3D mini effect
  },
  iconBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#6B7280',
  },
  rowValue: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1F2937',
  },
  rowValueOver: {
    color: '#EF4444',
  },
  rowTarget: {
    fontSize: 8,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    paddingVertical: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#2563EB',
    borderBottomWidth: 4, // 3D button effect
    borderBottomColor: '#1D4ED8',
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
  },
});
