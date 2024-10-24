import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const API_KEY = 'sk-iKO0670979c1c965e7214';

const PlantDetail = () => {
  const { id } = useLocalSearchParams(); 
  const [plantDetails, setPlantDetails] = useState(null);

  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        const response = await fetch(`https://perenual.com/api/species/details/${id}?key=${API_KEY}`);
        const data = await response.json();
        setPlantDetails(data); // Adjusted to use data.data based on the expected structure
      } catch (error) {
        console.error('Error fetching plant details:', error);
      }
    };
    fetchPlantDetails();
  }, [id]);

  if (!plantDetails) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.commonName}>{plantDetails.common_name}</Text>
      <Text style={styles.scientificName}>Scientific Name: {plantDetails.scientific_name.join(', ')}</Text>
      <Text style={styles.cycle}>Cycle: {plantDetails.cycle}</Text>
      <Text style={styles.watering}>Watering: {plantDetails.watering}</Text>
      <Image source={{ uri: plantDetails.default_image?.regular_url }} style={styles.image} />
      <Text style={styles.description}> {plantDetails.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop:60,
    backgroundColor: 'white', // Light grey background for contrast
    
  },
  commonName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2B7A0D', // Dark green color for common name
    marginBottom: 10,
  },
  scientificName: {
    fontSize: 16,
    color: '#555', // Dark grey for scientific name
    marginBottom: 8,
  },
  cycle: {
    fontSize: 16,
    color: '#3B9B4C', // Green for cycle
    marginBottom: 8,
  },
  watering: {
    fontSize: 16,
    color: '#FF9A00', // Orange for watering
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 250, // Increased height for better visibility
    borderRadius: 10,
    marginVertical: 10,
    borderColor: '#E3E3E3', // Light border color
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  description: {
    fontSize: 16,
    color: '#333', // Slightly darker text for description
    marginTop: 10,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#4A4A4A',
    marginTop: 20,
  },
});

export default PlantDetail;
