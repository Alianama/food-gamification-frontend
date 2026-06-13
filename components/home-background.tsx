import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import { ThemeDef } from '@/store/theme/slice';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  theme: ThemeDef;
  isHealthy: boolean;
  healthPercent: number;
}

const { width, height } = Dimensions.get('window');

// Cloud component
function Cloud({ anim, y, size, opacity }: { anim: Animated.Value; y: number; size: number; opacity: number }) {
  return (
    <Animated.View style={{
      position: 'absolute',
      top: y,
      transform: [{ translateX: anim }],
      opacity,
    }}>
      <View style={{ width: size, height: size * 0.4, backgroundColor: '#fff', borderRadius: size * 0.2 }} />
      <View style={{ position: 'absolute', top: -size * 0.15, left: size * 0.15, width: size * 0.4, height: size * 0.4, backgroundColor: '#fff', borderRadius: size * 0.2 }} />
      <View style={{ position: 'absolute', top: -size * 0.25, left: size * 0.4, width: size * 0.45, height: size * 0.45, backgroundColor: '#fff', borderRadius: size * 0.25 }} />
    </Animated.View>
  );
}

export default function HomeBackground({ theme, isHealthy, healthPercent }: Props) {
  const [particles] = useState(() => Array.from({ length: 12 }).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: 4 + Math.random() * 8,
    speed: 3000 + Math.random() * 4000,
    anim: new Animated.Value(0),
  })));

  const cloud1 = useRef(new Animated.Value(-100)).current;
  const cloud2 = useRef(new Animated.Value(width)).current;
  const colorAnim = useRef(new Animated.Value(isHealthy ? 0 : 1)).current;

  // Background color interpolation based on health
  useEffect(() => {
    Animated.timing(colorAnim, {
      toValue: healthPercent < 30 ? 1 : healthPercent < 70 ? 0.5 : 0,
      duration: 1000,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [healthPercent, theme.id]);

  useEffect(() => {
    // Floating particles
    const particleLoops = particles.map(p => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(p.anim, { toValue: 1, duration: p.speed, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(p.anim, { toValue: 0, duration: p.speed, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      );
    });
    particleLoops.forEach(l => l.start());

    // Clouds
    const c1Speed = 25000;
    const c2Speed = 35000;
    const loopC1 = Animated.loop(
      Animated.sequence([
        Animated.timing(cloud1, { toValue: width + 100, duration: c1Speed, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(cloud1, { toValue: -150, duration: 0, useNativeDriver: true }),
      ])
    );
    const loopC2 = Animated.loop(
      Animated.sequence([
        Animated.timing(cloud2, { toValue: -150, duration: c2Speed, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(cloud2, { toValue: width + 100, duration: 0, useNativeDriver: true }),
      ])
    );
    loopC1.start();
    loopC2.start();

    return () => {
      particleLoops.forEach(l => l.stop());
      loopC1.stop();
      loopC2.stop();
    };
  }, []);

  const bgTop = colorAnim.interpolate({ inputRange: [0, 1], outputRange: [theme.sky[0], theme.sickModifier[0]] });
  const bgMid = colorAnim.interpolate({ inputRange: [0, 1], outputRange: [theme.sky[1], theme.sickModifier[1]] });
  const bgBot = colorAnim.interpolate({ inputRange: [0, 1], outputRange: [theme.sky[2], theme.sickModifier[2]] });

  return (
    <View style={styles.container}>
      {/* Dynamic Animated Gradient Background */}
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: bgMid }]}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.2)']}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: bgTop, opacity: colorAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]} />
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: bgBot, opacity: 0.4, top: '50%' }]} />
      </Animated.View>

      {/* Clouds */}
      {theme.id !== 'night' && (
        <>
          <Cloud anim={cloud1} y={height * 0.15} size={120} opacity={0.6} />
          <Cloud anim={cloud2} y={height * 0.3} size={80} opacity={0.4} />
        </>
      )}

      {/* Stars if night */}
      {theme.id === 'night' && particles.map((p, i) => (
        <Animated.View key={`star${i}`} style={{
          position: 'absolute', left: p.x, top: p.y % (height * 0.5),
          width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#fff',
          opacity: p.anim.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] })
        }} />
      ))}

      {/* Particles */}
      {particles.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: theme.particle,
              transform: [
                { translateY: p.anim.interpolate({ inputRange: [0, 1], outputRange: [-20, 20] }) },
                { scale: p.anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.2] }) },
              ],
              opacity: p.anim.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.6] }),
            }
          ]}
        />
      ))}

      {/* Ground Platform */}
      <View style={styles.groundContainer}>
        <Animated.View style={[
          styles.groundPlatform,
          { backgroundColor: colorAnim.interpolate({ inputRange: [0, 1], outputRange: [theme.ground, '#424242'] }) }
        ]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 0,
  },
  particle: {
    position: 'absolute',
  },
  groundContainer: {
    position: 'absolute',
    bottom: -height * 0.1,
    left: -width * 0.2,
    right: -width * 0.2,
    height: height * 0.3,
    alignItems: 'center',
  },
  groundPlatform: {
    width: width * 1.4,
    height: width * 1.4,
    borderRadius: width * 0.7,
    transform: [{ scaleY: 0.3 }],
    opacity: 0.9,
  },
});
