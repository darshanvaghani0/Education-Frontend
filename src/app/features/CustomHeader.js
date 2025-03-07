import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, Dimensions } from 'react-native';
import { getUserName, isAdmin } from './auth/user_data';

const { width, height } = Dimensions.get('window');

const CustomHeader = ({ title, onBackPress, backButtonVisible, profileVisible }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [userName, setUserName] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const checkAdminStatus = async () => {
            const adminStatus = await isAdmin();
            setIsUserAdmin(adminStatus);
            const userName = await getUserName();
            setUserName(userName);
        };
        checkAdminStatus();
    }, []);

    const menuOptions = [
        {
            id: 'profile',
            title: 'View Profile',
            icon: require('./../../assets/person.png'),
            onPress: () => {
                console.log('View Profile clicked!');
            }
        },
        {
            id: 'approve',
            title: 'Approve User',
            icon: require('./../../assets/tick-inside-circle.png'),
            onPress: () => navigation.navigate('NewSignUpUser'),
            adminOnly: true
        },
        {
            id: 'logout',
            title: 'Logout',
            icon: require('./../../assets/logout.png'),
            onPress: async () => {
                await AsyncStorage.clear();
                navigation.navigate('Login');
            }
        }
    ];

    const MenuItem = ({ item }) => {
        if (item.adminOnly && !isUserAdmin) return null;
        
        return (
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                    setIsModalVisible(false);
                    item.onPress();
                }}
            >
                <Image source={item.icon} style={styles.menuIcon} />
                <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.leftSection}>
                    {backButtonVisible && (
                        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
                            <Image 
                                source={require('./../../assets/left.png')} 
                                style={styles.backIcon} 
                            />
                        </TouchableOpacity>
                    )}
                    <Text style={styles.title}>{title}</Text>
                </View>
                {profileVisible && (
                    <TouchableOpacity
                        onPress={() => setIsModalVisible(true)}
                        style={styles.profileButton}
                    >
                        <Image 
                            source={require('./../../assets/person.png')} 
                            style={styles.profileIcon} 
                        />
                    </TouchableOpacity>
                )}
            </View>

            <Modal
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
                animationType="fade"
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsModalVisible(false)}
                >
                    <View style={styles.menuContainer}>
                        <View style={styles.profileSection}>
                            <Text style={styles.userName}>{userName}</Text>
                            <Image 
                                source={require('./../../assets/boy.png')}
                                style={styles.profileImage}
                            />
                            {/* <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.profileActionButton}>
                                    <Text style={styles.buttonText}>Edit Profile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.profileActionButton}>
                                    <Text style={styles.buttonText}>Settings</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.profileActionButton}>
                                    <Text style={styles.buttonText}>Help</Text>
                                </TouchableOpacity>
                            </View> */}
                        </View>
                        <View style={styles.divider} />
                        {menuOptions.map(item => (
                            <MenuItem key={item.id} item={item} />
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: width * 0.04,
        height: height * 0.08,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    backIcon: {
        width: width * 0.05,
        height: width * 0.05,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    profileButton: {
        width: width * 0.1,
        height: width * 0.1,
        borderRadius: width * 0.05,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileIcon: {
        width: '100%',
        height: '100%',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    menuContainer: {
        position: 'absolute',
        right: 0,
        width: 250,
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 12,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 16,
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    profileActionButton: {
        backgroundColor: '#f0f0f0',
        padding: 8,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 14,
        color: '#1a1a1a',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
    },
    menuIcon: {
        width: 24,
        height: 24,
    },
    menuText: {
        marginLeft: 12,
        fontSize: 16,
        color: '#1a1a1a',
    }
});

export default CustomHeader;
