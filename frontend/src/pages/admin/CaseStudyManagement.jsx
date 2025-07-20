import { useState, useEffect } from 'react';
import { caseStudyApi } from '../../utils/api';

function CaseStudyManagement() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCaseStudy, setEditingCaseStudy] = useState(null);

  useEffect(() => {
    loadCaseStudies();
  }, []);

  const loadCaseStudies = async () => {
    try {
      setLoading(true);
      const response = await caseStudyApi.admin.getAll();
      setCaseStudies(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading case studies:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this case study?')) {
      return;
    }

    try {
      await caseStudyApi.admin.delete(id);
      await loadCaseStudies(); // Refresh the list
    } catch (err) {
      console.error('Error deleting case study:', err);
      alert('Failed to delete case study: ' + err.message);
    }
  };

  const handleEdit = (caseStudy) => {
    setEditingCaseStudy(caseStudy);
    setShowCreateForm(true);
  };

  const handleFormClose = () => {
    setShowCreateForm(false);
    setEditingCaseStudy(null);
    loadCaseStudies(); // Refresh the list
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading case studies...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Case Study Management</h1>
          <p className="text-gray-600 mt-2">Showcase your successful projects and client outcomes.</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary"
        >
          Create New Case Study
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {/* Case Studies List */}
      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            All Case Studies ({caseStudies.length})
          </h3>
        </div>
        
        {caseStudies.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {caseStudies.map((caseStudy) => (
              <div key={caseStudy.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900 mb-1">
                      {caseStudy.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      <strong>Client:</strong> {caseStudy.client}
                      {caseStudy.industry && (
                        <span className="ml-4"><strong>Industry:</strong> {caseStudy.industry}</span>
                      )}
                    </p>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      <strong>Challenge:</strong> {caseStudy.challenge}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      {caseStudy.featured && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      )}
                      {caseStudy.technologies && caseStudy.technologies.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-500">Technologies:</span>
                          <div className="flex flex-wrap gap-1">
                            {caseStudy.technologies.slice(0, 3).map((tech, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800"
                              >
                                {tech}
                              </span>
                            ))}
                            {caseStudy.technologies.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{caseStudy.technologies.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      <span className="text-gray-500">
                        Updated {new Date(caseStudy.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(caseStudy)}
                      className="text-primary hover:text-primary/80 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(caseStudy.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No case studies yet.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-4 btn-primary"
            >
              Create Your First Case Study
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <CaseStudyForm
          caseStudy={editingCaseStudy}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}

// Case Study Form Component
function CaseStudyForm({ caseStudy, onClose }) {
  const [formData, setFormData] = useState({
    title: caseStudy?.title || '',
    client: caseStudy?.client || '',
    industry: caseStudy?.industry || '',
    challenge: caseStudy?.challenge || '',
    solution: caseStudy?.solution || '',
    results: caseStudy?.results || '',
    technologies: caseStudy?.technologies?.join(', ') || '',
    featured: caseStudy?.featured || false,
    metaTitle: caseStudy?.metaTitle || '',
    metaDescription: caseStudy?.metaDescription || ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.client.trim() || 
        !formData.challenge.trim() || !formData.solution.trim() || 
        !formData.results.trim()) {
      setError('Title, client, challenge, solution, and results are required.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Process technologies (convert string to array)
      const processedData = {
        ...formData,
        technologies: formData.technologies
          .split(',')
          .map(tech => tech.trim())
          .filter(tech => tech.length > 0)
      };

      if (caseStudy) {
        // Update existing case study
        await caseStudyApi.admin.update(caseStudy.id, processedData);
      } else {
        // Create new case study
        await caseStudyApi.admin.create(processedData);
      }

      onClose();
    } catch (err) {
      console.error('Error saving case study:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8 overflow-hidden flex flex-col">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {caseStudy ? 'Edit Case Study' : 'Create New Case Study'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="text-red-800 text-sm">{error}</div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter case study title"
                  required
                />
              </div>

              <div>
                <label className="form-label">Client *</label>
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Client company name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label">Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., Manufacturing, Healthcare, Retail"
              />
            </div>

            <div>
              <label className="form-label">Challenge *</label>
              <textarea
                name="challenge"
                value={formData.challenge}
                onChange={handleChange}
                rows={4}
                className="form-input"
                placeholder="Describe the client's challenge or problem"
                required
              />
            </div>

            <div>
              <label className="form-label">Solution *</label>
              <textarea
                name="solution"
                value={formData.solution}
                onChange={handleChange}
                rows={4}
                className="form-input"
                placeholder="Describe how you solved the problem"
                required
              />
            </div>

            <div>
              <label className="form-label">Results *</label>
              <textarea
                name="results"
                value={formData.results}
                onChange={handleChange}
                rows={4}
                className="form-input"
                placeholder="Describe the outcomes and benefits achieved"
                required
              />
            </div>

            <div>
              <label className="form-label">Technologies</label>
              <input
                type="text"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter technologies separated by commas (e.g., Cisco, AWS, React)"
              />
              <p className="text-sm text-gray-500 mt-1">Separate multiple technologies with commas</p>
            </div>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Featured case study</span>
              </label>
            </div>

            <div>
              <label className="form-label">Meta Title (SEO)</label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                className="form-input"
                placeholder="SEO title for search engines"
              />
            </div>

            <div>
              <label className="form-label">Meta Description (SEO)</label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                rows={3}
                className="form-input"
                placeholder="SEO description for search engines"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : (caseStudy ? 'Update Case Study' : 'Create Case Study')}
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}

export default CaseStudyManagement;