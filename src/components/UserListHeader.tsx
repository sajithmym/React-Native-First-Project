import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutUp } from 'react-native-reanimated';

interface UserListHeaderProps {
  loading: boolean;
  onAdd: () => void;
  onRefresh: () => void;
}

const UserListHeader: React.FC<UserListHeaderProps> = ({ loading, onAdd, onRefresh }) => {
  return (
    <Animated.View entering={SlideInDown} exiting={SlideOutUp} style={styles.headerContainer}>
      <View style={styles.headerTop}>
        <Text style={styles.header}>Saj Management</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator size="large" color="#00796b" />}
      <TouchableOpacity style={styles.addButton} onPress={onAdd}>
        <Text style={styles.buttonText}>Add New User</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  refreshButton: {
    backgroundColor: '#4FC3F7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  refreshText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#00008B',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default UserListHeader;