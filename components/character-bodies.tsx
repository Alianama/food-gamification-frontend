import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { CharacterDef } from '@/store/theme/slice';

interface Props {
  def: CharacterDef;
  isHealthy: boolean;
  squishAnim: Animated.Value;
  wiggleAnim: Animated.Value;
  bounceAnim: Animated.Value;
  scaleAnim: Animated.Value;
  size?: number;
}

// ─── Reusable animated shape primitives ──────────────────────────────────────

function Circle({ size, color, style }: { size: number; color: string; style?: any }) {
  return <View style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }, style]} />;
}

function Oval({ w, h, color, style }: { w: number; h: number; color: string; style?: any }) {
  return <View style={[{ width: w, height: h, borderRadius: w / 2, backgroundColor: color }, style]} />;
}

// ─── Orange Character ─────────────────────────────────────────────────────────
// More dynamic version built with SVG shapes to complement the Lottie
export function OrangeCharacterBody({ def, isHealthy, squishAnim, wiggleAnim, bounceAnim, scaleAnim, size = 160 }: Props) {
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const cheekAnim = useRef(new Animated.Value(0)).current;

  // Auto blink
  useEffect(() => {
    const blink = () => {
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.05, duration: 80, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
      ]).start();
    };
    const interval = setInterval(blink, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  const s = size;
  const bodyColor = isHealthy ? def.color : '#D4A373';
  const leafColor = isHealthy ? '#4CAF50' : '#9E9E9E';

  return (
    <Animated.View style={[
      styles.characterRoot,
      {
        width: s, height: s * 1.1,
        transform: [
          { scaleX: squishAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] }) },
          { scaleY: squishAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.75] }) },
          { translateX: wiggleAnim.interpolate({ inputRange: [-1, 1], outputRange: [-10, 10] }) },
          { translateY: bounceAnim },
          { scale: scaleAnim },
        ],
      }
    ]}>
      {/* Leaf on top */}
      <View style={[styles.absCenter, { top: 0 }]}>
        <View style={{ flexDirection: 'row', gap: 2, justifyContent: 'center' }}>
          <View style={{ width: 8, height: 22, backgroundColor: leafColor, borderRadius: 4, transform: [{ rotate: '-20deg' }] }} />
          <View style={{ width: 6, height: 18, backgroundColor: leafColor, borderRadius: 3, transform: [{ rotate: '20deg' }] }} />
        </View>
      </View>

      {/* Body */}
      <Oval w={s * 0.85} h={s * 0.82} color={bodyColor} style={{ marginTop: 16, alignSelf: 'center' }} />

      {/* Face */}
      <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', marginTop: 20 }]}>
        {/* Eyes */}
        <View style={{ flexDirection: 'row', gap: s * 0.18, marginBottom: 6 }}>
          {/* Left eye */}
          <View style={{ alignItems: 'center' }}>
            <Animated.View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#1A1A1A', transform: [{ scaleY: blinkAnim }] }} />
            {/* shine */}
            <View style={{ position: 'absolute', top: 2, right: 2, width: 4, height: 4, borderRadius: 2, backgroundColor: '#fff' }} />
          </View>
          {/* Right eye */}
          <View style={{ alignItems: 'center' }}>
            <Animated.View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#1A1A1A', transform: [{ scaleY: blinkAnim }] }} />
            <View style={{ position: 'absolute', top: 2, right: 2, width: 4, height: 4, borderRadius: 2, backgroundColor: '#fff' }} />
          </View>
        </View>

        {/* Smile */}
        <View style={{
          width: 28, height: 14,
          borderBottomWidth: 3, borderLeftWidth: 2, borderRightWidth: 2,
          borderColor: '#1A1A1A', borderBottomLeftRadius: 14, borderBottomRightRadius: 14,
          opacity: isHealthy ? 1 : 0.4,
        }} />

        {/* Sad mouth when unhealthy */}
        {!isHealthy && (
          <View style={{
            width: 24, height: 12,
            borderTopWidth: 3, borderLeftWidth: 2, borderRightWidth: 2,
            borderColor: '#1A1A1A', borderTopLeftRadius: 12, borderTopRightRadius: 12,
            marginTop: 4,
          }} />
        )}

        {/* Cheeks */}
        <View style={{ flexDirection: 'row', gap: s * 0.3, marginTop: 4 }}>
          <Oval w={16} h={10} color="rgba(255,100,100,0.35)" />
          <Oval w={16} h={10} color="rgba(255,100,100,0.35)" />
        </View>
      </View>

      {/* Shadow */}
      <Oval w={s * 0.5} h={12} color="rgba(0,0,0,0.1)" style={{ alignSelf: 'center', marginTop: 4 }} />
    </Animated.View>
  );
}

// ─── Cat Character ─────────────────────────────────────────────────────────────
export function CatCharacterBody({ def, isHealthy, squishAnim, wiggleAnim, bounceAnim, scaleAnim, size = 160 }: Props) {
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const earAnim = useRef(new Animated.Value(0)).current;
  const tailAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Blink randomly
    const blinkTimer = setInterval(() => {
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.05, duration: 80, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
      ]).start();
    }, 2500 + Math.random() * 1500);

    // Tail curl
    const tailLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(tailAnim, { toValue: 1, duration: isHealthy ? 1500 : 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(tailAnim, { toValue: -1, duration: isHealthy ? 1500 : 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    tailLoop.start();

    // Ear occasional twitch
    const earTimer = setInterval(() => {
      if (isHealthy) {
        Animated.sequence([
          Animated.timing(earAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
          Animated.timing(earAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
          Animated.timing(earAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
          Animated.timing(earAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start();
      }
    }, 4000);

    return () => {
      clearInterval(blinkTimer);
      clearInterval(earTimer);
      tailLoop.stop();
    };
  }, [isHealthy]);

  const s = size;
  const bodyColor = isHealthy ? def.color : '#BCAAA4';
  const accentColor = isHealthy ? def.accentColor : '#D7CCC8';

  return (
    <Animated.View style={[
      styles.characterRoot,
      {
        width: s, height: s * 1.2,
        transform: [
          { scaleX: squishAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) },
          { scaleY: squishAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.8] }) },
          { translateX: wiggleAnim.interpolate({ inputRange: [-1, 1], outputRange: [-8, 8] }) },
          { translateY: bounceAnim },
          { scale: scaleAnim },
        ],
      }
    ]}>
      {/* Ears */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: s * 0.1, marginBottom: -10 }}>
        <Animated.View style={{ transform: [{ rotate: earAnim.interpolate({ inputRange: [0, 1], outputRange: ['-5deg', '-15deg'] }) }] }}>
          <View style={[styles.catEar, { borderBottomColor: bodyColor }]} />
          <View style={[styles.catEarInner, { borderBottomColor: '#FFCDD2' }]} />
        </Animated.View>
        <Animated.View style={{ transform: [{ rotate: earAnim.interpolate({ inputRange: [0, 1], outputRange: ['5deg', '15deg'] }) }] }}>
          <View style={[styles.catEar, { borderBottomColor: bodyColor }]} />
          <View style={[styles.catEarInner, { borderBottomColor: '#FFCDD2' }]} />
        </Animated.View>
      </View>

      {/* Body/Head */}
      <Oval w={s * 0.82} h={s * 0.78} color={bodyColor} style={{ alignSelf: 'center' }} />

      {/* Belly patch */}
      <View style={[StyleSheet.absoluteFill, { justifyContent: 'flex-end', alignItems: 'center', paddingBottom: s * 0.14 }]}>
        <Oval w={s * 0.38} h={s * 0.28} color={accentColor} />
      </View>

      {/* Face */}
      <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', marginTop: 10 }]}>
        {/* Eyes - cat slit pupils */}
        <View style={{ flexDirection: 'row', gap: s * 0.2, marginBottom: 8 }}>
          <View style={{ alignItems: 'center', justifyContent: 'center', width: 18, height: 14, borderRadius: 9, backgroundColor: def.eyeColor }}>
            <Animated.View style={{ width: 4, height: 11, borderRadius: 2, backgroundColor: '#111', transform: [{ scaleX: blinkAnim }] }} />
            <View style={{ position: 'absolute', top: 2, left: 5, width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(255,255,255,0.6)' }} />
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', width: 18, height: 14, borderRadius: 9, backgroundColor: def.eyeColor }}>
            <Animated.View style={{ width: 4, height: 11, borderRadius: 2, backgroundColor: '#111', transform: [{ scaleX: blinkAnim }] }} />
            <View style={{ position: 'absolute', top: 2, left: 5, width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(255,255,255,0.6)' }} />
          </View>
        </View>

        {/* Nose */}
        <View style={{ width: 0, height: 0, borderLeftWidth: 5, borderRightWidth: 5, borderBottomWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#E91E63', marginBottom: 2 }} />

        {/* Mouth */}
        <View style={{ flexDirection: 'row', gap: 0 }}>
          <View style={{ width: 8, height: 6, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: '#555', borderBottomLeftRadius: 4, marginRight: 2 }} />
          <View style={{ width: 8, height: 6, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#555', borderBottomRightRadius: 4 }} />
        </View>

        {/* Whiskers */}
        {[{ top: -2, left: -s * 0.42 }, { top: 4, left: -s * 0.42 }, { top: 10, left: -s * 0.42 }].map((w, i) => (
          <View key={`wl${i}`} style={{ position: 'absolute', top: w.top, left: w.left, width: s * 0.3, height: 1.5, backgroundColor: '#9E9E9E', borderRadius: 1 }} />
        ))}
        {[{ top: -2, right: -s * 0.42 }, { top: 4, right: -s * 0.42 }, { top: 10, right: -s * 0.42 }].map((w, i) => (
          <View key={`wr${i}`} style={{ position: 'absolute', top: w.top, right: w.left as any || w.right, width: s * 0.3, height: 1.5, backgroundColor: '#9E9E9E', borderRadius: 1 }} />
        ))}
      </View>

      {/* Tail */}
      <Animated.View style={{
        position: 'absolute', bottom: 10, right: -s * 0.15,
        width: s * 0.15, height: s * 0.55,
        borderRadius: s * 0.1, backgroundColor: bodyColor,
        transformOrigin: 'bottom center',
        transform: [{ rotate: tailAnim.interpolate({ inputRange: [-1, 1], outputRange: ['-30deg', '30deg'] }) }],
      }} />

      {/* Shadow */}
      <Oval w={s * 0.45} h={10} color="rgba(0,0,0,0.1)" style={{ alignSelf: 'center', marginTop: 4 }} />
    </Animated.View>
  );
}

// ─── Dog Character ─────────────────────────────────────────────────────────────
export function DogCharacterBody({ def, isHealthy, squishAnim, wiggleAnim, bounceAnim, scaleAnim, size = 160 }: Props) {
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const tailAnim = useRef(new Animated.Value(0)).current;
  const tongueAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const blinkTimer = setInterval(() => {
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.1, duration: 70, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 70, useNativeDriver: true }),
      ]).start();
    }, 2800);

    // Happy tail wag (fast) vs slow wag
    const tailSpeed = isHealthy ? 200 : 800;
    const tailLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(tailAnim, { toValue: 1, duration: tailSpeed, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(tailAnim, { toValue: -1, duration: tailSpeed, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    tailLoop.start();

    // Tongue pant (only when healthy)
    if (isHealthy) {
      const tongueLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(tongueAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(tongueAnim, { toValue: 0.7, duration: 400, useNativeDriver: true }),
        ])
      );
      tongueLoop.start();
    }

    return () => {
      clearInterval(blinkTimer);
      tailLoop.stop();
    };
  }, [isHealthy]);

  const s = size;
  const bodyColor = isHealthy ? def.color : '#A1887F';
  const earColor = isHealthy ? '#6D4C41' : '#8D6E63';

  return (
    <Animated.View style={[
      styles.characterRoot,
      {
        width: s, height: s * 1.15,
        transform: [
          { scaleX: squishAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.22] }) },
          { scaleY: squishAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.78] }) },
          { translateX: wiggleAnim.interpolate({ inputRange: [-1, 1], outputRange: [-10, 10] }) },
          { translateY: bounceAnim },
          { scale: scaleAnim },
        ],
      }
    ]}>
      {/* Floppy ears */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: s * 0.06, position: 'absolute', top: 10, width: '100%' }}>
        <Animated.View style={{
          width: s * 0.22, height: s * 0.42, backgroundColor: earColor,
          borderRadius: s * 0.1, borderBottomLeftRadius: s * 0.2,
          transform: [{ rotate: isHealthy ? '-10deg' : '-5deg' }],
          zIndex: 0,
        }} />
        <Animated.View style={{
          width: s * 0.22, height: s * 0.42, backgroundColor: earColor,
          borderRadius: s * 0.1, borderBottomRightRadius: s * 0.2,
          transform: [{ rotate: isHealthy ? '10deg' : '5deg' }],
          zIndex: 0,
        }} />
      </View>

      {/* Body */}
      <Oval w={s * 0.82} h={s * 0.78} color={bodyColor} style={{ alignSelf: 'center', marginTop: 20, zIndex: 1 }} />

      {/* Snout */}
      <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', marginTop: s * 0.28, zIndex: 2 }]}>
        <Oval w={s * 0.38} h={s * 0.26} color={def.accentColor} style={{ marginBottom: -4 }} />

        {/* Nose */}
        <Oval w={16} h={11} color="#4E342E" style={{ marginBottom: 2 }} />
      </View>

      {/* Face */}
      <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', marginTop: -10, zIndex: 3 }]}>
        {/* Eyes */}
        <View style={{ flexDirection: 'row', gap: s * 0.22, marginBottom: s * 0.18 }}>
          {[0, 1].map(i => (
            <View key={i} style={{ alignItems: 'center' }}>
              <Animated.View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#3E2723', transform: [{ scaleY: blinkAnim }] }} />
              <View style={{ position: 'absolute', top: 2, left: 3, width: 5, height: 5, borderRadius: 2.5, backgroundColor: 'rgba(255,255,255,0.65)' }} />
            </View>
          ))}
        </View>

        {/* Tongue */}
        {isHealthy && (
          <Animated.View style={{
            position: 'absolute', bottom: s * 0.12,
            width: 18, height: 22, backgroundColor: '#EF9A9A',
            borderBottomLeftRadius: 10, borderBottomRightRadius: 10,
            borderTopLeftRadius: 4, borderTopRightRadius: 4,
            transform: [{ translateY: tongueAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 4] }) }],
          }}>
            {/* Tongue center line */}
            <View style={{ position: 'absolute', top: 4, left: '50%', width: 2, height: 14, backgroundColor: '#E57373', borderRadius: 1 }} />
          </Animated.View>
        )}
      </View>

      {/* Tail */}
      <Animated.View style={{
        position: 'absolute', bottom: 16, right: -s * 0.12,
        width: s * 0.12, height: s * 0.42, backgroundColor: bodyColor,
        borderRadius: s * 0.08,
        transform: [{ rotate: tailAnim.interpolate({ inputRange: [-1, 1], outputRange: ['-45deg', '10deg'] }) }],
      }} />

      <Oval w={s * 0.45} h={10} color="rgba(0,0,0,0.1)" style={{ alignSelf: 'center', marginTop: 4 }} />
    </Animated.View>
  );
}

// ─── Fish Character ───────────────────────────────────────────────────────────
export function FishCharacterBody({ def, isHealthy, squishAnim, wiggleAnim, bounceAnim, scaleAnim, size = 160 }: Props) {
  const swimAnim = useRef(new Animated.Value(0)).current;
  const tailAnim = useRef(new Animated.Value(0)).current;
  const bubbleAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const swimSpeed = isHealthy ? 2000 : 5000;
    const swimLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(swimAnim, { toValue: 1, duration: swimSpeed, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(swimAnim, { toValue: -1, duration: swimSpeed, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    swimLoop.start();

    const tailLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(tailAnim, { toValue: 1, duration: swimSpeed / 2, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(tailAnim, { toValue: -1, duration: swimSpeed / 2, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    tailLoop.start();

    const blinkTimer = setInterval(() => {
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.05, duration: 60, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
      ]).start();
    }, 3000);

    return () => {
      swimLoop.stop();
      tailLoop.stop();
      clearInterval(blinkTimer);
    };
  }, [isHealthy]);

  const s = size;
  const bodyColor = isHealthy ? def.color : '#90CAF9';
  const finColor = isHealthy ? '#0288D1' : '#B0BEC5';

  return (
    <Animated.View style={[
      styles.characterRoot,
      {
        width: s * 1.3, height: s * 0.85,
        transform: [
          { scaleX: squishAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.85] }) },
          { scaleY: squishAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) },
          { rotate: swimAnim.interpolate({ inputRange: [-1, 1], outputRange: ['-8deg', '8deg'] }) },
          { translateY: bounceAnim },
          { scale: scaleAnim },
        ],
      }
    ]}>
      {/* Tail fin */}
      <Animated.View style={{
        position: 'absolute', left: 0, top: s * 0.12,
        width: 0, height: 0,
        borderTopWidth: s * 0.28, borderTopColor: 'transparent',
        borderBottomWidth: s * 0.28, borderBottomColor: 'transparent',
        borderRightWidth: s * 0.28, borderRightColor: finColor,
        transform: [{ rotate: tailAnim.interpolate({ inputRange: [-1, 1], outputRange: ['-20deg', '20deg'] }) }],
      }} />

      {/* Body */}
      <Oval w={s} h={s * 0.68} color={bodyColor} style={{ position: 'absolute', right: 0, top: s * 0.08 }} />

      {/* Belly */}
      <Oval w={s * 0.55} h={s * 0.34} color="rgba(255,255,255,0.35)" style={{ position: 'absolute', right: s * 0.08, top: s * 0.26 }} />

      {/* Top fin */}
      <View style={{
        position: 'absolute', right: s * 0.3, top: 0,
        width: 0, height: 0,
        borderLeftWidth: 16, borderLeftColor: 'transparent',
        borderRightWidth: 16, borderRightColor: 'transparent',
        borderBottomWidth: 28, borderBottomColor: finColor,
      }} />

      {/* Eye */}
      <View style={{ position: 'absolute', right: s * 0.16, top: s * 0.18, alignItems: 'center' }}>
        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: def.eyeColor, transform: [{ scaleY: blinkAnim }] }} />
          <View style={{ position: 'absolute', top: 3, right: 3, width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' }} />
        </View>
      </View>

      {/* Mouth / lips */}
      <View style={{ position: 'absolute', right: s * 0.06, top: s * 0.4, width: 18, height: 10, borderRadius: 6, borderWidth: 2, borderColor: '#0277BD' }} />

      {/* Scales pattern */}
      {[
        { r: s * 0.42, t: s * 0.1 }, { r: s * 0.3, t: s * 0.1 },
        { r: s * 0.42, t: s * 0.3 }, { r: s * 0.3, t: s * 0.3 },
      ].map((sc, i) => (
        <View key={i} style={{ position: 'absolute', right: sc.r, top: sc.t, width: 16, height: 10, borderRadius: 8, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)' }} />
      ))}
    </Animated.View>
  );
}

// ─── Dragon Character ──────────────────────────────────────────────────────────
export function DragonCharacterBody({ def, isHealthy, squishAnim, wiggleAnim, bounceAnim, scaleAnim, size = 160 }: Props) {
  const wingAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const fireAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const wingSpeed = isHealthy ? 800 : 2500;
    const wingLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(wingAnim, { toValue: 1, duration: wingSpeed, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(wingAnim, { toValue: 0, duration: wingSpeed, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    wingLoop.start();

    const blinkTimer = setInterval(() => {
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.05, duration: 80, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
      ]).start();
    }, 3500);

    // Occasional fire puff
    if (isHealthy) {
      const fireTimer = setInterval(() => {
        Animated.sequence([
          Animated.timing(fireAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(fireAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]).start();
      }, 5000);
      return () => { wingLoop.stop(); clearInterval(blinkTimer); clearInterval(fireTimer); };
    }
    return () => { wingLoop.stop(); clearInterval(blinkTimer); };
  }, [isHealthy]);

  const s = size;
  const bodyColor = isHealthy ? def.color : '#A5D6A7';
  const wingColor = isHealthy ? '#EF9A9A' : '#B0BEC5';

  return (
    <Animated.View style={[
      styles.characterRoot,
      {
        width: s, height: s * 1.2,
        transform: [
          { scaleX: squishAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) },
          { scaleY: squishAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.8] }) },
          { translateX: wiggleAnim.interpolate({ inputRange: [-1, 1], outputRange: [-10, 10] }) },
          { translateY: bounceAnim },
          { scale: scaleAnim },
        ],
      }
    ]}>
      {/* Wings */}
      <Animated.View style={{
        position: 'absolute', top: s * 0.15, left: -s * 0.22,
        width: s * 0.35, height: s * 0.4,
        backgroundColor: wingColor, borderRadius: s * 0.15,
        borderTopRightRadius: 0,
        transform: [{ rotate: wingAnim.interpolate({ inputRange: [0, 1], outputRange: ['-25deg', '-5deg'] }) }],
      }} />
      <Animated.View style={{
        position: 'absolute', top: s * 0.15, right: -s * 0.22,
        width: s * 0.35, height: s * 0.4,
        backgroundColor: wingColor, borderRadius: s * 0.15,
        borderTopLeftRadius: 0,
        transform: [{ rotate: wingAnim.interpolate({ inputRange: [0, 1], outputRange: ['25deg', '5deg'] }) }],
      }} />

      {/* Body */}
      <Oval w={s * 0.78} h={s * 0.82} color={bodyColor} style={{ alignSelf: 'center', marginTop: 18 }} />

      {/* Belly scales */}
      <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', marginTop: s * 0.2 }]}>
        {[0, 1, 2].map(i => (
          <Oval key={i} w={s * (0.32 - i * 0.04)} h={14} color="rgba(255,255,255,0.25)" style={{ marginBottom: 4 }} />
        ))}
      </View>

      {/* Horns */}
      <View style={{ position: 'absolute', top: 4, left: '50%', marginLeft: -20, flexDirection: 'row', gap: 16 }}>
        <View style={{ width: 0, height: 0, borderLeftWidth: 5, borderRightWidth: 5, borderBottomWidth: 20, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#BF360C', transform: [{ rotate: '-10deg' }] }} />
        <View style={{ width: 0, height: 0, borderLeftWidth: 5, borderRightWidth: 5, borderBottomWidth: 20, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#BF360C', transform: [{ rotate: '10deg' }] }} />
      </View>

      {/* Face */}
      <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', marginTop: 8 }]}>
        <View style={{ flexDirection: 'row', gap: s * 0.2, marginBottom: 8 }}>
          {[0, 1].map(i => (
            <View key={i} style={{ alignItems: 'center' }}>
              <Animated.View style={{ width: 15, height: 15, borderRadius: 7.5, backgroundColor: def.eyeColor, transform: [{ scaleY: blinkAnim }] }} />
              <View style={{ position: 'absolute', top: 2, right: 2, width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.7)' }} />
            </View>
          ))}
        </View>

        {/* Nostril */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 4 }}>
          <View style={{ width: 6, height: 4, borderRadius: 3, backgroundColor: '#2E7D32' }} />
          <View style={{ width: 6, height: 4, borderRadius: 3, backgroundColor: '#2E7D32' }} />
        </View>

        {/* Fire breath */}
        <Animated.View style={{
          flexDirection: 'row', gap: 3,
          opacity: fireAnim,
          transform: [{ scale: fireAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }],
        }}>
          {['#FF5722', '#FF9800', '#FFEB3B'].map((c, i) => (
            <View key={i} style={{ width: 8 + i * 4, height: 14 - i * 2, borderRadius: 6, backgroundColor: c }} />
          ))}
        </Animated.View>
      </View>

      {/* Tail */}
      <View style={{ position: 'absolute', bottom: 8, right: -s * 0.1, width: s * 0.18, height: s * 0.45, backgroundColor: bodyColor, borderRadius: s * 0.06, transform: [{ rotate: '25deg' }] }}>
        <View style={{ position: 'absolute', bottom: 0, left: '50%', marginLeft: -8, width: 0, height: 0, borderLeftWidth: 8, borderRightWidth: 8, borderTopWidth: 14, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#BF360C' }} />
      </View>

      <Oval w={s * 0.45} h={10} color="rgba(0,0,0,0.1)" style={{ alignSelf: 'center', marginTop: 4 }} />
    </Animated.View>
  );
}

// ─── Bunny Character ──────────────────────────────────────────────────────────
export function BunnyCharacterBody({ def, isHealthy, squishAnim, wiggleAnim, bounceAnim, scaleAnim, size = 160 }: Props) {
  const earLAnim = useRef(new Animated.Value(0)).current;
  const earRAnim = useRef(new Animated.Value(0)).current;
  const noseAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Ears wiggle
    const earLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(earLAnim, { toValue: 1, duration: isHealthy ? 1200 : 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(earLAnim, { toValue: -0.5, duration: isHealthy ? 1200 : 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    earLoop.start();
    const earRLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(earRAnim, { toValue: 1, duration: isHealthy ? 1200 : 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(earRAnim, { toValue: -0.5, duration: isHealthy ? 1200 : 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    earRLoop.start();

    // Nose twitch
    const noseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(noseAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(noseAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(noseAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(noseAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    );
    noseLoop.start();

    const blinkTimer = setInterval(() => {
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.05, duration: 70, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 70, useNativeDriver: true }),
      ]).start();
    }, 2000);

    return () => {
      earLoop.stop(); earRLoop.stop(); noseLoop.stop(); clearInterval(blinkTimer);
    };
  }, [isHealthy]);

  const s = size;
  const bodyColor = isHealthy ? def.color : '#F8BBD9';
  const earInner = '#FFCDD2';

  return (
    <Animated.View style={[
      styles.characterRoot,
      {
        width: s, height: s * 1.35,
        transform: [
          { scaleX: squishAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.28] }) },
          { scaleY: squishAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.72] }) },
          { translateX: wiggleAnim.interpolate({ inputRange: [-1, 1], outputRange: [-10, 10] }) },
          { translateY: bounceAnim },
          { scale: scaleAnim },
        ],
      }
    ]}>
      {/* Ears */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: s * 0.16, position: 'absolute', top: 0, width: '100%' }}>
        {/* Left ear */}
        <Animated.View style={{ alignItems: 'center', transform: [{ rotate: earLAnim.interpolate({ inputRange: [-1, 1], outputRange: ['-12deg', '2deg'] }) }] }}>
          <View style={{ width: s * 0.18, height: s * 0.52, borderRadius: s * 0.1, backgroundColor: bodyColor, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: s * 0.09, height: s * 0.42, borderRadius: s * 0.06, backgroundColor: earInner }} />
          </View>
        </Animated.View>
        {/* Right ear */}
        <Animated.View style={{ alignItems: 'center', transform: [{ rotate: earRAnim.interpolate({ inputRange: [-1, 1], outputRange: ['-2deg', '12deg'] }) }] }}>
          <View style={{ width: s * 0.18, height: s * 0.52, borderRadius: s * 0.1, backgroundColor: bodyColor, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: s * 0.09, height: s * 0.42, borderRadius: s * 0.06, backgroundColor: earInner }} />
          </View>
        </Animated.View>
      </View>

      {/* Body */}
      <Oval w={s * 0.84} h={s * 0.8} color={bodyColor} style={{ alignSelf: 'center', marginTop: s * 0.38 }} />

      {/* Tummy */}
      <View style={[StyleSheet.absoluteFill, { justifyContent: 'flex-end', alignItems: 'center', paddingBottom: s * 0.12 }]}>
        <Oval w={s * 0.4} h={s * 0.28} color={def.accentColor} />
      </View>

      {/* Face */}
      <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', marginTop: s * 0.12 }]}>
        {/* Eyes */}
        <View style={{ flexDirection: 'row', gap: s * 0.2, marginBottom: 8 }}>
          {[0, 1].map(i => (
            <View key={i} style={{ alignItems: 'center' }}>
              <Animated.View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: def.eyeColor, transform: [{ scaleY: blinkAnim }] }} />
              <View style={{ position: 'absolute', top: 2, left: 3, width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.7)' }} />
            </View>
          ))}
        </View>

        {/* Nose */}
        <Animated.View style={{
          width: 10, height: 7, borderRadius: 5, backgroundColor: '#E91E63', marginBottom: 3,
          transform: [{ scaleX: noseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] }) }],
        }} />

        {/* Mouth */}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: 8, height: 5, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: '#AD1457', borderBottomLeftRadius: 4, marginRight: 1 }} />
          <View style={{ width: 8, height: 5, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#AD1457', borderBottomRightRadius: 4 }} />
        </View>

        {/* Cheeks */}
        <View style={{ flexDirection: 'row', gap: s * 0.32, marginTop: 4 }}>
          <Oval w={18} h={11} color="rgba(233,30,99,0.25)" />
          <Oval w={18} h={11} color="rgba(233,30,99,0.25)" />
        </View>
      </View>

      {/* Tail poof */}
      <Circle size={s * 0.18} color={def.accentColor} style={{ position: 'absolute', bottom: s * 0.15, right: -s * 0.06 }} />

      <Oval w={s * 0.42} h={10} color="rgba(0,0,0,0.08)" style={{ alignSelf: 'center', marginTop: 4 }} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  characterRoot: { alignItems: 'center', justifyContent: 'center' },
  absCenter: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  catEar: {
    width: 0, height: 0,
    borderLeftWidth: 14, borderRightWidth: 14, borderBottomWidth: 24,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
  },
  catEarInner: {
    position: 'absolute', top: 6, left: 5,
    width: 0, height: 0,
    borderLeftWidth: 8, borderRightWidth: 8, borderBottomWidth: 14,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
  },
});
