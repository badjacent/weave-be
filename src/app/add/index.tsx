import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import AddActivity from '../../components/AddActivity';
import { moodService } from '../../services/moodService';
import { activityService } from '../../services/activityService';

export default function AddActivityScreen() {
  const [moods, setMoods] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadMoods = async () => {
      const moodData = await moodService.getAllMoods();
      setMoods(moodData);
    };
    loadMoods();
  }, []);

  const handleActivityAdded = async () => {
    // After adding, go back to previous screen
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
      <Link href=".." style={{ color: '#ffffff', padding: 20 }}>
        ← Back
      </Link>
      <AddActivity 
        onActivityAdded={handleActivityAdded}
        moods={moods}
      />
    </View>
  );
}