import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, FlatList, Alert } from 'react-native';
import { USERS_ENDPOINT } from './src/settings';
import { User } from './src/types';
import UserItem from './src/components/UserItem';
import UserListHeader from './src/components/UserListHeader';
import UserModal from './src/components/UserModal';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editableUser, setEditableUser] = useState<User | null>(null);
  const [form, setForm] = useState<User>({ name: '', email: '', password: '' });

  // Load users when the application mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch list of users from the API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(USERS_ENDPOINT);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  // Confirm deletion then delete user
  const handleDelete = (userId: number) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this user?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteUser(userId) },
    ]);
  };

  const deleteUser = async (userId: number) => {
    setLoading(true);
    try {
      await fetch(`${USERS_ENDPOINT}/${userId}`, { method: 'DELETE' });
      setUsers(users.filter(user => user.id !== userId));
      Alert.alert('Deleted', 'User deleted successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete user.');
    } finally {
      setLoading(false);
    }
  };

  // Open modal with user data for editing
  const openModalForEdit = (user: User) => {
    setEditableUser(user);
    setForm(user);
    setModalVisible(true);
  };

  // Open modal for adding a new user
  const openModalForAdd = () => {
    setEditableUser(null);
    setForm({ name: '', email: '', password: '' });
    setModalVisible(true);
  };

  // Handle save action for adding or updating a user
  const handleSave = () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert('Validation', 'Please fill all fields.');
      return;
    }
    if (editableUser) {
      Alert.alert('Confirm Update', 'Are you sure you want to update this user?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Update', onPress: updateUser },
      ]);
    } else {
      addUser();
    }
  };

  // Update existing user in the backend
  const updateUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${USERS_ENDPOINT}/${editableUser?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const updatedUser = await response.json();
      setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
      Alert.alert('Updated', 'User updated successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update user.');
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  // Add a new user to the backend
  const addUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(USERS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const newUser = await response.json();
      setUsers([...users, newUser]);
      Alert.alert('Added', 'User added successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to add user.');
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  // Update form state based on user input
  const handleChange = (field: keyof User, value: string) => {
    setForm({ ...form, [field]: value });
  };

  // Render individual user item using the UserItem component
  const renderUserItem = ({ item }: { item: User }) => (
    <UserItem item={item} onEdit={openModalForEdit} onDelete={handleDelete} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        renderItem={renderUserItem}
        ListHeaderComponent={
          <UserListHeader loading={loading} onAdd={openModalForAdd} />
        }
        contentContainerStyle={styles.listContent}
      />
      <UserModal
        visible={modalVisible}
        form={form}
        isEdit={!!editableUser}
        onClose={() => setModalVisible(false)}
        onChange={handleChange}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  listContent: {
    padding: 20,
  },
});

export default App;