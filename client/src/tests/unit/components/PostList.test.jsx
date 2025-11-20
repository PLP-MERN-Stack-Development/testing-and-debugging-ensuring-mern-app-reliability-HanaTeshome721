import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostList from '../../../components/PostList';
import { usePosts } from '../../../hooks/usePosts';

jest.mock('../../../hooks/usePosts');

describe('PostList Component', () => {
  const mockFetchPosts = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    usePosts.mockReturnValue({
      posts: [],
      loading: true,
      error: null,
      fetchPosts: mockFetchPosts,
    });

    render(<PostList />);
    expect(screen.getByText(/loading posts/i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    usePosts.mockReturnValue({
      posts: [],
      loading: false,
      error: 'Failed to fetch posts',
      fetchPosts: mockFetchPosts,
    });

    render(<PostList />);
    expect(screen.getByText(/error: failed to fetch posts/i)).toBeInTheDocument();
  });

  it('renders posts list', () => {
    const mockPosts = [
      {
        _id: '1',
        title: 'Test Post 1',
        content: 'Content 1',
        author: { username: 'user1' },
      },
      {
        _id: '2',
        title: 'Test Post 2',
        content: 'Content 2',
        author: { username: 'user2' },
      },
    ];

    usePosts.mockReturnValue({
      posts: mockPosts,
      loading: false,
      error: null,
      fetchPosts: mockFetchPosts,
    });

    render(<PostList />);

    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText(/by user1/i)).toBeInTheDocument();
  });

  it('renders empty state when no posts', () => {
    usePosts.mockReturnValue({
      posts: [],
      loading: false,
      error: null,
      fetchPosts: mockFetchPosts,
    });

    render(<PostList />);
    expect(screen.getByText(/no posts found/i)).toBeInTheDocument();
  });
});

