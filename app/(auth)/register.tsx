// app/(auth)/register.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, TextInput, HelperText } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/auth';
import { authApi } from '../services/api';

export default function RegisterScreen() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Starting registration...'); // Debug log
      
      const { token, user } = await authApi.register(email, password, name);
      console.log('Registration response:', { token, user }); // Debug log
      
      setToken(token);
      setUser(user);
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('Registration error:', err); // Debug log
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Create Account</Text>
      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        disabled={loading}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        disabled={loading}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        disabled={loading}
      />
      {error ? <HelperText type="error">{error}</HelperText> : null}
      <Button 
        mode="contained" 
        onPress={handleRegister} 
        style={styles.button}
        loading={loading}
        disabled={loading || !email || !password || !name}
      >
        Register
      </Button>
      <Button 
        onPress={() => router.push('/(auth)/login')}
        disabled={loading}
      >
        Already have an account? Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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
});