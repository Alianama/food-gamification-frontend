import CustomBottomBar from '@/components/custom-bottom-bar';
import UploadModal from '@/components/upload-modal';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RootState } from '@/store';
import { asyncConfirmFood, asyncFoodDetection, clearFoodData } from '@/store/food/slice';
import { showError, showSuccess } from '@/utils/toast';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Slot, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch<any>();
  const router = useRouter();

  const { accessToken, loading: authLoading } = useSelector((state: RootState) => state.auth);
  const { loading, predictedData, error, confirmSuccess } = useSelector(
    (state: RootState) => state.food,
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('unknown');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ Proteksi route setelah layout benar-benar mounted
  useEffect(() => {
    if (isMounted && !authLoading && !accessToken) {
      setTimeout(() => {
        router.replace('/lobby');
      }, 0);
    }
  }, [accessToken, authLoading, isMounted, router]);

  const resetModal = () => {
    setModalVisible(false);
    setImageUri(null);
    setMimeType('unknown');
    dispatch(clearFoodData());
  };

  const handleCameraPress = () => {
    resetModal();
    setModalVisible(true);
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return showError('Izin kamera dibutuhkan!');

    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      setMimeType(asset.mimeType || 'unknown');
    }
  };

  const handlePickGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return showError('Izin galeri dibutuhkan!');

    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!result.canceled) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      setMimeType(asset.mimeType || 'unknown');
    }
  };

  const handleConfirmFood = async () => {
    if (!predictedData?.data?.foodHistoryId) {
      showError('Data makanan tidak ditemukan!');
      return;
    }
    await dispatch(asyncConfirmFood(predictedData.data.foodHistoryId));
  };

  const handleUpload = async () => {
    if (!imageUri) return showError('Gambar belum dipilih!');

    try {
      const compressed = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 1080 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
      );

      const formData = new FormData();
      formData.append('image', {
        uri: compressed.uri,
        type: 'image/jpeg',
        name: 'food.jpg',
      } as any);

      dispatch(asyncFoodDetection(formData));
    } catch (err: any) {
      showError(err.message || 'Gagal upload gambar');
    }
  };

  useEffect(() => {
    if (confirmSuccess) {
      showSuccess('Makanan berhasil dikonfirmasi!');
    }
  }, [confirmSuccess]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  // ⏳ Spinner loading sementara menunggu token
  if (authLoading || !isMounted) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
      </View>
    );
  }

  if (!accessToken) return null;

  return (
    <View
      style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
    >
      <Slot />
      <CustomBottomBar onCameraPress={handleCameraPress} />

      <UploadModal
        visible={modalVisible}
        imageUri={imageUri}
        mimeType={mimeType}
        loading={loading}
        data={predictedData}
        error={error}
        onClose={resetModal}
        onTakePhoto={handleTakePhoto}
        onPickGallery={handlePickGallery}
        onUpload={handleUpload}
        onConfirm={handleConfirmFood}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });
