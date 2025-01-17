import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView 
} from 'react-native';
import { moodService } from '../services/moodService';
import { spacing, typography, colors, commonStyles, componentStyles } from '../theme/theme';

interface MoodManagerProps {
  moods: string[];
  onMoodsUpdated: () => Promise<void>;
}

const MoodManager: React.FC<MoodManagerProps> = ({ moods, onMoodsUpdated }) => {
  const [newMood, setNewMood] = useState('');

  const handleAddMood = async () => {
    if (newMood.trim()) {
      await moodService.addMood(newMood.trim().toLowerCase());
      await onMoodsUpdated();
      setNewMood('');
    }
  };

  const handleDeleteMood = async (mood: string) => {
    Alert.alert(
      'Delete Mood',
      `Are you sure you want to delete "${mood}"? This will remove the mood tag from all activities.`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await moodService.deleteMood(mood);
            await onMoodsUpdated();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Mbbbboods</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          value={newMood}
          onChangeText={setNewMood}
          placeholder="New mood name"
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TouchableOpacity
          onPress={handleAddMood}
          style={styles.addButton}
        >
          <Text style={styles.buttonText}>Add Mood</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.moodList}>
        {moods.map(mood => (
          <View key={mood} style={styles.moodItem}>
            <Text style={styles.moodText}>{mood}</Text>
            <TouchableOpacity
              onPress={() => handleDeleteMood(mood)}
              style={styles.deleteButton}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.size.large * 1.3,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.lg,
  },
  inputContainer: {
    ...commonStyles.row,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  input: {
    flex: 1,
    ...componentStyles.input,
  },
  addButton: {
    ...componentStyles.button,
    justifyContent: 'center',
  },
  moodList: {
    flex: 1,
  },
  moodItem: {
    ...commonStyles.row,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    marginBottom: spacing.md,
    borderRadius: 4,
  },
  moodText: {
    color: colors.text.primary,
  },
  deleteButton: {
    ...componentStyles.button,
    backgroundColor: colors.status.danger,
  },
  buttonText: {
    color: colors.text.primary,
  },
});

export default MoodManager;