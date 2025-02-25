export const ToastConfig = {
    success: ({ text1, text2 }) => (
      <View style={styles.toastContainer}>
        <Text style={styles.toastText1}>{text1}</Text>
        <Text style={styles.toastText2}>{text2}</Text>
      </View>
    ),
    error: ({ text1, text2 }) => (
      <View style={styles.toastContainer}>
        <Text style={styles.toastText1}>{text1}</Text>
        <Text style={styles.toastText2}>{text2}</Text>
      </View>
    ),
    // Add other toast types (e.g., info) if needed
  };
  
  const styles = {
    toastContainer: {
      width: '90%',
      padding: 15,
      borderRadius: 10,
      backgroundColor: '#1E90FF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5, // For Android shadow
    },
    toastText1: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    toastText2: {
      color: '#ffffff',
      fontSize: 14,
      marginTop: 5,
    },
  };
  