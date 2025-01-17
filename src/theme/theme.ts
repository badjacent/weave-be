import { StyleSheet } from 'react-native';

// Base measurements
export const spacing = {
  xs: 2,
  sm: 5,
  md: 10,
  lg: 20,
};

// Typography settings
export const typography = {
  size: {
    small: 24,
    regular: 28,
    large: 32,
  },
  weight: {
    regular: '400',
    bold: 'bold',
  },
};

// Colors
export const colors = {
  text: {
    primary: '#ffffff',
    link: '#0a7ea4',
  },
  background: {
    primary: '#1a1a1a',
    secondary: '#333',
    tertiary: '#444',
  },
  border: {
    primary: '#666',
  },
  status: {
    danger: '#c42',
  }
};

// Common styles that can be shared across components
export const commonStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gap5: {
    gap: spacing.sm,
  },
  gap10: {
    gap: spacing.md,
  },
});

// Common component styles
export const componentStyles = {
  input: {
    backgroundColor: colors.background.secondary,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.primary,
    padding: spacing.md,
    borderRadius: 4,
  },
  button: {
    backgroundColor: colors.background.tertiary,
    padding: spacing.md,
    borderRadius: 4,
    alignItems: 'center',
  },
}; 