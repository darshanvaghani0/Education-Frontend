import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, Dimensions } from 'react-native';
import { getUserName, isAdmin } from './auth/user_data';
import { colors, spacing, shadows, typography, borderRadius } from '../theme/theme';

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
        padding: spacing.md,
        height: height * 0.08,
        backgroundColor: colors.background.primary,
        ...shadows.md,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: spacing.sm,
        marginRight: spacing.sm,
    },
    backIcon: {
        width: width * 0.05,
        height: width * 0.05,
        tintColor: colors.text.primary,
    },
    title: {
        ...typography.h3,
        color: colors.text.primary,
    },
    profileButton: {
        width: width * 0.1,
        height: width * 0.1,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background.accent,
    },
    profileIcon: {
        width: '80%',
        height: '80%',
        tintColor: colors.primary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    menuContainer: {
        position: 'absolute',
        right: 0,
        width: width * 0.7,
        maxWidth: 300,
        height: '100%',
        backgroundColor: colors.background.primary,
        borderTopLeftRadius: borderRadius.xl,
        borderBottomLeftRadius: borderRadius.xl,
        padding: spacing.lg,
        ...shadows.lg,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: spacing.lg,
    },
    userName: {
        ...typography.h2,
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    profileImage: {
        width: width * 0.2,
        height: width * 0.2,
        borderRadius: borderRadius.full,
        marginBottom: spacing.lg,
        backgroundColor: colors.background.accent,
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.sm,
    },
    profileActionButton: {
        backgroundColor: colors.background.accent,
        padding: spacing.sm,
        borderRadius: borderRadius.md,
        minWidth: 80,
        alignItems: 'center',
    },
    buttonText: {
        ...typography.body,
        color: colors.text.primary,
    },
    divider: {
        height: 1,
        backgroundColor: colors.background.accent,
        marginVertical: spacing.md,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginVertical: spacing.xs,
        backgroundColor: colors.background.secondary,
    },
    menuIcon: {
        width: 24,
        height: 24,
        marginRight: spacing.md,
        tintColor: colors.primary,
    },
    menuText: {
        ...typography.body,
        color: colors.text.primary,
    },
});

export default CustomHeader;
