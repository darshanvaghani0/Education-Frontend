import React, { useEffect, useState } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator,
    Alert, ScrollView, Platform, PermissionsAndroid
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomHeader from '../CustomHeader';
import { BASE_URL } from '../../../services/api';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import { LogBox } from 'react-native';
import Toast from 'react-native-toast-message';

LogBox.ignoreLogs(['file:// exposed beyond app']);

const ChapterPDFScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { chapterId } = route.params;

    const [pdfFolders, setPdfFolders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChapterPDFs();
    }, []);

    const fetchChapterPDFs = async () => {
        try {
            const response = await fetch(`${BASE_URL}/chapter_pdf/chapter/${chapterId}`);
            const json = await response.json();
            setPdfFolders(json?.status === 'success' && Array.isArray(json.data) ? json.data : []);
        } catch (error) {
            console.error('Error fetching PDFs:', error);
            setPdfFolders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFolderClick = async (folder) => {
        await fetchAndSavePDF(folder.id, folder.pdf_name);
    };

    const requestPermissions = async (permissions) => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple(permissions);
                return permissions.every(
                    (perm) => granted[perm] === PermissionsAndroid.RESULTS.GRANTED
                );
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    const fetchAndSavePDF = async (id, pdfName) => {
        try {
            const fileUrl = `${BASE_URL}/chapter_pdf/download/${id}`;
            const downloadDir = RNFS.DownloadDirectoryPath;
            const localFile = `${downloadDir}/chapter_${id}.pdf`;

            console.log('Downloading PDF to:', localFile);

            const downloadResult = await RNFS.downloadFile({
                fromUrl: fileUrl,
                toFile: localFile,
                background: true,
            }).promise;

            if (downloadResult.statusCode === 200) {
                Toast.show({
                    type: 'success',
                    position: 'top',
                    text1: '🎉 PDF Downloaded Successfully!',
                     text2: '📂 Saved in your Downloads folder',
                });
                let contentUri = localFile;
                if (Platform.OS === 'android' && Platform.Version >= 24) {
                    contentUri = `content:/${localFile}}`;
                }
                // openWithExternalApp(contentUri);
            } else {
                console.error('Download failed:', downloadResult);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const openWithExternalApp = async (filePath) => {
        try {
            console.log('Opening PDF:', filePath);
            const mimeType = 'application/pdf';
            await FileViewer.open(filePath, { showOpenWithDialog: true, mimeType });
        } catch (error) {
            console.error('Error opening file:', error, filePath);
        }
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <CustomHeader title="Chapter PDFs" backButtonVisible={true} profileVisible={false} onBackPress={handleBackPress} />

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#007bff" />
                </View>
            ) : pdfFolders.length === 0 ? (
                <Text style={styles.noDataText}>No PDFs available</Text>
            ) : (
                <ScrollView contentContainerStyle={styles.listContainer}>
                    <View style={styles.rowContainer}>
                        {pdfFolders.map((item, index) => (
                            <TouchableOpacity
                                key={item?.id ? item.id.toString() : `pdf-${index}`}
                                style={styles.folderCard}
                                onPress={() => handleFolderClick(item)}
                            >
                                <Image source={require('../../../assets/clipboard.png')} style={styles.folderIcon} />
                                <Text style={styles.folderText}>{item.pdf_name || 'Unnamed PDF'}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContainer: { padding: 15, alignItems: 'center' },
    rowContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    folderCard: {
        width: '48%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    folderIcon: { width: 50, height: 50, marginBottom: 10 },
    folderText: { fontSize: 16, fontWeight: '500', color: 'black', textAlign: 'center' },
    noDataText: { fontSize: 18, color: 'gray', textAlign: 'center', marginTop: 20 },
});

export default ChapterPDFScreen;
