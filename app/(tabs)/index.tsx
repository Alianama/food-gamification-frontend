import Character from '@/components/character';
import GameHud from '@/components/stats-hud';
import { RootState } from '@/store';
import { asyncGetCharacterStats } from '@/store/food/slice';
import { useAppDispatch } from '@/store/hook';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { confirmedData, stats } = useSelector((state: RootState) => state.food);
  const character = confirmedData?.data?.character ?? stats?.data?.character;

  useEffect(() => {
    if (!confirmedData && !stats) {
      dispatch(asyncGetCharacterStats());
    }
  }, [confirmedData, stats]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {character ? (
        <GameHud
          level={character.level}
          statusName={character.statusName}
          healthPoint={character.healthPoint}
          xpPoint={character.xpPoint}
          xpToNextLevel={character.xpToNextLevel}
        />
      ) : null}
      <Character statusName={character?.statusName ?? 'healthy'} />
    </View>
  );
}
