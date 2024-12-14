export interface Activity {
  id: string;
  name: string;
  moods: string[];
  fieldStrengths: Record<string, number>;
}