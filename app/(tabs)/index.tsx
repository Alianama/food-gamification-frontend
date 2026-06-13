import CharacterPicker from '@/components/character-picker';
import HomeBackground from '@/components/home-background';
import InteractiveCharacter from '@/components/interactive-character';
import GameHud from '@/components/stats-hud';
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

  if (!loaded) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      {/* Background layer */}
      <HomeBackground
        theme={currentTheme}
        isHealthy={isHealthy}
        healthPercent={healthPercent}
      />

      {/* Floating Header Buttons */}
      <View style={styles.headerBtns}>
        <Pressable style={styles.iconBtn} onPress={() => router.push('/log')}>
          <Ionicons name="list" size={20} color="#1F2937" />
        </Pressable>
        <Pressable style={styles.iconBtn} onPress={() => setCharPickerVisible(true)}>
          <Ionicons name="paw" size={20} color="#1F2937" />
        </Pressable>
        <Pressable style={styles.iconBtn} onPress={() => setThemePickerVisible(true)}>
          <Ionicons name="color-palette" size={20} color="#1F2937" />
        </Pressable>
      </View>

      {/* HUD Layer */}
      {characterStats && (
        <View style={styles.hudContainer}>
          <GameHud
            level={characterStats.level}
            statusName={characterStats.statusName}
            healthPoint={characterStats.healthPoint}
            xpPoint={characterStats.xpPoint}
            xpToNextLevel={characterStats.xpToNextLevel}
          />
        </View>
      )}

      {/* Interactive Character Layer */}
      <InteractiveCharacter def={currentChar} isHealthy={isHealthy} />

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
    right: 16,
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
  hudContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    zIndex: 10,
  },
});
