// app/services/audioService.ts
import * as FileSystem from 'expo-file-system';
import {
  Audio,
  InterruptionModeIOS,
  InterruptionModeAndroid,
} from 'expo-av';
import type { RecordingOptions } from 'expo-av/build/Audio';
import { Platform } from 'react-native';

// Optimized recording settings for Whisper
const RECORDING_OPTIONS: RecordingOptions = {
  android: {
    extension: '.m4a',
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
    audioQuality: Audio.IOSAudioQuality.MAX,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,

  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 128000,
  },
};

class AudioService {
  private recording: Audio.Recording | null = null;
  private sound: Audio.Sound | null = null;
  private isAudioSetup = false;

  async setupRecording() {
    try {
      if (this.isAudioSetup) {
        console.log('Audio already setup');
        return;
      }

      console.log('Setting up audio recording...');

      const permissionResponse = await Audio.requestPermissionsAsync();
      console.log('Permission response:', permissionResponse);

      if (!permissionResponse.granted) {
        throw new Error('Permission to record audio was denied');
      }

      await this.cleanup();

      if (Platform.OS === 'ios') {
        try {
          await Audio.setIsEnabledAsync(true);
        } catch (e) {
          console.warn('Failed to enable Audio module:', e);
        }
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        shouldDuckAndroid: true,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        playThroughEarpieceAndroid: false,
      });

      this.isAudioSetup = true;
      console.log('Audio recording setup completed successfully');
    } catch (error) {
      console.error('Failed to setup recording:', error);
      this.isAudioSetup = false;
      throw new Error(
        error instanceof Error ? error.message : 'Failed to setup recording'
      );
    }
  }

  async startRecording(): Promise<void> {
    try {
      console.log('Initializing recording process...');

      if (!this.isAudioSetup) {
        await this.setupRecording();
      }

      if (this.recording) {
        console.log('Cleaning up previous recording...');
        await this.recording.stopAndUnloadAsync();
        this.recording = null;
      }

      console.log('Creating new recording with optimized settings...');
      this.recording = new Audio.Recording();
      await this.recording.prepareToRecordAsync(RECORDING_OPTIONS);
      await this.recording.startAsync();

      console.log('Recording started successfully');
    } catch (error) {
      console.error('Failed to start recording:', error);
      this.recording = null;
      throw new Error(
        error instanceof Error ? error.message : 'Failed to start recording'
      );
    }
  }

  async stopRecording(): Promise<string> {
    try {
      console.log('Stopping recording...');

      if (!this.recording) {
        throw new Error('No active recording found');
      }

      await this.recording.stopAndUnloadAsync();

      const uri = this.recording.getURI();
      console.log('Recording URI:', uri);

      if (!uri) {
        throw new Error('Failed to get recording URI');
      }

      const fileInfo = await FileSystem.getInfoAsync(uri);
      console.log('Recording file info:', fileInfo);

      if (!fileInfo.exists) {
        throw new Error('Recording file not found');
      }

      if (fileInfo.size < 100) {
        throw new Error('Recording file is too small, possibly corrupted');
      }

      this.recording = null;

      return uri;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to stop recording'
      );
    }
  }

  async playRecording(uri: string): Promise<void> {
    try {
      console.log('Starting playback for URI:', uri);

      if (this.sound) {
        console.log('Unloading previous sound...');
        await this.sound.unloadAsync();
        this.sound = null;
      }

      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error('Audio file not found');
      }

      console.log('Loading sound file...');
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );

      this.sound = sound;

      this.sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) {
          console.error('Playback status error:', status);
          return;
        }

        if (status.didJustFinish) {
          console.log('Playback finished');
          this.stopPlaying().catch(console.error);
        }
      });

      console.log('Playback started successfully');
    } catch (error) {
      console.error('Failed to play recording:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to play recording'
      );
    }
  }

  async stopPlaying(): Promise<void> {
    try {
      console.log('Stopping playback...');

      if (!this.sound) {
        console.log('No active sound to stop');
        return;
      }

      await this.sound.stopAsync();
      await this.sound.unloadAsync();
      this.sound = null;

      console.log('Playback stopped successfully');
    } catch (error) {
      console.error('Failed to stop playing:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to stop playing'
      );
    }
  }

  async cleanup(): Promise<void> {
    try {
      console.log('Cleaning up audio resources...');

      if (this.recording) {
        await this.recording.stopAndUnloadAsync();
        this.recording = null;
      }

      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }

      console.log('Cleanup completed successfully');
    } catch (error) {
      console.error('Failed to cleanup audio resources:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to cleanup audio resources'
      );
    }
  }
}

export const audioService = new AudioService();
