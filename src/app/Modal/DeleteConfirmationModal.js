import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme/theme';

const DeleteConfirmationModal = ({ visible, onClose, dependencies, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      disabled={isLoading}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Delete</Text>
            <TouchableOpacity 
              onPress={onClose} 
              style={styles.closeButton}
              disabled={isLoading}
            >
              <Image 
                source={require('../../assets/cancel.png')} 
                style={[styles.closeIcon, isLoading && styles.disabledIcon]}
              />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Are you sure?</Text>
            
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Following items will be deleted:</Text>
              <View style={styles.infoRow}>
                <Image 
                  source={require('../../assets/books.png')}
                  style={[styles.infoIcon, { tintColor: colors.primary }]}
                />
                <Text style={styles.infoText}>{dependencies.subject_count} Subjects</Text>
              </View>
              <View style={styles.infoRow}>
                <Image 
                  source={require('../../assets/chapter.png')}
                  style={[styles.infoIcon, { tintColor: colors.primary }]}
                />
                <Text style={styles.infoText}>{dependencies.chapter_count} Chapters</Text>
              </View>
              <View style={styles.infoRow}>
                <Image 
                  source={require('../../assets/pdf.png')}
                  style={[styles.infoIcon, { tintColor: colors.primary }]}
                />
                <Text style={styles.infoText}>{dependencies.pdf_count} Materials</Text>
              </View>
            </View>

            <Text style={styles.warningText}>This action cannot be undone</Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton, isLoading && styles.disabledButton]} 
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText, isLoading && styles.disabledText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.deleteButton, isLoading && styles.disabledButton]} 
              onPress={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.text.white} size="small" />
              ) : (
                <>
                  <Image 
                    source={require('../../assets/delete.png')}
                    style={[styles.buttonIcon, { tintColor: colors.text.white }]}
                  />
                  <Text style={[styles.buttonText, styles.deleteButtonText]}>Delete</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    width: '80%',
    maxWidth: 320,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.accent,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  closeButton: {
    padding: spacing.xs,
  },
  closeIcon: {
    width: 20,
    height: 20,
    tintColor: colors.text.light,
  },
  content: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  title: {
    ...typography.subtitle,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  infoContainer: {
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    width: '100%',
    marginBottom: spacing.md,
  },
  infoLabel: {
    ...typography.body,
    fontSize: 13,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xs / 2,
  },
  infoIcon: {
    width: 16,
    height: 16,
    marginRight: spacing.sm,
  },
  infoText: {
    ...typography.body,
    fontSize: 13,
    color: colors.text.secondary,
  },
  warningText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.error,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    ...shadows.sm,
  },
  buttonIcon: {
    width: 16,
    height: 16,
    marginRight: spacing.xs,
  },
  cancelButton: {
    backgroundColor: colors.background.secondary,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  buttonText: {
    ...typography.button,
    fontSize: 13,
  },
  cancelButtonText: {
    color: colors.text.primary,
  },
  deleteButtonText: {
    color: colors.text.white,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledIcon: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
});

export default DeleteConfirmationModal; 