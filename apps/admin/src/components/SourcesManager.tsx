import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Globe, User, AlertCircle, CheckCircle, Tag } from 'lucide-react'
import { supabase, Source } from '../lib/supabase'
import ScrapingControl from './ScrapingControl'

interface SourcesManagerProps {
  user: any
}

export default function SourcesManager({ user }: SourcesManagerProps) {
  const [sources, setSources] = useState<Source[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSource, setNewSource] = useState({
    name: '',
    url: '',
    type: 'rss' as 'rss' | 'html'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchSources()
  }, [])

  const fetchSources = async () => {
    setLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('sources')
        .select('*')
        .order('name')

      if (error) throw error
      setSources(data || [])
    } catch (error) {
      console.error('Error fetching sources:', error)
      setError('Failed to load sources')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const { error } = await supabase
        .from('sources')
        .insert([{
          ...newSource,
          user_id: user.id
        }])

      if (error) throw error

      setSuccess('Source added successfully!')
      setNewSource({ name: '', url: '', type: 'rss' })
      setShowAddForm(false)
      fetchSources()
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleDeleteSource = async (sourceId: string) => {
    if (!confirm('Are you sure you want to delete this source?')) return

    try {
      const { error } = await supabase
        .from('sources')
        .delete()
        .eq('id', sourceId)

      if (error) throw error

      setSuccess('Source deleted successfully!')
      fetchSources()
    } catch (error: any) {
      setError(error.message)
    }
  }

  const globalSources = sources.filter(source => source.user_id === null)
  const userSources = sources.filter(source => source.user_id === user.id)
  
  // Group global sources by category
  const sourcesByCategory = globalSources.reduce((acc, source) => {
    const category = source.category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(source)
    return acc
  }, {} as Record<string, Source[]>)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading sources...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">News Sources</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Source</span>
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700">{success}</span>
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Source</h3>
          
          <form onSubmit={handleAddSource} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Source Name
              </label>
              <input
                id="name"
                type="text"
                value={newSource.name}
                onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., My Blog"
                required
              />
            </div>
            
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                URL
              </label>
              <input
                id="url"
                type="url"
                value={newSource.url}
                onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/feed.xml"
                required
              />
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Source Type
              </label>
              <select
                id="type"
                value={newSource.type}
                onChange={(e) => setNewSource({ ...newSource, type: e.target.value as 'rss' | 'html' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="rss">RSS Feed</option>
                <option value="html">HTML Page</option>
              </select>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Source
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-8">
        {/* Scraping Control */}
        <ScrapingControl onScrapingComplete={fetchSources} />
        
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Global Sources by Category */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <span>Global Sources</span>
              <span className="text-sm font-normal text-gray-500">({globalSources.length})</span>
            </h3>
            
            {Object.entries(sourcesByCategory).map(([category, categorySources]) => (
              <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-gray-600" />
                  <span>{category}</span>
                  <span className="text-sm font-normal text-gray-500">({categorySources.length})</span>
                </h4>
                
                <div className="space-y-3">
                  {categorySources.map((source) => (
                    <div
                      key={source.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{source.name}</h5>
                        {source.description && (
                          <p className="text-sm text-gray-600 mt-1">{source.description}</p>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {source.type.toUpperCase()}
                          </span>
                          {source.is_active ? (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              ACTIVE
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                              INACTIVE
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* User Sources */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <User className="w-5 h-5 text-emerald-600" />
              <span>Your Sources</span>
              <span className="text-sm font-normal text-gray-500">({userSources.length})</span>
            </h3>
            
            <div className="space-y-3">
              {userSources.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No personal sources yet. Add one to get started!
                </p>
              ) : (
                userSources.map((source) => (
                  <div
                    key={source.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{source.name}</h4>
                      <p className="text-sm text-gray-500">{source.url}</p>
                      <span className="inline-block mt-1 px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                        {source.type.toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteSource(source.id)}
                      className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}