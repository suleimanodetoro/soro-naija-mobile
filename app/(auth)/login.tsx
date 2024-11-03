// app/(auth)/login.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/auth';

export default function LoginScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter();

  const handleLogin = () => {
    // Implement login logic here
    useAuthStore.getState().setToken('dummy-token'); // Temporary for testing
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Welcome Back</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
      <Button onPress={() => router.push('/(auth)/register')}>
        Create Account
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
      marginBottom: 12,
    },
    button: {
      marginTop: 12,
      marginBottom: 12,
    },
    languageSelector: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 20,
      backgroundColor: '#f5f5f5',
      borderRadius: 10,
      marginBottom: 20,
    },
    recordingSection: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    recordButton: {
      padding: 20,
    },
  });