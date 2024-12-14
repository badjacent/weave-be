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
  submitButton: {
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default AddActivity;