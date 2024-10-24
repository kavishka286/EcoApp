import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native'; // Import Picker for category selection
import { db } from '../../Config/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const UpdateJournal = () => {
  const { journalId } = useLocalSearchParams(); // Use useLocalSearchParams to get journalId
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [importantThings, setImportantThings] = useState('');
  const [category, setCategory] = useState('Fruits'); // Default category
  const [imageUrl, setImageUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchJournal = async () => {
      const journalDoc = await getDoc(doc(db, 'journals', journalId));
      if (journalDoc.exists()) {
        const journalData = journalDoc.data();
        setTitle(journalData.title);
        setDescription(journalData.description || '');
        setImportantThings(journalData.importantThings || '');
        setCategory(journalData.category || 'Fruits'); // Set the category
        setImageUrl(journalData.imageUrl || '');
      } else {
        Alert.alert('Journal not found');
      }
    };
    fetchJournal();
  }, [journalId]);

  const handleUpdate = async () => {
    try {
      const journalRef = doc(db, 'journals', journalId);
      await updateDoc(journalRef, {
        title,
        description,
        importantThings,
        category,
        imageUrl, // Keep imageUrl unchanged
      });
      Alert.alert('Journal updated successfully');
      router.push('ManageJournal'); // Navigate back to ManageJournal after updating
    } catch (error) {
      Alert.alert('Error updating journal', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Update Journal</Text>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.placeholderImage} />
      )}
      <Text style={styles.label}>Journal Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Journal Title"
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4} // You can adjust this as needed
      />
      <Text style={styles.label}>Important Things</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Important Things"
        value={importantThings}
        onChangeText={setImportantThings}
      />
      <Text style={styles.label}>Category</Text>
      <Picker
        selectedValue={category}
        style={styles.picker}
        onValueChange={(itemValue) => setCategory(itemValue)}
      >
        <Picker.Item label="Fruits" value="Fruits" />
        <Picker.Item label="Vegetables" value="Vegetables" />
        <Picker.Item label="Flowers" value="Flowers" />
      </Picker>
      <TouchableOpacity onPress={handleUpdate} style={styles.button}>
        <Text style={styles.buttonText}>Update Journal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#4CAF50',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#ddd',
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default UpdateJournal;
