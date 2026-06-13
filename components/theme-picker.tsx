import React from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { THEMES, ThemeId } from '@/store/theme/slice';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  visible: boolean;
  currentTheme: ThemeId;
  onSelect: (themeId: ThemeId) => void;
  onClose: () => void;
}

const { height } = Dimensions.get('window');

export default function ThemePicker({ visible, currentTheme, onSelect, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <Ionicons name="color-palette" size={24} color="#1F2937" />
            <Text style={styles.title}>Choose a Theme</Text>
          </View>

          <View style={styles.grid}>
            {Object.values(THEMES).map(t => (
              <Pressable
                key={t.id}
                style={[styles.themeCard, currentTheme === t.id && styles.activeCard]}
                onPress={() => { onSelect(t.id); onClose(); }}
              >
                <LinearGradient
                  colors={t.sky as [string, string, string]}
                  style={styles.swatch}
                >
                  <View style={[styles.ground, { backgroundColor: t.ground }]} />
                  <Text style={styles.emoji}>{t.label}</Text>
                </LinearGradient>
                <Text style={[styles.themeName, currentTheme === t.id && { color: '#667eea', fontWeight: '800' }]}>
                  {t.name}
                </Text>
                {currentTheme === t.id && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
    maxHeight: height * 0.7,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  themeCard: {
    width: '47%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeCard: {
    borderColor: '#667eea',
    backgroundColor: '#EFF6FF',
  },
  swatch: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 30,
  },
  emoji: {
    fontSize: 32,
  },
  themeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    textAlign: 'center',
  },
  checkBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#667eea',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
