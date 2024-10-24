import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; 
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig';
import { addToCart } from '../../redux/store'; // Adjust the path accordingly
import { useDispatch } from 'react-redux';

export default function ProductDetails() {
  const router = useRouter();
  const { productName } = useLocalSearchParams(); // Get product name from params
  const [productData, setProductData] = useState(null);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const q = query(
          collection(db, 'products'), // Reference to the products collection
          where('plantName', '==', productName) // Filter by plant name
        );

        const querySnapshot = await getDocs(q); // Execute the query

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data(); // Get the first matching document's data
          setProductData(docData);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching product data: ', error);
      }
    };

    fetchProductData();
  }, [productName]);

  const handleAddToCart = () => {
    dispatch(addToCart({ 
      id: productData.plantName, // or use a unique ID
      plantName: productData.plantName,
      category: productData.category,
      price: productData.price,
      amount: 1, // Initial amount
    }));
    Alert.alert('Success', `${productData.plantName} added to cart!`);
  };

  if (!productData) {
    return <Text>Loading...</Text>; // Show loading state while fetching data
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: productData.imageURL }}
        style={styles.productImage}
        onError={() => console.log('Error loading image')}
      />
      <Text style={styles.productName}>{productData.plantName}</Text>
      <Text style={styles.productDescription}>{productData.description}</Text>
      <Text style={styles.productCategory}>Category: {productData.category}</Text>
      <Text style={styles.productStock}>Stock: {productData.stock}</Text>
      <Text style={styles.productPrice}>Rs.{productData.price}</Text>

      <View style={styles.buttons}>
        <Button title="Go Back" onPress={() => router.back()} color="#4CAF50" />
        <Button title="Add to Cart" onPress={handleAddToCart} color="#4CAF50" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
  },
  productImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  productCategory: {
    fontSize: 16,
    marginBottom: 10,
    color: 'gray',
  },
  productStock: {
    fontSize: 16,
    marginBottom: 10,
    color: 'gray',
  },
  productPrice: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
