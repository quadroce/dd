import React, { useState, useEffect } from 'react'
import { Database, CheckCircle, XCircle, RefreshCw, Users, FileText, Rss, AlertTriangle } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function DatabaseTest() {
  const [testResults, setTestResults] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [envCheck, setEnvCheck] = useState<any>({})

  const runTests = async () => {
    setLoading(true)
    const results: any = {}
    
    // First, check environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    setEnvCheck({
      url: {
        exists: !!supabaseUrl,
        value: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'Missing',
        valid: supabaseUrl?.includes('supabase.co') || false
      },
      key: {
        exists: !!supabaseAnonKey,
        value: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'Missing',
        valid: supabaseAnonKey?.length > 100 || false
      }
    })

    try {
      // Test 0: Basic Supabase client initialization
      results.client_init = {
        success: !!supabase,
        error: !supabase ? 'Supabase client not initialized' : null
      }

      // Test 1: Check if we can read from sources table
      const { data: sources, error: sourcesError } = await supabase
        .from('sources')
        .select('*')
        .limit(5)

      results.sources = {
        success: !sourcesError,
        error: sourcesError?.message,
        count: sources?.length || 0,
        data: sources
      }

      // Test 2: Check if we can read from articles table
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .limit(5)

      results.articles = {
        success: !articlesError,
        error: articlesError?.message,
        count: articles?.length || 0,
        data: articles
      }

      // Test 3: Check if we can read from profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5)

      results.profiles = {
        success: !profilesError,
        error: profilesError?.message,
        count: profiles?.length || 0,
        data: profiles
      }

      // Test 4: Check current user
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      results.auth = {
        success: !userError && !sessionError && !!user && !!session,
        error: userError?.message || sessionError?.message || (!user ? 'No user found' : (!session ? 'No session found' : null)),
        user: user,
        session: !!session,
        sessionDetails: session ? {
          expires_at: session.expires_at,
          user_id: session.user?.id
        } : null
      }

      // Test 5: Try to insert a test log entry
      const { error: logError } = await supabase
        .from('system_logs')
        .insert([{
          action: 'database_test',
          status: 'success',
          message: 'Database connection test performed',
          details: { timestamp: new Date().toISOString() }
        }])

      results.write_test = {
        success: !logError,
        error: logError?.message
      }

    } catch (error: any) {
      results.general_error = {
        success: false,
        error: error.message
      }
    }

    setTestResults(results)
    setLoading(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  const TestResult = ({ title, result, icon: Icon }: any) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
        {result?.success ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500" />
        )}
      </div>
      
      {result?.success ? (
        <div className="text-sm text-green-600">
          ✓ Success
          {result.count !== undefined && (
            <span className="ml-2">({result.count} records found)</span>
          )}
        </div>
      ) : (
        <div className="text-sm text-red-600">
          ✗ Failed: {result?.error || 'Unknown error'}
        </div>
      )}
      
      {result?.data && result.data.length > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          Sample data: {JSON.stringify(result.data[0], null, 2).substring(0, 100)}...
        </div>
      )}
    </div>
  )

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Database className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Database Connection Test</h2>
        </div>
        <button
          onClick={runTests}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Run Tests</span>
        </button>
      </div>

      {/* Environment Variables Check */}
      <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <span>Environment Variables</span>
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>VITE_SUPABASE_URL:</span>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded text-xs ${envCheck.url?.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {envCheck.url?.value || 'Not set'}
              </span>
              {envCheck.url?.valid ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>VITE_SUPABASE_ANON_KEY:</span>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded text-xs ${envCheck.key?.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {envCheck.key?.value || 'Not set'}
              </span>
              {envCheck.key?.valid ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <TestResult
          title="Supabase Client"
          result={testResults.client_init}
          icon={Database}
        />
        
        <TestResult
          title="Sources Table"
          result={testResults.sources}
          icon={Rss}
        />
        
        <TestResult
          title="Articles Table"
          result={testResults.articles}
          icon={FileText}
        />
        
        <TestResult
          title="Profiles Table"
          result={testResults.profiles}
          icon={Users}
        />
        
        <TestResult
          title="Authentication"
          result={testResults.auth}
          icon={Users}
        />
        
        <TestResult
          title="Write Test (System Logs)"
          result={testResults.write_test}
          icon={Database}
        />
      </div>

      {testResults.auth?.user && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Current User Info:</h3>
          <div className="text-sm text-blue-700">
            <p>Email: {testResults.auth.user.email}</p>
            <p>ID: {testResults.auth.user.id}</p>
            <p>Created: {new Date(testResults.auth.user.created_at).toLocaleString()}</p>
            <p>Session Active: {testResults.auth.session ? 'Yes' : 'No'}</p>
            {testResults.auth.sessionDetails && (
              <p>Session Expires: {new Date(testResults.auth.sessionDetails.expires_at * 1000).toLocaleString()}</p>
            )}
          </div>
        </div>
      )}
      
      {(!envCheck.url?.valid || !envCheck.key?.valid) && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="font-medium text-red-900 mb-2">⚠️ Configuration Issue Detected</h3>
          <div className="text-sm text-red-700">
            <p>Your Supabase environment variables are not properly configured.</p>
            <p className="mt-2"><strong>To fix this:</strong></p>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>Go to your Supabase dashboard → Settings → API</li>
              <li>Copy your Project URL and Anon Key</li>
              <li>Add them as environment variables in Netlify</li>
              <li>Redeploy your site</li>
            </ol>
          </div>
        </div>
      )}
      
      {/* Supabase Configuration Check */}
      <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="font-medium text-yellow-900 mb-2">📧 Email Configuration Check</h3>
        <div className="text-sm text-yellow-700 space-y-2">
          <p><strong>If emails aren't being sent:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Go to Supabase Dashboard → Authentication → Settings</li>
            <li>Check if "Enable email confirmations" is turned ON</li>
            <li>If OFF, users will be signed in immediately without email confirmation</li>
            <li>Configure SMTP settings if you want custom email delivery</li>
            <li>Check your spam folder for confirmation emails</li>
          </ol>
          <p className="mt-2"><strong>Current behavior:</strong> If no email is sent, it means email confirmation is disabled in your Supabase project.</p>
        </div>
      </div>
    </div>
  )
}