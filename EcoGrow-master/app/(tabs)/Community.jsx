import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { collection, getDocs, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../Config/firebaseConfig';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Import icons for likes

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLikes, setUserLikes] = useState(new Set()); // Track liked posts for the current user
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = () => {
      const postsRef = collection(db, 'posts');
      // Listen for real-time updates
      const unsubscribe = onSnapshot(postsRef, (snapshot) => {
        const userPosts = snapshot.docs
          .filter(doc => doc.data().userId === auth.currentUser.uid) // Filter posts by current user
          .map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(userPosts);
        setLoading(false);
      });

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    if (userLikes.has(postId)) return; // Prevent multiple likes from the same user

    const postRef = doc(db, 'posts', postId);
    
    try {
      const post = posts.find(post => post.id === postId);
      await updateDoc(postRef, {
        likes: post.likes + 1, // Increment like count
      });

      setUserLikes((prev) => new Set(prev).add(postId)); // Add postId to liked set

      // Update the local state without refetching
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
      );
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

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

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Posts</Text>

      {posts.length === 0 ? (
        <Text style={styles.noPostsText}>No posts available.</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.postsList}
        />
      )}

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => router.push('/addPost')} style={styles.button}>
          <Text style={styles.buttonText}>Add Post</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/managePosts')} style={styles.button}>
          <Text style={styles.buttonText}>Manage Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/allPosts')} style={styles.button}>
          <Text style={styles.buttonText}>View All Posts</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 20,
    color: '#3D8C40',
    marginTop: 20,
    marginLeft: 10,
    fontFamily : 'roboto-bold',
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
    width: '100%', // Adjust width as necessary
    height: 200, // Adjust height as necessary
    borderRadius: 10,
    marginBottom: 10, // Spacing between image and text
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postDescription: {
    fontSize: 14,
    color: '#555',
  },
  noPostsText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 18,
  },
  postsList: {
    paddingBottom: 30,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
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
