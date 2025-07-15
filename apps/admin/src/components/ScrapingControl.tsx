import React, { useState } from 'react'
import { Play, RefreshCw, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface ScrapingControlProps {
  onScrapingComplete?: () => void
}

export default function ScrapingControl({ onScrapingComplete }: ScrapingControlProps) {
  const [isScrapingManual, setIsScrapingManual] = useState(false)
  const [isScrapingScheduled, setIsScrapingScheduled] = useState(false)
  const [lastResult, setLastResult] = useState<any>(null)
  const [error, setError] = useState('')

  const triggerManualScraping = async () => {
    setIsScrapingManual(true)
    setError('')
    
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scrape-news`
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      })
      
      const result = await response.json()
      
      if (result.success) {
        setLastResult(result)
        onScrapingComplete?.()
      } else {
        setError(result.message || 'Scraping failed')
      }
      
    } catch (err: any) {
      setError(err.message || 'Failed to trigger scraping')
    } finally {
      setIsScrapingManual(false)
    }
  }

  const triggerScheduledScraping = async () => {
    setIsScrapingScheduled(true)
    setError('')
    
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/schedule-scraper`
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      })
      
      const result = await response.json()
      
      if (result.success) {
        setLastResult(result.scraping_result)
        onScrapingComplete?.()
      } else {
        setError(result.message || 'Scheduled scraping failed')
      }
      
    } catch (err: any) {
      setError(err.message || 'Failed to trigger scheduled scraping')
    } finally {
      setIsScrapingScheduled(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">News Scraping Control</h3>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}
      
      {lastResult && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700 font-medium">Scraping Completed</span>
          </div>
          <div className="text-sm text-green-600">
            <p>Total articles scraped: <strong>{lastResult.total_articles}</strong></p>
            <p>Sources processed: <strong>{lastResult.sources_processed}</strong></p>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        <button
          onClick={triggerManualScraping}
          disabled={isScrapingManual || isScrapingScheduled}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isScrapingManual ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Scraping in progress...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Start Manual Scraping</span>
            </>
          )}
        </button>
        
        <button
          onClick={triggerScheduledScraping}
          disabled={isScrapingManual || isScrapingScheduled}
          className="w-full bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isScrapingScheduled ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Triggering scheduled scraping...</span>
            </>
          ) : (
            <>
              <Clock className="w-4 h-4" />
              <span>Trigger Scheduled Scraping</span>
            </>
          )}
        </button>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Manual Scraping:</strong> Immediately scrapes all active RSS sources</p>
        <p><strong>Scheduled Scraping:</strong> Simulates the automated 12-hour scraping cycle</p>
      </div>
    </div>
  )
}