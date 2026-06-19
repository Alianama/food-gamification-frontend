import Camera2SVG from '@/assets/icons/camera-2.svg';
import FeedSVG from '@/assets/icons/feed.svg';
import GalerySVG from '@/assets/icons/gallery.svg';
import SearchSVG from '@/assets/icons/search.svg';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';
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

const nutritionConfig: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  calories:      { label: 'Calories',     icon: 'flame',        color: '#FF6B6B', bg: '#FF6B6B20' },
  protein:       { label: 'Protein',      icon: 'barbell',      color: '#4FC3F7', bg: '#4FC3F720' },
  carbohydrate:  { label: 'Carbohydrate', icon: 'grid',         color: '#81C784', bg: '#81C78420' },
  fat:           { label: 'Fat',          icon: 'water',        color: '#E57373', bg: '#E5737320' },
  fiber:         { label: 'Fiber',        icon: 'leaf',         color: '#A5D6A7', bg: '#A5D6A720' },
  sugar:         { label: 'Sugar',        icon: 'ice-cream',    color: '#F48FB1', bg: '#F48FB120' },
  sodium:        { label: 'Sodium',       icon: 'ellipse',      color: '#90CAF9', bg: '#90CAF920' },
};

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
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 3,  duration: 80,  easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -3, duration: 80,  easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0,  duration: 80,  easing: Easing.linear, useNativeDriver: true }),
      ]).start();
    };
    const interval = setInterval(animate, 2000);
    return () => clearInterval(interval);
  }, []);

  const rotate = shakeAnim.interpolate({ inputRange: [-1, 1], outputRange: ['-6deg', '6deg'] });

  const nutrition = data?.data?.predictions?.nutrition_info?.nutrition as Record<string, string | number>;
  const fileExt = mimeType || (imageUri?.includes('.') ? imageUri.split('.').pop() : 'unknown');

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>

          {/* Close Button */}
          <Pressable style={styles.closeIcon} onPress={onClose}>
            <View style={styles.closeIconBg}>
              <Ionicons name="close" size={20} color="#EF4444" />
            </View>
          </Pressable>

          <View style={styles.dragIndicator} />

          {/* ── STATE 1: Select Source ── */}
          {!imageUri && !loading && !data && !error && (
            <>
              <View style={styles.titleRow}>
                <Ionicons name="camera" size={22} color="#FF821D" />
                <Text style={styles.title}>Upload Food Image</Text>
              </View>
              <Text style={styles.subtitle}>Take a photo or choose from your gallery</Text>

              <View style={styles.rowButtons}>
                <Pressable
                  style={[styles.sourceButton, { backgroundColor: themeColors.secondaryBackground }]}
                  onPress={onTakePhoto}
                >
                  <Camera2SVG width={32} height={32} fill="#fff" />
                  <Text style={styles.buttonText}>Camera</Text>
                </Pressable>

                <Pressable
                  style={[styles.sourceButton, { backgroundColor: themeColors.secondaryBackground }]}
                  onPress={onPickGallery}
                >
                  <GalerySVG width={32} height={32} fill="#fff" />
                  <Text style={styles.buttonText}>Gallery</Text>
                </Pressable>
              </View>

              <Pressable style={styles.buttonCancel} onPress={onClose}>
                <Ionicons name="close-circle-outline" size={18} color="#6B7280" />
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </>
          )}

          {/* ── STATE 2: Preview Image ── */}
          {imageUri && !data && !error && !loading && (
            <>
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
              <View style={styles.fileInfoRow}>
                <Ionicons name="document-outline" size={14} color="#9CA3AF" />
                <Text style={styles.fileType}>Format: {fileExt}</Text>
              </View>

              <View style={styles.rowButtons}>
                <Pressable
                  style={[styles.actionButton, { backgroundColor: themeColors.secondaryBackground }]}
                  onPress={onTakePhoto}
                >
                  <Animated.View style={{ transform: [{ rotate }] }}>
                    <Camera2SVG width={28} height={28} fill="#fff" />
                  </Animated.View>
                  <Text style={styles.buttonText}>Re-take</Text>
                </Pressable>

                <Pressable
                  style={[styles.actionButton, { backgroundColor: themeColors.tint }]}
                  onPress={onUpload}
                >
                  <Animated.View style={{ transform: [{ rotate }] }}>
                    <SearchSVG width={28} height={28} fill="#fff" />
                  </Animated.View>
                  <Text style={styles.buttonText}>Detect</Text>
                </Pressable>
              </View>
            </>
          )}

          {/* ── STATE 3: Result ── */}
          {!loading && data && (
            <>
              {data?.data?.predictions?.predicted_food === 'Unknown Food' ? (
                <View style={styles.resultCard}>
                  <View style={styles.unknownHeader}>
                    <Ionicons name="close-circle" size={44} color="#EF4444" />
                    <Text style={styles.unknownTitle}>Food Not Recognized</Text>
                  </View>
                  <Text style={styles.unknownDesc}>
                    The system could not detect any food in this photo. Please retake with a clearer image.
                  </Text>
                  <Pressable style={styles.buttonDanger} onPress={onClose}>
                    <Ionicons name="refresh" size={18} color="#fff" />
                    <Text style={styles.buttonText}>Try Again</Text>
                  </Pressable>
                </View>
              ) : (
                <>
                  <View style={styles.resultCard}>
                    {/* Food name */}
                    <View style={styles.resultFoodHeader}>
                      <Ionicons name="restaurant" size={24} color="#FF821D" />
                      <Text style={styles.resultFoodTitle} numberOfLines={2}>
                        {data?.data?.predictions?.predicted_food || 'Food Detected'}
                      </Text>
                    </View>

                    {/* Nutrition */}
                    {nutrition && Object.entries(nutrition).map(([key, value]) => {
                      const item = nutritionConfig[key.toLowerCase()];
                      if (!item) return null;
                      return (
                        <View key={key} style={styles.nutritionRow}>
                          <View style={[styles.nutritionIconBg, { backgroundColor: item.bg }]}>
                            <Ionicons name={item.icon as any} size={16} color={item.color} />
                          </View>
                          <Text style={styles.nutritionLabel}>{item.label}</Text>
                          <Text style={styles.nutritionValue}>
                            {typeof value === 'string' || typeof value === 'number' ? value : '-'} g
                          </Text>
                        </View>
                      );
                    })}
                  </View>

                  <Pressable style={[styles.buttonPrimary, { marginTop: 20 }]} onPress={onConfirm}>
                    <Animated.View style={{ transform: [{ rotate }] }}>
                      <FeedSVG width={28} height={28} />
                    </Animated.View>
                    <Text style={styles.buttonText}>Feed Character</Text>
                  </Pressable>

                  <LottieView
                    ref={confettiRef}
                    source={require('@/assets/lottie/Confetti.json')}
                    autoPlay={false}
                    style={styles.confetti}
                    loop={false}
                  />
                </>
              )}
            </>
          )}

          {/* ── STATE 4: Error ── */}
          {!loading && error && (
            <>
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={40} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
              <Pressable style={[styles.buttonDanger, { marginTop: 16 }]} onPress={onClose}>
                <Ionicons name="close" size={18} color="#fff" />
                <Text style={styles.buttonText}>Close</Text>
              </Pressable>
            </>
          )}

          {/* ── STATE 5: Loading ── */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF821D" />
              <Text style={styles.loadingText}>Detecting food...</Text>
            </View>
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
    borderRadius: 28,
    padding: 22,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 20,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    marginBottom: 18,
  },
  closeIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  closeIconBg: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Title
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },

  // Buttons
  rowButtons: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  sourceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  buttonCancel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
  },
  cancelText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonPrimary: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#8e00a1',
    paddingVertical: 15,
    borderRadius: 14,
  },
  buttonDanger: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 14,
  },

  // Preview
  previewImage: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    marginBottom: 10,
  },
  fileInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  fileType: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Result
  resultCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 18,
    marginTop: 6,
  },
  resultFoodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resultFoodTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  nutritionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 10,
  },
  nutritionIconBg: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nutritionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  // Unknown
  unknownHeader: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  unknownTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#EF4444',
    textAlign: 'center',
  },
  unknownDesc: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 20,
  },

  // Error
  errorContainer: {
    alignItems: 'center',
    gap: 10,
    padding: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },

  // Loading
  loadingContainer: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 15,
    color: '#FF821D',
    fontWeight: '600',
  },

  // Confetti
  confetti: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: -50,
    pointerEvents: 'none',
  },
});
