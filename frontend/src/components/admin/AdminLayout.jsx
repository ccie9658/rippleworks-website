import { Outlet, Link, useLocation } from 'react-router-dom';

function AdminLayout() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
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
                <span className="text-xl font-bold text-secondary">RippleWorks Admin</span>
              </Link>
            </div>
            
            <nav className="flex space-x-8">
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/admin') && location.pathname === '/admin'
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/blog"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/admin/blog')
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                Blog Posts
              </Link>
              <Link
                to="/admin/case-studies"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/admin/case-studies')
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                Case Studies
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                ← Back to Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;