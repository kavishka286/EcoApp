import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig';
import { parse, format } from 'date-fns';

const SalesAnalytics = () => {
  const [activeCategory, setActiveCategory] = useState('fruit');
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const inventory = [];

        ordersSnapshot.forEach(doc => {
          const orderData = doc.data();
          // Parse the string date into a Date object
          const orderDate = orderData.createdAt ? parse(orderData.createdAt, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", new Date()) : null;

          orderData.items.forEach(item => {
            inventory.push({
              id: item.id,
              name: item.plantName,
              category: item.category.toLowerCase(),
              amount: item.amount,
              price: item.price,
              date: orderDate,
            });
          });
        });

        setInventoryData(inventory);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders from Firestore:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryPress = (category) => {
    setActiveCategory(category.toLowerCase());
  };
  
  const categories = ['Fruit', 'Vegetable', 'Flower'];
  
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text>Amount: {item.amount}</Text>
      <Text>Total Price: Rs: {(item.price * item.amount).toFixed(2)}</Text>
      {item.date ? (
        <Text>Order Date: {format(item.date, 'dd/MM/yyyy')}</Text>
      ) : (
        <Text>Order Date: N/A</Text>
      )}
    </View>
  );

  const filteredData = inventoryData.filter(item => item.category.toLowerCase() === activeCategory.toLowerCase());

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sales Analytics</Text>

      <View style={styles.buttonContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              activeCategory === category.toLowerCase() && styles.activeButton,
            ]}
            onPress={() => handleCategoryPress(category)}
          >
            <Text style={styles.buttonText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#51CD56',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: '#3E8E41',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'rgba(243, 243, 243, 0.8)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default SalesAnalytics;