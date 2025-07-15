import React, { useState, useEffect } from 'react'
import { Clock, ExternalLink, Tag, RefreshCw } from 'lucide-react'
import { supabase, Article, Source } from '../lib/supabase'
import { formatDistanceToNow } from 'date-fns'

interface DashboardProps {
  user: any
}

export default function Dashboard({ user }: DashboardProps) {
  const [articles, setArticles] = useState<(Article & { sources: Source })[]>([])
  const [sources, setSources] = useState<Source[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSource, setSelectedSource] = useState<string>('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    
    try {
      // Fetch sources
      const { data: sourcesData, error: sourcesError } = await supabase
        .from('sources')
        .select('*')
        .order('name')

      if (sourcesError) throw sourcesError

      // Fetch articles with source information
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select(`
          *,
          sources (*)
        `)
        .order('published_at', { ascending: false })
        .limit(100)

      if (articlesError) throw articlesError

      setSources(sourcesData || [])
      setArticles(articlesData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = selectedSource === 'all' 
    ? articles 
    : articles.filter(article => article.source_id === selectedSource)

  const groupedArticles = filteredArticles.reduce((acc, article) => {
    const sourceName = article.sources?.name || 'Unknown'
    if (!acc[sourceName]) {
      acc[sourceName] = []
    }
    acc[sourceName].push(article)
    return acc
  }, {} as Record<string, Article[]>)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading articles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest News</h2>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedSource('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedSource === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Sources
          </button>
          {sources.map((source) => (
            <button
              key={source.id}
              onClick={() => setSelectedSource(source.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedSource === source.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {source.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedArticles).map(([sourceName, sourceArticles]) => (
          <div key={sourceName} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <span>{sourceName}</span>
              <span className="text-sm font-normal text-gray-500">
                ({sourceArticles.length} articles)
              </span>
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sourceArticles.slice(0, 10).map((article) => (
                <div
                  key={article.id}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h4>
                  
                  {article.summary && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {article.summary}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {article.published_at 
                          ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true })
                          : 'Unknown time'
                        }
                      </span>
                    </div>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Read</span>
                    </a>
                  </div>
                  
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(groupedArticles).length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No articles found</p>
          <p className="text-gray-400 text-sm mt-2">
            Try refreshing or check back later for new content
          </p>
        </div>
      )}
    </div>
  )
}