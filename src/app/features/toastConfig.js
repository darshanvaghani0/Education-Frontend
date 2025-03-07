import React from 'react';
import { View, Text } from 'react-native';
import { colors, typography, borderRadius, shadows } from '../theme/theme';

export default {
  success: ({ text1, text2 }) => (
    <View
      style={{
        width: '90%',
        backgroundColor: colors.background.secondary,
        borderLeftWidth: 4,
        borderLeftColor: colors.success,
        borderRadius: borderRadius.md,
        padding: 16,
        ...shadows.md,
      }}>
      <Text style={{ ...typography.body, color: colors.text.primary, fontWeight: '600' }}>
        {text1}
      </Text>
      {text2 && (
        <Text style={{ ...typography.caption, color: colors.text.secondary, marginTop: 4 }}>
          {text2}
        </Text>
      )}
    </View>
  ),
  error: ({ text1, text2 }) => (
    <View
      style={{
        width: '90%',
        backgroundColor: colors.background.secondary,
        borderLeftWidth: 4,
        borderLeftColor: colors.error,
        borderRadius: borderRadius.md,
        padding: 16,
        ...shadows.md,
      }}>
      <Text style={{ ...typography.body, color: colors.text.primary, fontWeight: '600' }}>
        {text1}
      </Text>
      {text2 && (
        <Text style={{ ...typography.caption, color: colors.text.secondary, marginTop: 4 }}>
          {text2}
        </Text>
      )}
    </View>
  ),
  // Add other toast types (e.g., info) if needed
};
  