import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RootState } from '@/store';
import { logout } from '@/store/auth/slice';
import { asyncGetProfile } from '@/store/profile/slice';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
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
import BmiModal from '@/components/bmi-modal';

export default function Profile() {
  const dispatch = useDispatch<any>();
  const { data, loading, error } = useSelector((state: RootState) => state.profile);
  const foodStats = useSelector((state: RootState) => state.food.stats);
  const character = foodStats?.data?.character ?? data?.character;
  const [modalVisible, setModalVisible] = useState(false);
  const [pwModalVisible, setPwModalVisible] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const colorScheme = useColorScheme();
  const tint = colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint;
  const router = useRouter();
  const isAdmin = data?.role?.name?.toLowerCase() === 'admin' || data?.role?.name?.toLowerCase() === 'super_admin';
  const userAuth = useSelector((state: RootState) => state.auth.user);

  const [bmiModalVisible, setBmiModalVisible] = useState(false);

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
        setModalVisible(false);
        const uri = result.assets[0].uri;
        const formData = new FormData();
        formData.append('image', {
          uri,
          name: 'profile.jpg',
          type: 'image/jpeg',
        } as any);

        await api.post('/users/profile-picture', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        Alert.alert('Success', 'Profile picture updated successfully!');
        setImageKey(Date.now());
        dispatch(asyncGetProfile());
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to update profile picture');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => dispatch(logout()),
      },
    ]);
  };

  const xpProgress = character ? (character.xpPoint / character.xpToNextLevel) * 100 : 0;
  const hpProgress = character ? Math.min(character.healthPoint, 100) : 0;

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FF821D" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Ionicons name="alert-circle" size={48} color="#EF4444" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header Card */}
      <LinearGradient colors={['#FF821D', '#F26200']} style={styles.headerGradient}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.avatarWrapper}>
          <Image
            source={{ uri: data?.profilePicture ? `${data.profilePicture}?t=${imageKey}` : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data?.fullName || 'U') + '&background=ffffff&color=667eea&size=200' }}
            style={styles.avatar}
          />
          <View style={styles.avatarEditBadge}>
            <Ionicons name="camera" size={14} color="#fff" />
          </View>
        </TouchableOpacity>

        <Text style={styles.name}>{data?.fullName || 'Nama User'}</Text>
        <Text style={styles.username}>@{data?.username || 'username'}</Text>
        <View style={styles.emailRow}>
          <Ionicons name="mail-outline" size={14} color="rgba(255,255,255,0.75)" />
          <Text style={styles.email}>{data?.email || 'email@example.com'}</Text>
        </View>

        {data?.role && (
          <View style={styles.roleBadge}>
            <Ionicons name="shield-checkmark-outline" size={12} color="#FF821D" />
            <Text style={styles.roleBadgeText}>{data.role.name}</Text>
          </View>
        )}
      </LinearGradient>

      {/* Character Stats */}
      {character && (
        <View style={styles.statsCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="game-controller" size={20} color="#FF821D" />
            <Text style={styles.sectionTitle}>Character Status</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>Lv.{character.level}</Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <Ionicons name="person" size={14} color="#9CA3AF" />
            <Text style={styles.statusText}>{character.statusName}</Text>
          </View>

          {/* HP Bar */}
          <View style={styles.barSection}>
            <View style={styles.barLabelRow}>
              <View style={styles.barLabelLeft}>
                <Ionicons name="heart" size={14} color="#EF4444" />
                <Text style={styles.barLabel}>Health Points</Text>
              </View>
              <Text style={styles.barValue}>{character.healthPoint} HP</Text>
            </View>
            <View style={styles.barBg}>
              <LinearGradient
                colors={['#FF6B6B', '#EF4444']}
                style={[styles.barFill, { width: `${hpProgress}%` as any }]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              />
            </View>
          </View>

          {/* XP Bar */}
          <View style={styles.barSection}>
            <View style={styles.barLabelRow}>
              <View style={styles.barLabelLeft}>
                <Ionicons name="flash" size={14} color="#F59E0B" />
                <Text style={styles.barLabel}>Experience</Text>
              </View>
              <Text style={styles.barValue}>{character.xpPoint}/{character.xpToNextLevel} XP</Text>
            </View>
            <View style={styles.barBg}>
              <LinearGradient
                colors={['#FFD93D', '#F59E0B']}
                style={[styles.barFill, { width: `${Math.min(xpProgress, 100)}%` as any }]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              />
            </View>
          </View>

          {/* Stat chips */}
          <View style={styles.statChipsRow}>
            <View style={[styles.statChip, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="trending-up" size={16} color="#3B82F6" />
              <Text style={[styles.statChipValue, { color: '#3B82F6' }]}>Lv.{character.level}</Text>
              <Text style={styles.statChipLabel}>Level</Text>
            </View>
            <View style={[styles.statChip, { backgroundColor: '#FFF7ED' }]}>
              <Ionicons name="flash" size={16} color="#F59E0B" />
              <Text style={[styles.statChipValue, { color: '#F59E0B' }]}>{character.xpPoint}</Text>
              <Text style={styles.statChipLabel}>XP</Text>
            </View>
            <View style={[styles.statChip, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="heart" size={16} color="#EF4444" />
              <Text style={[styles.statChipValue, { color: '#EF4444' }]}>{character.healthPoint}</Text>
              <Text style={styles.statChipLabel}>HP</Text>
            </View>
          </View>
        </View>
      )}

      {/* Body Mass & Target Harian */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="body" size={20} color="#FF821D" />
            <Text style={styles.sectionTitle}>Data Fisik & Target Harian</Text>
          </View>
          <TouchableOpacity onPress={() => setBmiModalVisible(true)}>
            <Text style={{ color: '#FF821D', fontWeight: '700', fontSize: 13 }}>Update</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statChipsRow}>
          <View style={[styles.statChip, { backgroundColor: '#F3F4F6' }]}>
            <Text style={[styles.statChipValue, { color: '#374151', fontSize: 18 }]}>{userAuth?.weight || '-'}</Text>
            <Text style={styles.statChipLabel}>Berat (kg)</Text>
          </View>
          <View style={[styles.statChip, { backgroundColor: '#F3F4F6' }]}>
            <Text style={[styles.statChipValue, { color: '#374151', fontSize: 18 }]}>{userAuth?.height || '-'}</Text>
            <Text style={styles.statChipLabel}>Tinggi (cm)</Text>
          </View>
        </View>

        {foodStats?.data?.dailyTargets && (
          <View style={{ marginTop: 16, gap: 10 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#6B7280', marginBottom: 4 }}>
              Target Nutrisi dari BMI:
            </Text>
            {[
              { label: 'Kalori', value: foodStats.data.dailyTargets.calories, unit: 'kcal', icon: 'flame', color: '#FF821D' },
              { label: 'Protein', value: foodStats.data.dailyTargets.protein, unit: 'g', icon: 'fish', color: '#3B82F6' },
              { label: 'Karbo', value: foodStats.data.dailyTargets.carbohydrate, unit: 'g', icon: 'leaf', color: '#10B981' },
              { label: 'Lemak', value: foodStats.data.dailyTargets.fat, unit: 'g', icon: 'water', color: '#F59E0B' },
            ].map((t, i) => (
              <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 10, borderRadius: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name={t.icon as any} size={16} color={t.color} />
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151' }}>{t.label}</Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: '800', color: '#111827' }}>{t.value} <Text style={{ fontSize: 11, fontWeight: '600', color: '#9CA3AF' }}>{t.unit}</Text></Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsCard}>
        {/* Admin Panel — hanya tampil untuk admin */}
        {isAdmin && (
          <>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => router.push('/admin' as any)}
            >
              <LinearGradient colors={['#FF821D', '#F26200']} style={styles.actionIcon}>
                <Ionicons name="shield-checkmark" size={20} color="#fff" />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionText}>Admin Panel</Text>
                <Text style={styles.actionSubText}>Kelola user & leaderboard</Text>
              </View>
              <View style={styles.adminPanelBadge}>
                <Text style={styles.adminPanelBadgeText}>Admin</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.actionDivider} />
          </>
        )}

        <TouchableOpacity style={styles.actionRow} onPress={handleChangePassword}>
          <View style={[styles.actionIcon, { backgroundColor: '#EFF6FF' }]}>
            <Ionicons name="key" size={20} color="#3B82F6" />
          </View>
          <Text style={[styles.actionText, { flex: 1 }]}>Change Password</Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.actionDivider} />

        <TouchableOpacity style={styles.actionRow} onPress={handleLogout}>
          <View style={[styles.actionIcon, { backgroundColor: '#FEF2F2' }]}>
            <Ionicons name="log-out" size={20} color="#EF4444" />
          </View>
          <Text style={[styles.actionText, { flex: 1, color: '#EF4444' }]}>Logout</Text>
          <Ionicons name="chevron-forward" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Bottom spacing */}
      <View style={{ height: 100 }} />

      {/* Modals */}
      <BmiModal visible={bmiModalVisible} />

      {/* Modal: View/Change Profile Picture */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Profile Picture</Text>
            <Image
              source={{ uri: data?.profilePicture ? `${data.profilePicture}?t=${imageKey}` : '' }}
              style={styles.modalImage}
            />
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: tint }]}
              onPress={handleChangeProfilePicture}
            >
              <Ionicons name="image" size={18} color="#fff" />
              <Text style={styles.modalButtonText}>Change Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#F3F4F6' }]}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={18} color="#374151" />
              <Text style={[styles.modalButtonText, { color: '#374151' }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal: Change Password */}
      <Modal visible={pwModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={[styles.modalContent, { padding: 24, gap: 12 }]}>
            <View style={styles.pwModalHeader}>
              <View style={styles.pwModalIconBg}>
                <Ionicons name="key" size={24} color="#FF821D" />
              </View>
              <Text style={styles.pwModalTitle}>Change Password</Text>
              <Text style={styles.pwModalSubtitle}>Enter your current and new password</Text>
            </View>

            {/* Current Password */}
            <View>
              <Text style={styles.inputLabel}>Current Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter current password"
                  placeholderTextColor="#aaa"
                  secureTextEntry={!showCurrent}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowCurrent(v => !v)} style={styles.eyeBtn}>
                  <Ionicons name={showCurrent ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View>
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-open-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Min. 6 characters"
                  placeholderTextColor="#aaa"
                  secureTextEntry={!showNew}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowNew(v => !v)} style={styles.eyeBtn}>
                  <Ionicons name={showNew ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Repeat new password"
                  placeholderTextColor="#aaa"
                  secureTextEntry={!showConfirm}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowConfirm(v => !v)} style={styles.eyeBtn}>
                  <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Buttons */}
            <TouchableOpacity
              style={[styles.pwSaveButton, { backgroundColor: '#FF821D' }]}
              onPress={handleSubmitChangePassword}
              disabled={pwLoading}
            >
              {pwLoading
                ? <ActivityIndicator color="#fff" />
                : <>
                    <Ionicons name="save-outline" size={18} color="#fff" />
                    <Text style={styles.pwSaveButtonText}>Save Password</Text>
                  </>
              }
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pwCancelButton]}
              onPress={() => setPwModalVisible(false)}
              disabled={pwLoading}
            >
              <Text style={styles.pwCancelButtonText}>Cancel</Text>
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
    backgroundColor: '#F8FAFC',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#FF821D',
    fontWeight: '600',
  },
  errorText: {
    marginTop: 12,
    fontSize: 15,
    color: '#EF4444',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Header Gradient
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 32,
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#FF821D',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 12,
  },
  email: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF821D',
  },

  // Stats Card
  statsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  levelBadge: {
    backgroundColor: '#FF821D',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 14,
  },
  statusText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  // Bars
  barSection: {
    marginBottom: 12,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barLabelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  barLabel: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  barValue: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  barBg: {
    width: '100%',
    height: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },

  // Stat Chips
  statChipsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  statChip: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    gap: 3,
  },
  statChipValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  statChipLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  // Actions Card
  actionsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 5,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  actionSubText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  actionDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  adminPanelBadge: {
    backgroundColor: '#FFF3E8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  adminPanelBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF821D',
  },

  // Modals
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#FF821D',
    marginVertical: 8,
  },
  modalButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  // Password Modal
  pwModalHeader: {
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  pwModalIconBg: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pwModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  pwModalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: '#111',
  },
  eyeBtn: {
    padding: 6,
  },
  pwSaveButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  pwSaveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  pwCancelButton: {
    width: '100%',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  pwCancelButtonText: {
    color: '#374151',
    fontWeight: '700',
    fontSize: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
});
