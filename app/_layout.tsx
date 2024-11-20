// app/_layout.tsx
import { useEffect } from 'react';
import { Slot, useSegments, useRouter } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useAuthStore } from './store/auth';

const queryClient = new QueryClient();

export default function RootLayout() {
  console.log('Root layout rendering');
  const segments = useSegments();
  const router = useRouter();
  const { token, isLoading } = useAuthStore();

  useEffect(() => {
    console.log('Auth effect running', { token, isLoading, segments });
    if (!isLoading) {
      const inAuthGroup = segments[0] === '(auth)';
      
      if (!token && !inAuthGroup) {
        // Redirect to the sign-in page.
        router.replace('/(auth)/login');
      } else if (token && inAuthGroup) {
        // Redirect away from the sign-in page.
        router.replace('/(tabs)');
      }
    }
  }, [token, segments, isLoading]);

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <Slot />
      </PaperProvider>
    </QueryClientProvider>
  );
}