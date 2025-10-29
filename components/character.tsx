import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';

export default function Character({ statusName }: { statusName: string }) {
  const [isLooping, setIsLooping] = useState(true);
  const lottieRef = useRef<LottieView>(null);

  const isUnhealthy = statusName?.toLowerCase() === 'unhealthy';
  const lottieSource = isUnhealthy
    ? require('@/assets/lottie/OrangeUnhealthy.json')
    : require('@/assets/lottie/Orange.json');
  const lottieSpeed = isUnhealthy ? 0.3 : 1;

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.play?.(lottieSpeed as unknown as number);
    }
  }, [lottieSpeed]);

  const handlePressIn = () => {
    setIsLooping(false);
    lottieRef.current?.pause?.();
  };

  const handlePressOut = () => {
    setIsLooping(true);
    lottieRef.current?.play?.();
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        style={{
          position: 'absolute',
          top: '60%',
          left: '50%',
          transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
          width: '200%',
          height: '200%',
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <LottieView
          ref={lottieRef}
          source={lottieSource}
          autoPlay={true}
          loop={isLooping}
          speed={lottieSpeed}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </TouchableOpacity>
    </>
  );
}
