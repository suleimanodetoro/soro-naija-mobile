// app/(tabs)/index.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Card, IconButton } from 'react-native-paper';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import * as FileSystem from 'expo-file-system';

const audioRecorderPlayer = new AudioRecorderPlayer();

export default function TranslateScreen() {
  const [isRecording, setIsRecording] = React.useState(false);
  const [selectedFromLanguage, setSelectedFromLanguage] = React.useState('English');
  const [selectedToLanguage, setSelectedToLanguage] = React.useState('Yoruba');

  const startRecording = async () => {
    try {
      const path = `${FileSystem.cacheDirectory}recording.m4a`;
      await audioRecorderPlayer.startRecorder(path);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorderPlayer.stopRecorder();
      setIsRecording(false);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.languageCard}>
        <Card.Content style={styles.languageSelector}>
          <View style={styles.languageItem}>
            <Text variant="labelLarge">From:</Text>
            <Text variant="titleMedium">{selectedFromLanguage}</Text>
            <IconButton icon="chevron-down" onPress={() => {}} />
          </View>
          <IconButton icon="swap-horizontal" onPress={() => {}} />
          <View style={styles.languageItem}>
            <Text variant="labelLarge">To:</Text>
            <Text variant="titleMedium">{selectedToLanguage}</Text>
            <IconButton icon="chevron-down" onPress={() => {}} />
          </View>
        </Card.Content>
      </Card>

      <View style={styles.recordingSection}>
        <Button
          mode="contained"
          onPress={isRecording ? stopRecording : startRecording}
          icon={isRecording ? 'stop' : 'microphone'}
          style={styles.recordButton}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
        <Text style={styles.hint}>
          {isRecording ? 'Recording...' : 'Tap to start recording'}
        </Text>
      </View>
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
    marginTop: 16,
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
  recordButton: {
    padding: 8,
    borderRadius: 30,
  },
  hint: {
    marginTop: 16,
    color: '#666',
  },
});