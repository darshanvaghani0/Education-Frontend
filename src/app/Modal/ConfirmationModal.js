import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { postApi } from '../../services/api';
import Toast from 'react-native-toast-message';
import { colors, spacing, shadows, typography, borderRadius, commonStyles } from '../theme/theme';

const ConfirmationModal = ({ visible, onClose, currentLevel, selectedStandard, selectedSubject, refreshData }) => {
    const [name, setName] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (visible && inputRef.current) {
            // Small delay to ensure the modal is fully visible
            setTimeout(() => {
                inputRef.current.focus();
            }, 100);
        }
    }, [visible]);

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

    const getIcon = () => {
        switch (currentLevel) {
            case 'standards':
                return require('../../assets/clipboard.png');
            case 'subjects':
                return require('../../assets/books.png');
            case 'chapters':
                return require('../../assets/chapter.png');
            default:
                return require('../../assets/clipboard.png');
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
                    <View style={styles.header}>
                        <Image source={getIcon()} style={styles.headerIcon} />
                        <Text style={styles.title}>Add New {currentLevel.slice(0, -1)}</Text>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.label}>{currentLevel.slice(0, -1).charAt(0).toUpperCase() + currentLevel.slice(0, -1).slice(1)} name</Text>
                    <TextInput
                        ref={inputRef}
                        style={styles.input}
                        placeholder={`Enter ${currentLevel.slice(0, -1)} name`}
                        placeholderTextColor={colors.text.light}
                        value={name}
                        onChangeText={setName}
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={[styles.button, styles.cancelButton]} 
                            onPress={onClose}
                        >
                            <Image 
                                source={require('../../assets/cancel.png')} 
                                style={[styles.buttonIcon, styles.cancelIcon]} 
                            />
                            <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.button, styles.submitButton]} 
                            onPress={handleSubmit}
                        >
                            <Image 
                                source={require('../../assets/tick-inside-circle.png')} 
                                style={[styles.buttonIcon, styles.submitIcon]} 
                            />
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: colors.background.secondary,
        borderRadius: borderRadius.lg,
        padding: 0,
        ...shadows.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.background.accent,
        borderTopLeftRadius: borderRadius.lg,
        borderTopRightRadius: borderRadius.lg,
    },
    headerIcon: {
        width: 24,
        height: 24,
        marginRight: spacing.sm,
        tintColor: colors.primary,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
        flex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: colors.background.accent,
    },
    label: {
        fontSize: 14,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
        marginTop: spacing.md,
        paddingHorizontal: spacing.md,
    },
    input: {
        marginHorizontal: spacing.md,
        backgroundColor: colors.background.accent,
        borderRadius: borderRadius.md,
        padding: spacing.sm,
        paddingHorizontal: spacing.md,
        color: colors.text.primary,
        borderWidth: 1,
        borderColor: colors.text.light,
        fontSize: 14,
        height: 40,
    },
    buttonContainer: {
        flexDirection: 'row',
        padding: spacing.md,
        gap: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.background.accent,
        marginTop: spacing.lg,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        height: 36,
    },
    buttonIcon: {
        width: 16,
        height: 16,
        marginRight: spacing.xs,
    },
    cancelButton: {
        backgroundColor: colors.background.accent,
    },
    submitButton: {
        backgroundColor: colors.primary,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    cancelButtonText: {
        color: colors.text.primary,
    },
    submitButtonText: {
        color: colors.text.white,
    },
    cancelIcon: {
        tintColor: colors.text.primary,
    },
    submitIcon: {
        tintColor: colors.text.white,
    },
});

export default ConfirmationModal;
