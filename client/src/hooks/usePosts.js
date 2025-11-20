import { useState, useCallback } from 'react';
import { fetchPosts as fetchPostsAPI } from '../utils/api';

/**
 * Custom hook for managing posts
 */
export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchPostsAPI(page, limit);
      setPosts(data.posts || data);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch posts';
      setError(errorMessage);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { posts, loading, error, fetchPosts };
};

