import { RootState } from '@/store';
import {
  asyncAdminCreateUser,
  asyncAdminDeleteUser,
  asyncAdminGetAllUsers,
  clearMutationState,
} from '@/store/admin/slice';
import { AdminUser } from '@/store/admin/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

// ─── User Card ─────────────────────────────────────────────────────────────

function UserCard({
  user,
  onPress,
  onDelete,
}: {
  user: AdminUser;
  onPress: () => void;
  onDelete: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  const handlePressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  const roleColor = user.role?.name === 'admin' ? '#FF821D' : user.role?.name === 'moderator' ? '#0EA5E9' : '#10B981';
  const roleBg = user.role?.name === 'admin' ? '#FFF3E8' : user.role?.name === 'moderator' ? '#E0F2FE' : '#D1FAE5';

  const initials = (user.fullName || user.username || '?')
    .split(' ')
    .map(w => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.userCard}
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Avatar */}
        <LinearGradient colors={['#FF821D', '#F26200']} style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </LinearGradient>

        {/* Info */}
        <View style={styles.cardInfo}>
          <Text style={styles.cardName} numberOfLines={1}>
            {user.fullName}
          </Text>
          <Text style={styles.cardUsername} numberOfLines={1}>
            @{user.username}
          </Text>
          <Text style={styles.cardEmail} numberOfLines={1}>
            {user.email}
          </Text>
        </View>

        {/* Right side */}
        <View style={styles.cardRight}>
          <View style={[styles.roleBadge, { backgroundColor: roleBg }]}>
            <Text style={[styles.roleBadgeText, { color: roleColor }]}>{user.role?.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={e => {
              e.stopPropagation?.();
              onDelete();
            }}
          >
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Create User Modal ──────────────────────────────────────────────────────

function CreateUserModal({
  visible,
  onClose,
  onSubmit,
  loading,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { username: string; fullName: string; email: string; password: string }) => void;
  loading: boolean;
}) {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const reset = () => {
    setUsername('');
    setFullName('');
    setEmail('');
    setPassword('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!username.trim() || !fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Semua field wajib diisi');
      return;
    }
    onSubmit({ username: username.trim(), fullName: fullName.trim(), email: email.trim(), password });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.modalBg}>
        <View style={styles.modalSheet}>
          <View style={styles.modalDragHandle} />
          <View style={styles.modalHeader}>
            <View style={styles.modalIconBg}>
              <Ionicons name="person-add" size={22} color="#FF821D" />
            </View>
            <Text style={styles.modalTitle}>Tambah User Baru</Text>
            <TouchableOpacity onPress={handleClose} style={styles.modalCloseBtn}>
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {[
              { label: 'Nama Lengkap', value: fullName, setter: setFullName, icon: 'person-outline', placeholder: 'John Doe' },
              { label: 'Username', value: username, setter: setUsername, icon: 'at-outline', placeholder: 'johndoe' },
              { label: 'Email', value: email, setter: setEmail, icon: 'mail-outline', placeholder: 'john@example.com' },
            ].map(field => (
              <View key={field.label} style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <View style={styles.inputRow}>
                  <Ionicons name={field.icon as any} size={18} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder={field.placeholder}
                    placeholderTextColor="#C4C4C4"
                    value={field.value}
                    onChangeText={field.setter}
                    autoCapitalize="none"
                    keyboardType={field.label === 'Email' ? 'email-address' : 'default'}
                  />
                </View>
              </View>
            ))}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.inputRow}>
                <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, { flex: 1 }]}
                  placeholder="Min. 6 karakter"
                  placeholderTextColor="#C4C4C4"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPw}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPw(v => !v)} style={{ padding: 6 }}>
                  <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, loading && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={18} color="#fff" />
                  <Text style={styles.submitBtnText}>Buat User</Text>
                </>
              )}
            </TouchableOpacity>
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Screen ────────────────────────────────────────────────────────────

export default function AdminUsers() {
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const { users, pagination, usersLoading, mutationLoading, mutationSuccess, mutationError } =
    useSelector((state: RootState) => state.admin);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const debounceRef = useRef<any>(null);

  const fetchUsers = useCallback(
    (p = 1, s = search) => {
      dispatch(asyncAdminGetAllUsers({ page: p, limit: 10, search: s }));
    },
    [dispatch, search],
  );

  useEffect(() => {
    fetchUsers(1, '');
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchUsers(1, search);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  useEffect(() => {
    if (mutationSuccess) {
      dispatch(clearMutationState());
      setCreateModalVisible(false);
      fetchUsers(1, search);
    }
  }, [mutationSuccess]);

  useEffect(() => {
    if (mutationError) {
      Alert.alert('Error', mutationError);
      dispatch(clearMutationState());
    }
  }, [mutationError]);

  const handleDelete = (user: AdminUser) => {
    Alert.alert(
      'Hapus User',
      `Yakin ingin menghapus "${user.fullName}"?\nTindakan ini tidak dapat dibatalkan.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => dispatch(asyncAdminDeleteUser(user.id)),
        },
      ],
    );
  };

  const handleCreateUser = (data: {
    username: string;
    fullName: string;
    email: string;
    password: string;
  }) => {
    dispatch(asyncAdminCreateUser(data));
  };

  const loadMore = () => {
    if (pagination && page < pagination.totalPages && !usersLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(asyncAdminGetAllUsers({ page: nextPage, limit: 10, search }));
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#FF821D', '#F26200']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Manajemen User</Text>
          {pagination && (
            <Text style={styles.headerSubtitle}>{pagination.total} user terdaftar</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setCreateModalVisible(true)}
        >
          <Ionicons name="person-add" size={20} color="#FF821D" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama, username, atau email..."
            placeholderTextColor="#C4C4C4"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* User List */}
      {usersLoading && users.length === 0 ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#FF821D" />
          <Text style={styles.centerStateText}>Memuat data user...</Text>
        </View>
      ) : users.length === 0 ? (
        <View style={styles.centerState}>
          <Ionicons name="people-outline" size={52} color="#D1D5DB" />
          <Text style={styles.centerStateText}>Tidak ada user ditemukan</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <UserCard
              user={item}
              onPress={() => router.push(`/admin/users/${item.id}` as any)}
              onDelete={() => handleDelete(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            usersLoading && users.length > 0 ? (
              <ActivityIndicator color="#FF821D" style={{ margin: 16 }} />
            ) : null
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => setCreateModalVisible(true)}
      >
        <LinearGradient colors={['#FF821D', '#F26200']} style={styles.fabGradient}>
          <Ionicons name="person-add" size={22} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Create Modal */}
      <CreateUserModal
        visible={createModalVisible}
        onClose={() => {
          setCreateModalVisible(false);
          dispatch(clearMutationState());
        }}
        onSubmit={handleCreateUser}
        loading={mutationLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  header: {
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchContainer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#111827' },

  listContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 },

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 2 },
  cardUsername: { fontSize: 12, color: '#6B7280', marginBottom: 1 },
  cardEmail: { fontSize: 11, color: '#9CA3AF' },
  cardRight: { alignItems: 'flex-end', gap: 8 },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeText: { fontSize: 11, fontWeight: '700' },
  deleteBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  centerStateText: { fontSize: 14, color: '#9CA3AF', fontWeight: '600' },

  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    borderRadius: 28,
    shadowColor: '#FF821D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Modal
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '90%',
  },
  modalDragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  modalIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFF3E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: '#111827' },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 8 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  inputIcon: { marginRight: 8 },
  textInput: { flex: 1, height: 48, fontSize: 14, color: '#111827' },
  submitBtn: {
    backgroundColor: '#FF821D',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    marginTop: 8,
  },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
