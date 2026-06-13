import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

interface Props {
  text: string;
  visible: boolean;
  onComplete: () => void;
}

export default function ExpressionBubble({ text, visible, onComplete }: Props) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && text) {
      // Pop in
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();

      // Auto hide after 2.5s
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(scaleAnim, { toValue: 0.8, duration: 200, easing: Easing.in(Easing.ease), useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start(() => {
          scaleAnim.setValue(0);
          onComplete();
        });
      }, 2500);

      return () => clearTimeout(timer);
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [visible, text]);

  if (!visible && opacityAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) as any === 0) {
    return null;
  }

  return (
    <Animated.View style={[
      styles.container,
      {
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }, { translateY: -20 }],
      }
    ]}>
      <View style={styles.bubble}>
        <Text style={styles.text}>{text}</Text>
      </View>
      <View style={styles.tail} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '35%',
    alignSelf: 'center',
    zIndex: 100,
    alignItems: 'center',
  },
  bubble: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    maxWidth: 220,
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 20,
  },
  tail: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#fff',
    marginTop: -1,
  },
});
