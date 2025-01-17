import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Link } from 'expo-router';
import MoodList from '../components/MoodList';
import { moodService } from '../services/moodService';
import { activityService, initializeData } from '../services/activityService';

export default function Home() {
  const [moods, setMoods] = useState<string[]>([]);

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('Starting initialization...');
        
        // Initialize activities
        try {
          await initializeData();
          console.log('Activities initialized successfully');
        } catch (error) {
          console.error('Error initializing activities:', error);
        }

        // Initialize moods
        try {
          await moodService.initializeDefaultMoods([
            'morning', 'exercise', 'quiet', 'evening', 'social', 'learning'
          ]);
          console.log('Moods initialized successfully');
          
          // Load moods
          const loadedMoods = await moodService.getAllMoods();
          console.log('Loaded moods:', loadedMoods);
          setMoods(loadedMoods);
        } catch (error) {
          console.error('Error with moods:', error);
        }
      } catch (error) {
        console.error('Error in main initialization:', error);
      }
    };

    initialize();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#1a1a1a' }}>
      <MoodList moods={moods} />
      <Link href="/manage-moods" style={{ color: '#ffffff' }}>H Moods</Link>
    </View>
  );
}