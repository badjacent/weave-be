import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  Switch 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Activity } from '../types/types';
import { activityService } from '../services/activityService';
import { FIELDS } from '../constants/fields';
import Slider from '@react-native-community/slider';
import { spacing, typography, colors, commonStyles, componentStyles } from '../theme/theme';


interface AddActivityProps {
  onActivityAdded: () => Promise<void>;
  moods: string[];
}

const AddActivity: React.FC<AddActivityProps> = ({ onActivityAdded, moods }) => {
  const router = useRouter();
  const { mood } = useLocalSearchParams();
  const preselectedMood = mood as string | undefined;
  
  const [name, setName] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<string[]>(
    preselectedMood ? [preselectedMood] : []
  );
  const [fieldStrengths, setFieldStrengths] = useState<Record<string, number>>(
    Object.keys(FIELDS).reduce((acc, field) => ({
      ...acc,
      [field]: 0
    }), {})
  );

  const handleSubmit = async () => {
    const newActivity = {
      id: Date.now().toString(),
      name,
      moods: selectedMoods,
      fieldStrengths
    };

    await activityService.addActivity(newActivity);
    await onActivityAdded();
    router.back();
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
      <Text style={styles.title}>Add New Activity</Text>
      
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

      <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Add Activity</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: '#1a1a1a',
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
  submitButton: {
    ...componentStyles.button,
    marginTop: spacing.lg,
  },
  submitButtonText: {
    color: colors.text.primary,
    fontWeight: typography.weight.bold,
  },
});

export default AddActivity;