import { RootState } from '@/store';
import {
  asyncAdminDeleteUser,
  asyncAdminGetUserById,
  asyncAdminResetPassword,
  asyncAdminUpdateUser,
  clearMutationState,
  clearSelectedUser,
} from '@/store/admin/slice';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const ROLE_OPTIONS = [
  { id: 1, name: 'admin', label: 'Admin', color: '#FF821D', bg: '#FFF3E8' },
  { id: 2, name: 'moderator', label: 'Moderator', color: '#0EA5E9', bg: '#E0F2FE' },
  { id: 3, name: 'user', label: 'User', color: '#10B981', bg: '#D1FAE5' },
];

// ─── Edit Modal ─────────────────────────────────────────────────────────────

function EditUserModal({
  visible,
  onClose,
  onSubmit,
  loading,
  initialData,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { fullName: string; username: string; email: string; roleId: number }) => void;
  loading: boolean;
  initialData: { fullName: string; username: string; email: string; roleId: number };
}) {
  const [fullName, setFullName] = useState(initialData.fullName);
  const [username, setUsername] = useState(initialData.username);
  const [email, setEmail] = useState(initialData.email);
  const [roleId, setRoleId] = useState(initialData.roleId);

  useEffect(() => {
    if (visible) {
      setFullName(initialData.fullName);
      setUsername(initialData.username);
      setEmail(initialData.email);
      setRoleId(initialData.roleId);
    }
  }, [visible, initialData]);

  const handleSubmit = () => {
    if (!fullName.trim() || !username.trim() || !email.trim()) {
      Alert.alert('Error', 'Semua field wajib diisi');
      return;
    }
    onSubmit({ fullName: fullName.trim(), username: username.trim(), email: email.trim(), roleId });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBg}>
        <View style={styles.modalSheet}>
          <View style={styles.dragHandle} />
          <View style={styles.modalHeader}>
            <View style={styles.modalIconBg}>
              <Ionicons name="create" size={22} color="#FF821D" />
            </View>
            <Text style={styles.modalTitle}>Edit User</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {[
            { label: 'Nama Lengkap', value: fullName, setter: setFullName, icon: 'person-outline', placeholder: 'Nama lengkap' },
            { label: 'Username', value: username, setter: setUsername, icon: 'at-outline', placeholder: 'username' },
            { label: 'Email', value: email, setter: setEmail, icon: 'mail-outline', placeholder: 'email@example.com' },
          ].map(f => (
            <View key={f.label} style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{f.label}</Text>
              <View style={styles.inputRow}>
                <Ionicons name={f.icon as any} size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.textInput}
                  value={f.value}
                  onChangeText={f.setter}
                  placeholder={f.placeholder}
                  placeholderTextColor="#C4C4C4"
                  autoCapitalize="none"
                  keyboardType={f.label === 'Email' ? 'email-address' : 'default'}
                />
              </View>
            </View>
          ))}

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Role</Text>
            <View style={styles.roleRow}>
              {ROLE_OPTIONS.map(role => (
                <TouchableOpacity
                  key={role.id}
                  style={[
                    styles.roleChip,
                    { backgroundColor: roleId === role.id ? role.bg : '#F3F4F6' },
                    roleId === role.id && { borderWidth: 1.5, borderColor: role.color },
                  ]}
                  onPress={() => setRoleId(role.id)}
                >
                  <Text
                    style={[
                      styles.roleChipText,
                      { color: roleId === role.id ? role.color : '#6B7280' },
                    ]}
                  >
                    {role.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="save" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>Simpan Perubahan</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={loading}>
            <Text style={styles.cancelBtnText}>Batal</Text>
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </View>
      </View>
    </Modal>
  );
}

// ─── Reset Password Modal ────────────────────────────────────────────────────

function ResetPasswordModal({
  visible,
  onClose,
  onSubmit,
  loading,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (pw: string) => void;
  loading: boolean;
}) {
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (visible) { setNewPw(''); setConfirmPw(''); }
  }, [visible]);

  const handleSubmit = () => {
    if (!newPw || !confirmPw) return Alert.alert('Error', 'Semua field wajib diisi');
    if (newPw.length < 6) return Alert.alert('Error', 'Password minimal 6 karakter');
    if (newPw !== confirmPw) return Alert.alert('Error', 'Password tidak sama');
    onSubmit(newPw);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBg}>
        <View style={[styles.modalSheet, { paddingBottom: 40 }]}>
          <View style={styles.dragHandle} />
          <View style={styles.modalHeader}>
            <View style={[styles.modalIconBg, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="key" size={22} color="#F59E0B" />
            </View>
            <Text style={styles.modalTitle}>Reset Password</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <Text style={styles.resetWarning}>Password user akan direset. Token login mereka akan diinvalidasi.</Text>
          {[
            { label: 'Password Baru', value: newPw, setter: setNewPw, placeholder: 'Min. 6 karakter' },
            { label: 'Konfirmasi Password', value: confirmPw, setter: setConfirmPw, placeholder: 'Ulangi password baru' },
          ].map(f => (
            <View key={f.label} style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{f.label}</Text>
              <View style={styles.inputRow}>
                <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
                <TextInput
                  style={[styles.textInput, { flex: 1 }]}
                  value={f.value}
                  onChangeText={f.setter}
                  placeholder={f.placeholder}
                  placeholderTextColor="#C4C4C4"
                  secureTextEntry={!showPw}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPw(v => !v)} style={{ padding: 6 }}>
                  <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: '#F59E0B' }, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : (
              <>
                <Ionicons name="key" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>Reset Password</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={loading}>
            <Text style={styles.cancelBtnText}>Batal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function AdminUserDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const { selectedUser, selectedUserLoading, selectedUserError, mutationLoading, mutationSuccess, mutationError } =
    useSelector((state: RootState) => state.admin);

  const [editModal, setEditModal] = useState(false);
  const [resetModal, setResetModal] = useState(false);

  useEffect(() => {
    if (id) dispatch(asyncAdminGetUserById(Number(id)));
    return () => { dispatch(clearSelectedUser()); };
  }, [id]);

  useEffect(() => {
    if (mutationSuccess) {
      dispatch(clearMutationState());
      setEditModal(false);
      setResetModal(false);
      // Refresh data
      if (id) dispatch(asyncAdminGetUserById(Number(id)));
    }
  }, [mutationSuccess]);

  useEffect(() => {
    if (mutationError) {
      Alert.alert('Error', mutationError);
      dispatch(clearMutationState());
    }
  }, [mutationError]);

  const handleDelete = () => {
    Alert.alert(
      'Hapus User',
      `Yakin ingin menghapus "${selectedUser?.fullName}"?\nTindakan ini tidak dapat dibatalkan.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            await dispatch(asyncAdminDeleteUser(Number(id)));
            router.back();
          },
        },
      ],
    );
  };

  const handleUpdate = (data: { fullName: string; username: string; email: string; roleId: number }) => {
    dispatch(asyncAdminUpdateUser({ id: Number(id), data }));
  };

  const handleResetPassword = (newPassword: string) => {
    dispatch(asyncAdminResetPassword({ id: Number(id), newPassword }));
  };

  const roleInfo = ROLE_OPTIONS.find(r => r.id === selectedUser?.role?.id) || ROLE_OPTIONS[2];

  if (selectedUserLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FF821D" />
        <Text style={{ marginTop: 12, color: '#FF821D', fontWeight: '600' }}>Memuat detail user...</Text>
      </View>
    );
  }

  if (selectedUserError || !selectedUser) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="alert-circle" size={52} color="#EF4444" />
        <Text style={{ marginTop: 12, color: '#EF4444', fontWeight: '600', textAlign: 'center' }}>
          {selectedUserError || 'User tidak ditemukan'}
        </Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => router.back()}>
          <Text style={styles.retryBtnText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const initials = selectedUser.fullName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  const joinDate = new Date(selectedUser.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#FF821D', '#F26200']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail User</Text>
        <TouchableOpacity style={styles.deleteHeaderBtn} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <LinearGradient colors={['#FF821D', '#F26200']} style={styles.bigAvatar}>
            <Text style={styles.bigAvatarText}>{initials}</Text>
          </LinearGradient>
          <Text style={styles.profileName}>{selectedUser.fullName}</Text>
          <Text style={styles.profileUsername}>@{selectedUser.username}</Text>
          <Text style={styles.profileEmail}>{selectedUser.email}</Text>
          <View style={[styles.roleChip, { backgroundColor: roleInfo.bg, borderWidth: 0, marginTop: 8 }]}>
            <Ionicons name="shield-checkmark-outline" size={12} color={roleInfo.color} />
            <Text style={[styles.roleChipText, { color: roleInfo.color, marginLeft: 4 }]}>
              {selectedUser.role?.name}
            </Text>
          </View>
          <Text style={styles.joinDate}>Bergabung {joinDate}</Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsCard}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => setEditModal(true)}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FFF3E8' }]}>
              <Ionicons name="create-outline" size={20} color="#FF821D" />
            </View>
            <Text style={styles.actionText}>Edit Informasi User</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.actionDivider} />

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => setResetModal(true)}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="key-outline" size={20} color="#F59E0B" />
            </View>
            <Text style={styles.actionText}>Reset Password</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.actionDivider} />

          <TouchableOpacity style={styles.actionRow} onPress={handleDelete}>
            <View style={[styles.actionIcon, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </View>
            <Text style={[styles.actionText, { color: '#EF4444' }]}>Hapus User</Text>
            <Ionicons name="chevron-forward" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Meta Info */}
        <View style={styles.metaCard}>
          <Text style={styles.metaTitle}>Informasi Akun</Text>
          {[
            { label: 'User ID', value: `#${selectedUser.id}` },
            { label: 'Role ID', value: `#${selectedUser.role?.id} — ${selectedUser.role?.name}` },
            { label: 'Terakhir Update', value: new Date(selectedUser.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) },
          ].map(item => (
            <View key={item.label} style={styles.metaRow}>
              <Text style={styles.metaLabel}>{item.label}</Text>
              <Text style={styles.metaValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Edit Modal */}
      {selectedUser && (
        <EditUserModal
          visible={editModal}
          onClose={() => { setEditModal(false); dispatch(clearMutationState()); }}
          onSubmit={handleUpdate}
          loading={mutationLoading}
          initialData={{
            fullName: selectedUser.fullName,
            username: selectedUser.username,
            email: selectedUser.email,
            roleId: selectedUser.role?.id ?? 3,
          }}
        />
      )}

      {/* Reset Password Modal */}
      <ResetPasswordModal
        visible={resetModal}
        onClose={() => { setResetModal(false); dispatch(clearMutationState()); }}
        onSubmit={handleResetPassword}
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
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '800', color: '#fff' },
  deleteHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scroll: { flex: 1 },

  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 5,
  },
  bigAvatar: {
    width: 90,
    height: 90,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  bigAvatarText: { color: '#fff', fontWeight: '800', fontSize: 32 },
  profileName: { fontSize: 22, fontWeight: '800', color: '#111827', textAlign: 'center' },
  profileUsername: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  profileEmail: { fontSize: 13, color: '#9CA3AF', marginTop: 4 },
  joinDate: { fontSize: 12, color: '#9CA3AF', marginTop: 8 },

  actionsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
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
  actionText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#111827' },
  actionDivider: { height: 1, backgroundColor: '#F3F4F6' },

  metaCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  metaTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 14 },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  metaLabel: { fontSize: 13, color: '#6B7280' },
  metaValue: { fontSize: 13, fontWeight: '600', color: '#111827' },

  // Modals
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '90%',
  },
  dragHandle: {
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
    marginBottom: 20,
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
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetWarning: {
    fontSize: 13,
    color: '#92400E',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    lineHeight: 18,
  },
  fieldGroup: { marginBottom: 14 },
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
  textInput: { flex: 1, height: 48, fontSize: 14, color: '#111827' },
  roleRow: { flexDirection: 'row', gap: 10 },
  roleChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 0,
  },
  roleChipText: { fontSize: 13, fontWeight: '700' },
  saveBtn: {
    backgroundColor: '#FF821D',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    marginTop: 8,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  cancelBtn: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#F3F4F6',
    marginTop: 10,
  },
  cancelBtnText: { color: '#374151', fontWeight: '700', fontSize: 15 },
  retryBtn: {
    marginTop: 16,
    backgroundColor: '#FF821D',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  retryBtnText: { color: '#fff', fontWeight: '700' },
});
