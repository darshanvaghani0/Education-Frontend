import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { validateSession } from '../../utils/Session';
import CustomHeader from '../CustomHeader';
import { get, post, postApi, postRequest } from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentScanner from 'react-native-document-scanner-plugin';
import { openGallery } from '../../utils/MediaAccess';
import SourceSelectionModal from '../../Modal/SourceSelectionModal';
import ImagePreviewModal from '../../Modal/ImagePreviewModal';

const PendingPod = () => {
    const { width, height } = useWindowDimensions();
    const navigation = useNavigation();
    const [podList, setPodList] = useState([]);
    const [podDetails, setPodDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedPodNo, setSelectedPodNo] = useState(null);
    const [isSourceModalVisible, setIsSourceModalVisible] = useState(false);
    const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isCameraSelected, setIsCameraSelected] = useState(false);

    const handleSelectSource = async (source) => {
        setIsSourceModalVisible(false);
        let image = null;
        if (source === 'camera') {
            // image = await openCamera();
            const { scannedImages } = await DocumentScanner.scanDocument({ maxNumDocuments: 1, quality: 100, resolution: 300 });
            if (scannedImages.length > 0) {
                image = scannedImages[0];
                if (image) {
                    setSelectedImage(image);
                    setIsPreviewModalVisible(true);
                    setIsCameraSelected(true);
                }
            }
        } else if (source === 'gallery') {
            image = await openGallery();
            if (image) {
                setSelectedImage(image.uri);
                setIsPreviewModalVisible(true);
                setIsCameraSelected(false);
            }
        }
    };

    useFocusEffect(
        useCallback(() => {
            validateSession(navigation);
            console.log(width, height);
        }, [navigation])
    );

    useEffect(() => {
        loadBranchAndFetchPods();
    }, []);

    const loadBranchAndFetchPods = async () => {
        try {
            const branchData = await AsyncStorage.getItem('selectedBranch');
            console.log(branchData);
            if (branchData) {
                const branch = JSON.parse(branchData);
                setSelectedBranch(branch);
                fetchPodList(branch.branch_id);
            }
        } catch (error) {
            console.error('Error loading branch data:', error);
        }
    };

    const getDateForApi = () => {
        const now = new Date();
        const hours = now.getHours();
        if (hours < 12) {
            now.setDate(now.getDate() - 1);
        }
        return now.toISOString().split('T')[0];
    };

    const fetchPodList = async (branchId) => {
        setLoading(true);
        let params = {
            "paginate": {
                "number_of_rows": 100,
                "page_number": 1
            },
            "sort_fields": [],
            "filter_fields": {
                "station_to": String(branchId)
            },
            "date_dict": {
                "date_from": "2025-02-02T14:18:09.756Z",
                "date_to": new Date().toISOString()
            }
        }
        console.log(params)
        postApi(`/report/get_pending_pod_report`, params)
            .then((response) => {
                console.log(response)
                if (response.status === 'success' && Array.isArray(response.data.data)) {
                    setPodList(response.data.data);
                    setLoading(false);
                } else {
                    setPodList([]);
                    setLoading(false);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onViewCLick = (bilty_id) => {
        setSelectedPodNo(bilty_id)-
        setIsSourceModalVisible(true)
    }

    const handleBackPress = () => {
        navigation.goBack();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB').replace(/\//g, '-');
    };

    return (
        <View style={styles.container}>
            <CustomHeader title="Pending POD" onBackPress={handleBackPress} backButtonVisible profileVisible />
            <View style={styles.content}>
                <View style={styles.branchHeader}>
                    {selectedBranch && <Text style={styles.selectedBranch}>Branch: {selectedBranch.branch_name}</Text>}
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="blue" />
                ) : (
                    <View style={[styles.tableContainer, { height: height * 0.85 }]}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.headerCell, { width: '20%' }]}>Bilty No</Text>
                            <Text style={[styles.headerCell, { width: '20%' }]}>Bilty Date</Text>
                            <Text style={[styles.headerCell, { width: '20%' }]}>Station from</Text>
                            <Text style={[styles.headerCell, { width: '20%' }]}>Consignee</Text>
                            <Text style={[styles.headerCell, { width: '20%' }]}>Action</Text>
                        </View>
                        <ScrollView nestedScrollEnabled>
                            {podList.length > 0 ? (
                                podList.map((item, index) => (
                                    <View key={index} style={styles.row}>
                                        <Text style={[styles.cell, { width: '20%' }]}>{item.bilty_no}</Text>
                                        <Text style={[styles.cell, { width: '20%' }]}>{formatDate(item.bilty_date)}</Text>
                                        <Text style={[styles.cell, { width: '20%' }]} numberOfLines={1}>
                                            {item.station_from}
                                        </Text>
                                        <Text style={[styles.cell, { width: '20%' }]} numberOfLines={1}>{item.consignee_name}</Text>
                                        <View style={[styles.cell, { width: '20%' }]}>
                                            <TouchableOpacity style={styles.viewButton} onPress={() => onViewCLick(item.bilty_id)}>
                                                <Text style={styles.viewButtonText}>View</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.emptyText}>No Data Available</Text>
                            )}
                        </ScrollView>
                    </View>
                )}
            </View>
            {isSourceModalVisible && <SourceSelectionModal
                isVisible={isSourceModalVisible}
                onClose={() => setIsSourceModalVisible(false)}
                onSelectSource={handleSelectSource}
            />}

            {isPreviewModalVisible && <ImagePreviewModal
                isVisible={isPreviewModalVisible}
                selectedImage={selectedImage}
                isCameraSelected={isCameraSelected}
                setSelectedImage={setSelectedImage}
                setIsCameraSelected={setIsCameraSelected}
                setIsPreviewModalVisible={setIsPreviewModalVisible}
                onClose={() => setIsPreviewModalVisible(false)}
                isFromPendingPod={true}
                PODId={selectedPodNo}
            />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 10,
    },
    branchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    selectedBranch: {
        fontSize: 13,
        fontWeight: '600',
    },
    tableContainer: {
        backgroundColor: '#f2f2f2',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#333',
        marginTop: 10,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 15,
        height: '100%',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: 'lightgray',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        borderTopEndRadius: 5,
        borderTopLeftRadius: 5,
    },
    headerCell: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 10,
        paddingVertical: 5,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#bbb',
    },
    cell: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 10,
        paddingVertical: 5,
    },
    viewButton: {
        backgroundColor: '#007bff',
        paddingHorizontal: 8,
        borderRadius: 5,
        alignSelf: 'center',
    },
    viewButtonText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 14,
        marginTop: 20,
    },
});

export default PendingPod;
