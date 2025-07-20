const express = require('express');
const prisma = require('../utils/database');
const router = express.Router();

// Note: In a real application, these routes would be protected by authentication middleware
// For now, we'll implement basic CRUD operations without auth

// GET /api/admin/blog - Get all blog posts (including drafts)
router.get('/blog', async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: posts,
      count: posts.length
    });
  } catch (error) {
    console.error('Error fetching admin blog posts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch blog posts'
    });
  }
});

// POST /api/admin/blog - Create new blog post
router.post('/blog', async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      status = 'DRAFT',
      featured = false,
      metaTitle,
      metaDescription,
      tags = []
    } = req.body;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // For now, we'll use the first admin user as the author
    const adminUser = await prisma.user.findFirst({
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      },
      where: {
        userRoles: {
          some: {
            role: {
              name: 'admin'
            }
          }
        }
      }
    });

    if (!adminUser) {
      return res.status(400).json({
        success: false,
        error: 'No admin user found'
      });
    }

    const publishedAt = status === 'PUBLISHED' ? new Date() : null;

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        status,
        featured,
        metaTitle,
        metaDescription,
        publishedAt,
        authorId: adminUser.id
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    
    // Handle unique constraint violation (duplicate slug)
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: 'A blog post with this title already exists. Please choose a different title.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create blog post'
    });
  }
});

// PUT /api/admin/blog/:id - Update blog post
router.put('/blog/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      excerpt,
      status,
      featured,
      metaTitle,
      metaDescription
    } = req.body;

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    // Generate new slug if title changed
    let slug = existingPost.slug;
    if (title && title !== existingPost.title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // Set publishedAt if changing to published
    let publishedAt = existingPost.publishedAt;
    if (status === 'PUBLISHED' && existingPost.status !== 'PUBLISHED') {
      publishedAt = new Date();
    } else if (status !== 'PUBLISHED') {
      publishedAt = null;
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        status,
        featured,
        metaTitle,
        metaDescription,
        publishedAt
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    
    // Handle unique constraint violation (duplicate slug)
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: 'A blog post with this title already exists. Please choose a different title.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update blog post'
    });
  }
});

// DELETE /api/admin/blog/:id - Delete blog post
router.delete('/blog/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    await prisma.blogPost.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete blog post'
    });
  }
});

module.exports = router;