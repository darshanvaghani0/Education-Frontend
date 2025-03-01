import React, { useEffect, useRef, useState, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Dimensions,
    Alert,
} from "react-native";
import Toast from "react-native-toast-message";
import { postApi, uploadImage } from "../../services/api";
import { getUserId } from "../features/auth/user_data";

const { width } = Dimensions.get("window");

const ConfirmationModal = ({ visible, onClose, currentLevel, selectedStandard, selectedSubject, refreshData }) => {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getTitle = () => {
        return currentLevel === 'standards' ? 'Standard' :
            currentLevel === 'subjects' ? 'Subject' : 'Chapter';
    };

    const handleSubmit = async () => {
        setIsLoading(true)
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter a valid name.');
            return;
        }
        const user_id = await getUserId()
        let endpoint = '';
        let body = { created_by: user_id };

        if (currentLevel === 'standards') {
            endpoint = '/standards/';
            body.standard_name = name;
        } else if (currentLevel === 'subjects' && selectedStandard) {
            endpoint = '/subjects/';
            body.subject_name = name;
            body.standard_id = selectedStandard;
        } else if (currentLevel === 'chapters' && selectedSubject) {
            endpoint = '/chapters/';
            body.chapter_name = name;
            body.subject_id = selectedSubject;
        } else {
            Alert.alert('Error', 'Missing required selection.');
            return;
        }

        try {
            postApi(endpoint, body).then((res) => {
                if (res.status === 'success') {
                    setIsLoading(false)
                    setName('');
                    onClose();
                    refreshData();
                } else {

                }
            }).finally(() => { setIsLoading(false) })
        } catch (error) {
            Alert.alert('Error', 'Something went wrong.');
        }
    };

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.header}>Add {getTitle()}</Text>
                    <TouchableOpacity
                        style={[styles.cancelButton, isLoading && styles.disabled]}
                        disabled={isLoading}
                        onPress={onClose}
                    >
                        <Image source={require("../../assets/cancel.png")} style={styles.cancelButtonImage} />
                    </TouchableOpacity>

                    <View style={styles.separator} />

                    <View style={styles.body}>
                        <TextInput
                            style={styles.input}
                            placeholder={`Enter ${getTitle()} name`}
                            placeholderTextColor="gray"
                            value={name}
                            onChangeText={setName}
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.button, isLoading && styles.disabled]}
                            onPress={handleSubmit}
                            disabled={isLoading}
                        >
                            <Text style={styles.buttonText}>Add</Text>
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
        // padding: 20,
    },
    header: {
        fontSize: 18,
        fontWeight: "bold",
        // textAlign: "center",
        // marginBottom: 10,
        padding: 15
    },
    cancelButton: {
        position: "absolute",
        top: 13,
        right: 13,
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
        // marginVertical: 10,
    },
    body: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        // alignItems: "center",
    },
    bold: {
        fontWeight: "bold",
        fontSize: 25
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 7,
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5,
        padding: 8,
        fontSize: 14,
        color: "black",
        width: "100%",
        marginTop: 8,
    },
    footer: {
        flexDirection: "row",
        justifyContent:'flex-end',
        padding: 15,
    },
    button: {
        backgroundColor: "#fff",
        borderRadius: 5,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 3,
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

export default ConfirmationModal;
