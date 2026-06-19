import React from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { CHARACTERS, CharacterId } from '@/store/theme/slice';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Props {
  visible: boolean;
  currentCharacter: CharacterId;
  onSelect: (charId: CharacterId) => void;
  onClose: () => void;
}

const { height } = Dimensions.get('window');

export default function CharacterPicker({ visible, currentCharacter, onSelect, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <Ionicons name="paw" size={24} color="#1F2937" />
            <Text style={styles.title}>Choose Character</Text>
          </View>

          <View style={styles.grid}>
            {Object.values(CHARACTERS).map(c => (
              <Pressable
                key={c.id}
                style={[styles.charCard, currentCharacter === c.id && styles.activeCard]}
                onPress={() => { onSelect(c.id); onClose(); }}
              >
                <View style={[styles.avatarBg, { backgroundColor: c.color + '20' }]}>
                  <Text style={styles.emoji}>{c.emoji}</Text>
                </View>
                <Text style={[styles.charName, currentCharacter === c.id && { color: '#FF821D', fontWeight: '800' }]}>
                  {c.name}
                </Text>
                {currentCharacter === c.id && (
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
  charCard: {
    width: '30%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeCard: {
    borderColor: '#FF821D',
    backgroundColor: '#EFF6FF',
  },
  avatarBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 32,
  },
  charName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    textAlign: 'center',
  },
  checkBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF821D',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
