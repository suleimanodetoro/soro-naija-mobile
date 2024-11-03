// app/(tabs)/community.tsx
import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Avatar } from 'react-native-paper';

const DUMMY_POSTS = [
  {
    id: '1',
    user: 'John Doe',
    language: 'Yoruba',
    audioUrl: 'dummy_url',
    likes: 24,
    comments: 5,
  },
  // Add more dummy data
];

export default function CommunityScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={DUMMY_POSTS}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title
              title={item.user}
              subtitle={`Learning ${item.language}`}
              left={(props) => <Avatar.Text {...props} label={item.user[0]} />}
            />
            <Card.Content>
              <Text variant="bodyMedium">Audio recording</Text>
            </Card.Content>
            <Card.Actions>
              <Text>{item.likes} likes</Text>
              <Text>{item.comments} comments</Text>
            </Card.Actions>
          </Card>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
  },
});