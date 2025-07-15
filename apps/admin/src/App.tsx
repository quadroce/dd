import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import SourcesManager from './components/SourcesManager'
import DatabaseTest from './components/DatabaseTest'

function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'home' | 'sources' | 'settings'>('home')

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Only set user if we have a valid session
      if (session?.user && session?.expires_at && session.expires_at > Date.now() / 1000) {
        setUser(session.user)
      } else {
        setUser(null)
        // Clear any invalid session
        if (session) {
          supabase.auth.signOut()
        }
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
      } else if (event === 'SIGNED_OUT' || !session) {
        setUser(null)
        setActiveTab('home')
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        setUser(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleAuth = (user: any) => {
    // Double-check that we have a valid session before proceeding
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && session?.expires_at && session.expires_at > Date.now() / 1000) {
        setUser(user)
      } else {
        console.error('Invalid session after auth')
        setUser(null)
      }
    })
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      if (event === 'SIGNED_OUT') {
        setActiveTab('home')
      }
    } catch (error) {
      console.error('Error signing out:', error)
      // Force sign out locally even if server call fails
      setUser(null)
      setActiveTab('home')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ScoutFeed...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Auth onAuth={handleAuth} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        onSignOut={handleSignOut}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <main>
        {activeTab === 'home' && <Dashboard user={user} />}
        {activeTab === 'sources' && <SourcesManager user={user} />}
        {activeTab === 'settings' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <div className="space-y-6">
              <DatabaseTest />
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <p className="text-gray-600">Additional settings coming soon...</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App