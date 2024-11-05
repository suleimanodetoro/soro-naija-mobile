// app/(tabs)/index.tsx
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
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
    error,
    startRecording,
    stopRecording,
    playRecording,
    stopPlaying,
  } = useAudioRecorder();

  const [translating, setTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [translatedAudio, setTranslatedAudio] = useState<string | null>(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectingLanguage, setSelectingLanguage] = useState<'from' | 'to' | null>(null);
  const [fromLanguage, setFromLanguage] = useState(LANGUAGES[0]);
  const [toLanguage, setToLanguage] = useState(LANGUAGES[1]);

  const handleTranslate = async () => {
    if (!recordingUri) return;
    
    try {
      setTranslating(true);
      // TODO: Implement translation logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
      setTranslatedText("Translation will appear here...");
      setTranslatedAudio("translated-audio-uri");
    } catch (err) {
      console.error('Translation failed:', err);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <View style={styles.container}>
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
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        
        <View style={styles.recordingControls}>
          <Button
            mode="contained"
            onPress={isRecording ? stopRecording : startRecording}
            icon={isRecording ? 'stop' : 'microphone'}
            style={[styles.controlButton, isRecording && styles.recordingButton]}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>

          {recordingUri && !isRecording && (
            <>
              <Button
                mode="outlined"
                onPress={isPlaying ? stopPlaying : playRecording}
                icon={isPlaying ? 'stop' : 'play'}
                style={styles.controlButton}
              >
                {isPlaying ? 'Stop' : 'Play'}
              </Button>
              
              <Button
                mode="contained"
                onPress={handleTranslate}
                icon="translate"
                style={styles.controlButton}
                loading={translating}
                disabled={translating}
              >
                Translate
              </Button>
            </>
          )}
        </View>

        {translating && (
          <View style={styles.translatingContainer}>
            <Text>Translating...</Text>
            <ProgressBar indeterminate style={styles.progressBar} />
          </View>
        )}

        {translatedText && (
          <Card style={styles.translationCard}>
            <Card.Content>
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
    </View>
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
});