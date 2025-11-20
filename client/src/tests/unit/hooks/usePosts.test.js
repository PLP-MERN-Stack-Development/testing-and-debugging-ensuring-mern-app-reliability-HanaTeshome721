import { renderHook, act } from '@testing-library/react';
import { usePosts } from '../../../hooks/usePosts';
import { fetchPosts as fetchPostsAPI } from '../../../utils/api';

jest.mock('../../../utils/api');

describe('usePosts Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePosts());

    expect(result.current.posts).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should fetch posts successfully', async () => {
    const mockPosts = [
      { _id: '1', title: 'Post 1', content: 'Content 1' },
      { _id: '2', title: 'Post 2', content: 'Content 2' },
    ];

    fetchPostsAPI.mockResolvedValue({ posts: mockPosts });

    const { result } = renderHook(() => usePosts());

    await act(async () => {
      await result.current.fetchPosts(1, 10);
    });

    expect(result.current.posts).toEqual(mockPosts);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle fetch error', async () => {
    const mockError = {
      response: {
        data: { error: 'Failed to fetch posts' },
      },
    };

    fetchPostsAPI.mockRejectedValue(mockError);

    const { result } = renderHook(() => usePosts());

    await act(async () => {
      await result.current.fetchPosts(1, 10);
    });

    expect(result.current.posts).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch posts');
    expect(result.current.loading).toBe(false);
  });

  it('should set loading to true during fetch', async () => {
    fetchPostsAPI.mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => usePosts());

    act(() => {
      result.current.fetchPosts(1, 10);
    });

    expect(result.current.loading).toBe(true);
  });
});

