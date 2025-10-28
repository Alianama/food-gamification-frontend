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
    { name: 'index', icon: 'home-outline', label: 'Home' },
    { name: 'stats', icon: 'bar-chart-outline', label: 'Stats' },
    { name: 'camera', icon: 'camera-outline', isCenter: true, label: 'Camera' },
    { name: 'log', icon: 'list-outline', label: 'Log' },
    { name: 'profile', icon: 'person-outline', label: 'Profile' },
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
          name={tab.icon as any}
          size={24}
          color={isActive ? themeColors.tint : 'rgba(0,0,0,0.5)'}
        />
        <Text style={[styles.tabLabel, { color: isActive ? themeColors.tint : 'rgba(0,0,0,0.5)' }]}>
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
    borderTopColor: '#eee',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 24,
    marginHorizontal: 4,
  },
  tabLabel: { fontSize: 12, marginTop: 4 },
  centerButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
