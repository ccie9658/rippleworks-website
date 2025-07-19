function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary/90 to-neutral">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Logo placeholder - we'll add the actual logo later */}
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center ripple-effect">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <h1 className="text-2xl font-bold text-white">RippleWorks</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-white/90 hover:text-white transition-colors">Home</a>
            <a href="#" className="text-white/90 hover:text-white transition-colors">Services</a>
            <a href="#" className="text-white/90 hover:text-white transition-colors">About</a>
            <a href="#" className="text-white/90 hover:text-white transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Small Business <span className="text-primary">Technology</span> Modernization
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-8 animate-slide-up">
            Expert consulting for network infrastructure, cloud solutions, and website development. 
            Creating ripples of positive change in your business technology.
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

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center text-white/70">
        <p>&copy; 2024 RippleWorks. Creating positive ripples in business technology.</p>
      </footer>
    </div>
  )
}

export default App
