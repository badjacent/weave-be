import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Link } from 'expo-router';
import EditActivity from '../../../components/EditActivity';
import { moodService } from '../../../services/moodService';
import { activityService } from '../../../services/activityService';

export default function EditActivityScreen() {
  const [moods, setMoods] = useState<string[]>([]);

  useEffect(() => {
    const loadMoods = async () => {
      const moodData = await moodService.getAllMoods();
      setMoods(moodData);
    };
    loadMoods();
  }, []);

  const handleActivityUpdated = async () => {
    // Any refresh logic needed after update
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
      <Link href=".." style={{ color: '#ffffff', padding: 20 }}>
        ← Back
      </Link>
      <EditActivity 
        onActivityUpdated={handleActivityUpdated}
        moods={moods}
      />
    </View>
  );
}