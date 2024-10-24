import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig'; 
import { Ionicons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router'; 
import { FontAwesome } from '@expo/vector-icons'; // Import for cart icon

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (querySnapshot) => {
      const productsList = [];
      querySnapshot.forEach((doc) => {
        productsList.push({ id: doc.id, ...doc.data() });
      });
      setProducts(productsList);
      setFilteredProducts(productsList);
    }, (error) => {
      console.error("Error fetching products: ", error);
    });

    return () => unsubscribe();
  }, []);

  // Filter products by search query and category
  useEffect(() => {
    const results = products.filter(product => {
      const matchesSearch = product.plantName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
    setFilteredProducts(results);
  }, [searchQuery, products, selectedCategory]);

  // Navigate to product detail screen
  const handleProductPress = (product) => {
    router.push({
      pathname: 'productDetail', 
      params: { productName: product.plantName }, // Pass only the product name
    });
  };

  // Navigate to Cart screen
  const handleViewCart = () => {
    router.push('CartScreen'); // Assuming you have a 'cart' route
  };

  // Navigate to Orders screen
  const handleViewOrders = () => {
    router.push('MyOrders'); // Navigate to the MyOrders screen
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productCard} onPress={() => handleProductPress(item)}>
      <Image source={{ uri: item.imageURL }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.plantName}</Text>
        <Text style={styles.productPrice}>Rs.{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Buy your <Text style={styles.highlight}>favourite plant</Text></Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          placeholder="search for any plant"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.filterTabs}>
        <TouchableOpacity 
          style={[styles.filterTab, selectedCategory === 'All' && styles.activeTab]} 
          onPress={() => setSelectedCategory('All')}>
          <Text style={[styles.filterTabText, selectedCategory === 'All' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, selectedCategory === 'Vegetable' && styles.activeTab]} 
          onPress={() => setSelectedCategory('Vegetable')}>
          <Text style={[styles.filterTabText, selectedCategory === 'Vegetable' && styles.activeTabText]}>Vegetable</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, selectedCategory === 'Fruit' && styles.activeTab]} 
          onPress={() => setSelectedCategory('Fruit')}>
          <Text style={[styles.filterTabText, selectedCategory === 'Fruit' && styles.activeTabText]}>Fruit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, selectedCategory === 'Flower' && styles.activeTab]} 
          onPress={() => setSelectedCategory('Flower')}>
          <Text style={[styles.filterTabText, selectedCategory === 'Flower' && styles.activeTabText]}>Flower</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />

      {/* View Cart Button */}
      <TouchableOpacity style={styles.cartButton} onPress={handleViewCart}>
        <FontAwesome name="shopping-cart" size={24} color="white" />
      </TouchableOpacity>

      {/* View Orders Button */}
      <TouchableOpacity style={styles.ordersButton} onPress={handleViewOrders}>
        <Text style={styles.ordersButtonText}>View Orders</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingTop: 40
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 10,
  },
  highlight: {
    color: '#4CAF50',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  filterTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterTab: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  filterTabText: {
    color: '#999',
    fontSize: 14,
  },
  activeTabText: {
    color: '#fff',
  },
  productList: {
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flex: 0.48,
    marginHorizontal: 5,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  productInfo: {
    marginTop: 10,
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#333',
  },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ordersButton: {
    position: 'absolute',
    bottom: 80, // Adjust position above the cart button
    right: 20,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ordersButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
