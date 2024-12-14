import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Link } from 'expo-router';
import MoodManager from '../../components/MoodManager';
import { moodService } from '../../services/moodService';

export default function ManageMoods() {
  const [moods, setMoods] = useState<string[]>([]);

  useEffect(() => {
    loadMoods();
  }, []);

  const loadMoods = async () => {
    const moodData = await moodService.getAllMoods();
    setMoods(moodData);
  };

  const handleMoodsUpdated = async () => {
    await loadMoods();
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#1a1a1a' }}>
      <Link href="/" style={{ color: '#ffffff', marginBottom: 20 }}>
        ← Back
      </Link>
      <MoodManager 
        moods={moods}
        onMoodsUpdated={handleMoodsUpdated}
      />
    </View>
  );
}