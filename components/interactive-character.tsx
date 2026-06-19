import React, { useRef, useState } from 'react';
import { Animated, Easing, PanResponder, Pressable, StyleSheet, View } from 'react-native';
import { CharacterDef } from '@/store/theme/slice';
import ExpressionBubble from './expression-bubble';
import { BunnyCharacterBody, CatCharacterBody, DogCharacterBody, DragonCharacterBody, FishCharacterBody, OrangeCharacterBody } from './character-bodies';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Props {
  def: CharacterDef;
  isHealthy: boolean;
}

export default function InteractiveCharacter({ def, isHealthy }: Props) {
  const [bubbleText, setBubbleText] = useState('');
  const [bubbleVisible, setBubbleVisible] = useState(false);

  // Anim values
  const squishAnim = useRef(new Animated.Value(0)).current;
  const wiggleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Track double tap
  const lastTapRef = useRef<number>(0);

  const showReaction = (type: 'tap' | 'longPress' | 'doubleTap' | 'hungry' | 'happy' | 'sick') => {
    let list: string[] = [];
    if (type === 'tap') list = def.tapReactions;
    else if (type === 'longPress') list = def.longPressReactions;
    else if (type === 'doubleTap') list = def.doubleTapReactions;
    else if (type === 'hungry') list = def.hungryReactions;
    else if (type === 'happy') list = def.happyReactions;
    else if (type === 'sick') list = def.sickReactions;

    if (list.length > 0) {
      const text = list[Math.floor(Math.random() * list.length)];
      setBubbleText(text);
      setBubbleVisible(true);
    }
  };

  const handlePressIn = () => {
    Animated.spring(squishAnim, { toValue: 1, friction: 3, tension: 100, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(squishAnim, { toValue: 0, friction: 3, tension: 40, useNativeDriver: true }).start();
  };

  const handlePress = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double tap
      handleDoubleTap();
      lastTapRef.current = 0;
    } else {
      // Single tap
      Animated.sequence([
        Animated.timing(wiggleAnim, { toValue: 1, duration: 50, useNativeDriver: true }),
        Animated.timing(wiggleAnim, { toValue: -1, duration: 50, useNativeDriver: true }),
        Animated.timing(wiggleAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
      showReaction('tap');
      lastTapRef.current = now;
    }
  };

  const handleDoubleTap = () => {
    // Jump up
    Animated.sequence([
      Animated.spring(bounceAnim, { toValue: -60, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.spring(bounceAnim, { toValue: 0, friction: 5, tension: 80, useNativeDriver: true }),
    ]).start();
    showReaction('doubleTap');
  };

  const handleLongPress = () => {
    // Gentle pulse
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.1, duration: 500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]).start();
    showReaction('longPress');
  };

  // Pan Responder for Drag/Swipe
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        handlePressIn();
      },
      onPanResponderMove: Animated.event([null, { dx: wiggleAnim }], { useNativeDriver: false }),
      onPanResponderRelease: (e, gestureState) => {
        handlePressOut();
        Animated.spring(wiggleAnim, { toValue: 0, friction: 4, useNativeDriver: true }).start();
        
        // Detect swipe up
        if (gestureState.dy < -50) {
          handleDoubleTap(); // treat swipe up like double tap jump
        } else if (Math.abs(gestureState.dx) < 10 && Math.abs(gestureState.dy) < 10) {
          // If barely moved, treat as tap/long press depending on time
          // We let standard press handlers deal with it
        }
      },
    })
  ).current;

  // Select body component
  const BodyComp = {
    orange: OrangeCharacterBody,
    cat: CatCharacterBody,
    dog: DogCharacterBody,
    fish: FishCharacterBody,
    dragon: DragonCharacterBody,
    bunny: BunnyCharacterBody,
  }[def.id] || OrangeCharacterBody;

  return (
    <View style={styles.container}>
      <ExpressionBubble
        text={bubbleText}
        visible={bubbleVisible}
        onComplete={() => setBubbleVisible(false)}
      />

      <Pressable
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={500}
        style={[
          styles.touchArea, 
          !isHealthy && { transform: [{ scale: 1.25 }] }
        ]}
        {...panResponder.panHandlers}
      >
        {!isHealthy && (
          <Animated.View style={{ position: 'absolute', top: 0, right: 20, zIndex: 10, transform: [{ rotate: '15deg' }] }}>
            <Ionicons name="bandage" size={40} color="#FCA5A5" />
          </Animated.View>
        )}
        {!isHealthy && (
          <Animated.View style={{ position: 'absolute', top: -10, left: 10, zIndex: 10 }}>
            <Ionicons name="thermometer" size={40} color="#93C5FD" />
          </Animated.View>
        )}

        <BodyComp
          def={def}
          isHealthy={isHealthy}
          squishAnim={squishAnim}
          wiggleAnim={wiggleAnim}
          bounceAnim={bounceAnim}
          scaleAnim={scaleAnim}
          size={180}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 400,
    position: 'absolute',
    bottom: '10%',
  },
  touchArea: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
