import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { postApi } from '../../services/api';
import Toast from 'react-native-toast-message';
import { colors, spacing, shadows, typography, borderRadius, commonStyles } from '../theme/theme';
import { getUserId } from '../features/auth/user_data';

const ConfirmationModal = ({ visible, onClose, currentLevel, selectedStandard, selectedSubject, refreshData }) => {
    const [name, setName] = useState('');
    const [userId, setUserId] = useState(null);
    const inputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (visible && inputRef.current) {
            // Small delay to ensure the modal is fully visible
            setTimeout(() => {
                inputRef.current.focus();
            }, 100);
            const initializeData = async () => {
                const userId = await getUserId();
                setUserId(userId);
            }
            initializeData();
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

        setIsLoading(true);
        try {
            let response;
            if (currentLevel === 'standards') {
                response = await postApi('/standards/', { standard_name: name, created_by: userId });
            } else if (currentLevel === 'subjects') {
                response = await postApi('/subjects/', { subject_name: name, standard_id: selectedStandard.id, created_by: userId });
            } else if (currentLevel === 'chapters') {
                response = await postApi('/chapters/', { chapter_name: name, subject_id: selectedSubject.id, created_by: userId });
            }

            if (response.status === 'success') {
                Toast.show({
                    type: 'success',
                    position: 'top',
                    text1: `${currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} added successfully`,
                });
                setName('');
                onClose();
                refreshData();
            } else {
                Toast.show({
                    type: 'error',
                    position: 'top',
                    text1: response.data.message || 'Failed to add',
                });
            }
        } catch (error) {
            console.error('Error adding item:', error);
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Error adding item',
            });
        } finally {
            setIsLoading(false);
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

    const getTitle = () => {
        switch (currentLevel) {
            case 'standards':
                return 'Add Standard';
            case 'subjects':
                return `Add Subject to ${selectedStandard.standard_name}`;
            case 'chapters':
                return `Add Chapter to ${selectedSubject.subject_name}`;
            default:
                return 'Add Item';
        }
    };

    const getPlaceholder = () => {
        switch (currentLevel) {
            case 'standards':
                return 'Enter Standard Name';
            case 'subjects':
                return 'Enter Subject Name';
            case 'chapters':
                return 'Enter Chapter Name';
            default:
                return 'Enter Name';
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
                        <Text style={styles.headerText}>{getTitle()}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Image 
                                source={require('../../assets/cancel.png')} 
                                style={styles.closeIcon}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.label}>{getPlaceholder()}</Text>
                    <TextInput
                        ref={inputRef}
                        style={[styles.input, isLoading && styles.disabledInput]}
                        placeholder={getPlaceholder()}
                        placeholderTextColor={colors.text.light}
                        value={name}
                        onChangeText={setName}
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit}
                        editable={!isLoading}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={[styles.button, styles.cancelButton, isLoading && styles.disabledButton]} 
                            onPress={onClose}
                            disabled={isLoading}
                        >
                            <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.button, styles.submitButton, isLoading && styles.disabledButton]} 
                            onPress={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={colors.text.white} size="small" />
                            ) : (
                                <Text style={[styles.buttonText, styles.submitButtonText]}>Add</Text>
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
    disabledInput: {
        opacity: 0.7,
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
    disabledButton: {
        opacity: 0.7,
    },
});

export default ConfirmationModal;
