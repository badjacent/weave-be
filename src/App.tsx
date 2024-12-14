import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Navigator } from 'expo-router';
import { activityService, initializeData } from './services/activityService';
import { moodService } from '../src/services/moodService';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await initializeData();
        await moodService.initializeDefaultMoods([
          'morning', 'exercise', 'quiet', 'evening', 'social', 'learning'
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#ffffff' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
      <Navigator />
    </View>
  );
}