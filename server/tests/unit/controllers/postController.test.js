const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require('../../../src/controllers/postController');
const Post = require('../../../src/models/Post');
const { validateRequiredFields } = require('../../../src/utils/validation');

jest.mock('../../../src/models/Post');
jest.mock('../../../src/utils/validation');
jest.mock('../../../src/middleware/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Post Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {},
      params: {},
      body: {},
      userId: '507f1f77bcf86cd799439011',
      user: { role: 'user' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('getPosts', () => {
    it('should return posts with pagination', async () => {
      const mockPosts = [
        { _id: '1', title: 'Post 1', content: 'Content 1' },
        { _id: '2', title: 'Post 2', content: 'Content 2' },
      ];

      Post.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockPosts),
      });
      Post.countDocuments.mockResolvedValue(2);

      req.query = { page: '1', limit: '10' };

      await getPosts(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        posts: mockPosts,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          pages: 1,
        },
      });
    });
  });

  describe('getPostById', () => {
    it('should return a post by ID', async () => {
      const mockPost = {
        _id: '1',
        title: 'Test Post',
        content: 'Test Content',
        views: 0,
        save: jest.fn().mockResolvedValue(),
      };

      Post.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockPost),
      });

      req.params.id = '1';

      await getPostById(req, res, next);

      expect(res.json).toHaveBeenCalledWith(mockPost);
      expect(mockPost.views).toBe(1);
    });

    it('should return 404 if post not found', async () => {
      Post.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      req.params.id = 'nonexistent';

      await getPostById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Post not found',
      });
    });
  });

  describe('createPost', () => {
    it('should create a new post', async () => {
      const mockPost = {
        _id: '1',
        title: 'New Post',
        content: 'New Content',
        author: req.userId,
      };

      validateRequiredFields.mockReturnValue({ isValid: true });
      Post.create.mockResolvedValue(mockPost);

      req.body = {
        title: 'New Post',
        content: 'New Content',
      };

      await createPost(req, res, next);

      expect(Post.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    it('should return 400 if validation fails', async () => {
      validateRequiredFields.mockReturnValue({
        isValid: false,
        message: 'Missing required fields',
      });

      req.body = {
        content: 'Missing title',
      };

      await createPost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required fields',
      });
    });
  });

  describe('updatePost', () => {
    it('should update a post', async () => {
      const mockPost = {
        _id: '1',
        title: 'Old Title',
        content: 'Old Content',
        author: req.userId,
        save: jest.fn().mockResolvedValue(),
      };

      Post.findById.mockResolvedValue(mockPost);

      req.params.id = '1';
      req.body = {
        title: 'Updated Title',
      };

      await updatePost(req, res, next);

      expect(mockPost.title).toBe('Updated Title');
      expect(mockPost.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    it('should return 403 if user is not the author', async () => {
      const mockPost = {
        _id: '1',
        author: 'different-user-id',
      };

      Post.findById.mockResolvedValue(mockPost);

      req.params.id = '1';
      req.body = { title: 'Updated Title' };

      await updatePost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'You can only update your own posts',
      });
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      const mockPost = {
        _id: '1',
        author: req.userId,
      };

      Post.findById.mockResolvedValue(mockPost);
      Post.findByIdAndDelete.mockResolvedValue(mockPost);

      req.params.id = '1';

      await deletePost(req, res, next);

      expect(Post.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith({
        message: 'Post deleted successfully',
      });
    });
  });
});

