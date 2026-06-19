import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface Props {
  tips: string[];
}

export default function HealthTips({ tips }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!tips || tips.length === 0) return;

    let isMounted = true;
    fadeAnim.setValue(0);

    const runAnimation = () => {
      if (!isMounted) return;

      // 1. Fade in (0.5s)
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // 2. Wait 4.5s (Total visible: 5s) then Fade out
      setTimeout(() => {
        if (!isMounted) return;
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          if (!isMounted) return;
          // 3. Ganti text saat menghilang
          setCurrentIndex((prev) => (prev + 1) % tips.length);
          
          // 4. Tunggu 19.5s (Total hidden: 20s) lalu loop lagi
          setTimeout(() => {
            if (isMounted) runAnimation();
          }, 19500);
        });
      }, 4500);
    };

    runAnimation();

    return () => {
      isMounted = false;
      fadeAnim.stopAnimation();
    };
  }, [tips, fadeAnim]);

  if (!tips || tips.length === 0) return null;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.tipBox, { opacity: fadeAnim }]}>
        <View style={styles.iconContainer}>
          <Ionicons name="bulb-outline" size={18} color="#FF821D" />
        </View>
        <Text style={styles.tipText}>{tips[currentIndex]}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 110, // Adjusted to avoid overlapping with Tab Bar and Character
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 10,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    maxWidth: '90%',
  },
  iconContainer: {
    marginRight: 10,
    backgroundColor: 'rgba(255, 130, 29, 0.15)',
    padding: 6,
    borderRadius: 12,
  },
  tipText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
    flexShrink: 1,
  },
});
