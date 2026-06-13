import { Colors } from '@/constants/theme';
import type { AppDispatch, RootState } from '@/store';
import { asyncCreateUser } from '@/store/profile/slice';
import { showError, showSuccess } from '@/utils/toast';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((s: RootState) => s.profile);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      showError(String(error));
    }
  }, [error]);

  const handleRegister = async () => {
    if (!username || !fullName || !email || !password) {
      showError('Semua field wajib diisi');
      return;
    }
    try {
      await dispatch(asyncCreateUser({ username, fullName, email, password })).unwrap();
      showSuccess('Registrasi berhasil! Silakan masuk.');
      router.replace('/login');
    } catch (e) {
      // error handled via Redux state in useEffect
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Gradient Header */}
      <LinearGradient colors={['#11998e', '#38ef7d']} style={styles.topGradient}>
        <View style={styles.headerIconBg}>
          <Ionicons name="person-add" size={36} color="#fff" />
        </View>
        <Text style={styles.appName}>Create Account</Text>
        <Text style={styles.tagline}>Join Foodify and start your health journey</Text>
      </LinearGradient>

      <ScrollView
        style={styles.formContainer}
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Username */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="at-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              placeholder="Choose a username"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Full Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              placeholder="Min. 6 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.input}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeBtn}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color="#EF4444" />
            <Text style={styles.errorText}>{String(error)}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.registerButton, loading && styles.registerButtonDisabled]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={loading ? ['#9CA3AF', '#9CA3AF'] : ['#11998e', '#38ef7d']}
            style={styles.registerButtonGradient}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <>
                <Ionicons name="hourglass-outline" size={18} color="#fff" />
                <Text style={styles.registerButtonText}>Creating account...</Text>
              </>
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                <Text style={styles.registerButtonText}>Create Account</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.loginLink}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topGradient: {
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  headerIconBg: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 24,
    paddingTop: 28,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: '#111827',
  },
  eyeBtn: {
    padding: 6,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  registerButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#11998e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  registerButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  registerButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  loginText: {
    color: '#6B7280',
    fontSize: 14,
  },
  loginLink: {
    color: '#11998e',
    fontSize: 14,
    fontWeight: '700',
  },
});
