import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, Dimensions } from 'react-native';
import { isAdmin } from './auth/user_data';

const { width, height } = Dimensions.get('window');

const CustomHeader = ({ title, onBackPress, backButtonVisible, profileVisible, profileImage, viewProfileIcon, logoutIcon }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false)
    const navigation = useNavigation();

    useEffect(() => {
        const initializeData = async () => {
            const adminStatus = await isAdmin();
            setIsUserAdmin(adminStatus);
        };
        initializeData();
    }, []);

    const handleViewProfile = () => {
        console.log('View Profile clicked!');
    };

    const handleApproveUser = () => {
        navigation.navigate('NewSignUpUser');
    }

    const handleLogout = () => {
        console.log('Logout clicked!');
        AsyncStorage.clear();
        navigation.navigate('Login');
    };

    return (
        <>
            <View style={styles.headerContainer}>
                <View style={styles.backButtonHeader}>
                    {backButtonVisible &&
                        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
                            <Image source={require('./../../assets/left.png')} style={styles.backImage} />
                        </TouchableOpacity>
                    }
                    <Text style={styles.headerTitle}>{title}</Text>
                </View>
                {profileVisible &&
                    <TouchableOpacity
                        onPress={() => setIsModalVisible(true)}
                        style={styles.profileImageContainer}
                    >
                        <Image source={require('./../../assets/person.png')} style={styles.profileImage} />
                    </TouchableOpacity>
                }
            </View>

            <Modal
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setIsModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => {
                                setIsModalVisible(false);
                                handleViewProfile();
                            }}
                        >
                            <Image source={require('./../../assets/person.png')} style={styles.optionIcon} />
                            <Text style={styles.optionText}>View Profile</Text>
                        </TouchableOpacity>

                        {isUserAdmin && (
                            <TouchableOpacity
                                style={styles.option}
                                onPress={() => {
                                    setIsModalVisible(false);
                                handleApproveUser();
                            }}
                        >
                            <Image source={require('./../../assets/tick-inside-circle.png')} style={styles.optionIcon} />
                                <Text style={styles.optionText}>Approve User</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => {
                                setIsModalVisible(false);
                                handleLogout();
                            }}
                        >
                            <Image source={require('./../../assets/logout.png')} style={styles.optionIcon} />
                            <Text style={styles.optionText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

        </>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: width * 0.04,
        height: height * 0.08,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    backButtonHeader: {
        flexDirection: 'row',
    },
    backButton: {
        padding: 5,
    },
    backImage: {
        width: width * 0.05,
        height: width * 0.05,
    },
    headerTitle: {
        color: 'black',
        fontSize: width * 0.045,
        fontWeight: 'bold',
        padding: 3
    },
    profileImageContainer: {
        width: width * 0.1,
        height: width * 0.1,
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end', 
        paddingTop: 20, 
    },
    modalContent: {
        width: '40%',
        backgroundColor: '#F0F0F0',
        padding: 5,
        marginTop: height * 0.054,
        borderColor: 'black',
        borderRadius: 10,
        marginRight: 5
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    optionIcon: {
        width: 22,
        height: 22,
    },
    optionText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#333',
    },
});

export default CustomHeader;
