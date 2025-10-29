import Camera2SVG from '@/assets/icons/camera-2.svg';
import FeedSVG from '@/assets/icons/feed.svg';
import GalerySVG from '@/assets/icons/gallery.svg';
import SearchSVG from '@/assets/icons/search.svg';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface UploadModalProps {
  visible: boolean;
  imageUri: string | null;
  mimeType: string;
  loading: boolean;
  data?: any | null;
  error?: string | null;
  onClose: () => void;
  onTakePhoto: () => void;
  onPickGallery: () => void;
  onUpload: () => void;
  onConfirm: () => void;
}

export default function UploadModal({
  visible,
  imageUri,
  mimeType,
  loading,
  data,
  error,
  onClose,
  onTakePhoto,
  onPickGallery,
  onUpload,
  onConfirm,
}: UploadModalProps) {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const confettiRef = useRef<LottieView>(null);

  useEffect(() => {
    if (data) {
      confettiRef.current?.play();
    }
  }, [data]);

  useEffect(() => {
    const animate = () => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 3,
            duration: 80,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -3,
            duration: 80,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 80,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    };
    const interval = setInterval(animate, 2000);
    return () => clearInterval(interval);
  }, []);

  const rotate = shakeAnim.interpolate({ inputRange: [-1, 1], outputRange: ['-6deg', '6deg'] });

  const nutrition = data?.data?.predictions?.nutrition_info?.nutrition as Record<
    string,
    string | number
  >;

  const nutritionLabels: Record<string, { label: string; emoji: string; bg: string }> = {
    calories: { label: 'Calories', emoji: '🔥', bg: '#FFB74D' },
    protein: { label: 'Protein', emoji: '💪', bg: '#4FC3F7' },
    carbohydrate: { label: 'Carbohydrate', emoji: '🍚', bg: '#81C784' },
    fat: { label: 'Fat', emoji: '🧈', bg: '#E57373' },
    fiber: { label: 'Fiber', emoji: '🌾', bg: '#A1887F' },
    sugar: { label: 'Sugar', emoji: '🍬', bg: '#F48FB1' },
    sodium: { label: 'Sodium', emoji: '🧂', bg: '#90CAF9' },
  };

  const FileInfo = () =>
    mimeType || (imageUri?.includes('.') ? imageUri.split('.').pop() : 'unknown');

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Pressable style={styles.closeIcon} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
          <View style={styles.dragIndicator} />

          {/* Select Source State */}
          {!imageUri && !loading && !data && !error && (
            <>
              <Text style={styles.title}>Upload Food Image</Text>

              <View style={styles.rowButtons}>
                <Pressable
                  style={{
                    backgroundColor: themeColors.secondaryBackground,
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderRadius: 16,
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 8,
                  }}
                  onPress={onTakePhoto}
                >
                  <Camera2SVG width={35} height={35} fill="#fff" />
                  <Text style={styles.buttonText}>Camera</Text>
                </Pressable>

                <Pressable
                  style={{
                    backgroundColor: themeColors.secondaryBackground,
                    paddingVertical: 14,
                    paddingHorizontal: 20,
                    borderRadius: 16,
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 8,
                  }}
                  onPress={onPickGallery}
                >
                  <GalerySVG width={35} height={35} fill="#fff" />
                  <Text style={styles.buttonText}>Gallery</Text>
                </Pressable>
              </View>
              <Pressable style={styles.buttonCancel} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </>
          )}

          {imageUri && !data && !error && !loading && (
            <>
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
              <Text style={styles.fileType}>Format: {FileInfo()}</Text>

              <View style={styles.rowButtons}>
                <Pressable
                  style={[
                    styles.primaryButton,
                    {
                      backgroundColor: themeColors.secondaryBackground,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 8,
                    },
                  ]}
                  onPress={onTakePhoto}
                >
                  <Animated.View style={{ transform: [{ rotate }] }}>
                    <Camera2SVG width={35} height={35} fill="#fff" />
                  </Animated.View>
                  <Text style={styles.buttonText}>Re Take</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.primaryButton,
                    {
                      backgroundColor: themeColors.tint,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 8,
                    },
                  ]}
                  onPress={onUpload}
                >
                  <Animated.View style={{ transform: [{ rotate }] }}>
                    <SearchSVG width={35} height={35} fill="#fff" />
                  </Animated.View>
                  <Text style={styles.buttonText}>Detection</Text>
                </Pressable>
              </View>
            </>
          )}

          {/* Result State */}
          {!loading && data && (
            <>
              <View style={styles.resultCard}>
                <Text style={styles.resultFoodTitle}>
                  🍽 {data?.data?.predictions?.predicted_food || 'Makanan'}
                </Text>

                {nutrition &&
                  Object.entries(nutrition).map(([key, value]) => {
                    const item = nutritionLabels[key];
                    if (!item) return null;

                    return (
                      <View key={key} style={styles.nutritionRow}>
                        <Text style={[styles.nutritionLabel, { backgroundColor: item.bg }]}>
                          {item.emoji} {item.label}
                        </Text>
                        <Text style={styles.nutritionValue}>
                          {typeof value === 'string' || typeof value === 'number' ? value : '-'} g
                        </Text>
                      </View>
                    );
                  })}
              </View>

              <Pressable style={[styles.buttonPrimary, { marginTop: 28 }]} onPress={onConfirm}>
                <Animated.View style={{ transform: [{ rotate }], marginBottom: 10 }}>
                  <FeedSVG width={35} height={35} />
                </Animated.View>
                <Text style={styles.buttonText}>Feed Character</Text>
              </Pressable>
              <LottieView
                ref={confettiRef}
                source={require('@/assets/lottie/Confetti.json')}
                autoPlay={false}
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: -50,
                }}
                loop={false}
              />
            </>
          )}

          {!loading && error && (
            <>
              <Text style={styles.errorText}>{error}</Text>

              <Pressable style={[styles.buttonDanger, { marginTop: 24 }]} onPress={onClose}>
                <Text style={styles.buttonText}>Close</Text>
              </Pressable>
            </>
          )}
          {loading && (
            <>
              <ActivityIndicator size="large" color={themeColors.tint} />
              <Text style={{ marginTop: 15, fontSize: 16 }}>Uploading and Detecting...</Text>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },

  dragIndicator: {
    width: 45,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ccc',
    marginBottom: 15,
  },

  closeIcon: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 10,
  },
  closeText: {
    fontSize: 30,
    color: '#ff3333',
    fontWeight: 'bold',
  },

  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 25 },

  previewImage: {
    width: '100%',
    height: 270,
    borderRadius: 15,
    marginBottom: 15,
  },
  fileType: {
    fontSize: 13,
    color: 'gray',
    marginBottom: 12,
  },

  modalButtons: {
    width: '100%',
    gap: 10,
  },

  primaryButton: {
    backgroundColor: '#0066ff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  selectButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },

  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  redButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  cancelButton: {
    marginTop: 18,
    width: '70%',
    paddingVertical: 12,
    backgroundColor: '#eee',
    borderRadius: 10,
    alignItems: 'center',
  },

  errorText: {
    color: 'red',
    marginBottom: 15,
    fontSize: 15,
  },

  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  rowButtons: {
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },

  buttonPrimary: {
    backgroundColor: '#8e00a1ff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonDanger: {
    backgroundColor: '#ff4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonCancel: {
    marginTop: 20,
    paddingVertical: 14,
    width: '70%',
    backgroundColor: '#eee',
    borderRadius: 12,
    alignItems: 'center',
    alignSelf: 'center',
  },

  buttonText: {
    color: '#fff',
    paddingHorizontal: 6,
    fontSize: 16,
    fontWeight: 'bold',
  },

  cancelText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },

  resultCard: {
    width: '100%',
    backgroundColor: '#F7F9FC',
    padding: 18,
    borderRadius: 18,
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  resultFoodTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },

  nutritionRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    alignItems: 'center',
  },

  nutritionLabel: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  nutritionValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
});
