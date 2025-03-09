import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { User } from '../types';

interface UserItemProps {
  item: User;
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
}

const UserItem: React.FC<UserItemProps> = ({ item, onEdit, onDelete }) => {
  return (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => onEdit(item)} style={styles.editButton}>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item.id!)} style={styles.deleteButton}>
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#E1F5FE',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  userInfo: {
    flex: 3,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0277BD',
  },
  userEmail: {
    fontSize: 14,
    color: '#555',
  },
  actionButtons: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  editButton: {
    backgroundColor: '#4FC3F7',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#FF7043',
    padding: 10,
    borderRadius: 5,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default UserItem;