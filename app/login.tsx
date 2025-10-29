import { Colors } from '@/constants/theme';
import type { AppDispatch, RootState } from '@/store';
import { login } from '@/store/auth/slice';
import { showError, showSuccess } from '@/utils/toast';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

import {
  Image,
  KeyboardAvoidingView,
  Platform,
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
  }, [accessToken]);

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

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.formContainer}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={{ width: '100%', height: 100, marginBottom: 10 }}
          resizeMode="contain"
        />
        <Text style={styles.name}>Foodify</Text>
        <Text style={styles.title}>Log In</Text>
        <Text style={styles.descriptionTitle}>By logging in, you agree to our Terms of Use</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            autoCapitalize="none"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#666"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.loginButton,
            loading && styles.loginButtonDisabled,
            { backgroundColor: themeColors.tint },
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.errorText}>{String(error)}</Text> : null}

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have account?</Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.registerLink}> Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center' },
  formContainer: { padding: 20, width: '100%', maxWidth: 400, alignSelf: 'center' },
  name: { fontSize: 32, fontWeight: 'bold', color: '#000', marginBottom: 40, textAlign: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#000', marginBottom: 10, textAlign: 'left' },
  descriptionTitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 60,
    textAlign: 'left',
  },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, color: '#333', marginBottom: 8, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 16,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#000',
  },
  loginButton: { padding: 15, borderRadius: 16, marginTop: 10 },
  loginButtonDisabled: { backgroundColor: '#7FB5FF' },
  loginButtonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: '#FF3B30', marginTop: 12, textAlign: 'center', fontSize: 14 },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  registerText: { color: '#333', fontSize: 14 },
  registerLink: { color: '#007AFF', fontSize: 14, fontWeight: '600' },
});
