import React from 'react';
import { View, Text, Modal, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from '../types';

interface UserModalProps {
  visible: boolean;
  form: User;
  isEdit?: boolean;
  onClose: () => void;
  onChange: (field: keyof User, value: string) => void;
  onSave: () => void;
}

const UserModal: React.FC<UserModalProps> = ({
  visible,
  form,
  isEdit,
  onClose,
  onChange,
  onSave,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>
            {isEdit ? 'Edit User' : 'Add New User'}
          </Text>
          <TextInput
            style={styles.inputField}
            placeholder="Name"
            value={form.name}
            onChangeText={(text) => onChange('name', text)}
          />
          <TextInput
            style={styles.inputField}
            placeholder="Email"
            value={form.email}
            onChangeText={(text) => onChange('email', text)}
          />
          <TextInput
            style={styles.inputField}
            placeholder="Password"
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
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  cancelButton: {
    backgroundColor: '#B0BEC5',
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