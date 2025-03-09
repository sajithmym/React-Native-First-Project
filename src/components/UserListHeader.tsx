import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

interface UserListHeaderProps {
  loading: boolean;
  onAdd: () => void;
}

const UserListHeader: React.FC<UserListHeaderProps> = ({ loading, onAdd }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.header}>User Management</Text>
      {loading && <ActivityIndicator size="large" color="#00796b" />}
      <TouchableOpacity style={styles.addButton} onPress={onAdd}>
        <Text style={styles.buttonText}>Add New User</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#FFD54F',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    color: '#424242',
    fontWeight: '600',
  },
});

export default UserListHeader;