import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { db, storage, auth } from '../../Config/firebaseConfig';
import DropDownPicker from 'react-native-dropdown-picker';
import { useRouter } from 'expo-router';

export default function AddProduct() {
  const [plantName, setPlantName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(null);
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const [errors, setErrors] = useState({});

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Vegetable', value: 'vegetable' },
    { label: 'Fruit', value: 'fruit' },
    { label: 'Flower', value: 'flower' },
  ]);

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

  const validateFields = () => {
    let errors = {};

    if (!plantName) errors.plantName = "Plant name is required.";
    if (!description) errors.description = "Description is required.";
    if (!category) errors.category = "Please select a category.";
    if (!stock || !/^\d+$/.test(stock) || parseInt(stock) <= 0) errors.stock = "Please enter a valid stock quantity.";
    if (!price || !/^\d+(\.\d{1,2})?$/.test(price) || parseFloat(price) <= 0) errors.price = "Please enter a valid price.";
    if (!image) errors.image = "Please select an image.";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const uploadImage = async () => {
    if (image == null) return null;

    const imageName = image.substring(image.lastIndexOf('/') + 1);
    const imageRef = ref(storage, `plants/${imageName}`);

    const img = await fetch(image);
    const bytes = await img.blob();

    try {
      await uploadBytes(imageRef, bytes);
      const imageURL = await getDownloadURL(imageRef);
      return imageURL;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const handleAddProduct = async () => {
    if (!validateFields()) {
      return;
    }

    setUploading(true);
    const imageURL = await uploadImage();

    if (imageURL) {
      try {
        await addDoc(collection(db, 'products'), {
          plantName,
          description,
          category,
          stock: parseInt(stock),
          price: parseFloat(price),
          imageURL,
          userId: auth.currentUser.uid,
        });
        Alert.alert("Success", "Product added successfully!");
        setPlantName('');
        setDescription('');
        setCategory(null);
        setStock('');
        setPrice('');
        setImage(null);
        router.push('manageProduct');
      } catch (error) {
        console.error("Error adding product: ", error);
        Alert.alert("Error", "Could not add the product.");
      }
    }
    setUploading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add New Plant</Text>

      <TextInput
        placeholder="Plant Name"
        value={plantName}
        onChangeText={setPlantName}
        style={[styles.input, errors.plantName && styles.errorBorder]}
      />
      {errors.plantName && <Text style={styles.errorText}>{errors.plantName}</Text>}

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, errors.description && styles.errorBorder]}
        multiline
      />
      {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

      <DropDownPicker
        open={open}
        value={category}
        items={items}
        setOpen={setOpen}
        setValue={setCategory}
        setItems={setItems}
        placeholder="Select Category"
        containerStyle={{ marginBottom: 20 }}
      />
      {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

      <TextInput
        placeholder="Stock Quantity"
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
        style={[styles.input, errors.stock && styles.errorBorder]}
      />
      {errors.stock && <Text style={styles.errorText}>{errors.stock}</Text>}

      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={[styles.input, errors.price && styles.errorBorder]}
      />
      {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Pick an Image</Text>
        )}
      </TouchableOpacity>
      {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={handleAddProduct}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>{uploading ? "Uploading..." : "Add Product"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4CAF50',
    textAlign: 'center',
  },
  input: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  errorBorder: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 12,
  },
  imagePicker: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    height: 150,
    marginBottom: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  imagePickerText: {
    color: '#888',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
