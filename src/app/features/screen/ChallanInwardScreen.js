import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions, useWindowDimensions } from 'react-native';
import { validateSession } from '../../utils/Session';
import CustomHeader from '../CustomHeader';
import { get } from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ChallanInwardScreen = () => {
    const { width, height } = useWindowDimensions('window');
    const navigation = useNavigation();
    const [challanList, setChallanList] = useState([]);
    const [challanDetails, setChallanDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedChallanNo, setSelectedChallanNo] = useState(null);

    useFocusEffect(
        useCallback(() => {
            validateSession(navigation);
            console.log(width, height)
        }, [navigation])
    );

    useEffect(() => {
        loadBranchAndFetchChallans();
    }, []);

    useEffect(() => {
        if (selectedChallanNo) {
            fetchChallanDetails(selectedChallanNo.chalan_no);
        }
    }, [selectedChallanNo]);

    const loadBranchAndFetchChallans = async () => {
        try {
            const branchData = await AsyncStorage.getItem('selectedBranch');
            console.log(branchData)
            if (branchData) {
                const branch = JSON.parse(branchData);
                setSelectedBranch(branch);
                fetchChallanList(branch.branch_id);
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
        return now.toISOString().split("T")[0];
    };

    const fetchChallanList = async (branchId) => {
        setLoading(true);
        get(`/challan/all_challan/${branchId}`, { companyId: 1, fyear: '24-25', from_date: getDateForApi() })
            .then((response) => {
                if (response.status === 'success' && Array.isArray(response.data)) {
                    setChallanList(response.data);
                    setLoading(false)
                } else {
                    setChallanList([]);
                    setLoading(false)
                }
            }).finally(() => { setLoading(false) })
    };

    const fetchChallanDetails = async (challanNo) => {
        setLoading(true);
        get(`/challan/all_info/${challanNo}`, { branch_id: selectedBranch.branch_id, companyId: 1, fyear: '24-25' })
            .then((response) => {
                if (response.status === 'success' && Array.isArray(response.data.chalan_info)) {
                    setChallanDetails(response.data.chalan_info);
                    setLoading(false)
                } else {
                    setChallanDetails([]);
                    setLoading(false)
                }
            }).finally(() => { setLoading(false) })
    };

    const handleViewPress = (challan) => {
        setSelectedChallanNo(challan ? challan : '');
        if (!challan) {
            fetchChallanList(selectedBranch.branch_id);
        }
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB').replace(/\//g, '-');
    };

    return (
        <View style={styles.container}>
            <CustomHeader title="Challan Inward" onBackPress={handleBackPress} backButtonVisible profileVisible />
            <View style={styles.content}>
                <View style={styles.branchHeader}>
                    {selectedBranch && <Text style={styles.selectedBranch}>Branch: {selectedBranch.branch_name}</Text>}

                    {selectedChallanNo && (
                        <TouchableOpacity style={[styles.viewButton, { paddingVertical: 5 }]} onPress={() => handleViewPress(null)}>
                            <Text style={styles.viewButtonText}>Back</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="blue" />
                ) : !selectedChallanNo ? (
                    <View style={[styles.tableContainer, { height: height * 0.85 }]}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.headerCell, { width: '14%' }]}>Ch. No</Text>
                            <Text style={[styles.headerCell, { width: '18%' }]}>Ch. Date</Text>
                            <Text style={[styles.headerCell, { width: '18%' }]}>Vehicle No</Text>
                            <Text style={[styles.headerCell, { width: '17%' }]}>From</Text>
                            <Text style={[styles.headerCell, { width: '18%' }]}>Driver No</Text>
                            <Text style={[styles.headerCell, { width: '15%' }]}>Action</Text>
                        </View>
                        <ScrollView nestedScrollEnabled>
                            {challanList.length > 0 ? (
                                challanList.map((item, index) => (
                                    <View key={index} style={styles.row}>
                                        <Text style={[styles.cell, { width: '14%' }]}>{item.chalan_no}</Text>
                                        <Text style={[styles.cell, { width: '18%' }]}>{item.booking_chalan_date}</Text>
                                        <Text style={[styles.cell, { width: '18%' }]}>{item.vehicle_no}</Text>
                                        <Text style={[styles.cell, { width: '17%' }]} numberOfLines={1}>{item.station_from_name}</Text>
                                        <Text style={[styles.cell, { width: '18%' }]}>{item.driver_mobile_no}</Text>
                                        <View style={[styles.cell, { width: '15%' }]}>
                                            <TouchableOpacity style={styles.viewButton} onPress={() => handleViewPress(item)}>
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
                ) : (
                    <>
                        <View>
                            <Text style={styles.selectedChalan}>Station From: <Text style={{ fontWeight: '400' }}>{selectedChallanNo.station_from_name}</Text></Text>
                            <Text style={styles.selectedChalan}>Challan No: <Text style={{ fontWeight: '400' }}>{selectedChallanNo.chalan_no}</Text></Text>
                            <Text style={styles.selectedChalan}>Vehicle No: <Text style={{ fontWeight: '400' }}>{selectedChallanNo.vehicle_no}</Text></Text>
                        </View>
                        <View style={[styles.tableContainer, { height: height * 0.78 }]}>
                            <View style={styles.tableHeader}>
                                <Text style={[styles.headerCell, { width: '15%' }]}>Bilty No</Text>
                                <Text style={[styles.headerCell, { width: '17%' }]}>Bilty Date</Text>
                                <Text style={[styles.headerCell, { width: '13%' }]}>Package</Text>
                                <Text style={[styles.headerCell, { width: '12%' }]}>Weight</Text>
                                <Text style={[styles.headerCell, { width: '20%' }]}>Consignor</Text>
                                <Text style={[styles.headerCell, { width: '20%' }]}>Consignee</Text>
                            </View>
                            <ScrollView nestedScrollEnabled>
                                {challanDetails.length > 0 ? (
                                    challanDetails.map((item, index) => (
                                        <View key={index} style={styles.row}>
                                            <Text style={[styles.cell, { width: '15%' }]}>{item.bilty_no}</Text>
                                            <Text style={[styles.cell, { width: '17%' }]}>{formatDate(item.created_date)}</Text>
                                            <Text style={[styles.cell, { width: '13%' }]}>{item.no_of_package}</Text>
                                            <Text style={[styles.cell, { width: '12%' }]}>{item.charge_weight}</Text>
                                            <Text style={[styles.cell, { width: '20%' }]} numberOfLines={1}>{item.consignor_name}</Text>
                                            <Text style={[styles.cell, { width: '20%' }]} numberOfLines={1}>{item.consignee_name}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.emptyText}>No Data Available</Text>
                                )}
                            </ScrollView>
                        </View>
                    </>
                )}
            </View>
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
        fontWeight: '600'
    },
    selectedChalan: {
        fontSize: 12,
        fontWeight: '600'
    },
    tableContainer: {
        backgroundColor: '#f2f2f2',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#333',
        marginTop: 10,
        width: '100%',
        shadowColor: "#000",
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
        borderTopLeftRadius: 5
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
        ellipsizeMode: "tail"
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

export default ChallanInwardScreen;
