import { Colors } from '@/constants/theme';
import type { AppDispatch, RootState } from '@/store';
import { login } from '@/store/auth/slice';
import { showError, showSuccess } from '@/utils/toast';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
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

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { accessToken, loading, error } = useSelector((s: RootState) => s.auth);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    if (accessToken) {
      showSuccess('Login berhasil!');
      router.replace('/(tabs)');
    }
  }, [accessToken, router]);

  useEffect(() => {
    if (error) {
      showError(String(error));
    }
  }, [error]);

  const handleLogin = () => {
    if (!username || !password) {
      showError('Username dan password wajib diisi');
      return;
    }
    dispatch(login({ username, password }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={['#FF821D', '#F26200']}
        style={styles.topGradient}
      >
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Foodify</Text>
        <Text style={styles.tagline}>Track your nutrition, level up your life</Text>
      </LinearGradient>

      <ScrollView
        style={styles.formContainer}
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account to continue</Text>

        {/* Username */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              autoCapitalize="none"
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
              placeholder="Enter your password"
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
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={loading ? ['#9CA3AF', '#9CA3AF'] : ['#FF821D', '#F26200']}
            style={styles.loginButtonGradient}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <>
                <Ionicons name="hourglass-outline" size={18} color="#fff" />
                <Text style={styles.loginButtonText}>Signing in...</Text>
              </>
            ) : (
              <>
                <Ionicons name="log-in-outline" size={18} color="#fff" />
                <Text style={styles.loginButtonText}>Sign In</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.registerLink}> Register</Text>
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
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContent: {
    padding: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 28,
  },
  inputGroup: {
    marginBottom: 18,
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
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#FF821D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    color: '#6B7280',
    fontSize: 14,
  },
  registerLink: {
    color: '#FF821D',
    fontSize: 14,
    fontWeight: '700',
  },
});
