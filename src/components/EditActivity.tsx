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
import { spacing, typography, colors, commonStyles, componentStyles } from '../theme/theme';

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
    padding: spacing.lg,
    backgroundColor: colors.background.primary,
  },
  title: {
    fontSize: typography.size.large * 1.3,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  input: {
    ...componentStyles.input,
  },
  moodGrid: {
    ...commonStyles.row,
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  moodItem: {
    ...commonStyles.row,
    marginRight: spacing.md,
  },
  moodLabel: {
    color: colors.text.primary,
    marginLeft: spacing.xs,
  },
  sliderContainer: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    width: 100,
    marginBottom: spacing.xs,
  },
  sliderRow: {
    ...commonStyles.row,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    color: colors.text.primary,
    minWidth: 40,
    textAlign: 'right',
  },
  buttonContainer: {
    ...commonStyles.row,
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  saveButton: {
    ...componentStyles.button,
    flex: 1,
  },
  deleteButton: {
    ...componentStyles.button,
    flex: 1,
    backgroundColor: colors.status.danger,
  },
  buttonText: {
    color: colors.text.primary,
    fontWeight: typography.weight.bold,
  },
});

export default EditActivity;