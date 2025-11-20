import React, { useEffect, useState } from 'react';
import { usePosts } from '../hooks/usePosts';
import './PostList.css';

const PostList = () => {
  const { posts, loading, error, fetchPosts } = usePosts();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="post-list">
      <h2>Posts</h2>
      
      {posts.length === 0 ? (
        <p>No posts found</p>
      ) : (
        <>
          <ul className="posts">
            {posts.map((post) => (
              <li key={post._id} className="post-item">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <small>By {post.author?.username || 'Unknown'}</small>
              </li>
            ))}
          </ul>
          
          <div className="pagination">
            <button 
              onClick={() => setPage(page - 1)} 
              disabled={page === 1}
            >
              Previous
            </button>
            <span>Page {page}</span>
            <button onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PostList;

