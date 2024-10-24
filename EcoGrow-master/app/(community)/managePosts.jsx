import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../Config/firebaseConfig';
import { useRouter } from 'expo-router';

export default function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      const postsRef = collection(db, 'posts');
      const postsSnapshot = await getDocs(postsRef);
      const userPosts = postsSnapshot.docs
        .filter(doc => doc.data().userId === auth.currentUser.uid) // Filter posts by current user
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(userPosts);
    };

    fetchPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      setPosts(posts.filter(post => post.id !== postId));
      Alert.alert('Success', 'Post deleted successfully!');
    } catch (error) {
      console.error("Error deleting post:", error);
      Alert.alert('Error', 'Could not delete post. Please try again.');
    }
  };

  const handleUpdatePost = (post) => {
    if (post) {
      // Navigate to the update screen, passing the post ID and other details
      router.push({
        pathname: `${post.id}`,
        params: { id: post.id, title: post.title, description: post.description }
      });
    } else {
      console.warn('Post is undefined, not navigating.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Posts</Text>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.postItem}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postDescription}>{item.description}</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity onPress={() => handleUpdatePost(item)} style={styles.button}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeletePost(item.id)} style={styles.buttondelete}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    paddingTop: 60,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4CAF50',
    fontFamily: 'Roboto-bold'
  },
  postItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postDescription: {
    fontSize: 14,
    color: '#555',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  buttondelete: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontStyle: 'bold',
  },
});
