import React, { useState } from 'react';
import { 
  Modal, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard 
} from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { updateBmi } from '@/store/auth/slice';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Props {
  visible: boolean;
}

export default function BmiModal({ visible }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!weight || !height) return;
    
    setLoading(true);
    try {
      await dispatch(updateBmi({ weight: parseFloat(weight), height: parseFloat(height) })).unwrap();
    } catch (error) {
      console.error("Gagal update BMI:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            <View style={styles.modalContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="body" size={32} color="#FF821D" />
              </View>
              
              <Text style={styles.title}>Data Fisik Anda</Text>
              <Text style={styles.subtitle}>
                Kami butuh data berat dan tinggi badan untuk menghitung target nutrisi harian yang pas buat Anda!
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Berat Badan (kg)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  returnKeyType="done"
                  placeholder="Contoh: 65"
                  value={weight}
                  onChangeText={setWeight}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tinggi Badan (cm)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  returnKeyType="done"
                  placeholder="Contoh: 170"
                  value={height}
                  onChangeText={setHeight}
                  editable={!loading}
                />
              </View>

              <TouchableOpacity 
                style={[styles.saveButton, (!weight || !height || loading) && styles.saveButtonDisabled]} 
                onPress={handleSave}
                disabled={!weight || !height || loading}
              >
                <Text style={styles.saveButtonText}>{loading ? 'Menyimpan...' : 'Simpan Data'}</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  keyboardView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 130, 29, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#FF821D',
    width: '100%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#FCA5A5',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
