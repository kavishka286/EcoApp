import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { db } from '../../Config/firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const ManageJournal = () => {
  const [journals, setJournals] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchJournals = async () => {
      const journalSnapshot = await getDocs(collection(db, 'journals'));
      setJournals(journalSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchJournals();
  }, []);

  const handleUpdatePress = (journal) => {
    router.push({
      pathname: 'UpdateJournal', // Exact pathname for the update screen
      params: { journalId: journal.id }, // Using journal.id as the parameter
    });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'journals', id));
    setJournals(journals.filter((journal) => journal.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Journals</Text>
      <FlatList
        data={journals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.journalInfo}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
              ) : (
                <View style={styles.placeholderImage} />
              )}
              <Text style={styles.title}>{item.title}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => handleUpdatePress(item)} // Call the handleUpdatePress function
                style={[styles.button, styles.updateButton]}
              >
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={[styles.button, styles.deleteButton]}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#4CAF50',
    marginLeft: 15,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  journalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#ddd',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default ManageJournal;
