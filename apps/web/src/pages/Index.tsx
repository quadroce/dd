import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, Plus, Filter, Zap, Target, Clock, Users } from "lucide-react";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import NewsletterManagement from "@/components/NewsletterManagement";
import TopicSelector from "@/components/TopicSelector";
import SystemDiagnostics from "@/components/SystemDiagnostics";

const Index = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already subscribed!",
            description: "This email is already on our waitlist.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Success!",
          description: "You've been added to our waitlist. We'll notify you when we launch!",
        });
        setEmail("");
      }
    } catch (error) {
      console.error('Error submitting to waitlist:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is authenticated, show the newsletter management interface
  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <SystemDiagnostics />
            <NewsletterManagement />
            <TopicSelector />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Stop searching.
            <span className="text-blue-600"> Start discovering.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI-powered content discovery that delivers curated articles, videos, and posts directly to you. 
            Join the waitlist for personalized daily drops.
          </p>
          
          {!user && (
            <div className="max-w-md mx-auto mb-12">
              <form onSubmit={handleWaitlistSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Joining..." : "Join Waitlist"}
                </Button>
              </form>
              <p className="text-sm text-gray-500 mt-2">
                Be the first to know when we launch!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How DropDaily Works
          </h2>
          <p className="text-xl text-gray-600">
            Three simple steps to personalized content discovery
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Select Your Interests</h3>
            <p className="text-gray-600">Choose up to 25 topics that matter to you - from tech and sports to culture and finance.</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Choose Formats</h3>
            <p className="text-gray-600">Pick your preferred content types: articles, videos, Reddit discussions, or social media posts.</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Your Daily Drop</h3>
            <p className="text-gray-600">Receive a personalized digest every morning with 5 carefully curated pieces of content.</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose DropDaily?
            </h2>
            <p className="text-xl text-gray-600">
              Cut through the noise with AI-powered content curation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap className="h-8 w-8 text-blue-600" />,
                title: "AI-Powered",
                description: "Smart algorithms learn your preferences and deliver content you'll actually want to read."
              },
              {
                icon: <Target className="h-8 w-8 text-green-600" />,
                title: "Personalized",
                description: "Every recommendation is tailored to your interests, industry, and reading habits."
              },
              {
                icon: <Clock className="h-8 w-8 text-purple-600" />,
                title: "Time-Saving",
                description: "Spend minutes, not hours, staying informed with our curated daily digest."
              },
              {
                icon: <Users className="h-8 w-8 text-red-600" />,
                title: "Community",
                description: "Discover trending topics and discussions from your professional network."
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Sample Content Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sample Daily Digest
          </h2>
          <p className="text-xl text-gray-600">
            Here's what your personalized content feed might look like
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
              type: "Discussion", 
              title: "What can I expect moving to Milan as a guy in my mid-20s?", 
              source: "Reddit - r/milano", 
              time: "8 min read",
              url: "https://www.reddit.com/r/milano/comments/1llpits/what_can_i_expect_moving_to_milan_as_a_guy_in_my/"
            },
            { 
              type: "Article", 
              title: "Cambiare settore? No grazie", 
              source: "LinkedIn News", 
              time: "5 min read",
              url: "https://www.linkedin.com/news/story/cambiare-settore-no-grazie-6448388/"
            },
            { 
              type: "Social", 
              title: "Instagram Post", 
              source: "Instagram", 
              time: "1 min view",
              url: "https://www.instagram.com/p/DIJpxL9oRE3/?img_index=1"
            },
            { 
              type: "News", 
              title: "Wimbledon: sorteggio Sinner debutta contro Nardi, nei quarti possibile derby con Musetti", 
              source: "Gazzetta dello Sport", 
              time: "4 min read",
              url: "https://www.gazzetta.it/Tennis/atp/slam/wimbledon/27-06-2025/wimbledon-sorteggio-sinner-debutta-contro-nardi-nei-quarti-possibile-derby-con-musetti.shtml"
            },
            { 
              type: "Tech", 
              title: "This AI-powered startup studio plans to launch 100,000 companies a year. Really.", 
              source: "TechCrunch", 
              time: "6 min read",
              url: "https://techcrunch.com/2025/06/26/this-ai-powered-startup-studio-plans-to-launch-100000-companies-a-year-really/"
            },
            { 
              type: "Video", 
              title: "Dan Pat Rugby Training", 
              source: "YouTube", 
              time: "12 min",
              isVideo: true,
              videoId: "UYKV0LXfj8k"
            }
          ].map((item, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <Badge className={`mb-3 ${
                item.type === 'Discussion' ? 'bg-orange-100 text-orange-800' :
                item.type === 'Article' ? 'bg-blue-100 text-blue-800' :
                item.type === 'Social' ? 'bg-pink-100 text-pink-800' :
                item.type === 'News' ? 'bg-green-100 text-green-800' :
                item.type === 'Tech' ? 'bg-purple-100 text-purple-800' :
                'bg-blue-100 text-blue-800'
              }`}>{item.type}</Badge>
              <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>
              {item.isVideo && item.videoId ? (
                <div className="my-4">
                  <YouTubeEmbed videoId={item.videoId} title={item.title} />
                </div>
              ) : null}
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{item.source}</span>
                <span>{item.time}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="bg-blue-600 py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Daily Reading?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of professionals who've already upgraded their content consumption
            </p>
            <div className="max-w-md mx-auto">
              <form onSubmit={handleWaitlistSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white"
                  required
                />
                <Button type="submit" variant="secondary" disabled={isSubmitting}>
                  {isSubmitting ? "Joining..." : "Get Started"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;