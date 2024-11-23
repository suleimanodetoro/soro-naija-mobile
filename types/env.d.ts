// types/expo-env.d.ts
import 'expo-constants';

declare module 'expo-constants' {
  interface ExpoConfig {
    extra: {
      HUGGING_FACE_API_KEY: string;
      // Add other variables here
    };
  }

  // For SDK 48 and above
  export const expoConfig: ExpoConfig;
}
