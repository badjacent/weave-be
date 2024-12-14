type Field = {
    name: string;
    color: string;
  };
  
  export const FIELDS: Record<string, Field> = {
    physical: {
      name: 'Physical',
      color: '#4A90E2' // blue
    },
    meditation: {
      name: 'Meditation',
      color: '#9013FE' // purple
    },
    creative: {
      name: 'Creative',
      color: '#F5A623' // orange
    },
    social: {
      name: 'Social',
      color: '#50E3C2' // teal
    },
    intellectual: {
      name: 'Intellectual',
      color: '#E74C3C' // red
    }
  };