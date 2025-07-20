import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogApi, caseStudyApi } from '../../utils/api';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBlogPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalCaseStudies: 0,
    featuredCaseStudies: 0,
    loading: true,
    error: null
  });

  const [recentContent, setRecentContent] = useState({
    recentPosts: [],
    recentCaseStudies: [],
    loading: true
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load stats
      const [blogResponse, caseStudyResponse] = await Promise.all([
        blogApi.admin.getAllPosts(),
        caseStudyApi.admin.getAll()
      ]);

      const blogPosts = blogResponse.data;
      const caseStudies = caseStudyResponse.data;

      setStats({
        totalBlogPosts: blogPosts.length,
        publishedPosts: blogPosts.filter(post => post.status === 'PUBLISHED').length,
        draftPosts: blogPosts.filter(post => post.status === 'DRAFT').length,
        totalCaseStudies: caseStudies.length,
        featuredCaseStudies: caseStudies.filter(cs => cs.featured).length,
        loading: false,
        error: null
      });

      // Get recent content (last 5 items)
      setRecentContent({
        recentPosts: blogPosts.slice(0, 5),
        recentCaseStudies: caseStudies.slice(0, 5),
        loading: false
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
      setRecentContent(prev => ({
        ...prev,
        loading: false
      }));
    }
  };

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">
          <strong>Error loading dashboard:</strong> {stats.error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your RippleWorks content and website.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Blog Posts</p>
              <p className="text-3xl font-bold text-primary">{stats.totalBlogPosts}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex space-x-4 text-sm">
            <span className="text-green-600">{stats.publishedPosts} published</span>
            <span className="text-yellow-600">{stats.draftPosts} drafts</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Case Studies</p>
              <p className="text-3xl font-bold text-primary">{stats.totalCaseStudies}</p>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-blue-600">{stats.featuredCaseStudies} featured</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Quick Actions</p>
              <div className="mt-3 space-y-2">
                <Link to="/admin/blog" className="block text-sm text-primary hover:text-primary/80">
                  Create New Post →
                </Link>
                <Link to="/admin/case-studies" className="block text-sm text-primary hover:text-primary/80">
                  Add Case Study →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Site Links</p>
              <div className="mt-3 space-y-2">
                <Link to="/" className="block text-sm text-gray-700 hover:text-primary">
                  View Homepage →
                </Link>
                <a href="http://localhost:3001/health" target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-700 hover:text-primary">
                  API Health →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Blog Posts */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Blog Posts</h3>
              <Link to="/admin/blog" className="text-sm text-primary hover:text-primary/80">
                View All →
              </Link>
            </div>
          </div>
          <div className="px-6 py-4">
            {recentContent.recentPosts.length > 0 ? (
              <div className="space-y-4">
                {recentContent.recentPosts.map((post) => (
                  <div key={post.id} className="flex items-start space-x-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          post.status === 'PUBLISHED' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(post.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No blog posts yet.</p>
            )}
          </div>
        </div>

        {/* Recent Case Studies */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Case Studies</h3>
              <Link to="/admin/case-studies" className="text-sm text-primary hover:text-primary/80">
                View All →
              </Link>
            </div>
          </div>
          <div className="px-6 py-4">
            {recentContent.recentCaseStudies.length > 0 ? (
              <div className="space-y-4">
                {recentContent.recentCaseStudies.map((caseStudy) => (
                  <div key={caseStudy.id} className="flex items-start space-x-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                        {caseStudy.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-600">{caseStudy.client}</span>
                        {caseStudy.featured && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Featured
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(caseStudy.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No case studies yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;