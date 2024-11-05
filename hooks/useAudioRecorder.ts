// app/hooks/useAudioRecorder.ts
import { useState, useCallback } from 'react';
import { audioService } from '@/app/services/audioService';


export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      await audioService.startRecording();
      setIsRecording(true);
    } catch (err) {
      setError('Failed to start recording');
      console.error(err);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    try {
      setError(null);
      const uri = await audioService.stopRecording();
      setRecordingUri(uri);
      setIsRecording(false);
    } catch (err) {
      setError('Failed to stop recording');
      console.error(err);
    }
  }, []);

  const playRecording = useCallback(async () => {
    if (!recordingUri) return;
    
    try {
      setError(null);
      await audioService.playRecording(recordingUri);
      setIsPlaying(true);
    } catch (err) {
      setError('Failed to play recording');
      console.error(err);
    }
  }, [recordingUri]);

  const stopPlaying = useCallback(async () => {
    try {
      setError(null);
      await audioService.stopPlaying();
      setIsPlaying(false);
    } catch (err) {
      setError('Failed to stop playing');
      console.error(err);
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