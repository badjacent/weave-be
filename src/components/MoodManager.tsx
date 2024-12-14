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
      <Text style={styles.title}>Manage Moods</Text>
      
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
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#666',
    padding: 10,
    borderRadius: 4,
  },
  addButton: {
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 4,
    justifyContent: 'center',
  },
  moodList: {
    flex: 1,
  },
  moodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#333',
    marginBottom: 10,
    borderRadius: 4,
  },
  moodText: {
    color: '#ffffff',
  },
  deleteButton: {
    backgroundColor: '#c42',
    padding: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: '#ffffff',
  },
});

export default MoodManager;