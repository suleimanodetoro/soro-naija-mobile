// app/services/audioService.ts
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';

class AudioService {
  private recording: Audio.Recording | null = null;
  private sound: Audio.Sound | null = null;

  async setupRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    } catch (error) {
      console.error('Failed to setup recording:', error);
      throw error;
    }
  }

  async startRecording(): Promise<void> {
    try {
      await this.setupRecording();
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      this.recording = recording;
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  async stopRecording(): Promise<string> {
    try {
      if (!this.recording) throw new Error('No recording in progress');
      
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      if (!uri) throw new Error('No recording URI available');
      
      this.recording = null;
      return uri;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      throw error;
    }
  }

  async playRecording(uri: string): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
      }
      
      const { sound } = await Audio.Sound.createAsync({ uri });
      this.sound = sound;
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to play recording:', error);
      throw error;
    }
  }

  async stopPlaying(): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
      }
    } catch (error) {
      console.error('Failed to stop playing:', error);
      throw error;
    }
  }
}

export const audioService = new AudioService();