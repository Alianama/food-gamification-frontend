import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RootState } from '@/store';
import { logout } from '@/store/auth/slice';
import { asyncGetProfile } from '@/store/profile/slice';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import KeySVG from '../../assets/icons/key.svg';
import LogoutSVG from '../../assets/icons/logout.svg';

export default function Profile() {
  const dispatch = useDispatch<any>();
  const { data, loading, error } = useSelector((state: RootState) => state.profile);
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const tint = colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint;

  useEffect(() => {
    dispatch(asyncGetProfile());
  }, [dispatch]);

  const handleChangePassword = () => {
    Alert.alert('Action', 'Ganti Password ditekan');
  };

  const handleChangeProfilePicture = () => {
    Alert.alert('Action', 'Ganti Profile Picture ditekan');
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

        {data?.role && (
          <View style={styles.roleContainer}>
            <Text style={styles.roleTitle}>Role: {data.role.name}</Text>
            <Text style={styles.roleDesc}>{data.role.description}</Text>
            <Text style={styles.permissionTitle}>Permissions:</Text>
            {data.role.permissions.map((perm, idx) => (
              <Text key={idx} style={styles.permissionItem}>
                - {perm.permission.name}: {perm.permission.description}
              </Text>
            ))}
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
});
