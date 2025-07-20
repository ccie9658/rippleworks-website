// API configuration and helper functions
const API_BASE_URL = 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Generic API request function
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || 'An error occurred',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error', 0, null);
  }
}

// Blog API functions
export const blogApi = {
  // Get all published blog posts
  getAllPosts: () => apiRequest('/blog'),
  
  // Get single blog post by slug
  getPost: (slug) => apiRequest(`/blog/${slug}`),
  
  // Admin functions
  admin: {
    // Get all posts (including drafts)
    getAllPosts: () => apiRequest('/admin/blog'),
    
    // Create new post
    createPost: (postData) => apiRequest('/admin/blog', {
      method: 'POST',
      body: JSON.stringify(postData),
    }),
    
    // Update post
    updatePost: (id, postData) => apiRequest(`/admin/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    }),
    
    // Delete post
    deletePost: (id) => apiRequest(`/admin/blog/${id}`, {
      method: 'DELETE',
    }),
  },
};

// Case Study API functions
export const caseStudyApi = {
  // Get all case studies
  getAll: (featured = null) => {
    const query = featured !== null ? `?featured=${featured}` : '';
    return apiRequest(`/case-studies${query}`);
  },
  
  // Get single case study by slug
  getBySlug: (slug) => apiRequest(`/case-studies/${slug}`),
  
  // Admin functions
  admin: {
    // Get all case studies
    getAll: () => apiRequest('/admin/case-studies'),
    
    // Create new case study
    create: (caseStudyData) => apiRequest('/admin/case-studies', {
      method: 'POST',
      body: JSON.stringify(caseStudyData),
    }),
    
    // Update case study
    update: (id, caseStudyData) => apiRequest(`/admin/case-studies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(caseStudyData),
    }),
    
    // Delete case study
    delete: (id) => apiRequest(`/admin/case-studies/${id}`, {
      method: 'DELETE',
    }),
  },
};

export { ApiError };