import React from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { User } from '../types';

interface UserModalProps {
  visible: boolean;
  form: User;
  isEdit?: boolean;
  onClose: () => void;
  onChange: (field: keyof User, value: string) => void;
  onSave: () => void;
}

const { width, height } = Dimensions.get('window');

const UserModal: React.FC<UserModalProps> = ({
  visible,
  form,
  isEdit,
  onClose,
  onChange,
  onSave,
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(height);

  React.useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.exp),
      });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(height, { duration: 300 });
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <Animated.View style={[styles.modalOverlay, overlayStyle]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}>
          <Animated.View style={[styles.modalContent, modalStyle]}>
            <Text style={styles.modalHeader}>
              {isEdit ? 'Edit User' : 'Add New User'}
            </Text>
            <TextInput
              style={styles.inputField}
              placeholder="Name"
              placeholderTextColor="#888"
              value={form.name}
              onChangeText={(text) => onChange('name', text)}
            />
            <TextInput
              style={styles.inputField}
              placeholder="Email"
              placeholderTextColor="#888"
              value={form.email}
              onChangeText={(text) => onChange('email', text)}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.inputField}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={form.password}
              onChangeText={(text) => onChange('password', text)}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.modalButton, styles.cancelButton]}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onSave}
                style={[styles.modalButton, styles.saveButton]}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  keyboardAvoidingView: {
    width: '100%',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ff4444',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserModal;