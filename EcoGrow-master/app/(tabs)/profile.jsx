import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { auth } from '../../Config/firebaseConfig'; // Adjust the import path as needed
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      router.push('login'); // Navigate to Login screen after logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <Image 
        source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }} // New Pexels image
        style={styles.profileImage}
      />
      {/* User Info */}
      <Text style={styles.userName}>Username: dushx</Text>
      <Text style={styles.userEmail}>Email: tdmahindarathne@aiesec.net</Text>
      
      {/* Section Navigation */}
      <View style={styles.sectionContainer}>
        <TouchableOpacity style={styles.section} onPress={ () => { router.push('Home')}}>
          <Text style={styles.sectionText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.section} onPress={ () => { router.push('Journal')}}>
          <Text style={styles.sectionText}>My Journals</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.section} onPress={ () => { router.push('Community')}}>
          <Text style={styles.sectionText}>Community</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.section} onPress={ () => { router.push('Sales')}}>
          <Text style={styles.sectionText}>Sales</Text>
        </TouchableOpacity>
      </View>
      
      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    justifyContent: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    alignSelf: 'center',
   
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  section: {
    backgroundColor: '#E0E0E0',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    justifyContent: 'center',
  },
  sectionText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 30,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;
