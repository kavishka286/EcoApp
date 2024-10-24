import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig'; 
import { useRouter, useLocalSearchParams } from 'expo-router'; // Updated import

export default function UpdateProduct() {
  const router = useRouter();
  const { id, plantName, description, price } = useLocalSearchParams(); // Updated to include price
  const [newPlantName, setNewPlantName] = useState(plantName);
  const [newDescription, setNewDescription] = useState(description);
  const [newPrice, setNewPrice] = useState(price.toString()); // Ensure price is a string for TextInput

  const handleUpdateProduct = async () => {
    try {
      const productDoc = doc(db, 'products', id);
      await updateDoc(productDoc, {
        plantName: newPlantName,
        description: newDescription,
        price: parseFloat(newPrice), // Ensure price is a number
      });
      Alert.alert("Success", "Product updated successfully!");
      router.push('manageProduct'); // Navigate back to manageProduct after updating
    } catch (error) {
      console.error("Error updating product: ", error);
      Alert.alert("Error", "Could not update the product.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Update Product</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Plant Name</Text>
        <TextInput
          placeholder="Enter Plant Name"
          value={newPlantName}
          onChangeText={setNewPlantName}
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          placeholder="Enter Description"
          value={newDescription}
          onChangeText={setNewDescription}
          style={styles.input}
          multiline
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Price</Text>
        <TextInput
          placeholder="Enter Price"
          value={newPrice}
          onChangeText={setNewPrice}
          style={styles.input}
          keyboardType="numeric" // Ensure only numeric input
        />
      </View>

      <Button title="Update Product" onPress={handleUpdateProduct} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4CAF50',
  },
  inputContainer: {
    marginBottom: 15, // Add spacing between input fields
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
});
