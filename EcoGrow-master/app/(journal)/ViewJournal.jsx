import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig'; 
import { useRouter } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons'; 

export default function ViewJournal() {
  const [journals, setJournals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJournals, setFilteredJournals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'journals'), (querySnapshot) => {
      const journalsList = [];
      querySnapshot.forEach((doc) => {
        journalsList.push({ id: doc.id, ...doc.data() });
      });
      setJournals(journalsList);
      setFilteredJournals(journalsList);
    }, (error) => {
      console.error("Error fetching journals: ", error);
    });

    return () => unsubscribe();
  }, []);

  // Filter journals by search query and category
  useEffect(() => {
    const results = journals.filter(journal => {
      const matchesSearch = journal.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || journal.category?.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
    setFilteredJournals(results);
  }, [searchQuery, journals, selectedCategory]);

  // Navigate to journal detail screen
  const handleJournalPress = (journal) => {
    router.push({
      pathname: 'JournalDetail',
      params: { journalId: journal.id }, // Pass journal ID as a parameter
    });
  };

  const renderJournal = ({ item }) => (
    <TouchableOpacity style={styles.journalCard} onPress={() => handleJournalPress(item)}>
      {item.imageUrl ? (
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.journalImage} 
          onError={(e) => console.log("Image loading error:", e.nativeEvent.error)}
        />
      ) : (
        <View style={[styles.journalImage, styles.placeholderImage]}>
          <Text>No Image</Text>
        </View>
      )}
      <View style={styles.journalInfo}>
        <Text style={styles.journalTitle}>{item.title}</Text>
        <Text style={styles.journalDescription}>{item.description}</Text>
        <Text style={styles.journalDate}>{item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'No date'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Journals</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          placeholder="Search for a journal"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.filterTabs}>
        {['All', 'Fruits', 'Vegetables', 'Flowers'].map(category => (
          <TouchableOpacity 
            key={category}
            style={[styles.filterTab, selectedCategory === category && styles.activeTab]} 
            onPress={() => setSelectedCategory(category)}>
            <Text style={[styles.filterTabText, selectedCategory === category && styles.activeTabText]}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredJournals}
        renderItem={renderJournal}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.journalList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
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
  journalList: {
    paddingBottom: 20,
  },
  journalCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
  },
  journalImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  journalInfo: {
    flex: 1,
  },
  journalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  journalDescription: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  journalDate: {
    fontSize: 14,
    color: 'gray',
  },
});
