import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { auth, db } from '../../Config/firebaseConfig';
import { useRouter } from 'expo-router';

export default function ManageProduct() {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, 'products');
      const q = query(productsCollection, where("userId", "==", auth.currentUser.uid));
      const productSnapshot = await getDocs(q);
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products: ", error);
      Alert.alert("Error", "Could not fetch products.");
    }
  };

  const handleUpdateProduct = (product) => {
    if (product) {
      console.log(product);
      router.push({
        pathname: `updateProduct`,
        params: { 
          id: product.id, 
          plantName: product.plantName, 
          description: product.description,
          price: product.price,
        },
      });
    } else {
      console.warn('Product is undefined, not navigating.');
    }
  };

  const handleDeleteProduct = async (id) => {
    const productDoc = doc(db, 'products', id);
    try {
      await deleteDoc(productDoc);
      Alert.alert("Success", "Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product: ", error);
      Alert.alert("Error", "Could not delete the product.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.productCard}>
      <Text style={styles.productName}>{item.plantName}</Text>
      <Text style={styles.productDetails}>Description: {item.description || "N/A"}</Text>
      <Text style={styles.productDetails}>Category: {item.category || "N/A"}</Text>
      <Text style={styles.productDetails}>Stock: {item.stock || "N/A"}</Text>
      <Text style={styles.productDetails}>Price: Rs.{item.price ? item.price.toFixed(2) : "0.00"}</Text>
      <TouchableOpacity onPress={() => handleUpdateProduct(item)} style={styles.button}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => handleDeleteProduct(item.id)}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Manage Products</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
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
  productCard: {
    backgroundColor: '#F3F3F3',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 1, // Shadow for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.1, // Shadow opacity for iOS
    shadowRadius: 5, // Shadow radius for iOS
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productDetails: {
    fontSize: 14,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});