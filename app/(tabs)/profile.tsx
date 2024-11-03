// app/(tabs)/profile.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { useAuthStore } from '../store/auth';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <Card style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Avatar.Text size={80} label={user?.name?.[0] ?? 'U'} />
        </View>
        <Card.Content style={styles.content}>
          <Text variant="headlineSmall" style={styles.name}>
            {user?.name ?? 'User Name'}
          </Text>
          <Text variant="bodyMedium" style={styles.email}>
            {user?.email ?? 'email@example.com'}
          </Text>
        </Card.Content>
      </Card>

      <Button 
        mode="contained" 
        onPress={logout}
        style={styles.logoutButton}
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  profileCard: {
    marginTop: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    padding: 16,
  },
  content: {
    alignItems: 'center',
  },
  name: {
    marginTop: 8,
  },
  email: {
    marginTop: 4,
    color: '#666',
  },
  logoutButton: {
    marginTop: 24,
  },
});