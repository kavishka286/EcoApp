import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig';
import { useRouter, useLocalSearchParams } from 'expo-router';  // Use useLocalSearchParams instead of useSearchParams

export default function UpdatePost() {
  const router = useRouter();
  const { id, title: initialTitle = '', description: initialDescription = '' } = useLocalSearchParams();  // Use useLocalSearchParams for dynamic route params

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  // Log params for debugging
  useEffect(() => {
    console.log('Params received:', { id, title: initialTitle, description: initialDescription });
  }, [id, initialTitle, initialDescription]);

  const handleUpdatePost = async () => {
    if (!id) {
      Alert.alert('Error', 'No post data found.');
      return;
    }

    try {
      const postRef = doc(db, 'posts', id);  // Reference to the post using the post ID
      await updateDoc(postRef, { title, description });
      Alert.alert('Success', 'Post updated successfully!');
      router.push('managePosts');  // Navigate back to managePosts after updating
    } catch (error) {
      console.error('Error updating post:', error);
      Alert.alert('Error', 'Could not update post. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Update Post</Text>
      <TextInput
        placeholder="Edit title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Edit description"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePost}>
        <Text style={styles.buttonText}>Update Post</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.goBackButton} onPress={() => router.push('managePosts')}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    paddingTop: 40
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4CAF50'
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  goBackButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
