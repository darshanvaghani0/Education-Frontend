export const colors = {
  primary: '#818cf8',
  secondary: '#f472b6',
  accent: '#a78bfa',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  background: {
    primary: '#0f172a',
    secondary: '#1e293b',
    accent: '#334155',
  },
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    light: '#64748b',
    white: '#ffffff',
  },
};

export const lightTheme = {
  primary: '#4f46e5',
  secondary: '#db2777',
  accent: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  background: {
    primary: '#f8fafc',
    secondary: '#e2e8f0',
    accent: '#cbd5e1',
  },
  text: {
    primary: '#1e293b',
    secondary: '#334155',
    light: '#64748b',
    white: '#ffffff',
  },
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