// app/services/whisperService.ts
import * as FileSystem from 'expo-file-system';
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const HUGGING_FACE_API_KEY = Constants.expoConfig.extra.HUGGING_FACE_API_KEY;
interface TranscriptionOptions {
  language?: string;
  task?: 'transcribe' | 'translate';
  return_timestamps?: boolean | 'word';
}

interface TranscriptionResult {
  text: string;
  segments?: Array<{
    text: string;
    start: number;
    end: number;
  }>;
  language?: string;
}

class WhisperService {
  private MODEL_ID = 'openai/whisper-large-v3-turbo';
  private API_URL = `https://api-inference.huggingface.co/models/${this.MODEL_ID}`;

  private async convertAudioToWav(sourceUri: string): Promise<string> {
    try {
      console.log('Converting audio to WAV format...');
      
      // Adjust the source URI if necessary
      let adjustedSourceUri = sourceUri;
      if (Platform.OS === 'ios' && sourceUri.startsWith('file://')) {
        adjustedSourceUri = sourceUri.replace('file://', '');
      }

      // Create a target path in the app's documents directory
      const targetPath = `${FileSystem.documentDirectory}converted_audio.wav`;
      
      // FFmpeg command to convert to WAV with correct parameters for Whisper
      const command = `-y -i "${adjustedSourceUri}" -ar 16000 -ac 1 -c:a pcm_s16le "${targetPath}"`;
      
      console.log('Executing FFmpeg command:', command);
      await FFmpegKit.execute(command);
      
      console.log('Audio conversion completed. Target path:', targetPath);
      return targetPath;
    } catch (error) {
      console.error('Audio conversion failed:', error);
      throw new Error('Failed to convert audio format');
    }
  }

  async transcribeAudio(
    audioUri: string,
    options: TranscriptionOptions = {}
  ): Promise<TranscriptionResult> {
    try {
      console.log('Starting transcription process...');

      // Convert audio to WAV format
      const wavFile = await this.convertAudioToWav(audioUri);

      // Read the WAV file as a base64-encoded string
      console.log('Reading converted audio file as base64...');
      const base64Data = await FileSystem.readAsStringAsync(wavFile, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Prepare headers
      const headers: HeadersInit = {
        'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
        'Content-Type': 'application/json',
      };

      // Create URL with query parameters for options
      let url = this.API_URL;
      const queryParams: string[] = [];
      
      if (options.language) {
        queryParams.push(`language=${encodeURIComponent(options.language)}`);
      }
      if (options.task) {
        queryParams.push(`task=${encodeURIComponent(options.task)}`);
      }
      if (options.return_timestamps) {
        queryParams.push(`return_timestamps=${options.return_timestamps}`);
      }
      
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }

      console.log('Sending request to Hugging Face API...', url);

      // Create the payload with the base64-encoded audio
      const payload = {
        inputs: base64Data,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API request failed: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('Transcription result:', result);

      // Clean up the temporary file
      await FileSystem.deleteAsync(wavFile).catch(console.error);

      return {
        text: result.text || '',
        segments: result.segments || [],
        language: result.language,
      };
    } catch (error) {
      console.error('Transcription failed:', error);
      throw error;
    }
  }
}

export const whisperService = new WhisperService();
