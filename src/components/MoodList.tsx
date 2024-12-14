import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

interface MoodListProps {
  moods: string[];
}

const MoodList: React.FC<MoodListProps> = ({ moods }) => {
  return (
    <View style={styles.container}>
      {moods.map((mood) => (
        <Link
          key={mood}
          href={`/mood/${mood}`}
          style={styles.link}
        >
          {mood}
        </Link>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  link: {
    color: '#ffffff',
    marginBottom: 10,
  }
});

export default MoodList;