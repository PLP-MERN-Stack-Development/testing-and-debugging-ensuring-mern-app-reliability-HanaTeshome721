const Post = require('../models/Post');
const { validateRequiredFields, sanitizeInput } = require('../utils/validation');
const { logger } = require('../middleware/logger');

/**
 * Get all posts with optional filtering and pagination
 */
const getPosts = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 10, published } = req.query;
    
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (published !== undefined) {
      query.published = published === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const posts = await Post.find(query)
      .populate('author', 'username email')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    logger.error('Error fetching posts', error);
    next(error);
  }
};

/**
 * Get a single post by ID
 */
const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findById(id)
      .populate('author', 'username email')
      .populate('category', 'name');

    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
      });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    logger.error('Error fetching post', error);
    next(error);
  }
};

/**
 * Create a new post
 */
const createPost = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;

    // Validate required fields
    const validation = validateRequiredFields(req.body, ['title', 'content']);
    if (!validation.isValid) {
      return res.status(400).json({
        error: validation.message,
      });
    }

    // Sanitize inputs
    const sanitizedTitle = sanitizeInput(title);
    const sanitizedContent = sanitizeInput(content);

    const post = await Post.create({
      title: sanitizedTitle,
      content: sanitizedContent,
      author: req.userId,
      category: category || null,
    });

    logger.info('Post created', { postId: post._id, author: req.userId });

    res.status(201).json(post);
  } catch (error) {
    logger.error('Error creating post', error);
    next(error);
  }
};

/**
 * Update a post
 */
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, category, published } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({
        error: 'You can only update your own posts',
      });
    }

    // Update fields
    if (title) post.title = sanitizeInput(title);
    if (content) post.content = sanitizeInput(content);
    if (category !== undefined) post.category = category;
    if (published !== undefined) post.published = published;

    await post.save();

    logger.info('Post updated', { postId: post._id });

    res.json(post);
  } catch (error) {
    logger.error('Error updating post', error);
    next(error);
  }
};

/**
 * Delete a post
 */
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
      });
    }

    // Check if user is the author or admin
    if (post.author.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'You can only delete your own posts',
      });
    }

    await Post.findByIdAndDelete(id);

    logger.info('Post deleted', { postId: id });

    res.json({
      message: 'Post deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting post', error);
    next(error);
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};

