import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RootState } from '@/store';
import { logout } from '@/store/auth/slice';
import { asyncGetProfile } from '@/store/profile/slice';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '@/utils/api';
import KeySVG from '../../assets/icons/key.svg';
import LogoutSVG from '../../assets/icons/logout.svg';

export default function Profile() {
  const dispatch = useDispatch<any>();
  const { data, loading, error } = useSelector((state: RootState) => state.profile);
  // Ambil data karakter dari food/stats jika ada (lebih real-time setelah feed)
  // fallback ke data dari profile API
  const foodStats = useSelector((state: RootState) => state.food.stats);
  const character = foodStats?.data?.character ?? data?.character;
  const [modalVisible, setModalVisible] = useState(false);
  const [pwModalVisible, setPwModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const colorScheme = useColorScheme();
  const tint = colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint;

  useEffect(() => {
    dispatch(asyncGetProfile());
  }, [dispatch]);

  const handleChangePassword = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPwModalVisible(true);
  };

  const handleSubmitChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Semua field wajib diisi.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Password baru dan konfirmasi password tidak sama.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password baru minimal 6 karakter.');
      return;
    }
    try {
      setPwLoading(true);
      await api.put('/users/change-password', { currentPassword, newPassword });
      Alert.alert('Berhasil', 'Password berhasil diubah! Silakan login kembali.');
      setPwModalVisible(false);
      dispatch(logout());
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Gagal mengubah password.';
      Alert.alert('Error', msg);
    } finally {
      setPwLoading(false);
    }
  };

  const handleChangeProfilePicture = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setModalVisible(false); // Hide modal while uploading
        const uri = result.assets[0].uri;
        
        // Prepare FormData
        const formData = new FormData();
        formData.append('image', {
          uri,
          name: 'profile.jpg',
          type: 'image/jpeg',
        } as any);

        const res = await api.post('/users/profile-picture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        Alert.alert('Success', 'Profile picture updated successfully!');
        dispatch(asyncGetProfile()); // Refresh profile to get the new picture
      }
    } catch (err: any) {
      console.log(err);
      Alert.alert('Error', err?.message || 'Failed to update profile picture');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          dispatch(logout());
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={{ uri: data?.profilePicture || 'https://via.placeholder.com/120' }}
            style={styles.avatar}
          />
        </TouchableOpacity>

        <Text style={styles.name}>{data?.fullName || 'Nama User'}</Text>
        <Text style={styles.username}>@{data?.username || 'username'}</Text>
        <Text style={styles.email}>{data?.email || 'email@example.com'}</Text>

        {character && (
          <View style={styles.characterContainer}>
            <Text style={styles.sectionTitle}>Character Status</Text>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>Lv {character.level}</Text>
                <Text style={styles.statLabel}>{character.statusName}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{character.healthPoint} HP</Text>
                <Text style={styles.statLabel}>Health</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{character.xpPoint}/{character.xpToNextLevel}</Text>
                <Text style={styles.statLabel}>XP</Text>
              </View>
            </View>
          </View>
        )}

        {data?.role && (
          <View style={styles.roleContainer}>
            <Text style={styles.roleTitle}>Role: {data.role.name}</Text>
            <Text style={styles.roleDesc}>{data.role.description}</Text>
          </View>
        )}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: tint,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
              },
            ]}
            onPress={handleChangePassword}
          >
            <KeySVG width={22} height={22} />
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: '#FF6B6B',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              },
            ]}
            onPress={handleLogout}
          >
            <LogoutSVG width={22} height={22} style={{ marginBottom: -3, marginRight: 8 }} />
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal untuk lihat foto profil */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Image source={{ uri: data?.profilePicture || '' }} style={styles.modalImage} />
            <TouchableOpacity
              style={[styles.button, { width: '80%', marginTop: 15, backgroundColor: tint }]}
              onPress={handleChangeProfilePicture}
            >
              <Text style={styles.buttonText}>Change Profile Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { width: '80%', backgroundColor: '#ff4d4d', marginTop: 10 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Ganti Password */}
      <Modal visible={pwModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={[styles.modalContent, { padding: 24, gap: 12 }]}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#111', marginBottom: 4 }}>
              🔑 Ganti Password
            </Text>

            {/* Current Password */}
            <Text style={styles.inputLabel}>Password Lama</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Masukkan password lama"
                placeholderTextColor="#aaa"
                secureTextEntry={!showCurrent}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowCurrent(v => !v)} style={styles.eyeBtn}>
                <Text style={styles.eyeText}>{showCurrent ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            {/* New Password */}
            <Text style={styles.inputLabel}>Password Baru</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Minimal 6 karakter"
                placeholderTextColor="#aaa"
                secureTextEntry={!showNew}
                value={newPassword}
                onChangeText={setNewPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowNew(v => !v)} style={styles.eyeBtn}>
                <Text style={styles.eyeText}>{showNew ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <Text style={styles.inputLabel}>Konfirmasi Password Baru</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Ulangi password baru"
                placeholderTextColor="#aaa"
                secureTextEntry={!showConfirm}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowConfirm(v => !v)} style={styles.eyeBtn}>
                <Text style={styles.eyeText}>{showConfirm ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            {/* Buttons */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: tint, marginTop: 8 }]}
              onPress={handleSubmitChangePassword}
              disabled={pwLoading}
            >
              {pwLoading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.buttonText}>Simpan Password</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#9CA3AF' }]}
              onPress={() => setPwModalVisible(false)}
              disabled={pwLoading}
            >
              <Text style={styles.buttonText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
  },
  card: {
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 20,
  },
  avatar: {
    width: 130,
    height: 130,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
    borderRadius: 65,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 5,
    color: '#222222',
  },
  username: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 15,
  },
  roleContainer: {
    width: '100%',
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  roleTitle: {
    fontWeight: '700',
    fontSize: 17,
    marginBottom: 6,
    color: '#333333',
  },
  roleDesc: {
    fontSize: 14,
    marginBottom: 12,
    color: '#555555',
  },
  permissionTitle: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#444444',
  },
  permissionItem: {
    fontSize: 13,
    marginLeft: 12,
    marginBottom: 4,
    color: '#666666',
  },
  characterContainer: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  loadingText: {
    fontSize: 18,
    color: '#555555',
  },
  errorText: {
    fontSize: 18,
    color: '#ff4d4d',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    padding: 20,
    alignItems: 'center',
  },
  modalImage: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 3,
    borderColor: '#FF6B6B',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#444',
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    width: '100%',
  },
  textInput: {
    flex: 1,
    height: 46,
    fontSize: 15,
    color: '#111',
  },
  eyeBtn: {
    padding: 6,
  },
  eyeText: {
    fontSize: 18,
  },
});
