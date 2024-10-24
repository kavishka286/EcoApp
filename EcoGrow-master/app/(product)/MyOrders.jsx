import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig'; // Import Firestore database

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(db, 'orders');
        const ordersSnapshot = await getDocs(ordersCollection);
        const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderId}>Order ID: {item.id}</Text>
      <Text style={styles.totalPrice}>Total Price: ${item.totalPrice.toFixed(2)}</Text>
      <Text style={styles.createdAt}>Order Date: {new Date(item.createdAt).toLocaleString()}</Text>
      <Text style={styles.itemsHeading}>Items:</Text>
      {item.items.map((product, index) => (
        <Text key={index} style={styles.itemText}>
          - {product.plantName} (x{product.amount})
        </Text>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>My <Text style={styles.highlight}>Orders</Text></Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.orderList}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    paddingTop:40
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 10,
  },
  highlight: {
    color: '#4CAF50',
  },
  orderList: {
    flexGrow: 1,
  },
  orderItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalPrice: {
    fontSize: 16,
    color: '#777',
    marginVertical: 5,
  },
  createdAt: {
    fontSize: 14,
    color: '#999',
  },
  itemsHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginVertical: 10,
  },
  itemText: {
    fontSize: 14,
    color: '#555',
  },
});
