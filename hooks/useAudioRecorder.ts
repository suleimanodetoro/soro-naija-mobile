// app/hooks/useAudioRecorder.ts
import { audioService } from '@/app/services/audioService';
import { useState, useCallback } from 'react';

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      console.log('Hook: Starting recording...');
      await audioService.startRecording();
      setIsRecording(true);
      console.log('Hook: Recording started');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start recording';
      console.error('Hook: Recording error:', errorMessage);
      setError(errorMessage);
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    try {
      setError(null);
      console.log('Hook: Stopping recording...');
      const uri = await audioService.stopRecording();
      console.log('Hook: Got recording URI:', uri);
      setRecordingUri(uri);
      setIsRecording(false);
      return uri;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to stop recording';
      console.error('Hook: Stop recording error:', errorMessage);
      setError(errorMessage);
      setIsRecording(false);
      return undefined;
    }
  }, []);

  const playRecording = useCallback(async () => {
    if (!recordingUri) {
      setError('No recording available to play');
      return;
    }
    
    try {
      setError(null);
      console.log('Hook: Playing recording:', recordingUri);
      await audioService.playRecording(recordingUri);
      setIsPlaying(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to play recording';
      console.error('Hook: Playback error:', errorMessage);
      setError(errorMessage);
      setIsPlaying(false);
    }
  }, [recordingUri]);

  const stopPlaying = useCallback(async () => {
    try {
      setError(null);
      console.log('Hook: Stopping playback');
      await audioService.stopPlaying();
      setIsPlaying(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to stop playing';
      console.error('Hook: Stop playback error:', errorMessage);
      setError(errorMessage);
      setIsPlaying(false);
    }
  }, []);

  return {
    isRecording,
    isPlaying,
    recordingUri,
    error,
    startRecording,
    stopRecording,
    playRecording,
    stopPlaying,
  };
}