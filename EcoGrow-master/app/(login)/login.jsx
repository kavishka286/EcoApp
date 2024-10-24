// login.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../Config/firebaseConfig'; // Import Firebase auth instance
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase method for login

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Login Function
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Login successful!');
      router.push('Home');
      // Navigate to the next screen after login (e.g., home page)
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="gray" style={styles.icon} />
        <TextInput
          placeholder="Enter your email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="gray" style={styles.icon} />
        <TextInput
          placeholder="Enter your password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => router.push('signup')}>
          <Text style={styles.signupLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        backgroundColor: '#fff',
      },
      heading: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#000',
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E6E6E6',
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 10,
        width: '100%',
      },
      icon: {
        marginRight: 10,
      },
      input: {
        height: 50,
        flex: 1,
        fontSize: 16,
      },
      forgotPassword: {
        alignSelf: 'flex-end',
        color: '#3EB049',
        marginBottom: 30,
      },
      loginButton: {
        backgroundColor: '#3EB049',
        paddingVertical: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
      },
      loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
      signupContainer: {
        flexDirection: 'row',
        marginTop: 20,
      },
      signupText: {
        color: '#000',
      },
      signupLink: {
        color: '#3EB049',
        marginLeft: 5,
      },
});
