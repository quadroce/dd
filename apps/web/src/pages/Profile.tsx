import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserContent } from '@/hooks/useUserContent';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  ExternalLink, 
  BookmarkPlus, 
  ThumbsDown, 
  Settings, 
  LogOut, 
  Download,
  RefreshCw,
  Share,
  Heart,
  Clock,
  User
} from 'lucide-react';

const Profile = () => {
  const { user, loading, signOut } = useAuth();
  const { 
    todaysContent, 
    savedContent, 
    likedContent, 
    userPreferences,
    isLoading: contentLoading,
    refetchContent 
  } = useUserContent();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // If user is not authenticated, redirect to auth page
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
      }
    };

    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleExport = (format: 'pdf' | 'markdown') => {
    // Export functionality would be implemented here
    console.log(`Exporting as ${format}`);
    setExportModalOpen(false);
  };

  const handleContentAction = (action: string, contentId: string) => {
    console.log(`${action} on content ${contentId}`);
  };

  const handleRequestNewDrop = async () => {
    await refetchContent();
  };

  if (loading || contentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = firstName || lastName ? `${firstName} ${lastName}`.trim() : user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-semibold text-foreground">
              DropDaily
            </Link>
            <div className="flex items-center gap-4">
              <Link 
                to={`/u/${user?.email?.split('@')[0]}`} 
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
              >
                <Share className="h-4 w-4" />
                Public Profile
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Hi {displayName} 👋 — here's your drop for today
          </h1>
          <p className="text-muted-foreground">
            Curated content based on your interests and reading patterns
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Today's Drop */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  Today's Drop
                </h2>
                <Button variant="outline" size="sm" onClick={handleRequestNewDrop}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Request New Drop
                </Button>
              </div>
              
              <div className="grid gap-6">
                {todaysContent.length > 0 ? todaysContent.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="md:flex">
                      <div className="md:w-48 md:flex-shrink-0">
                        <div className="w-full h-48 md:h-full bg-muted flex items-center justify-center">
                          <User className="h-12 w-12 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="p-6 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{item.source || 'Unknown'}</Badge>
                          <Badge variant="outline">{item.content_type}</Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {item.description || 'No description available'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" asChild disabled={!item.url}>
                            <a href={item.url || '#'} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Read
                            </a>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleContentAction('save', item.id)}
                          >
                            <BookmarkPlus className="h-4 w-4 mr-2" />
                            Save for Later
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleContentAction('not-relevant', item.id)}
                          >
                            <ThumbsDown className="h-4 w-4 mr-2" />
                            Not Relevant
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )) : (
                  <div className="text-center py-12">
                    <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No content yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Set up your interests to get personalized content recommendations.
                    </p>
                    <Link to="/preferences">
                      <Button>
                        <Settings className="h-4 w-4 mr-2" />
                        Set Up Interests
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </section>

            {/* Saved for Later */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Saved for Later
              </h2>
              
              <div className="grid gap-4">
                {savedContent.length > 0 ? savedContent.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-16 bg-muted rounded flex items-center justify-center">
                          <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs">{item.source || 'Unknown'}</Badge>
                            <span className="text-xs text-muted-foreground">
                              Saved {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-medium text-foreground mb-1 line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {item.description || 'No description available'}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" asChild disabled={!item.url}>
                          <a href={item.url || '#'} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Read
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No saved content yet</p>
                  </div>
                )}
              </div>
            </section>

            {/* Liked Content */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Liked Content
              </h2>
              
              <div className="grid gap-4">
                {likedContent.length > 0 ? likedContent.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-16 bg-muted rounded flex items-center justify-center">
                          <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs">{item.source || 'Unknown'}</Badge>
                            <span className="text-xs text-muted-foreground">
                              Liked {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-medium text-foreground mb-1 line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {item.description || 'No description available'}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" asChild disabled={!item.url}>
                          <a href={item.url || '#'} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Read
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No liked content yet</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/preferences">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Update Interests
                    </Button>
                  </Link>
                  
                  <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Export Feed
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Export Your Feed</DialogTitle>
                        <DialogDescription>
                          Choose a format to export your curated content and reading history.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <Button 
                          onClick={() => handleExport('pdf')} 
                          className="w-full justify-start"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export as PDF
                        </Button>
                        <Button 
                          onClick={() => handleExport('markdown')} 
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export as Markdown
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* Profile Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Today's Content</span>
                      <span className="font-medium">{todaysContent.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Saved Items</span>
                      <span className="font-medium">{savedContent.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Liked Items</span>
                      <span className="font-medium">{likedContent.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Your Interests</span>
                      <span className="font-medium">{userPreferences?.length || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;