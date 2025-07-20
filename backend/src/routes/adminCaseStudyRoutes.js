const express = require('express');
const prisma = require('../utils/database');
const router = express.Router();

// GET /api/admin/case-studies - Get all case studies for admin
router.get('/', async (req, res) => {
  try {
    const caseStudies = await prisma.caseStudy.findMany({
      orderBy: {
        updatedAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: caseStudies,
      count: caseStudies.length
    });
  } catch (error) {
    console.error('Error fetching admin case studies:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch case studies'
    });
  }
});

// POST /api/admin/case-studies - Create new case study
router.post('/', async (req, res) => {
  try {
    const {
      title,
      client,
      industry,
      challenge,
      solution,
      results,
      technologies = [],
      featured = false,
      metaTitle,
      metaDescription
    } = req.body;

    // Validate required fields
    if (!title || !client || !challenge || !solution || !results) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, client, challenge, solution, results'
      });
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const caseStudy = await prisma.caseStudy.create({
      data: {
        title,
        slug,
        client,
        industry,
        challenge,
        solution,
        results,
        technologies,
        featured,
        metaTitle: metaTitle || title,
        metaDescription
      }
    });

    res.status(201).json({
      success: true,
      data: caseStudy
    });
  } catch (error) {
    console.error('Error creating case study:', error);
    
    // Handle unique constraint violation (duplicate slug)
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: 'A case study with this title already exists. Please choose a different title.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create case study'
    });
  }
});

// PUT /api/admin/case-studies/:id - Update case study
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      client,
      industry,
      challenge,
      solution,
      results,
      technologies,
      featured,
      metaTitle,
      metaDescription
    } = req.body;

    // Check if case study exists
    const existingCaseStudy = await prisma.caseStudy.findUnique({
      where: { id }
    });

    if (!existingCaseStudy) {
      return res.status(404).json({
        success: false,
        error: 'Case study not found'
      });
    }

    // Generate new slug if title changed
    let slug = existingCaseStudy.slug;
    if (title && title !== existingCaseStudy.title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const caseStudy = await prisma.caseStudy.update({
      where: { id },
      data: {
        title,
        slug,
        client,
        industry,
        challenge,
        solution,
        results,
        technologies,
        featured,
        metaTitle,
        metaDescription
      }
    });

    res.json({
      success: true,
      data: caseStudy
    });
  } catch (error) {
    console.error('Error updating case study:', error);
    
    // Handle unique constraint violation (duplicate slug)
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: 'A case study with this title already exists. Please choose a different title.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update case study'
    });
  }
});

// DELETE /api/admin/case-studies/:id - Delete case study
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if case study exists
    const existingCaseStudy = await prisma.caseStudy.findUnique({
      where: { id }
    });

    if (!existingCaseStudy) {
      return res.status(404).json({
        success: false,
        error: 'Case study not found'
      });
    }

    await prisma.caseStudy.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Case study deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting case study:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete case study'
    });
  }
});

module.exports = router;