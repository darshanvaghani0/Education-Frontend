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

        formData.append('pdf_name', pdfName);
        formData.append('chapter_id', chapterId);
        formData.append('pdf_file', {
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
                    <Text style={styles.title}>Add PDF Material</Text>
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Enter PDF name"
                        placeholderTextColor={colors.text.light}
                        value={pdfName}
                        onChangeText={setPdfName}
                    />

                    <TouchableOpacity 
                        style={styles.fileButton} 
                        onPress={pickDocument}
                    >
                        <Text style={styles.fileButtonText}>
                            {selectedFile ? selectedFile.name : 'Select PDF File'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={[styles.button, styles.cancelButton]} 
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.button, styles.submitButton]} 
                            onPress={handleSubmit}
                        >
                            <Text style={[styles.buttonText, styles.submitButtonText]}>Upload</Text>
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
    fileButton: {
        backgroundColor: colors.background.accent,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.text.light,
        borderStyle: 'dashed',
    },
    fileButtonText: {
        ...typography.body,
        color: colors.text.primary,
        textAlign: 'center',
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

export default AddMaterialModal;
