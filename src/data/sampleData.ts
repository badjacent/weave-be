import { Activity } from '../types/types';

export const activities: Activity[] = [
    {
      id: '1',
      name: "Morning Yoga",
      fieldStrengths: {
        physical: 0.8,
        meditation: 0.6,
        creative: 0.2,
        social: 0.1,
        intellectual: 0.3
      },
      moods: ["morning", "exercise", "quiet"]
    },
    {
      id: '2',
      name: "Book Club Meeting",
      fieldStrengths: {
        physical: 0.1,
        meditation: 0.2,
        creative: 0.4,
        social: 0.9,
        intellectual: 0.8
      },
      moods: ["evening", "social", "learning"]
    },
    {
      id: '3',
      name: "Movie on TV",
      fieldStrengths: {
        physical: 0.1,
        meditation: 0.2,
        creative: 0.4,
        social: 0.9,
        intellectual: 0.8
      },
      moods: ["quiet"]
    }
  ];

// Get unique moods from activities
export const getAllMoods = (): string[] => {
  const moodSet = new Set<string>();
  activities.forEach(activity => {
    activity.moods.forEach(mood => moodSet.add(mood));
  });
  return Array.from(moodSet);
};