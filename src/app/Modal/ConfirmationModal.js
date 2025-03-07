import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { postApi } from '../../services/api';
import Toast from 'react-native-toast-message';
import { colors, spacing, shadows, typography, borderRadius, commonStyles } from '../theme/theme';

const ConfirmationModal = ({ visible, onClose, currentLevel, selectedStandard, selectedSubject, refreshData }) => {
    const [name, setName] = useState('');

    const handleSubmit = async () => {
        if (!name.trim()) {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Error',
                text2: 'Please enter a name',
            });
            return;
        }

        let endpoint = '';
        let body = {};

        switch (currentLevel) {
            case 'standards':
                endpoint = '/standards/';
                body = { standard_name: name };
                break;
            case 'subjects':
                endpoint = '/subjects/';
                body = { subject_name: name, standard_id: selectedStandard.id };
                break;
            case 'chapters':
                endpoint = '/chapters/';
                body = { chapter_name: name, subject_id: selectedSubject.id };
                break;
            default:
                return;
        }

        try {
            const response = await postApi(endpoint, body);
            if (response.status === 'success') {
                Toast.show({
                    type: 'success',
                    position: 'top',
                    text1: 'Success',
                    text2: `${currentLevel.slice(0, -1)} added successfully`,
                });
                setName('');
                onClose();
                refreshData();
            } else {
                Toast.show({
                    type: 'error',
                    position: 'top',
                    text1: 'Error',
                    text2: response.message || 'Something went wrong',
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Error',
                text2: 'Something went wrong',
            });
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Add {currentLevel.slice(0, -1)}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={`Enter ${currentLevel.slice(0, -1)} name`}
                        placeholderTextColor={colors.text.light}
                        value={name}
                        onChangeText={setName}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
                            <Text style={[styles.buttonText, styles.submitButtonText]}>Submit</Text>
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
        width: '90%',
        backgroundColor: colors.background.secondary,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        ...shadows.lg,
    },
    title: {
        ...typography.h3,
        color: colors.text.primary,
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    input: {
        ...commonStyles.input,
        marginBottom: spacing.lg,
        backgroundColor: colors.background.accent,
        borderColor: colors.text.light,
        color: colors.text.primary,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    button: {
        flex: 1,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: colors.background.accent,
    },
    submitButton: {
        backgroundColor: colors.primary,
    },
    buttonText: {
        ...typography.body,
        color: colors.text.primary,
        fontWeight: '600',
    },
    submitButtonText: {
        color: colors.text.white,
    },
});

export default ConfirmationModal;
