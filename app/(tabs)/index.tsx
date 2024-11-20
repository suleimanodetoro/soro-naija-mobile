// app/(tabs)/index.tsx
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useWhisperTranscription } from '@/hooks/useWhisperTranscription';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, Card, IconButton, Portal, Modal, ProgressBar } from 'react-native-paper';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ha', name: 'Hausa' },
  { code: 'ig', name: 'Igbo' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'pcm', name: 'Nigerian Pidgin' },
];

export default function TranslateScreen() {
  const {
    isRecording,
    isPlaying,
    recordingUri,
    error: recordingError,
    startRecording,
    stopRecording,
    playRecording,
    stopPlaying,
  } = useAudioRecorder();

  const {
    transcribe,
    isTranscribing,
    transcriptionResult,
    error: transcriptionError,
  } = useWhisperTranscription();

  const [translating, setTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectingLanguage, setSelectingLanguage] = useState<'from' | 'to' | null>(null);
  const [fromLanguage, setFromLanguage] = useState(LANGUAGES[0]);
  const [toLanguage, setToLanguage] = useState(LANGUAGES[1]);

  const handleStartRecording = async () => {
    try {
      console.log('Starting recording...');
      await startRecording();
      console.log('Recording started successfully');
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const handleStopRecording = async () => {
    try {
      console.log('Stopping recording...');
      const uri = await stopRecording();
      console.log('Recording stopped, uri:', uri);
      
      if (uri) {
        console.log('Starting transcription...');
        console.log('Source language:', fromLanguage.code);
        const result = await transcribe(uri, fromLanguage.code);
        console.log('Transcription result:', result);
      } else {
        console.log('No URI received from stopRecording');
      }
    } catch (err) {
      console.error('Failed to process recording:', err);
    }
  };

  const handleTranslate = async () => {
    if (!transcriptionResult) {
      console.log('No transcription result available for translation');
      return;
    }
    
    try {
      console.log('Starting translation...');
      setTranslating(true);
      const result = await transcribe(recordingUri!, fromLanguage.code, 'translate');
      console.log('Translation result:', result);
      setTranslatedText(result.text);
    } catch (err) {
      console.error('Translation failed:', err);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.languageCard}>
        <Card.Content>
          <View style={styles.languageSelector}>
            <View style={styles.languageItem}>
              <Text variant="labelLarge">From:</Text>
              <Button
                mode="outlined"
                onPress={() => {
                  setSelectingLanguage('from');
                  setShowLanguageModal(true);
                }}
              >
                {fromLanguage.name}
              </Button>
            </View>
            
            <IconButton
              icon="swap-horizontal"
              onPress={() => {
                const temp = fromLanguage;
                setFromLanguage(toLanguage);
                setToLanguage(temp);
              }}
            />
            
            <View style={styles.languageItem}>
              <Text variant="labelLarge">To:</Text>
              <Button
                mode="outlined"
                onPress={() => {
                  setSelectingLanguage('to');
                  setShowLanguageModal(true);
                }}
              >
                {toLanguage.name}
              </Button>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.recordingSection}>
        {(recordingError || transcriptionError) && (
          <Text style={styles.errorText}>
            {recordingError || transcriptionError}
          </Text>
        )}
        
        <View style={styles.recordingControls}>
          <Button
            mode="contained"
            onPress={isRecording ? handleStopRecording : handleStartRecording}
            icon={isRecording ? 'stop' : 'microphone'}
            style={[styles.controlButton, isRecording && styles.recordingButton]}
            disabled={isTranscribing || translating}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>

          {/* Debug info in development */}
          {__DEV__ && (
            <Text style={styles.debugText}>
              {recordingUri ? `Recording URI: ${recordingUri}` : 'No recording URI yet'}
            </Text>
          )}

          {recordingUri && !isRecording && !isTranscribing && (
            <Button
              mode="outlined"
              onPress={isPlaying ? stopPlaying : playRecording}
              icon={isPlaying ? 'stop' : 'play'}
              style={styles.controlButton}
              disabled={isTranscribing || translating}
            >
              {isPlaying ? 'Stop' : 'Play'}
            </Button>
          )}
        </View>

        {(isTranscribing || translating) && (
          <View style={styles.processingContainer}>
            <Text>{isTranscribing ? 'Transcribing...' : 'Translating...'}</Text>
            <ProgressBar indeterminate style={styles.progressBar} />
          </View>
        )}

        {/* Debug info for states */}
        {__DEV__ && (
          <View style={styles.debugSection}>
            <Text style={styles.debugText}>isRecording: {String(isRecording)}</Text>
            <Text style={styles.debugText}>isTranscribing: {String(isTranscribing)}</Text>
            <Text style={styles.debugText}>isTranslating: {String(translating)}</Text>
            <Text style={styles.debugText}>From Language: {fromLanguage.code}</Text>
            <Text style={styles.debugText}>To Language: {toLanguage.code}</Text>
          </View>
        )}

        {transcriptionResult && !translating && (
          <Card style={styles.resultCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.resultTitle}>
                Transcription:
              </Text>
              <Text variant="bodyLarge">{transcriptionResult}</Text>
              
              <Button
                mode="contained"
                onPress={handleTranslate}
                icon="translate"
                style={[styles.controlButton, styles.translateButton]}
                loading={translating}
                disabled={translating}
              >
                Translate
              </Button>
            </Card.Content>
          </Card>
        )}

        {translatedText && (
          <Card style={styles.resultCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.resultTitle}>
                Translation:
              </Text>
              <Text variant="bodyLarge">{translatedText}</Text>
            </Card.Content>
          </Card>
        )}
      </View>

      <Portal>
        <Modal
          visible={showLanguageModal}
          onDismiss={() => {
            setShowLanguageModal(false);
            setSelectingLanguage(null);
          }}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            Select Language
          </Text>
          {LANGUAGES.map((lang) => (
            <Button
              key={lang.code}
              mode="outlined"
              onPress={() => {
                if (selectingLanguage === 'from') {
                  setFromLanguage(lang);
                } else {
                  setToLanguage(lang);
                }
                setShowLanguageModal(false);
                setSelectingLanguage(null);
              }}
              style={styles.languageButton}
            >
              {lang.name}
            </Button>
          ))}
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  languageCard: {
    marginBottom: 16,
  },
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageItem: {
    alignItems: 'center',
  },
  recordingSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingControls: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  controlButton: {
    width: 200,
  },
  recordingButton: {
    backgroundColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    marginBottom: 16,
  },
  translatingContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  progressBar: {
    width: 200,
    height: 4,
    marginTop: 8,
  },
  translationCard: {
    marginTop: 24,
    width: '100%',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  languageButton: {
    marginVertical: 4,
  },
  resultCard: {
    marginTop: 24,
    width: '100%',
  },
  resultTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  translateButton: {
    marginTop: 16,
  },
  processingContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  debugText: {
    fontSize: 10,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  debugSection: {
    marginTop: 16,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    width: '100%',
  },
});