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
import { uploadImage } from "../../services/api";

const { width } = Dimensions.get("window");

const ConfirmationModal = ({
    isVisible,
    onClose,
    suffixData,
    setSelectedBiltyId,
    setBiltyNo,
    handleUploadAgain
}) => {
    const [biltyNumber, setBiltyNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const biltyInputRef = useRef(null);

    useEffect(() => {
        if (isVisible) {
            setTimeout(() => biltyInputRef.current?.focus(), 500);
        }
    }, [isVisible]);

    const onYesClick = () => {
        if(biltyNumber){
            handleUploadAgain(biltyNumber)
        } else {
            handleUploadAgain(suffixData[0].bilty_no)
        }
        onClose()
    }

    return (
        <Modal transparent visible={isVisible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.header}>Confirm Bilty Number</Text>
                    <TouchableOpacity
                        style={[styles.cancelButton, isLoading && styles.disabled]}
                        disabled={isLoading}
                        onPress={onClose}
                    >
                        <Image source={require("../../assets/cancel.png")} style={styles.cancelButtonImage} />
                    </TouchableOpacity>

                    <View style={styles.separator} />

                    <View style={styles.body}>
                        <Text>
                            You uploaded POD for{" "}
                            <Text style={styles.bold}>{suffixData[0]?.bilty_no || "N/A"}</Text>.{"\n"}
                        </Text>
                        <Text style={styles.label}>If not, enter the bilty number:</Text>
                        <TextInput
                            ref={biltyInputRef}
                            style={styles.input}
                            placeholder="Enter bilty number"
                            placeholderTextColor="gray"
                            value={biltyNumber}
                            onChangeText={setBiltyNumber}
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.footer}>
                        <TouchableOpacity style={[styles.button,isLoading && styles.disabled]} onPress={onClose} disabled={isLoading}>
                            <Text style={styles.buttonText}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, isLoading && styles.disabled]}
                            onPress={onYesClick}
                            disabled={isLoading}
                        >
                            <Text style={styles.buttonText}>Yes</Text>
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
        padding:15
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
        paddingVertical:15,
        paddingHorizontal: 30,
        // alignItems: "center",
    },
    bold: {
        fontWeight: "bold",
        fontSize:25
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
        justifyContent: "space-around",
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
