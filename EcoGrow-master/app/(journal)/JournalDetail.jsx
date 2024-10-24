import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; 
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig';

export default function JournalDetail() {
  const router = useRouter();
  const { journalId } = useLocalSearchParams(); // Get journal ID from params
  const [journalData, setJournalData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for fetching data

  useEffect(() => {
    const fetchJournalData = async () => {
      try {
        const docRef = doc(db, 'journals', journalId); // Reference to the specific journal
        const docSnap = await getDoc(docRef); // Get the document

        if (docSnap.exists()) {
          setJournalData(docSnap.data()); // Set the journal data
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching journal data: ', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchJournalData();
  }, [journalId]);

  const handleGoBack = () => {
    router.back(); // Navigate back to the previous screen
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loadingIndicator} />; // Show loading indicator
  }

  if (!journalData) {
    return <Text>No journal data found.</Text>; // Handle case with no data
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.previewTitle}>{journalData.title}</Text>
      <Text style={styles.previewDate}>
        {new Date(journalData.createdAt.toDate()).toLocaleDateString()} {/* Format createdAt date */}
      </Text>

      {journalData.imageUrl && ( // Show image if exists
        <Image source={{ uri: journalData.imageUrl }} style={styles.previewImage} />
      )}

      <Text style={styles.journalContent}>{journalData.description}</Text>

      <Text style={styles.careRoutine}>
        <Text style={{ fontWeight: 'bold' }}>Important Things: </Text>
        {journalData.importantThings || 'No important things listed.'}
      </Text>

      <Text style={styles.categoryText}>
        Category: {journalData.category || 'No category specified.'}
      </Text>

      <View style={styles.buttons}>
        <TouchableOpacity onPress={handleGoBack} style={styles.goBackButton}>
          <Text style={styles.goBackButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F8F0',
    paddingTop: 60,
  },
  previewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Roboto-Bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  previewDate: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
    textAlign: 'center',
    marginTop: 10
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'cover',
    marginTop: 20
  },
  journalContent: {
    fontSize: 20,
    marginBottom: 20,
    marginTop: 20
  },
  careRoutine: {
    marginTop: 5,
    fontStyle: 'italic',
    fontSize: 16,
    marginTop: 20
  },
  categoryText: {
    marginTop: 10,
    color: '#449E48',
    fontWeight: 'bold',
    marginTop: 20
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginTop: 20
  },
  loadingIndicator: {
    marginTop: 20,
  },
  goBackButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20
  },
  goBackButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});
