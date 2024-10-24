// AddPost.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, storage } from '../../Config/firebaseConfig';
import { useRouter } from 'expo-router';

export default function AddPost() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const router = useRouter();

  const pickImage = async () => {
    console.log("Picking an image...");
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Image picker result:", result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log("Selected image URI:", result.assets[0].uri);
    }
  };

  const handleUploadPost = async () => {
    console.log("Handling post upload...");
    if (!image || !description || !title) {
      Alert.alert('Error', 'Please select an image and add a description and title.');
      return;
    }

    try {
      console.log("Creating storage reference...");
      const storageRef = ref(storage, `posts/${auth.currentUser.uid}/${Date.now()}.jpg`);
      console.log("Storage reference created:", storageRef);

      console.log("Getting file info...");
      const fileInfo = await FileSystem.getInfoAsync(image);
      console.log("File info:", fileInfo);

      if (!fileInfo.exists) {
        Alert.alert('Error', 'Image file does not exist!');
        return;
      }

      console.log("Fetching image data...");
      const response = await fetch(fileInfo.uri);
      const blob = await response.blob();
      console.log("Blob created from image:", blob);

      console.log("Starting upload...");
      const uploadResult = await uploadBytes(storageRef, blob);
      console.log("Upload completed:", uploadResult);

      console.log("Getting download URL...");
      const imageURL = await getDownloadURL(uploadResult.ref);
      console.log("Image uploaded, URL:", imageURL);

      console.log("Saving post details to Firestore...");
      const docRef = await addDoc(collection(db, 'posts'), {
        userId: auth.currentUser.uid,
        imageURL: imageURL,
        title: title,
        description: description,
        likes: 0, // Initialize likes count to 0
        timestamp: serverTimestamp(),
      });
      console.log("Post details saved to Firestore. Document ID:", docRef.id);

      Alert.alert('Success', 'Post added successfully!');
      setImage(null);
      setDescription('');
      setTitle('');
      router.push('Community');
    } catch (error) {
      console.error("Error uploading post:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      
      if (error.code === 'storage/unauthorized') {
        Alert.alert('Error', 'You do not have permission to upload files. Please check your Firebase Storage rules.');
      } else if (error.code === 'storage/canceled') {
        Alert.alert('Error', 'The upload was canceled.');
      } else if (error.code === 'storage/unknown') {
        Alert.alert('Error', `An unknown error occurred. Please check your internet connection and try again. Details: ${error.message}`);
      } else {
        Alert.alert('Error', `An error occurred while uploading: ${error.message}`);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add a Post</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imageUploadContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <Text>Upload an image</Text>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Add a title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Add a description"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.publishButton} onPress={handleUploadPost}>
        <Text style={styles.publishButtonText}>Publish</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  imageUploadContainer: {
    width: 200,
    height: 200,
    backgroundColor: '#e1e1e1',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  publishButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  publishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
