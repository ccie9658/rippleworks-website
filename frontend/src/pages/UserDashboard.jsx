import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { blogApi, caseStudyApi } from '../utils/api';
import ProfileEditModal from '../components/user/ProfileEditModal';

function UserDashboard() {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    recentPosts: [],
    featuredCaseStudies: [],
    loading: true,
    error: null
  });
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true }));
      
      // Load recent content for the user to browse
      const [blogResponse, caseStudyResponse] = await Promise.all([
        blogApi.getAllPosts(),
        caseStudyApi.getAll()
      ]);

      setDashboardData({
        recentPosts: blogResponse.data.slice(0, 3),
        featuredCaseStudies: caseStudyResponse.data.filter(cs => cs.featured).slice(0, 2),
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (dashboardData.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-3">
                <img 
                  src="/images/logos/rippleworks_logo_256.png" 
                  alt="RippleWorks Logo" 
                  className="h-8 w-auto"
                />
                <span className="text-xl font-bold text-secondary">RippleWorks</span>
              </Link>
            </div>
            
            <nav className="flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-primary">
                Public Site
              </Link>
              {user?.userRoles?.some(ur => ur.role.name === 'ADMIN' || ur.role.name === 'admin') && (
                <Link to="/admin" className="text-gray-700 hover:text-primary">
                  Admin Panel
                </Link>
              )}
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Welcome, {user?.firstName}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-primary"
                >
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.firstName}!
                </h1>
                <p className="text-gray-600 mt-2">
                  Member since {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setShowProfileEdit(true)}
                className="btn-primary"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Account Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Account Status</p>
                  <p className="text-2xl font-bold text-green-600">Active</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Account Type</p>
                  <p className="text-2xl font-bold text-primary">
                    {user?.userRoles?.some(ur => ur.role.name === 'ADMIN' || ur.role.name === 'admin') ? 'Admin' : 'User'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-lg font-semibold text-gray-900 truncate">{user?.email}</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.95a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Blog Posts */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Latest Insights</h3>
              </div>
              <div className="p-6">
                {dashboardData.recentPosts.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recentPosts.map((post) => (
                      <div key={post.id} className="border-l-4 border-primary pl-4">
                        <h4 className="font-medium text-gray-900 line-clamp-1">{post.title}</h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.excerpt}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No blog posts available.</p>
                )}
              </div>
            </div>

            {/* Featured Case Studies */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Success Stories</h3>
              </div>
              <div className="p-6">
                {dashboardData.featuredCaseStudies.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.featuredCaseStudies.map((caseStudy) => (
                      <div key={caseStudy.id} className="border-l-4 border-secondary pl-4">
                        <h4 className="font-medium text-gray-900 line-clamp-1">{caseStudy.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">Client: {caseStudy.client}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(caseStudy.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No case studies available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Profile Edit Modal */}
      {showProfileEdit && (
        <ProfileEditModal
          user={user}
          onClose={() => setShowProfileEdit(false)}
          onUpdate={loadDashboardData}
        />
      )}
    </div>
  );
}

export default UserDashboard;