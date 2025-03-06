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

const { width } = Dimensions.get("window");

const AddMaterialModal = ({ visible, onClose, chapterId, onUploadSuccess }) => {
    const [pdfTitle, setPdfTitle] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const pickPDF = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });
            setSelectedFile(res[0]);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log("User cancelled file picker");
            } else {
                console.error("File selection error:", err);
            }
        }
    };

    const uploadPDF = async () => {
        if (!pdfTitle.trim() || !selectedFile) {
            Toast.show({ type: "error", text1: "Error", text2: "Please enter a title and select a PDF" });
            return;
        }

        setUploading(true);
        const formData = new FormData();
        const userId = await getUserId();

        // formData.append("chapter_id", chapterId);
        // formData.append("created_by", userId);
        // formData.append("pdf_name", pdfTitle);
        formData.append("file", {
            uri: selectedFile.uri,
            name: selectedFile.name,
            type: 'application/pdf',
        });

        try {
            const response = await fetch(`${BASE_URL}/chapter_pdf/upload/?chapter_id=${chapterId}&created_by=${userId}&pdf_name=${pdfTitle}`, {
                method: "POST",
                headers: { "Content-Type": "multipart/form-data" },
                body: formData,
            });
            const result = await response.json();

            if (result.status === "success") {
                Toast.show({ type: "success", text1: "Upload Successful", text2: result.data.pdf_name });
                onUploadSuccess();
                onClose();
            } else {
                throw new Error(result.message || "Upload failed");
            }
        } catch (error) {
            console.error("Upload Error:", error);
            Toast.show({ type: "error", text1: "Upload Failed", text2: error.message });
        } finally {
            setUploading(false);
        }
    };

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Add Material</Text>
                        <TouchableOpacity
                            style={[styles.cancelButton, uploading && styles.disabled]}
                            disabled={uploading}
                            onPress={onClose}
                        >
                            <Image source={require("../../assets/cancel.png")} style={styles.cancelButtonImage} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.body}>
                        <Text style={styles.label}>PDF Title</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter PDF Title"
                            placeholderTextColor="gray"
                            value={pdfTitle}
                            onChangeText={setPdfTitle}
                            editable={!uploading}
                        />

                        <TouchableOpacity style={styles.fileButton} onPress={pickPDF} disabled={uploading}>
                            <Image source={require("../../assets/upload.png")} style={styles.uploadIcon} />
                            <Text style={styles.fileButtonText} numberOfLines={1}>
                                {selectedFile ? selectedFile.name : "Select PDF"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.button, uploading && styles.disabled]}
                            onPress={uploadPDF}
                            disabled={uploading}
                        >
                            {uploading ? <ActivityIndicator color="black" /> : <Text style={styles.buttonText}>Upload</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Toast />
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: width * 0.85,
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 5,
    },
    headerContainer: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    header: {
        fontSize: 18,
        fontWeight: "bold",
    },
    cancelButton: {
        width: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    cancelButtonImage: {
        width: 20,
        height: 20,
    },
    separator: {
        height: 1,
        backgroundColor: "gray",
        width: "100%",
    },
    body: {
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "black",
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5,
        padding: 8,
        fontSize: 14,
        color: "black",
        width: "100%",
        marginBottom: 10,
    },
    fileButton: {
        backgroundColor: "#ddd",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: 'center',
        width: '60%',
        alignSelf: 'center',
        paddingVertical: 10,
    },
    uploadIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    fileButtonText: {
        fontSize: 16,
        color: "black",
    },
    footer: {
        height: 60,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingHorizontal: 15,
    },
    button: {
        backgroundColor: "#fff",
        borderRadius: 5,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
        shadowOffset: { width: 0, height: 2 },
        width: "40%",
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "black",
        fontWeight: "500",
        fontSize: 14,
    },
    disabled: {
        backgroundColor: "lightgray",
    },
});

export default AddMaterialModal;
