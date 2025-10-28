import CustomBottomBar from '@/components/custom-bottom-bar';
import UploadModal from '@/components/upload-modal';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RootState } from '@/store';
import { foodDetection } from '@/store/food/action';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Redirect, Slot } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch<any>();
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('unknown');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any | null>(null);

  if (!accessToken) return <Redirect href="/lobby" />;

  const handleCameraPress = () => {
    setModalVisible(true);
    setImageUri(null);
    setData(null);
    setError(null);
    setMimeType('unknown');
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return alert('Izin kamera dibutuhkan!');

    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      setMimeType(asset.mimeType || 'unknown');
    }
  };

  const handlePickGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return alert('Izin galeri dibutuhkan!');

    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!result.canceled) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      setMimeType(asset.mimeType || 'unknown');
    }
  };

  const handleUpload = async () => {
    if (!imageUri) return;

    setLoading(true);
    setError(null);

    try {
      let processedUri = imageUri;
      let processedMime = mimeType;

      const compressed = await ImageManipulator.manipulateAsync(
        processedUri,
        [{ resize: { width: 1080 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
      );
      processedUri = compressed.uri;
      processedMime = 'image/jpeg';

      console.log('✅ Compressed Image:', processedUri);

      if (mimeType === 'image/heic' || imageUri?.toLowerCase().endsWith('.heic')) {
        console.log('⚠️ Convert HEIC → JPEG');

        const converted = await ImageManipulator.manipulateAsync(processedUri, [], {
          compress: 0.9,
          format: ImageManipulator.SaveFormat.JPEG,
        });

        processedUri = converted.uri;
        processedMime = 'image/jpeg';
      }

      console.log('📌 READY TO UPLOAD:', processedUri, processedMime);

      const formData = new FormData();
      formData.append('image', {
        uri: processedUri,
        type: processedMime,
        name: `food.${processedMime === 'image/jpeg' ? 'jpg' : 'png'}`,
      } as any);

      const resAction = await dispatch(foodDetection(formData));

      if (foodDetection.fulfilled.match(resAction)) {
        setData(resAction.payload);
      } else {
        setError(resAction.payload?.message || 'Upload gagal');
      }
    } catch (err: any) {
      console.log('Upload error:', err);
      setError('Kesalahan jaringan');
    }

    setLoading(false);
  };

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
        data={data}
        error={error}
        onClose={() => setModalVisible(false)}
        onTakePhoto={handleTakePhoto}
        onPickGallery={handlePickGallery}
        onUpload={handleUpload}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });
