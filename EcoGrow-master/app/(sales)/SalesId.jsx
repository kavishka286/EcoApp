import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const InventoryScreen = () => {
  const router = useRouter();
  const [totalSales, setTotalSales] = useState(0); // State to store total sales
  const [categorySales, setCategorySales] = useState({ fruit: 0, vegetable: 0, flower: 0 });

  // Initialize Firestore
  const db = getFirestore();

  // Function to fetch total sales from Firestore and calculate category-specific sales
  const fetchTotalSales = async () => {
    const orderDetailsCollection = collection(db, 'orders'); // Adjusted the collection name to 'orders'
    const orderDetailsSnapshot = await getDocs(orderDetailsCollection); // Fetch documents
    let total = 0;
    let categoryTotals = { fruit: 0, vegetable: 0, flower: 0 };

    // Iterate over documents to sum totalPrice field
    orderDetailsSnapshot.forEach(doc => {
      const data = doc.data();
      
      // Check if items exist in the document
      if (data && data.items) {
        data.items.forEach(item => {
          const totalPrice = Number(item.price) * Number(item.amount); // Calculate total for the item
          if (!isNaN(totalPrice)) {
            total += totalPrice; // Add totalPrice to total sales

            // Add totalPrice to the respective category
            const category = item.category.toLowerCase();
            if (category in categoryTotals) {
              categoryTotals[category] += totalPrice;
            }
          }
        });
      }
    });

    setTotalSales(total); // Update total sales state
    setCategorySales(categoryTotals); // Update category-specific sales
  };
  
  useEffect(() => {
    fetchTotalSales(); // Fetch total sales when component mounts
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Sales Analytics</Text>

      {/* Total Sales */}
      <View style={styles.salesContainer}>
        <Text style={styles.totalSalesText}>
          Total Sales: Rs {totalSales.toLocaleString()} {/* Format number with commas */}
        </Text>
      </View>

      {/* Category Sales */}
      <View style={styles.salesContainer}>
        <Text style={styles.categorySalesText}>
          Fruits Sales: Rs {categorySales.fruit.toLocaleString()}
        </Text>
        <Text style={styles.categorySalesText}>
          Vegetables Sales: Rs {categorySales.vegetable.toLocaleString()}
        </Text>
        <Text style={styles.categorySalesText}>
          Flowers Sales: Rs {categorySales.flower.toLocaleString()}
        </Text>
      </View>

      {/* Navigation Buttons */}
      <TouchableOpacity
        style={[styles.navButton, styles.Button1]}
        onPress={() => router.push(`/salescategory/${salescategoryid}`)} // Adjusted for correct string interpolation
      >
        <Text style={styles.navButtonText}>Sales by Category</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navButton, styles.Button2]}
        onPress={() => router.push(`/salesoverview/${salesoverviewid}`)} // Adjusted for correct string interpolation
      >
        <Text style={styles.navButtonText}>Monthly Overview</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 24,
  },
  salesContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  totalSalesText: {
    fontWeight: 'bold',
    fontSize: 26,
    textAlign: 'center',
    color: '#333',
  },
  categorySalesText: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    color: '#666',
    marginVertical: 5,
  },
  navButton: {
    backgroundColor: '#51CD56',
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  navButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  Button1: {
    marginTop: 10,
  },
  Button2: {
    marginTop: 10,
  },
});

export default InventoryScreen;
