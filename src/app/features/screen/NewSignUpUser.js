import React, { useEffect, useState } from "react";
import { 
  View, Text, TouchableOpacity, ScrollView, 
  ActivityIndicator, StyleSheet, Image 
} from "react-native";
import { BASE_URL } from "../../../services/api";
import CustomHeader from '../CustomHeader';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

const TableRow = ({ onPress, name, email }) => (
  
    <View style={[styles.rowContent, styles.tableRow]}>
      <View style={[styles.cell, styles.nameCell]}>
        <Text style={styles.nameText}>{name}</Text>
      </View>
      <View style={[styles.cell, styles.emailCell]}>
        <Text style={styles.emailText} numberOfLines={1} ellipsizeMode="tail">{email}</Text>
      </View>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.cell}>
          <Image style={styles.iconRight} source={require('../../../assets/tick-inside-circle.png')} />
        </View>
      </TouchableOpacity>
    </View>
);

const NewSignUpUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchInactiveUsers();
  }, []);

  const fetchInactiveUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/inactive-users`);
      const json = await response.json();
      
      if (json.status === "success" && Array.isArray(json.data)) {
        setUsers(json.data);
      } else {
        setUsers([]);
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Failed to load users',
        });
      }
    } catch (error) {
      setUsers([]);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Something went wrong while fetching users.',
      });
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/users/approve/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();

      if (json.status === "success") {
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'User approved successfully!',
        });
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      } else {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Failed to approve user',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Something went wrong while approving user.',
      });
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Approve Users"
        backButtonVisible={true}
        profileVisible={false}
        onBackPress={handleBackPress}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <View style={styles.headerContent}>
              <View style={[styles.cell, styles.nameCell]}>
                <Text style={styles.headerText}>Name</Text>
              </View>
              <View style={[styles.cell, styles.emailCell]}>
                <Text style={styles.headerText}>Email</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.headerText}>Action</Text>
              </View>
            </View>
          </View>

          <ScrollView>
            <View>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow
                    key={user.id}
                    onPress={() => approveUser(user.id)}
                    name={user.name}
                    email={user.email}
                  />
                ))
              ) : (
                <View style={styles.noUsersContainer}>
                  <Text style={styles.noUsersText}>No pending users for approval</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
  },
  headerContent: {
    flexDirection: 'row',
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  rowContent: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  nameCell: {
    flex: 1,
    alignItems: 'center',
  },
  emailCell: {
    flex: 3,
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    color: '#495057',
    fontSize: 14,
  },
  nameText: {
    fontSize: 16,
    color: '#212529',
  },
  emailText: {
    fontSize: 14,
    color: '#6c757d',
  },
  iconLeft: {
    width: 24,
    height: 24,
  },
  iconRight: {
    width: 20,
    height: 20,
    // tintColor: '#6c757d',
  },
  noUsersContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noUsersText: {
    fontSize: 16,
    color: '#6c757d',
  },
});

export default NewSignUpUser;
