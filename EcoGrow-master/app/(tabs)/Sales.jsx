import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit'; // Import LineChart from react-native-chart-kit
import { getFirestore, collection, onSnapshot } from 'firebase/firestore'; // Import onSnapshot for real-time updates
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Icon library for the round button

export default function Sales() {
  const router = useRouter();
  const [categorySales, setCategorySales] = useState({ fruit: 0, vegetable: 0, flower: 0 });
  const [loading, setLoading] = useState(true);

  const db = getFirestore();

  // Fetch total sales categorized by 'fruit', 'vegetable', 'flower' from Firestore
  const fetchTotalSales = async () => {
    const orderDetailsCollection = collection(db, 'orders');

    // Set up a real-time listener for changes to the 'orders' collection
    onSnapshot(orderDetailsCollection, (snapshot) => {
      let categoryTotals = { fruit: 0, vegetable: 0, flower: 0 };

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data && data.items) {
          data.items.forEach((item) => {
            const totalPrice = Number(item.price) * Number(item.amount);
            if (!isNaN(totalPrice)) {
              const category = item.category.toLowerCase();
              if (category in categoryTotals) {
                categoryTotals[category] += totalPrice;
              }
            }
          });
        }
      });

      setCategorySales(categoryTotals);
      setLoading(false); // Set loading to false after fetching data
    });
  };

  useEffect(() => {
    fetchTotalSales();
  }, []);

  // Calculate total sales
  const totalSales = categorySales.fruit + categorySales.vegetable + categorySales.flower;

  // Prepare data for the LineChart
  const chartData = {
    labels: ['Fruit', 'Vegetable', 'Flower'],
    datasets: [
      {
        data: [
          categorySales.fruit || 0,
          categorySales.vegetable || 0,
          categorySales.flower || 0,
        ],
        strokeWidth: 2, // Optional: adjust the line width
      },
    ],
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.heading}>Sales Analytics</Text>

      {/* Line Chart */}
      {!loading && (
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 40} // Width of the graph
          height={220}
          chartConfig={{
            backgroundColor: '#4CAF50',
            backgroundGradientFrom: '#4CAF50',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 0, // Show no decimal places
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier // Optional: create a curved line
          style={styles.chart}
        />
      )}

      {/* Total Sales and Category Sales */}
      <View style={styles.salesContainer}>
        <Text style={styles.totalSalesText}>Total Sales: Rs {totalSales.toLocaleString()}</Text>
        <Text style={styles.categorySalesText}>Fruits Sales: Rs {categorySales.fruit.toLocaleString()}</Text>
        <Text style={styles.categorySalesText}>Vegetables Sales: Rs {categorySales.vegetable.toLocaleString()}</Text>
        <Text style={styles.categorySalesText}>Flowers Sales: Rs {categorySales.flower.toLocaleString()}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
      <TouchableOpacity
          style={[styles.navButton, styles.categoryButton]}
          onPress={() => router.push('addProduct')}
        >
          <Text style={styles.navButtonText}>Add Product</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, styles.manageButton]}
          onPress={() => router.push('manageProduct')}
        >
          <Text style={styles.navButtonText}>Manage Products</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.categoryButton]}
          onPress={() => router.push('SaleCategory')}
        >
          <Text style={styles.navButtonText}>Ordered products</Text>
        </TouchableOpacity>
      </View>

     
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 80, // Add padding at the bottom to make space for the button
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: 'center',
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
    elevation: 0,
  },
  totalSalesText: {
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  categorySalesText: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginVertical: 5,
  },
  buttonsContainer: {
    marginTop: 20,
  },
  navButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  manageButton: {
    marginBottom: 15,
  },
  categoryButton: {
    marginBottom: 15,
  },
  navButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 0, // Adjust this value to set how far from the bottom you want the button
    right: 20,
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 1,
  },
});
