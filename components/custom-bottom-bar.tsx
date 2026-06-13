import CameraSVG from '@/assets/icons/camera.svg';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useSegments } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';

interface CustomBottomBarProps {
  onCameraPress: () => void;
}

export default function CustomBottomBar({ onCameraPress }: CustomBottomBarProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

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
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -15,
            duration: 180,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    };
    const interval = setInterval(animate, 5000);
    return () => clearInterval(interval);
  }, []);

  const segments = useSegments();
  const activeRoute = (() => {
    const last = segments[segments.length - 1];
    if (!last || last === '(tabs)') return 'index';
    return last;
  })();

  const tabs = [
    { name: 'index', iconDefault: 'home-outline', iconActive: 'home', label: 'Home' },
    { name: 'stats', iconDefault: 'bar-chart-outline', iconActive: 'bar-chart', label: 'Stats' },
    { name: 'camera', iconDefault: 'camera-outline', iconActive: 'camera', isCenter: true, label: 'Scan' },
    { name: 'explore', iconDefault: 'trophy-outline', iconActive: 'trophy', label: 'Awards' },
    { name: 'profile', iconDefault: 'person-outline', iconActive: 'person', label: 'Profile' },
  ];

  const onPressTab = (route: string) => {
    if (route === 'camera') {
      onCameraPress();
      return;
    }
    if (route === 'index') router.push('/');
    else router.push(`/(tabs)/${route}` as any);
  };

  const renderTab = (tab: (typeof tabs)[0]) => {
    const isActive = activeRoute === tab.name;

    if (tab.isCenter) {
      const rotate = shakeAnim.interpolate({ inputRange: [-1, 1], outputRange: ['-6deg', '6deg'] });
      return (
        <Pressable
          key={tab.name}
          onPress={() => onPressTab(tab.name)}
          style={[styles.centerButton, { backgroundColor: themeColors.tint }]}
        >
          <Animated.View style={{ transform: [{ rotate }, { translateY: bounceAnim }] }}>
            <CameraSVG width={65} height={65} fill="#fff" />
          </Animated.View>
        </Pressable>
      );
    }

    return (
      <Pressable
        key={tab.name}
        style={[styles.tab, isActive && { backgroundColor: themeColors.tint + '20' }]}
        onPress={() => onPressTab(tab.name)}
      >
        <Ionicons
          name={(isActive ? tab.iconActive : tab.iconDefault) as any}
          size={22}
          color={isActive ? themeColors.tint : 'rgba(0,0,0,0.4)'}
        />
        <Text style={[styles.tabLabel, { color: isActive ? themeColors.tint : 'rgba(0,0,0,0.4)' }]}>
          {tab.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.bar}>{tabs.map(tab => renderTab(tab))}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  bar: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 24,
    marginHorizontal: 2,
  },
  tabLabel: { fontSize: 10, marginTop: 3, fontWeight: '600' },
  centerButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
});
