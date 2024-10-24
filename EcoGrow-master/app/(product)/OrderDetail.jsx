import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, FlatList } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig';
import { useLocalSearchParams } from 'expo-router';

export default function OrderDetail() {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const orderDoc = doc(db, 'orders', id);
        const orderSnapshot = await getDoc(orderDoc);
        if (orderSnapshot.exists()) {
          setOrder({ id: orderSnapshot.id, ...orderSnapshot.data() });
        } else {
          console.log('No such order!');
        }
      } catch (error) {
        console.error("Error fetching order detail: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  const renderItem = ({ item }) => (
    <Text style={styles.itemText}>
      - {item.plantName} (x{item.amount}) - ${(item.price * item.amount).toFixed(2)}
    </Text>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Order <Text style={styles.highlight}>Details</Text></Text>
      {order && (
        <View>
          <Text style={styles.orderId}>Order ID: {order.id}</Text>
          <Text style={styles.totalPrice}>Total Price: ${order.totalPrice.toFixed(2)}</Text>
          <Text style={styles.createdAt}>Order Date: {new Date(order.createdAt).toLocaleString()}</Text>
          <Text style={styles.itemsHeading}>Items:</Text>
          <FlatList
            data={order.items}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 10,
  },
  highlight: {
    color: '#4CAF50',
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
    marginBottom: 5,
  },
});