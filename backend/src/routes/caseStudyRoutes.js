const express = require('express');
const prisma = require('../utils/database');
const router = express.Router();

// GET /api/case-studies - Get all case studies
router.get('/', async (req, res) => {
  try {
    const { featured } = req.query;
    
    const whereClause = {};
    if (featured === 'true') {
      whereClause.featured = true;
    }

    const caseStudies = await prisma.caseStudy.findMany({
      where: whereClause,
      orderBy: [
        { featured: 'desc' }, // Featured first
        { createdAt: 'desc' }  // Then by newest
      ]
    });

    res.json({
      success: true,
      data: caseStudies,
      count: caseStudies.length
    });
  } catch (error) {
    console.error('Error fetching case studies:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch case studies'
    });
  }
});

// GET /api/case-studies/:slug - Get single case study by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const caseStudy = await prisma.caseStudy.findUnique({
      where: { slug }
    });

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        error: 'Case study not found'
      });
    }

    res.json({
      success: true,
      data: caseStudy
    });
  } catch (error) {
    console.error('Error fetching case study:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch case study'
    });
  }
});

module.exports = router;