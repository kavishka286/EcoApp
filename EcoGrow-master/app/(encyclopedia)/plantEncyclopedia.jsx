// plantEncyclopedia.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter from expo-router

const API_KEY = 'sk-iKO0670979c1c965e7214'; // Replace with your actual API key
const API_URL = (page) => `https://perenual.com/api/species-list?key=${API_KEY}&page=${page}`;

const PlantEncyclopedia = () => {
  const router = useRouter(); // Initialize the router
  const [plants, setPlants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      if (!hasMore) return; // Exit if there's no more data to fetch

      setLoading(true);
      try {
        const response = await fetch(API_URL(currentPage));
        const data = await response.json();
        if (data.data.length === 0) {
          setHasMore(false); // No more data available
        } else {
          setPlants((prevPlants) => [...prevPlants, ...data.data]); // Append new plants
          setFilteredPlants((prevPlants) => [...prevPlants, ...data.data]); // Update filtered plants
        }
      } catch (error) {
        console.error('Error fetching plant data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, [currentPage]);

  useEffect(() => {
    // Filter plants based on the search query
    const results = plants.filter(plant =>
      plant.common_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPlants(results);
  }, [searchQuery, plants]);

  const loadMorePlants = () => {
    if (hasMore && !loading) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const renderPlantCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`${item.id}`)}>
      <Image source={{ uri: item.default_image?.thumbnail }} style={styles.image} />
      <Text style={styles.commonName}>{item.common_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Encyclopedia</Text>
      
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by common name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredPlants}
        keyExtractor={(item, index) => `${item.id}-${index}`} // Use a unique key
        renderItem={renderPlantCard}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />

      {/* Load More Button */}
      {hasMore && (
        <TouchableOpacity style={styles.loadMoreButton} onPress={loadMorePlants}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loadMoreText}>Load More</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4CAF50',
  },
  searchInput: {
    height: 40,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  grid: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    elevation: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 10
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  commonName: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  loadMoreButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  loadMoreText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PlantEncyclopedia;
