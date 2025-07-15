
import { supabase } from '@/integrations/supabase/client';

// Updated taxonomy data with Italian categories and options
const topicTaxonomy = {
  "Sports": [
    { slug: "football-soccer", name: "Football (Soccer)", description: "International football and soccer leagues" },
    { slug: "premier-league", name: "Premier League", description: "English Premier League football" },
    { slug: "serie-a", name: "Serie A", description: "Italian Serie A football league" },
    { slug: "la-liga", name: "La Liga", description: "Spanish La Liga football" },
    { slug: "uefa-champions-league", name: "UEFA Champions League", description: "European club football competition" },
    { slug: "mls", name: "MLS", description: "Major League Soccer (US)" },
    { slug: "american-football", name: "American Football", description: "American football leagues and news" },
    { slug: "nfl", name: "NFL", description: "National Football League" },
    { slug: "ncaa-football", name: "NCAA Football", description: "College football in the US" },
    { slug: "basketball", name: "Basketball", description: "Basketball leagues and tournaments" },
    { slug: "nba", name: "NBA", description: "National Basketball Association" },
    { slug: "ncaa-basketball", name: "NCAA Basketball", description: "College basketball in the US" },
    { slug: "euroleague", name: "EuroLeague", description: "European basketball competition" },
    { slug: "tennis", name: "Tennis", description: "Professional tennis tournaments" },
    { slug: "atp", name: "ATP", description: "Association of Tennis Professionals" },
    { slug: "wta", name: "WTA", description: "Women's Tennis Association" },
    { slug: "grand-slams", name: "Grand Slams", description: "Tennis Grand Slam tournaments" },
    { slug: "formula-1", name: "Formula 1", description: "Formula 1 racing championship" },
    { slug: "motogp", name: "MotoGP", description: "Motorcycle racing championship" },
    { slug: "golf", name: "Golf", description: "Professional golf tournaments" },
    { slug: "baseball", name: "Baseball", description: "Baseball leagues and games" },
    { slug: "cycling", name: "Cycling", description: "Professional cycling and competitions" },
    { slug: "esports", name: "Esports", description: "Competitive video gaming" },
    { slug: "league-of-legends", name: "League of Legends", description: "League of Legends esports" },
    { slug: "valorant", name: "Valorant", description: "Valorant competitive gaming" },
    { slug: "cs-go", name: "CS:GO", description: "Counter-Strike: Global Offensive esports" },
    { slug: "dota-2", name: "Dota 2", description: "Dota 2 competitive gaming" },
    { slug: "olympics-athletics", name: "Olympics / Athletics", description: "Olympic games and athletics" },
    { slug: "martial-arts", name: "Martial Arts", description: "Various martial arts disciplines" },
    { slug: "ufc", name: "UFC", description: "Ultimate Fighting Championship" },
    { slug: "mma", name: "MMA", description: "Mixed Martial Arts" },
    { slug: "boxing", name: "Boxing", description: "Professional boxing matches" },
    { slug: "winter-sports", name: "Winter Sports", description: "Skiing, snowboarding, and winter Olympics" }
  ],
  "Tech & Innovation": [
    { slug: "artificial-intelligence", name: "Artificial Intelligence", description: "AI research, applications, and industry news" },
    { slug: "web-development", name: "Web Development", description: "Web development technologies and frameworks" },
    { slug: "mobile-development", name: "Mobile Development", description: "Mobile app development and technologies" },
    { slug: "cybersecurity", name: "Cybersecurity", description: "Information security and cyber threats" },
    { slug: "blockchain-crypto", name: "Blockchain / Crypto", description: "Blockchain technology and cryptocurrency" },
    { slug: "startups", name: "Startups", description: "Startup companies and entrepreneurship" },
    { slug: "saas-tools", name: "SaaS Tools", description: "Software as a Service tools and platforms" },
    { slug: "gadgets-hardware", name: "Gadgets & Hardware", description: "Technology gadgets and hardware reviews" },
    { slug: "space-tech", name: "Space Tech", description: "Space technology and exploration" },
    { slug: "robotics", name: "Robotics", description: "Robotics and automation technology" },
    { slug: "programming-languages", name: "Programming Languages", description: "Programming language news and tutorials" },
    { slug: "python", name: "Python", description: "Python programming language" },
    { slug: "javascript", name: "JavaScript", description: "JavaScript programming and frameworks" },
    { slug: "rust", name: "Rust", description: "Rust programming language" },
    { slug: "swift", name: "Swift", description: "Swift programming language" },
    { slug: "product-management", name: "Product Management", description: "Product management strategies and tools" },
    { slug: "ux-ui-design", name: "UX/UI Design", description: "User experience and interface design" }
  ],
  "Art & Design": [
    { slug: "digital-art", name: "Digital Art", description: "Digital artwork and creative techniques" },
    { slug: "graphic-design", name: "Graphic Design", description: "Graphic design trends and techniques" },
    { slug: "photography", name: "Photography", description: "Photography tips, gear, and inspiration" },
    { slug: "illustration", name: "Illustration", description: "Illustration art and techniques" },
    { slug: "architecture", name: "Architecture", description: "Architectural design and urban planning" },
    { slug: "fashion-design", name: "Fashion Design", description: "Fashion design and industry trends" },
    { slug: "interior-design", name: "Interior Design", description: "Interior design and home decoration" },
    { slug: "street-art", name: "Street Art", description: "Street art and urban artistic expression" },
    { slug: "animation", name: "Animation", description: "Animation techniques and industry news" },
    { slug: "industrial-design", name: "Industrial Design", description: "Product and industrial design" },
    { slug: "typography", name: "Typography", description: "Typography and font design" },
    { slug: "color-theory", name: "Color Theory", description: "Color theory and application in design" },
    { slug: "design-inspiration", name: "Design Inspiration", description: "Creative inspiration and design showcases" }
  ],
  "Culture & Society": [
    { slug: "philosophy", name: "Philosophy", description: "Philosophical thoughts and discussions" },
    { slug: "anthropology", name: "Anthropology", description: "Cultural anthropology and human societies" },
    { slug: "psychology", name: "Psychology", description: "Psychology research and mental processes" },
    { slug: "sociology", name: "Sociology", description: "Social behavior and society studies" },
    { slug: "gender-identity", name: "Gender & Identity", description: "Gender studies and identity issues" },
    { slug: "religion-spirituality", name: "Religion & Spirituality", description: "Religious studies and spiritual practices" },
    { slug: "language-linguistics", name: "Language & Linguistics", description: "Language studies and linguistics" },
    { slug: "history", name: "History", description: "Historical events and studies" },
    { slug: "ancient-history", name: "Ancient History", description: "Ancient civilizations and historical periods" },
    { slug: "modern-history", name: "Modern History", description: "Modern historical events and analysis" },
    { slug: "war-conflict", name: "War & Conflict", description: "Military history and conflict studies" },
    { slug: "traditions-rituals", name: "Traditions & Rituals", description: "Cultural traditions and ceremonial practices" },
    { slug: "pop-culture", name: "Pop Culture", description: "Popular culture trends and phenomena" },
    { slug: "subcultures", name: "Subcultures", description: "Alternative cultures and communities" }
  ],
  "Finance & Economy": [
    { slug: "stock-market", name: "Stock Market", description: "Stock market news and analysis" },
    { slug: "personal-finance", name: "Personal Finance", description: "Personal financial planning and advice" },
    { slug: "crypto-web3", name: "Crypto & Web3", description: "Cryptocurrency and Web3 technologies" },
    { slug: "financial-news", name: "Financial News", description: "Latest financial and economic news" },
    { slug: "real-estate", name: "Real Estate", description: "Real estate market and investment" },
    { slug: "startups-vc", name: "Startups & VC", description: "Startup funding and venture capital" },
    { slug: "banking-fintech", name: "Banking & Fintech", description: "Banking industry and financial technology" },
    { slug: "side-hustles", name: "Side Hustles", description: "Side business opportunities and income streams" },
    { slug: "economic-theory", name: "Economic Theory", description: "Economic theories and principles" },
    { slug: "taxes-accounting", name: "Taxes & Accounting", description: "Tax planning and accounting practices" },
    { slug: "retirement-planning", name: "Retirement Planning", description: "Retirement savings and planning strategies" }
  ],
  "Education & Learning": [
    { slug: "learning-techniques", name: "Learning Techniques", description: "Effective learning methods and strategies" },
    { slug: "memory-brain-hacks", name: "Memory & Brain Hacks", description: "Memory improvement and cognitive techniques" },
    { slug: "online-courses", name: "Online Courses", description: "Online education and course platforms" },
    { slug: "study-productivity", name: "Study Productivity", description: "Study techniques and productivity methods" },
    { slug: "self-taught-paths", name: "Self-Taught Paths", description: "Self-directed learning approaches" },
    { slug: "lifelong-learning", name: "Lifelong Learning", description: "Continuous education and skill development" },
    { slug: "language-learning", name: "Language Learning", description: "Foreign language acquisition techniques" },
    { slug: "english", name: "English", description: "English language learning and usage" },
    { slug: "spanish", name: "Spanish", description: "Spanish language learning" },
    { slug: "japanese", name: "Japanese", description: "Japanese language and culture" },
    { slug: "mandarin", name: "Mandarin", description: "Mandarin Chinese language learning" },
    { slug: "educational-tech", name: "Educational Tech", description: "Technology in education and learning tools" },
    { slug: "academic-research", name: "Academic Research", description: "Research methodologies and academic studies" }
  ],
  "Entertainment": [
    { slug: "movies", name: "Movies", description: "Film industry news and movie reviews" },
    { slug: "new-releases", name: "New Releases", description: "Latest movie and entertainment releases" },
    { slug: "film-analysis", name: "Film Analysis", description: "Movie criticism and film analysis" },
    { slug: "international-cinema", name: "International Cinema", description: "World cinema and foreign films" },
    { slug: "tv-series", name: "TV Series", description: "Television series and shows" },
    { slug: "netflix", name: "Netflix", description: "Netflix original content and recommendations" },
    { slug: "hbo", name: "HBO", description: "HBO series and premium content" },
    { slug: "anime", name: "Anime", description: "Japanese animation and manga culture" },
    { slug: "celebrities", name: "Celebrities", description: "Celebrity news and entertainment gossip" },
    { slug: "streaming-trends", name: "Streaming Trends", description: "Streaming platform trends and content" },
    { slug: "stand-up-comedy", name: "Stand-Up Comedy", description: "Stand-up comedy and comedians" },
    { slug: "theatre-musicals", name: "Theatre & Musicals", description: "Theatre productions and musical performances" }
  ],
  "Wellness & Lifestyle": [
    { slug: "mental-health", name: "Mental Health", description: "Mental health awareness and support" },
    { slug: "productivity", name: "Productivity", description: "Productivity tips and time management" },
    { slug: "fitness-training", name: "Fitness & Training", description: "Fitness routines and training programs" },
    { slug: "gym-workouts", name: "Gym Workouts", description: "Gym exercises and workout routines" },
    { slug: "home-workouts", name: "Home Workouts", description: "Home fitness and exercise routines" },
    { slug: "running", name: "Running", description: "Running techniques and marathon training" },
    { slug: "nutrition-diet", name: "Nutrition & Diet", description: "Nutritional advice and dietary information" },
    { slug: "mindfulness-meditation", name: "Mindfulness & Meditation", description: "Mindfulness practices and meditation techniques" },
    { slug: "sleep-science", name: "Sleep Science", description: "Sleep research and sleep improvement" },
    { slug: "journaling", name: "Journaling", description: "Journaling techniques and personal reflection" },
    { slug: "biohacking", name: "Biohacking", description: "Biohacking and human optimization" },
    { slug: "longevity", name: "Longevity", description: "Longevity research and healthy aging" }
  ],
  "World & Politics": [
    { slug: "world-news", name: "World News", description: "International news and current events" },
    { slug: "elections", name: "Elections", description: "Electoral processes and political campaigns" },
    { slug: "climate-policy", name: "Climate Policy", description: "Climate change policy and environmental politics" },
    { slug: "diplomacy", name: "Diplomacy", description: "International diplomacy and foreign relations" },
    { slug: "social-justice", name: "Social Justice", description: "Social justice movements and advocacy" },
    { slug: "conflict-zones", name: "Conflict Zones", description: "Global conflicts and crisis regions" },
    { slug: "international-relations", name: "International Relations", description: "Global politics and international affairs" },
    { slug: "geopolitics", name: "Geopolitics", description: "Geopolitical analysis and global strategy" }
  ],
  "Science & Nature": [
    { slug: "astronomy", name: "Astronomy", description: "Space exploration and astronomical discoveries" },
    { slug: "biology", name: "Biology", description: "Biological sciences and life sciences research" },
    { slug: "physics", name: "Physics", description: "Physics research and scientific discoveries" },
    { slug: "chemistry", name: "Chemistry", description: "Chemical research and discoveries" },
    { slug: "neuroscience", name: "Neuroscience", description: "Brain research and neuroscience discoveries" },
    { slug: "environmental-science", name: "Environmental Science", description: "Environmental research and conservation" },
    { slug: "geology", name: "Geology", description: "Earth sciences and geological studies" },
    { slug: "zoology", name: "Zoology", description: "Animal studies and wildlife research" },
    { slug: "oceanography", name: "Oceanography", description: "Marine science and ocean studies" }
  ],
  "DIY & Maker Culture": [
    { slug: "home-improvement", name: "Home Improvement", description: "Home renovation and improvement projects" },
    { slug: "woodworking", name: "Woodworking", description: "Woodworking projects and craftsmanship" },
    { slug: "3d-printing", name: "3D Printing", description: "3D printing technology and projects" },
    { slug: "electronics", name: "Electronics", description: "Electronics projects and circuit design" },
    { slug: "arduino-raspberry-pi", name: "Arduino / Raspberry Pi", description: "Microcontroller and single-board computer projects" },
    { slug: "gardening", name: "Gardening", description: "Gardening tips and plant cultivation" },
    { slug: "repair-culture", name: "Repair Culture", description: "Repair and maintenance of household items" },
    { slug: "recycling-upcycling", name: "Recycling / Upcycling", description: "Sustainable practices and creative reuse" }
  ]
};

export const seedTopics = async () => {
  try {
    console.log('Starting to seed topics...');
    
    // Check if topics already exist
    const { data: existingTopics, error: checkError } = await supabase
      .from('topics')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking existing topics:', checkError);
      throw checkError;
    }

    if (existingTopics && existingTopics.length > 0) {
      console.log('Topics already exist, skipping seed');
      return { success: true, message: 'Topics already exist' };
    }

    // Prepare topics for insertion
    const topicsToInsert = [];
    
    for (const [category, topics] of Object.entries(topicTaxonomy)) {
      for (const topic of topics) {
        topicsToInsert.push({
          slug: topic.slug,
          name: topic.name,
          category: category,
          parent_category: null,
          description: topic.description
        });
      }
    }

    console.log(`Inserting ${topicsToInsert.length} topics...`);

    // Insert topics in batches to avoid hitting limits
    const batchSize = 50;
    for (let i = 0; i < topicsToInsert.length; i += batchSize) {
      const batch = topicsToInsert.slice(i, i + batchSize);
      
      const { error: insertError } = await supabase
        .from('topics')
        .insert(batch);

      if (insertError) {
        console.error('Error inserting topics batch:', insertError);
        throw insertError;
      }
    }

    console.log('Topics seeded successfully!');
    return { success: true, message: 'Topics seeded successfully' };
    
  } catch (error) {
    console.error('Error seeding topics:', error);
    return { success: false, error: error.message };
  }
};
