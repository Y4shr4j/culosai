import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Edit, Trash2, Plus, Search, Sparkles, Eye } from 'lucide-react';
import { api } from '../../src/utils/api';

interface Character {
  _id: string;
  name: string;
  description: string;
  personality: string;
  image: string;
  category: string;
  tags: string[];
  isActive: boolean;
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function Characters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    personality: '',
    image: '',
    category: '',
    tags: [] as string[]
  });

  // AI Generation state
  const [aiFormData, setAiFormData] = useState({
    prompt: '',
    category: ''
  });

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter) params.append('category', categoryFilter);

      const response = await api.get(`/characters?${params.toString()}`);
      setCharacters(response.characters || []);
    } catch (error) {
      console.error('Error fetching characters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/characters', formData);
      setShowCreateModal(false);
      setFormData({
        name: '',
        description: '',
        personality: '',
        image: '',
        category: '',
        tags: []
      });
      fetchCharacters();
    } catch (error) {
      console.error('Error creating character:', error);
    }
  };

  const handleUpdateCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCharacter) return;
    
    try {
      await api.put(`/characters/${editingCharacter._id}`, formData);
      setEditingCharacter(null);
      setFormData({
        name: '',
        description: '',
        personality: '',
        image: '',
        category: '',
        tags: []
      });
      fetchCharacters();
    } catch (error) {
      console.error('Error updating character:', error);
    }
  };

  const handleDeleteCharacter = async (characterId: string) => {
    if (!window.confirm('Are you sure you want to delete this character?')) return;
    
    try {
      await api.delete(`/characters/${characterId}`);
      fetchCharacters();
    } catch (error) {
      console.error('Error deleting character:', error);
    }
  };

  const handleGenerateAICharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/characters/generate', aiFormData);
      setShowGenerateModal(false);
      setAiFormData({
        prompt: '',
        category: ''
      });
      fetchCharacters();
    } catch (error) {
      console.error('Error generating AI character:', error);
    }
  };

  const openEditModal = (character: Character) => {
    setEditingCharacter(character);
    setFormData({
      name: character.name,
      description: character.description,
      personality: character.personality,
      image: character.image,
      category: character.category,
      tags: character.tags
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <AdminSidebar />
      <div className="flex-1 ml-[260px]">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Characters Management</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setShowGenerateModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
              >
                <Sparkles className="w-4 h-4" />
                Generate AI Character
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Create Character
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search characters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Romance">Romance</option>
                <option value="Adventure">Adventure</option>
                <option value="Mystery">Mystery</option>
                <option value="AI Generated">AI Generated</option>
              </select>
              <button
                onClick={fetchCharacters}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Characters Grid */}
          <div className="bg-white rounded-lg shadow">
            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : characters.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No characters found</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                {characters.map((character) => (
                  <div key={character._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={character.image}
                        alt={character.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Character';
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          character.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {character.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{character.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{character.description}</p>
                      <div className="mb-3">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {character.category}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {character.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                            {tag}
                          </span>
                        ))}
                        {character.tags.length > 3 && (
                          <span className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                            +{character.tags.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          Created: {new Date(character.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(character)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCharacter(character._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingCharacter) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingCharacter ? 'Edit Character' : 'Create New Character'}
            </h2>
            <form onSubmit={editingCharacter ? handleUpdateCharacter : handleCreateCharacter}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Personality</label>
                  <textarea
                    value={formData.personality}
                    onChange={(e) => setFormData({...formData, personality: e.target.value})}
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Romance">Romance</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Mystery">Mystery</option>
                    <option value="AI Generated">AI Generated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingCharacter(null);
                    setFormData({
                      name: '',
                      description: '',
                      personality: '',
                      image: '',
                      category: '',
                      tags: []
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingCharacter ? 'Update Character' : 'Create Character'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Generation Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Generate AI Character
            </h2>
            <form onSubmit={handleGenerateAICharacter}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prompt</label>
                  <textarea
                    value={aiFormData.prompt}
                    onChange={(e) => setAiFormData({...aiFormData, prompt: e.target.value})}
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the character you want to generate..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={aiFormData.category}
                    onChange={(e) => setAiFormData({...aiFormData, category: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Romance">Romance</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Mystery">Mystery</option>
                    <option value="AI Generated">AI Generated</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowGenerateModal(false);
                    setAiFormData({
                      prompt: '',
                      category: ''
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Character
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
