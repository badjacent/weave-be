import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FIELDS } from '../constants/fields';
import { Activity as ActivityType } from '../types/types';

type ActivityProps = {
  id: string;
  name: string;
  fieldStrengths: Record<string, number>;
  isRandomMode?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onFieldClick?: (fieldKey: string) => void;
};

  

const Activity: React.FC<ActivityProps> = ({
  id,
  name,
  fieldStrengths,
  isRandomMode = false,
  isSelected = false,
  onSelect,
  onFieldClick
}) => {
  const router = useRouter();

  const handleNamePress = () => {
    if (isRandomMode && onSelect) {
      onSelect(id);
    } else {
      router.push(`/edit/${id}`);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={handleNamePress}
        style={styles.nameContainer}
      >
        {isRandomMode && (
          <Text style={[styles.diceEmoji, { opacity: isSelected ? 1 : 0.3 }]}>
            🎲
          </Text>
        )}
        <Text style={styles.name}>{name}</Text>
      </TouchableOpacity>

      <View style={styles.fieldsContainer}>
        {Object.keys(FIELDS).map(fieldKey => (
          <TouchableOpacity
            key={fieldKey}
            onPress={() => {
              if (!isRandomMode && onFieldClick) {
                onFieldClick(fieldKey);
              }
            }}
            style={[
              styles.fieldBox,
              {
                backgroundColor: FIELDS[fieldKey].color,
                opacity: fieldStrengths[fieldKey] || 0.05
              }
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    marginBottom: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 30,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  diceEmoji: {
    fontSize: 16,
  },
  name: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  fieldsContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  fieldBox: {
    width: 20,
    height: 20,
  },
});

export default Activity;