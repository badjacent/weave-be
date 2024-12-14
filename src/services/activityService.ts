import AsyncStorage from '@react-native-async-storage/async-storage';
import { activities } from '../data/sampleData';
import { Activity } from '../types/types';

const STORAGE_KEY = 'activities';

// Add the Activity type interface if not already defined elsewhere
interface Activity {
  id: string;
  name: string;
  moods: string[];
  fieldStrengths: Record<string, number>;
}

class ActivityService {
  // Local storage methods
  private async saveToLocal(activities: Activity[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    } catch (error) {
      console.error('Error saving activities:', error);
      throw error;
    }
  }

  private async getFromLocal(): Promise<Activity[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting activities:', error);
      throw error;
    }
  }

  // API methods (to be implemented later)
  private async syncWithBackend(activities: Activity[]): Promise<void> {
    // TODO: Implement API sync
    console.log('Backend sync not implemented yet');
  }

  // Public methods that your app will use
  async getAllActivities(): Promise<Activity[]> {
    return this.getFromLocal();
  }

  async addActivity(activity: Activity): Promise<void> {
    const activities = await this.getFromLocal();
    activities.push(activity);
    await this.saveToLocal(activities);
  }

  async updateActivity(updatedActivity: Activity): Promise<void> {
    const activities = await this.getFromLocal();
    const index = activities.findIndex(a => a.id === updatedActivity.id);
    if (index !== -1) {
      activities[index] = updatedActivity;
      await this.saveToLocal(activities);
    }
  }

  async deleteActivity(activityId: string): Promise<void> {
    const activities = await this.getFromLocal();
    const filteredActivities = activities.filter(a => a.id !== activityId);
    await this.saveToLocal(filteredActivities);
  }

  // Added method to get activities by mood
  async getActivitiesByMood(mood: string): Promise<Activity[]> {
    const activities = await this.getFromLocal();
    return activities.filter(activity => activity.moods.includes(mood));
  }
}

export const initializeData = async () => {
    try {
      console.log('Starting initializeData...');
      const existingData = await activityService.getAllActivities();
      console.log('Existing activities:', existingData);
      
      if (existingData.length === 0) {
        console.log('No existing activities, initializing with sample data:', activities);
        for (const activity of activities) {
          await activityService.addActivity(activity);
        }
        console.log('Sample activities initialized');
      } else {
        console.log('Found existing activities:', existingData.length);
      }
    } catch (error) {
      console.error('Error in initializeData:', error);
      throw error;
    }
  };
  
export const activityService = new ActivityService();