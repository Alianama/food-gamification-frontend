import { Colors } from '@/constants/theme';
import type { AppDispatch, RootState } from '@/store';
import { register } from '@/store/auth/action';
import { showError, showSuccess } from '@/utils/toast';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
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

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { accessToken, loading, error } = useSelector((s: RootState) => s.auth);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    if (accessToken) {
      showSuccess('Registrasi berhasil!');
      router.replace('/(tabs)');
    }
  }, [accessToken]);

  useEffect(() => {
    if (error) {
      showError(String(error));
    }
  }, [error]);

  const handleRegister = () => {
    if (!username || !fullName || !email || !password) {
      showError('Semua field wajib diisi');
      return;
    }
    dispatch(register({ username, fullName, email, password }));
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Register</Text>
        <Text style={styles.descriptionTitle}>By Registering, you agree to our Terms of Use</Text>

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
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
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
            styles.registerButton,
            loading && styles.registerButtonDisabled,
            { backgroundColor: themeColors.tint },
          ]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.registerButtonText}>{loading ? 'Registering...' : 'Register'}</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.errorText}>{String(error)}</Text> : null}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have account?</Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginLink}> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center' },
  formContainer: { padding: 20, width: '100%', maxWidth: 400, alignSelf: 'center' },
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
  registerButton: { padding: 15, borderRadius: 16, marginTop: 10 },
  registerButtonDisabled: { backgroundColor: '#7FB5FF' },
  registerButtonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '600' },
  errorText: { color: '#FF3B30', marginTop: 12, textAlign: 'center', fontSize: 14 },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  loginText: { color: '#333', fontSize: 14 },
  loginLink: { color: '#007AFF', fontSize: 14, fontWeight: '600' },
});
