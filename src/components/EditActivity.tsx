import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  Switch,
  Alert 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Slider from '@react-native-community/slider';
import { activityService } from '../services/activityService';
import { FIELDS } from '../constants/fields';
import { Activity } from '../types/types';

interface EditActivityProps {
  onActivityUpdated: () => Promise<void>;
  moods: string[];
}

const EditActivity: React.FC<EditActivityProps> = ({ onActivityUpdated, moods }) => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [fieldStrengths, setFieldStrengths] = useState<Record<string, number>>(
    Object.keys(FIELDS).reduce((acc, field) => ({
      ...acc,
      [field]: 0
    }), {})
  );

  useEffect(() => {
    const loadActivity = async () => {
      if (!id) return;
      const activities = await activityService.getAllActivities();
      const activity = activities.find(a => a.id === id);
      if (activity) {
        setName(activity.name);
        setSelectedMoods(activity.moods);
        setFieldStrengths(activity.fieldStrengths);
      }
    };
    loadActivity();
  }, [id]);

  const handleSubmit = async () => {
    if (!id) return;

    const updatedActivity: Activity = {
      id: id.toString(),
      name,
      moods: selectedMoods,
      fieldStrengths
    };

    await activityService.updateActivity(updatedActivity);
    await onActivityUpdated();
    router.back();
  };

  const handleDelete = async () => {
    console.log('Delete initiated for id:', id);
    if (!id) {
      console.log('No ID found, returning');
      return;
    }
  
    // Use window.confirm for web
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        console.log('Attempting to delete activity:', id.toString());
        await activityService.deleteActivity(id.toString());
        console.log('Activity deleted from storage');
        await onActivityUpdated();
        console.log('Parent component updated');
        router.back();
      } catch (error) {
        console.error('Error during deletion:', error);
      }
    }
  };
      
  const toggleMood = (mood: string) => {
    setSelectedMoods(prev => 
      prev.includes(mood)
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Activity</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Moods:</Text>
        <View style={styles.moodGrid}>
          {moods.map(mood => (
            <View key={mood} style={styles.moodItem}>
              <Switch
                value={selectedMoods.includes(mood)}
                onValueChange={() => toggleMood(mood)}
              />
              <Text style={styles.moodLabel}>{mood}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        {Object.entries(FIELDS).map(([fieldKey, field]) => (
          <View key={fieldKey} style={styles.sliderContainer}>
            <Text style={[styles.fieldLabel, { color: field.color }]}>
              {field.name}:
            </Text>
            <View style={styles.sliderRow}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                step={0.1}
                value={fieldStrengths[fieldKey]}
                onValueChange={(value) => setFieldStrengths(prev => ({
                  ...prev,
                  [fieldKey]: value
                }))}
                minimumTrackTintColor={field.color}
                maximumTrackTintColor="#666"
              />
              <Text style={styles.sliderValue}>
                {fieldStrengths[fieldKey].toFixed(1)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Delete Activity</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#ffffff',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#333',
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#666',
    padding: 10,
    borderRadius: 4,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  moodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  moodLabel: {
    color: '#ffffff',
    marginLeft: 5,
  },
  sliderContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    width: 100,
    marginBottom: 5,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    color: '#ffffff',
    minWidth: 40,
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#c42',
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default EditActivity;