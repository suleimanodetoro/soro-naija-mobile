
// app/hooks/useWhisperTranscription.ts
import { whisperService } from '@/app/services/whisperService';
import { useState } from 'react';

export function useWhisperTranscription() {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const transcribe = async (
    audioUri: string,
    language?: string,
    task: 'transcribe' | 'translate' = 'transcribe'
  ) => {
    try {
      setIsTranscribing(true);
      setError(null);

      const result = await whisperService.transcribeAudio(audioUri, {
        language,
        task,
        return_timestamps: true,
      });

      setTranscriptionResult(result.text);
      return result;
    } catch (err) {
      setError('Failed to transcribe audio');
      console.error(err);
      throw err;
    } finally {
      setIsTranscribing(false);
    }
  };

  return {
    transcribe,
    isTranscribing,
    transcriptionResult,
    error,
  };
}