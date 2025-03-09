import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {USERS_ENDPOINT} from './src/settings';

type User = {
  id?: number;
  name: string;
  email: string;
  password: string;
};

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editableUser, setEditableUser] = useState<User | null>(null);
  const [form, setForm] = useState<User>({name: '', email: '', password: ''});

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleDelete = (userId: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this user?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteUser(userId),
        },
      ],
    );
  };

  const deleteUser = async (userId: number) => {
    setLoading(true);
    try {
      await fetch(`${USERS_ENDPOINT}/${userId}`, {method: 'DELETE'});
      setUsers(users.filter(user => user.id !== userId));
      Alert.alert('Deleted', 'User deleted successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete user.');
    } finally {
      setLoading(false);
    }
  };

  const openModalForEdit = (user: User) => {
    setEditableUser(user);
    setForm(user);
    setModalVisible(true);
  };

  const openModalForAdd = () => {
    setEditableUser(null);
    setForm({name: '', email: '', password: ''});
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert('Validation', 'Please fill all fields.');
      return;
    }
    if (editableUser) {
      Alert.alert(
        'Confirm Update',
        'Are you sure you want to update this user?',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Update', onPress: updateUser},
        ],
      );
    } else {
      addUser();
    }
  };

  const updateUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${USERS_ENDPOINT}/${editableUser?.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(form),
      });
      const updatedUser = await response.json();
      setUsers(
        users.map(user => (user.id === updatedUser.id ? updatedUser : user)),
      );
      Alert.alert('Updated', 'User updated successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update user.');
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  const addUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(USERS_ENDPOINT, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
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

  const renderUserItem = ({item}: {item: User}) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={() => openModalForEdit(item)}
          style={styles.editButton}>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id!)}
          style={styles.deleteButton}>
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>User Management</Text>
        {loading && <ActivityIndicator size="large" color="#00796b" />}
        <TouchableOpacity style={styles.addButton} onPress={openModalForAdd}>
          <Text style={styles.buttonText}>Add New User</Text>
        </TouchableOpacity>
        <FlatList
          data={users}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={renderUserItem}
          style={styles.list}
        />
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>
              {editableUser ? 'Edit User' : 'Add New User'}
            </Text>
            <TextInput
              style={styles.inputField}
              placeholder="Name"
              value={form.name}
              onChangeText={text => setForm({...form, name: text})}
            />
            <TextInput
              style={styles.inputField}
              placeholder="Email"
              value={form.email}
              onChangeText={text => setForm({...form, email: text})}
            />
            <TextInput
              style={styles.inputField}
              placeholder="Password"
              secureTextEntry
              value={form.password}
              onChangeText={text => setForm({...form, password: text})}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalButton, styles.cancelButton]}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                style={[styles.modalButton, styles.saveButton]}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    padding: 20,
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
  list: {
    marginTop: 10,
  },
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

export default App;
