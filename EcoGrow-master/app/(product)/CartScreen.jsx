import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateItemAmount } from '../../redux/store'; // Adjust the path accordingly
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig'; // Import Firestore database
import { useRouter } from 'expo-router'; // Import the router

export default function CartScreen() {
  const dispatch = useDispatch();
  const router = useRouter(); // Get router object
  const cartItems = useSelector((state) => state.cart);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateAmount = (id, amount) => {
    if (amount < 1) {
      handleRemove(id); // Remove item if amount goes below 1
    } else {
      dispatch(updateItemAmount(id, amount));
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.amount, 0);
  };

  const handlePayNow = async () => {
    const totalPrice = calculateTotal();
    const orderDetails = {
      items: cartItems,
      totalPrice,
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, 'orders'), orderDetails);
      
      router.push('ShippingDetails'); // Navigate to the MyOrders screen
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.leftContainer}>
        <Text style={styles.plantName}>{item.plantName}</Text>
        <Text style={styles.category}>Category: {item.category}</Text>
        <View style={styles.amountContainer}>
          <TouchableOpacity 
            style={styles.amountButton} 
            onPress={() => handleUpdateAmount(item.id, item.amount - 1)}>
            <Text style={styles.amountButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.amountText}>{item.amount}</Text>
          <TouchableOpacity 
            style={styles.amountButton} 
            onPress={() => handleUpdateAmount(item.id, item.amount + 1)}>
            <Text style={styles.amountButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.rightContainer}>
        <Text style={styles.price}>${(item.price * item.amount).toFixed(2)}</Text>
        <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(item.id)}>
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>My <Text style={styles.highlight}>Cart</Text></Text>

      {/* FlatList for displaying cart items */}
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cartList}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={ // Footer will be included in the FlatList
          <View style={styles.footer}>
            <Text style={styles.totalPriceText}>Total Price: ${calculateTotal().toFixed(2)}</Text>
            <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 10,
  },
  highlight: {
    color: '#4CAF50',
  },
  cartList: {
    flexGrow: 1, // Ensure list takes up available space
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 100, // Set a fixed height for each item
  },
  leftContainer: {
    flex: 1,
  },
  plantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  category: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  amountButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  amountText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#ff6666',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#ddd',
    marginTop: 15,
  },
  totalPriceText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  payButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
