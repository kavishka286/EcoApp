import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { db, storage } from '../../Config/firebaseConfig'; // Firebase setup
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const AddJournal = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [importantThings, setImportantThings] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('Fruits'); // Default category
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title) newErrors.title = 'Title is required';
    if (!description) newErrors.description = 'Description is required';
    if (!importantThings) newErrors.importantThings = 'Important Things field is required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    let imageUrl = '';
    if (image) {
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(storage, `journals/${new Date().toISOString()}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);
      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          console.error('Upload error:', error);
          setLoading(false);
        },
        async () => {
          imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          saveJournal(imageUrl);
        }
      );
    } else {
      saveJournal(imageUrl);
    }
  };

  const saveJournal = async (imageUrl) => {
    try {
      await addDoc(collection(db, 'journals'), {
        title,
        description,
        importantThings,
        category,
        imageUrl,
        createdAt: new Date(),
      });
      setLoading(false);
      router.push('ManageJournal');
    } catch (error) {
      console.error('Error adding journal:', error);
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Journal</Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={[styles.input, errors.title && styles.inputError]}
      />
      {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={[styles.input, styles.descriptionInput, errors.description && styles.inputError]}
      />
      {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

      <TextInput
        placeholder="Important Things"
        value={importantThings}
        onChangeText={setImportantThings}
        multiline
        style={[styles.input, styles.descriptionInput, errors.importantThings && styles.inputError]}
      />
      {errors.importantThings && <Text style={styles.errorText}>{errors.importantThings}</Text>}

      <Picker
        selectedValue={category}
        style={styles.picker}
        onValueChange={(itemValue) => setCategory(itemValue)}
      >
        <Picker.Item label="Fruits" value="Fruits" />
        <Picker.Item label="Vegetables" value="Vegetables" />
        <Picker.Item label="Flowers" value="Flowers" />
      </Picker>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>Pick an image</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.publishButton, loading && styles.disabledButton]} 
        onPress={handleSubmit} 
        disabled={loading}
      >
        <Text style={styles.publishButtonText}>{loading ? 'Saving...' : 'Publish'}</Text>
      </TouchableOpacity>
      
      {loading && <ActivityIndicator size="large" style={styles.loadingIndicator} />}

      <View style={styles.previewContainer}>
        <Text style={styles.previewTitle}>{title || 'Journal Title'}</Text>
        <Text style={styles.previewDate}>
          {new Date().toLocaleDateString()}
        </Text>

        {image && (
          <Image source={{ uri: image }} style={styles.previewImage} />
        )}

        <Text>{description || 'Your journal description goes here...'}</Text>
        
        <Text style={styles.careRoutine}>
          <Text style={{ fontWeight: 'bold' }}>Care Routine: </Text>
          {importantThings || 'Describe care routine or important things...'}
        </Text>

        <Text style={styles.categoryText}>
          Category: {category}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4CAF50', // Title color
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderBottomColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: 150,
    marginBottom: 10,
  },
  imagePicker: {
    backgroundColor: '#e0f7fa',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerText: {
    color: '#00796b',
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginTop: 10,
  },
  publishButton: {
    backgroundColor: '#4CAF50', // Same color as the title
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  publishButtonText: {
    color: '#FFFFFF', // White text color
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#A5D6A7', // Lighter color when disabled
  },
  previewContainer: {
    marginTop: 20,
    backgroundColor: '#F0F8F0',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  previewTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  previewDate: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
    textAlign: 'center',
  },
  previewImage: {
    width: '100%',
    height: 150,
    marginBottom: 10,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  careRoutine: {
    marginTop: 10,
    fontStyle: 'italic',
  },
  categoryText: {
    marginTop: 10,
    color: '#449E48',
    fontWeight: 'bold',
  },
});

export default AddJournal;
