export const colors = {
  primary: '#818cf8',    // Lighter Indigo
  secondary: '#f472b6',  // Lighter Pink
  accent: '#a78bfa',    // Lighter Purple
  success: '#34d399',   // Lighter Green
  warning: '#fbbf24',   // Lighter Amber
  error: '#f87171',     // Lighter Red
  background: {
    primary: '#0f172a',   // Dark Blue
    secondary: '#1e293b', // Slightly Lighter Dark Blue
    accent: '#334155',    // Even Lighter Dark Blue
  },
  text: {
    primary: '#f8fafc',   // Almost White
    secondary: '#cbd5e1',  // Light Gray
    light: '#64748b',     // Medium Gray
    white: '#ffffff',     // Pure White
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2.0,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4.84,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5.65,
    elevation: 6,
  },
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 14,
  },
};

export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
  },
  button: {
    primary: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondary: {
      backgroundColor: colors.secondary,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  input: {
    borderWidth: 1,
    borderColor: colors.text.light,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
  },
}; 