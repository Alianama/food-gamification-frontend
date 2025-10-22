import CameraSVG from '@/assets/icon/camera.svg';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useSegments } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Image,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function CustomBottomBar() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
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

  // Determine active route segment using expo-router's useSegments
  const segments = useSegments();
  let activeRoute = (() => {
    const last = segments[segments.length - 1];
    if (!last) return 'index';
    if (last === '(tabs)') return 'index';
    return last;
  })();

  const tabs = [
    { name: 'index', icon: 'home-outline', label: 'Home' },
    { name: 'stats', icon: 'bar-chart-outline', label: 'Stats' },
    { name: 'camera', icon: 'camera-outline', isCenter: true, label: 'Camera' },
    { name: 'log', icon: 'list-outline', label: 'Log' },
    { name: 'profile', icon: 'person-outline', label: 'Profile' },
  ];

  const checkPermissions = async (type: 'camera' | 'library') => {
    if (type === 'camera') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please grant camera access in your device settings to take photos.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => {
                Linking.openSettings();
              },
            },
          ],
        );
        return false;
      }
    } else {
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (libraryStatus !== 'granted') {
        Alert.alert(
          'Photos Permission Required',
          'Please grant photo library access in your device settings to select photos.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => {
                Linking.openSettings();
              },
            },
          ],
        );
        return false;
      }
    }
    return true;
  };

  const handleImagePick = async () => {
    try {
      const hasPermission = await checkPermissions('library');
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setShowModal(true);
      }
    } catch (e) {
      console.warn('Error picking image:', e);
      Alert.alert('Error', 'Failed to access photo library. Please try again.');
    }
  };

  const handleCamera = async () => {
    try {
      const hasPermission = await checkPermissions('camera');
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setShowModal(true);
      }
    } catch (e) {
      console.warn('Error taking photo:', e);
      Alert.alert('Error', 'Failed to access camera. Please try again.');
    }
  };

  const handleUpload = () => {
    // TODO: Implement your upload logic here
    console.log('Uploading image:', selectedImage);
    setShowModal(false);
    setSelectedImage(null);
  };

  const onPressTab = (route: string) => {
    if (route === 'camera') {
      Alert.alert('Choose Photo Source', 'Would you like to take a photo or choose from gallery?', [
        {
          text: 'Camera',
          onPress: handleCamera,
        },
        {
          text: 'Gallery',
          onPress: handleImagePick,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]);
      return;
    }

    if (route === 'index') {
      router.push('/');
    } else if (route === 'stats') {
      router.push('/(tabs)/stats' as any);
    } else if (route === 'log') {
      router.push('/(tabs)/log' as any);
    } else if (route === 'profile') {
      router.push('/(tabs)/profile' as any);
    }
  };

  const renderTab = (tab: (typeof tabs)[0], index: number) => {
    const isActive = activeRoute === tab.name;

    if (tab.isCenter) {
      const rotate = shakeAnim.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-6deg', '6deg'],
      });

      return (
        <Pressable
          key={tab.name}
          onPress={() => onPressTab(tab.name)}
          style={[styles.centerButton, { backgroundColor: themeColors.tint }]}
        >
          <Animated.View
            style={{
              transform: [{ rotate }, { translateY: bounceAnim }],
            }}
          >
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
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.barWrapper} pointerEvents="box-none">
        <View style={[styles.bar, { backgroundColor: 'white' }]}>
          {tabs.map((tab, index) => renderTab(tab, index))}
        </View>
      </View>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedImage && <Image source={{ uri: selectedImage }} style={styles.previewImage} />}
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: '#ff4444' }]}
                onPress={() => {
                  setShowModal(false);
                  setSelectedImage(null);
                }}
              >
                <Text style={styles.buttonText}>Retake</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: themeColors.tint }]}
                onPress={handleUpload}
              >
                <Text style={styles.buttonText}>Upload</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  barWrapper: {
    width: '100%',
    alignItems: 'center',
    overflow: 'visible',
  },
  bar: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 24,
    marginHorizontal: 4,
    paddingHorizontal: 12,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  centerButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    padding: 15,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
