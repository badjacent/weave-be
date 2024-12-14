import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { Activity as ActivityType } from '../../../types/types';
import Activity from '../../../components/Activity';
import { activityService } from '../../../services/activityService';



export default function MoodActivityList() {
  const { mood } = useLocalSearchParams();
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [isRandomMode, setIsRandomMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [flashingId, setFlashingId] = useState<string | null>(null);
  const [flashCount, setFlashCount] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);  const [sortField, setSortField] = useState<string | null>(null);

  

  const toggleRandomMode = () => {
    if (isRandomMode && selectedIds.length > 0) {
      // Start flashing a random selection
      const randomId = selectedIds[Math.floor(Math.random() * selectedIds.length)];
      console.log('Starting flash for activity:', randomId);
      setFlashingId(randomId);
      setFlashCount(0);
      setIsFlashing(true);
    }
    setIsRandomMode(!isRandomMode);
    setSelectedIds([]);
  };

  useEffect(() => {
    loadActivities();    
    if (flashingId && flashCount < 10) {
        console.log('Flash count:', flashCount);
        const timer = setTimeout(() => {
        setIsFlashing(prev => !prev);
        setFlashCount(prev => prev + 1);
        }, 300);
        return () => clearTimeout(timer);
    } else if (flashCount >= 10) {
        console.log('Flashing complete');
        setFlashingId(null);
        setFlashCount(0);
        setIsFlashing(false);
  }  }, [flashingId, flashCount, isFlashing]);

  const loadActivities = async () => {
    if (!mood) {
      console.log('No mood parameter');
      return;
    }
    console.log('Loading activities for mood:', mood);
    const allActivities = await activityService.getAllActivities();
    console.log('All activities:', allActivities);
    const filteredActivities = allActivities.filter(
      activity => activity.moods.includes(mood.toString())
    );
    console.log('Filtered activities:', filteredActivities);
    setActivities(filteredActivities);
  };

  const handleActivitySelect = (id: string) => {
    if (!isRandomMode) return;
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleFieldClick = (field: string) => {
    setSortField(field);
  };

  const sortedActivities = React.useMemo(() => {
    if (!sortField) return activities;
    return [...activities].sort((a, b) => {
      const valueA = a.fieldStrengths[sortField] || 0;
      const valueB = b.fieldStrengths[sortField] || 0;
      return valueB - valueA;
    });
  }, [activities, sortField]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Link href="/" style={styles.backLink}>
          ← Back
        </Link>
        <View style={styles.headerButtons}>
          <Link 
            href={`/add?mood=${mood}`}
            style={styles.addButton}
          >
            +
          </Link>
          <Text 
            onPress={toggleRandomMode}
            style={styles.diceButton}
          >
            {isRandomMode ? '🎲 Done' : '🎲'}
          </Text>
        </View>
      </View>

      <Text style={styles.moodTitle}>{mood}</Text>

      {sortedActivities.map((activity) => (
        <View
        key={activity.id}
        style={[
            styles.activityContainer,
            activity.id === flashingId && isFlashing && styles.flashingActivity,
            selectedIds.includes(activity.id) && styles.selectedActivity
        ]}
        >
        <Activity 
            {...activity}
            isRandomMode={isRandomMode}
            isSelected={selectedIds.includes(activity.id)}
            onSelect={handleActivitySelect}
            onFieldClick={handleFieldClick}
        />
        </View>      
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  backLink: {
    color: '#ffffff',
  },
  addButton: {
    color: '#ffffff',
    fontSize: 24,
  },
  diceButton: {
    color: '#ffffff',
    fontSize: 20,
  },
  moodTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  activityContainer: {
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 2,
  },
  selectedActivity: {
    backgroundColor: '#333',
  },
  flashingActivity: {
    backgroundColor: '#444',
  },
});

