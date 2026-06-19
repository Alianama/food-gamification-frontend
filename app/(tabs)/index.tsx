import CharacterPicker from '@/components/character-picker';
import HomeBackground from '@/components/home-background';
import InteractiveCharacter from '@/components/interactive-character';

import DailyNutritionInfo from '@/components/daily-nutrition-info';
import HealthTips from '@/components/health-tips';
import BmiModal from '@/components/bmi-modal';
import ThemePicker from '@/components/theme-picker';
import { RootState } from '@/store';
import { asyncGetCharacterStats } from '@/store/food/slice';
import { useAppDispatch } from '@/store/hook';
import { CHARACTERS, loadThemeSettings, setCharacter, setTheme, THEMES } from '@/store/theme/slice';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { confirmedData, stats } = useSelector((state: RootState) => state.food);
  const { user } = useSelector((state: RootState) => state.auth);
  const { themeId, characterId, loaded } = useSelector((state: RootState) => state.theme);
  const router = useRouter();

  const [themePickerVisible, setThemePickerVisible] = useState(false);
  const [charPickerVisible, setCharPickerVisible] = useState(false);

  const characterStats = confirmedData?.data?.character ?? stats?.data?.character;

  useEffect(() => {
    dispatch(loadThemeSettings());
  }, [dispatch]);

  useEffect(() => {
    if (!confirmedData && !stats) {
      dispatch(asyncGetCharacterStats());
    }
  }, [confirmedData, stats, dispatch]);

  const currentTheme = THEMES[themeId] || THEMES.default;
  const currentChar = CHARACTERS[characterId] || CHARACTERS.orange;

  const healthPercent = characterStats ? Math.min(characterStats.healthPoint, 100) : 100;
  const isHealthy = healthPercent >= 50; // Below 50 is sick

  const [showBmiModal, setShowBmiModal] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (!user.weight || !user.height) {
      setShowBmiModal(true);
      return;
    }
    if (user.lastBmiUpdate) {
      const lastUpdate = new Date(user.lastBmiUpdate).getTime();
      const now = new Date().getTime();
      const daysDiff = (now - lastUpdate) / (1000 * 3600 * 24);
      if (daysDiff > 30) {
        setShowBmiModal(true);
        return;
      }
    }
    setShowBmiModal(false);
  }, [user]);

  if (!loaded) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      {/* Background layer */}
      <HomeBackground
        theme={currentTheme}
        isHealthy={isHealthy}
        healthPercent={healthPercent}
      />

      {/* Action Buttons Layer moved to UnifiedStatsPanel */}





      {/* Interactive Character Layer */}
      <InteractiveCharacter def={currentChar} isHealthy={isHealthy} />

      {/* Unified Stats Layer (Health, XP, Nutrition) */}
      {/* Gunakan conditional render (bukan return null internal) untuk hindari React 19 static flag error */}
      {(() => {
        const hasStats = stats?.data?.dailyTargets && stats.data.todayNutrition && stats.data.character;
        if (hasStats) {
          return (
            <DailyNutritionInfo
              statsData={stats.data}
              onPressLog={() => router.push('/log')}
              onPressChar={() => setCharPickerVisible(true)}
              onPressTheme={() => setThemePickerVisible(true)}
            />
          );
        }
        return null;
      })()}

      {/* Health Tips Layer */}
      {stats?.data?.healthRecommendations && stats.data.healthRecommendations.length > 0 ? (
        <HealthTips tips={stats.data.healthRecommendations} />
      ) : null}

      {/* BMI Modal — selalu render, komponen internal handle visible=false */}
      <BmiModal visible={showBmiModal} />

      {/* Pickers Layer */}
      <ThemePicker
        visible={themePickerVisible}
        currentTheme={themeId}
        onSelect={(id) => dispatch(setTheme(id))}
        onClose={() => setThemePickerVisible(false)}
      />

      <CharacterPicker
        visible={charPickerVisible}
        currentCharacter={characterId}
        onSelect={(id) => dispatch(setCharacter(id))}
        onClose={() => setCharPickerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBtns: {
    position: 'absolute',
    top: 60,
    left: 16,
    flexDirection: 'column',
    gap: 12,
    zIndex: 20,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

});
