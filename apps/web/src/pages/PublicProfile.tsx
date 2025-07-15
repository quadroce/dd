import { useParams } from 'react-router-dom';
import { usePublicProfile } from '@/hooks/usePublicProfile';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ExternalLink, 
  Twitter, 
  Linkedin, 
  Copy, 
  Heart,
  Clock,
  User,
  Share
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { toast } = useToast();
  const { profile, publicContent, isLoading, isPublic, error } = usePublicProfile(username || '');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Profile link has been copied to your clipboard.",
    });
  };

  const handleShare = (platform: 'twitter' | 'linkedin') => {
    const url = encodeURIComponent(window.location.href);
    const displayName = profile?.first_name && profile?.last_name 
      ? `${profile.first_name} ${profile.last_name}` 
      : profile?.email?.split('@')[0] || 'User';
    const text = encodeURIComponent(`Check out ${displayName}'s curated content on DropDaily`);
    
    let shareUrl = '';
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    } else if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The profile you're looking for doesn't exist or is no longer available.
          </p>
          <Button asChild>
            <a href="/">Back to DropDaily</a>
          </Button>
        </div>
      </div>
    );
  }

  if (!isPublic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Profile Not Public</h1>
          <p className="text-muted-foreground mb-6">
            This user has chosen to keep their profile private.
          </p>
          <Button asChild>
            <a href="/">Back to DropDaily</a>
          </Button>
        </div>
      </div>
    );
  }

  const displayName = profile.first_name && profile.last_name 
    ? `${profile.first_name} ${profile.last_name}` 
    : profile.email?.split('@')[0] || 'User';

  const initials = displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="text-xl font-semibold text-foreground">
              DropDaily
            </a>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleShare('twitter')}>
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleShare('linkedin')}>
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="text-center mb-12">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage src={profile.avatar_url || undefined} alt={displayName} />
            <AvatarFallback className="text-2xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {displayName}
          </h1>
          
          <p className="text-lg text-muted-foreground mb-4">
            Here's what {displayName.split(' ')[0]} is discovering this week
          </p>
          
          <div className="flex justify-center items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Share className="h-4 w-4" />
              <span>@{username}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Recent Content */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Recent Discoveries
            </h2>
            
            {publicContent.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {publicContent.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <User className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">{item.source || 'Unknown'}</Badge>
                        <Badge variant="outline" className="text-xs">{item.content_type}</Badge>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {item.description || 'No description available'}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <Button size="sm" variant="outline" asChild>
                          <a href={item.url || '#'} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Read
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No public content yet</h3>
                <p className="text-muted-foreground">
                  {displayName} hasn't shared any public content yet.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t text-center">
          <p className="text-muted-foreground mb-4">
            Want to discover and curate content like {displayName}?
          </p>
          <Button asChild>
            <a href="/">Join DropDaily</a>
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default PublicProfile;