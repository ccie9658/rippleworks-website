import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogApi, caseStudyApi } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/auth/AuthModal';

function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [content, setContent] = useState({
    recentPosts: [],
    featuredCaseStudies: [],
    loading: true,
    error: null
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const [blogResponse, caseStudyResponse] = await Promise.all([
        blogApi.getAllPosts(),
        caseStudyApi.getAll(true) // Only featured case studies
      ]);

      setContent({
        recentPosts: blogResponse.data.slice(0, 3), // Show 3 most recent posts
        featuredCaseStudies: caseStudyResponse.data.slice(0, 2), // Show 2 featured case studies
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error loading homepage content:', error);
      setContent(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  const handleLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleRegister = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary/90 to-neutral">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/images/logos/rippleworks_logo_light_bg.png" 
              alt="RippleWorks Logo" 
              className="h-10 w-auto"
            />
            <h1 className="text-2xl font-bold text-white">RippleWorks</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-white/90 hover:text-white transition-colors">Home</a>
            <a href="#" className="text-white/90 hover:text-white transition-colors">Services</a>
            <a href="#" className="text-white/90 hover:text-white transition-colors">About</a>
            <a href="#" className="text-white/90 hover:text-white transition-colors">Contact</a>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-white/90 text-sm">
                  Welcome, {user?.firstName}
                </span>
                <Link to="/dashboard" className="text-white/90 hover:text-white transition-colors">
                  Dashboard
                </Link>
                {user && user.userRoles?.some(ur => ur.role.name === 'ADMIN' || ur.role.name === 'admin') && (
                  <Link to="/admin" className="text-white/90 hover:text-white transition-colors">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogin}
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={handleRegister}
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in text-gray-100">
            Small Business <span className="text-primary font-extrabold">Technology</span> Modernization
          </h2>
          <p className="text-xl md:text-2xl mb-8 animate-slide-up leading-relaxed text-gray-300">
            Expert consulting for network infrastructure, cloud solutions, and website development. 
            <br />
            <span className="text-lg md:text-xl italic text-gray-400">Creating ripples of positive change in your business technology.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <button className="btn-primary">
              Get Started
            </button>
            <button className="btn-outline border-white text-white hover:bg-white hover:text-secondary">
              Learn More
            </button>
          </div>
        </div>
      </main>

      {/* Services Preview */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card-hover bg-white/10 text-white border-white/20">
            <h3 className="text-xl font-semibold mb-4 text-primary">Network Consulting</h3>
            <p className="text-white/90">
              Modern network design and optimization for improved productivity and security.
            </p>
          </div>
          <div className="card-hover bg-white/10 text-white border-white/20">
            <h3 className="text-xl font-semibold mb-4 text-primary">Website Solutions</h3>
            <p className="text-white/90">
              Professional website development, maintenance, and performance optimization.
            </p>
          </div>
          <div className="card-hover bg-white/10 text-white border-white/20">
            <h3 className="text-xl font-semibold mb-4 text-primary">Cloud & Servers</h3>
            <p className="text-white/90">
              Cloud migration strategies and server management for scalable growth.
            </p>
          </div>
        </div>
      </section>
    </div>

    {/* Content Sections - White Background */}
    <div className="bg-white">
      {/* Featured Case Studies */}
      {content.featuredCaseStudies.length > 0 && (
        <section className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how we've helped businesses like yours modernize their technology infrastructure and achieve remarkable results.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {content.featuredCaseStudies.map((caseStudy) => (
              <div key={caseStudy.id} className="card-hover">
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Featured Case Study
                    </span>
                    {caseStudy.industry && (
                      <span className="text-sm text-gray-500">{caseStudy.industry}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary mb-2">{caseStudy.title}</h3>
                  <p className="text-gray-600 mb-2"><strong>Client:</strong> {caseStudy.client}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Challenge</h4>
                    <p className="text-gray-600 text-sm line-clamp-2">{caseStudy.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Results</h4>
                    <p className="text-gray-600 text-sm line-clamp-2">{caseStudy.results}</p>
                  </div>
                </div>

                {caseStudy.technologies && caseStudy.technologies.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.technologies.slice(0, 4).map((tech, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                        >
                          {tech}
                        </span>
                      ))}
                      {caseStudy.technologies.length > 4 && (
                        <span className="text-xs text-gray-500 self-center">
                          +{caseStudy.technologies.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <button className="text-primary hover:text-primary/80 text-sm font-medium">
                    Read Full Case Study →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Blog Posts */}
      {content.recentPosts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                Latest Insights
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Stay informed with our latest thoughts on technology trends, best practices, and industry insights.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {content.recentPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Blog Post
                      </span>
                      {post.featured && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-secondary mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{post.author?.firstName} {post.author?.lastName}</span>
                        <span>•</span>
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <button className="text-primary hover:text-primary/80 text-sm font-medium">
                        Read More →
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-12">
              <button className="btn-outline">
                View All Blog Posts
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Modernize Your Technology?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join the businesses that have already transformed their operations with our expert consulting and proven solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              Schedule Consultation
            </button>
            <button className="bg-white text-secondary hover:bg-gray-100 font-medium px-6 py-3 rounded-lg transition-colors duration-200">
              View Our Services
            </button>
          </div>
        </div>
      </section>
    </div>

    {/* Footer */}
    <footer className="bg-neutral text-white/70 py-8">
      <div className="container mx-auto px-6 text-center">
        <p>&copy; 2024 RippleWorks. Creating positive ripples in business technology.</p>
      </div>
    </footer>

    {/* Authentication Modal */}
    <AuthModal
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
      initialMode={authMode}
    />
    </>
  );
}

export default HomePage;