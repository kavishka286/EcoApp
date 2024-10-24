// allPost.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; // Import icons from Expo
import { auth } from '../../Config/firebaseConfig'; // Make sure to import auth

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [userLikes, setUserLikes] = useState(new Set()); // Track liked posts for current user
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query

  useEffect(() => {
    const q = collection(db, 'posts'); // Fetch all posts

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = async (postId) => {
    if (userLikes.has(postId)) return; // Prevent multiple likes from the same user

    const postRef = doc(db, 'posts', postId);

    try {
      await updateDoc(postRef, {
        likes: posts.find(post => post.id === postId).likes + 1, // Increment like count
      });

      setUserLikes((prev) => new Set(prev).add(postId)); // Add postId to liked set
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <Image source={{ uri: item.imageURL }} style={styles.postImage} />
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postDescription}>{item.description}</Text>
      <View style={styles.likeContainer}>
        <TouchableOpacity 
          onPress={() => handleLike(item.id)} 
          style={[
            styles.heartButton,
            userLikes.has(item.id) && styles.heartButtonLiked // Change style if liked
          ]}
        >
          <Ionicons 
            name={userLikes.has(item.id) ? "heart" : "heart-outline"} 
            size={24} 
            color="#4CAF50" 
          />
        </TouchableOpacity>
        <Text style={styles.likeCount}>{item.likes} likes</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>All Posts</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by title..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {filteredPosts.length === 0 ? (
        <Text style={styles.noPostsText}>No posts available.</Text>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.postsList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3D8C40',
    marginTop: 20,
    marginLeft: 10,
    fontFamily: 'roboto-bold',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  postDescription: {
    fontSize: 16,
    color: '#666',
  },
  noPostsText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 18,
  },
  postsList: {
    paddingBottom: 30,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  heartButton: {
    marginRight: 10,
    padding: 5,
    backgroundColor: 'transparent', // Remove background color
  },
  heartButtonLiked: {
    backgroundColor: '#e1f5e1', // Change background when liked, if you want
  },
  likeCount: {
    fontSize: 16,
    color: '#666',
  },
});
