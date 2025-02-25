import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';

const BranchSelectionScreen = () => {
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchStoredData = async () => {
            try {
                const storedData = await AsyncStorage.getItem('loginData');
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    if (parsedData.response?.data?.branch_info) {
                        const uniqueBranches = [];
                        const branchSet = new Set();

                        parsedData.response.data.branch_info.forEach((branch) => {
                            if (!branchSet.has(branch.branch_id)) {
                                branchSet.add(branch.branch_id);
                                uniqueBranches.push({
                                    label: branch.branch_name,
                                    value: branch.branch_id,
                                    branchData: branch,
                                });
                            }
                        });

                        setItems(uniqueBranches);
                        setBranches(uniqueBranches.map((b) => b.branchData));
                    } else {
                        console.log("Branch data not found");
                    }
                }
            } catch (error) {
                console.log("Error retrieving login data:", error);
            }
        };

        fetchStoredData();
    }, []);

    const handleBranchSelect = async () => {
        if (!selectedBranch) {
            console.log("Please select a branch first!");
            return;
        }

        try {
            const selectedData = branches.find((b) => b.branch_id === selectedBranch);
            await AsyncStorage.setItem('selectedBranch', JSON.stringify(selectedData));
            console.log(`Selected branch: ${selectedData.branch_name}`);
            navigation.navigate('Home');
        } catch (error) {
            console.log("Error saving selected branch:", error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.contentBox}>
                <Text style={styles.title}>Select a Branch</Text>

                <DropDownPicker
                    open={open}
                    value={selectedBranch}
                    items={items}
                    setOpen={setOpen}
                    setValue={setSelectedBranch}
                    setItems={setItems}
                    placeholder="Select Branch"
                    containerStyle={styles.dropdownContainer}
                    style={styles.dropdown}
                    dropDownStyle={styles.dropdownStyle}
                    searchable={true}
                    searchPlaceholder="Search branch..."
                />

                <TouchableOpacity
                    onPress={handleBranchSelect}
                    style={[styles.button, !selectedBranch && styles.disabled]}
                    disabled={!selectedBranch}
                >
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    contentBox: {
        width: '90%',
        padding: 20,
        borderWidth: 2,
        borderColor: '#000',
        borderStyle: 'dashed',
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dropdownContainer: {
        width: '100%',
        height: 50,
        marginBottom: 20,
    },
    dropdown: {
        backgroundColor: "#f0f0f0",
    },
    dropdownStyle: {
        backgroundColor: "#fff",
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

export default BranchSelectionScreen;
