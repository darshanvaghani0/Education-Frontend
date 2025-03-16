import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Dimensions,
    Image,
    ActivityIndicator,
    Alert,
} from "react-native";
import DocumentPicker from "react-native-document-picker";
import Toast from "react-native-toast-message";
import { getUserId } from "../features/auth/user_data";
import { BASE_URL } from "../../services/api";
import { colors, spacing, shadows, typography, borderRadius, commonStyles } from '../theme/theme';

const { width } = Dimensions.get("window");

const AddMaterialModal = ({ visible, onClose, chapterId, onUploadSuccess }) => {
    const [pdfName, setPdfName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });
            setSelectedFile(result[0]);
        } catch (err) {
            if (!DocumentPicker.isCancel(err)) {
                Toast.show({
                    type: 'error',
                    position: 'top',
                    text1: 'Error',
                    text2: 'Error picking the document',
                });
            }
        }
    };

    const handleSubmit = async () => {
        if (!pdfName.trim() || !selectedFile) {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Error',
                text2: 'Please enter PDF name and select a file',
            });
            return;
        }

        setUploading(true);
        const formData = new FormData();
        const userId = await getUserId();

        formData.append('file', {
            uri: selectedFile.uri,
            type: selectedFile.type,
            name: selectedFile.name,
        });

        try {
            const response = await fetch(`${BASE_URL}/chapter_pdf/upload/?chapter_id=${chapterId}&created_by=${userId}&pdf_name=${pdfName}`, {
                method: "POST",
                headers: { "Content-Type": "multipart/form-data" },
                body: formData,
            });
            const result = await response.json();

            if (result.status === "success") {
                Toast.show({
                    type: 'success',
                    position: 'top',
                    text1: 'Success',
                    text2: 'PDF uploaded successfully',
                });
                setPdfName('');
                setSelectedFile(null);
                onClose();
                onUploadSuccess();
            } else {
                throw new Error(result.message || "Failed to upload PDF");
            }
        } catch (error) {
            console.error("Upload Error:", error);
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Error',
                text2: 'Something went wrong',
            });
        } finally {
            setUploading(false);
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
                        <Image 
                            source={require('../../assets/pdf.png')} 
                            style={styles.headerIcon} 
                        />
                        <Text style={styles.title}>Add PDF Material</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.form}>
                        <Text style={styles.label}>PDF Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter PDF name"
                            placeholderTextColor={colors.text.light}
                            value={pdfName}
                            onChangeText={setPdfName}
                        />

                        <Text style={styles.label}>PDF File</Text>
                        <TouchableOpacity 
                            style={styles.fileButton} 
                            onPress={pickDocument}
                        >
                            <Image 
                                source={require('../../assets/upload.png')} 
                                style={styles.uploadIcon} 
                            />
                            <Text style={styles.fileButtonText}>
                                {selectedFile ? selectedFile.name : 'Select PDF File'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={[styles.button, styles.cancelButton]} 
                            onPress={onClose}
                            disabled={uploading}
                        >
                            <Image 
                                source={require('../../assets/cancel.png')} 
                                style={[styles.buttonIcon, styles.cancelIcon]} 
                            />
                            <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.button, styles.submitButton, uploading && styles.buttonDisabled]} 
                            onPress={handleSubmit}
                            disabled={uploading}
                        >
                            {uploading ? (
                                <ActivityIndicator color={colors.text.white} />
                            ) : (
                                <>
                                    <Image 
                                        source={require('../../assets/upload.png')} 
                                        style={[styles.buttonIcon, styles.submitIcon]} 
                                    />
                                    <Text style={[styles.buttonText, styles.submitButtonText]}>Upload</Text>
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
    form: {
        padding: spacing.md,
    },
    label: {
        fontSize: 14,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
    },
    input: {
        backgroundColor: colors.background.accent,
        borderRadius: borderRadius.md,
        padding: spacing.sm,
        paddingHorizontal: spacing.md,
        color: colors.text.primary,
        borderWidth: 1,
        borderColor: colors.text.light,
        fontSize: 14,
        marginBottom: spacing.md,
        height: 40,
    },
    fileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.accent,
        padding: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.text.light,
        borderStyle: 'dashed',
        marginBottom: spacing.md,
        height: 40,
    },
    uploadIcon: {
        width: 20,
        height: 20,
        marginRight: spacing.sm,
        tintColor: colors.primary,
    },
    fileButtonText: {
        fontSize: 14,
        color: colors.text.primary,
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        padding: spacing.md,
        gap: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.background.accent,
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
    buttonDisabled: {
        opacity: 0.5,
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

export default AddMaterialModal;
