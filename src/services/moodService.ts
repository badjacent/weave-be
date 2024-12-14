// src/services/moodService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'moods';

class MoodService {
  private async saveToLocal(moods: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(moods));
    } catch (error) {
      console.error('Error saving moods:', error);
      throw error;
    }
  }

  async getAllMoods(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting moods:', error);
      throw error;
    }
  }

  async addMood(mood: string): Promise<void> {
    const moods = await this.getAllMoods();
    if (!moods.includes(mood)) {
      moods.push(mood);
      await this.saveToLocal(moods);
    }
  }

  async deleteMood(moodToDelete: string): Promise<void> {
    const moods = await this.getAllMoods();
    const filteredMoods = moods.filter(mood => mood !== moodToDelete);
    await this.saveToLocal(filteredMoods);
  }

  async initializeDefaultMoods(defaultMoods: string[]): Promise<void> {
    const existingMoods = await this.getAllMoods();
    if (existingMoods.length === 0) {
      await this.saveToLocal(defaultMoods);
    }
  }
}

export const moodService = new MoodService();