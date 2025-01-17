import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { spacing, colors, commonStyles } from '../theme/theme';

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
    ...commonStyles.gap10,
  },
  link: {
    color: colors.text.primary,
    marginBottom: spacing.md,
  }
});

export default MoodList;