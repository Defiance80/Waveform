export const artistProfile = {
  name: "Kendrick Cole",
  genre: "Hip-Hop",
  location: "Los Angeles, CA",
  followers: 847000,
  monthlyListeners: 2400000,
  avatar: "/api/placeholder/100/100"
};

export const momentumData = {
  score: 78,
  change: 12,
  topRegion: "Los Angeles, CA",
  direction: "Rising",
  emergingMarkets: 3,
  podcastNetworks: 2
};

export const quickStats = [
  { label: "Total Mentions", value: "2,847", change: "+23%" },
  { label: "Active Markets", value: "8", change: "+2" },
  { label: "Content Velocity", value: "4.2M", change: "+45%" },
  { label: "Revenue Alerts", value: "3", change: "New" }
];

export const podcastMentions = [
  {
    id: 1,
    show: "The Joe Rogan Experience",
    episode: "#2087 - Music Industry Deep Dive",
    timestamp: "1:23:45",
    sentiment: "Positive",
    date: "2024-03-18",
    reach: "11M",
    strength: "Strong"
  },
  {
    id: 2,
    show: "Breakfast Club",
    episode: "Rising Artists to Watch",
    timestamp: "0:45:12",
    sentiment: "Very Positive",
    date: "2024-03-17",
    reach: "8.5M",
    strength: "Strong"
  },
  {
    id: 3,
    show: "Complex Brackets",
    episode: "LA's Next Generation",
    timestamp: "0:12:33",
    sentiment: "Positive",
    date: "2024-03-16",
    reach: "2.1M",
    strength: "Moderate"
  },
  {
    id: 4,
    show: "Rap Caviar Podcast",
    episode: "Underground Heat Check",
    timestamp: "2:01:22",
    sentiment: "Positive",
    date: "2024-03-15",
    reach: "4.7M",
    strength: "Strong"
  },
  {
    id: 5,
    show: "No Jumper",
    episode: "West Coast Scene Check",
    timestamp: "1:15:30",
    sentiment: "Neutral",
    date: "2024-03-14",
    reach: "3.2M",
    strength: "Moderate"
  }
];

export const blogFeatures = [
  {
    id: 1,
    publication: "Pitchfork",
    title: "10 LA Artists Breaking Through",
    reach: "5.2M",
    date: "2024-03-18",
    sentiment: "Positive",
    url: "#"
  },
  {
    id: 2,
    publication: "XXL Magazine",
    title: "Freshman Class Watch List",
    reach: "3.8M",
    date: "2024-03-17",
    sentiment: "Very Positive",
    url: "#"
  },
  {
    id: 3,
    publication: "Complex",
    title: "Who's Next in Hip-Hop",
    reach: "4.1M",
    date: "2024-03-16",
    sentiment: "Positive",
    url: "#"
  },
  {
    id: 4,
    publication: "The Fader",
    title: "Underground Gems",
    reach: "2.9M",
    date: "2024-03-15",
    sentiment: "Positive",
    url: "#"
  }
];

export const cityMomentumData = [
  {
    city: "Los Angeles",
    country: "USA",
    status: "Early Surge",
    growth: "+152%",
    listeners: "78.4K",
    playlistAdds: 47,
    color: "success"
  },
  {
    city: "San Francisco",
    country: "USA",
    status: "Growing",
    growth: "+89%",
    listeners: "32.1K",
    playlistAdds: 19,
    color: "warning"
  },
  {
    city: "Atlanta",
    country: "USA",
    status: "Growing",
    growth: "+67%",
    listeners: "45.2K",
    playlistAdds: 23,
    color: "warning"
  },
  {
    city: "New York",
    country: "USA",
    status: "Rising",
    growth: "+54%",
    listeners: "51.3K",
    playlistAdds: 21,
    color: "blue"
  },
  {
    city: "Houston",
    country: "USA",
    status: "Emerging",
    growth: "+42%",
    listeners: "28.9K",
    playlistAdds: 15,
    color: "blue"
  },
  {
    city: "Chicago",
    country: "USA",
    status: "Stable",
    growth: "+18%",
    listeners: "19.4K",
    playlistAdds: 9,
    color: "primary"
  }
];

export const viralClips = [
  {
    id: 1,
    title: "Late Night Freestyle",
    platforms: ["TikTok", "Instagram", "YouTube"],
    views: "2.3M",
    shares: "87K",
    saves: "45K",
    velocity: "+340%",
    thumbnail: "/api/placeholder/120/80",
    originalPlatform: "TikTok"
  },
  {
    id: 2,
    title: "Studio Session Behind Scenes",
    platforms: ["Instagram", "YouTube", "Twitter"],
    views: "1.8M",
    shares: "62K",
    saves: "38K",
    velocity: "+280%",
    thumbnail: "/api/placeholder/120/80",
    originalPlatform: "Instagram"
  },
  {
    id: 3,
    title: "Unreleased Snippet",
    platforms: ["TikTok", "Instagram"],
    views: "950K",
    shares: "41K",
    saves: "29K",
    velocity: "+190%",
    thumbnail: "/api/placeholder/120/80",
    originalPlatform: "TikTok"
  }
];

export const revenueStreams = [
  {
    platform: "Spotify",
    amount: "$12,847",
    status: "Active",
    growth: "+23%",
    color: "#1DB954"
  },
  {
    platform: "Apple Music",
    amount: "$8,291",
    status: "Active",
    growth: "+18%",
    color: "#FA57C1"
  },
  {
    platform: "YouTube",
    amount: "$4,526",
    status: "Unclaimed",
    growth: "+67%",
    color: "#FF0000"
  },
  {
    platform: "TikTok",
    amount: "$2,847",
    status: "Opportunity",
    growth: "+340%",
    color: "#000000"
  }
];

export const revenueAlerts = [
  {
    id: 1,
    type: "Unclaimed Royalties",
    platform: "YouTube",
    amount: "$4,526",
    description: "Music usage detected but not monetized",
    priority: "High",
    action: "Claim Revenue Stream"
  },
  {
    id: 2,
    type: "Trending Sound",
    platform: "TikTok",
    amount: "$2,847",
    description: "Your sound is trending - 2.3M uses detected",
    priority: "Medium",
    action: "Monetize Sound"
  },
  {
    id: 3,
    type: "Unauthorized Usage",
    platform: "Instagram",
    amount: "$1,234",
    description: "Unauthorized use in viral meme content",
    priority: "Medium",
    action: "Dispute Usage"
  }
];

export const recommendedActions = [
  {
    id: 1,
    title: "Contact 3 blogs that mentioned you this week",
    priority: "High",
    timeframe: "24 hours",
    description: "Pitchfork, XXL, and Complex all featured you - strike while hot",
    category: "Press Relations",
    effort: "Low",
    impact: "High"
  },
  {
    id: 2,
    title: "Upload official remix to capture UGC wave",
    priority: "Medium",
    timeframe: "48 hours",
    description: "Fans are creating unofficial remixes - release the official version",
    category: "Content Strategy",
    effort: "Medium",
    impact: "High"
  },
  {
    id: 3,
    title: "Run LA geo-campaign - window closing in 48hrs",
    priority: "Urgent",
    timeframe: "48 hours",
    description: "Peak momentum detected in Los Angeles market",
    category: "Marketing",
    effort: "High",
    impact: "Very High"
  },
  {
    id: 4,
    title: "Collaborate with emerging West Coast artists",
    priority: "Medium",
    timeframe: "2 weeks",
    description: "Strong signal in LA market - local collaboration opportunity with Blxst, Roddy Ricch",
    category: "Collaboration",
    effort: "High",
    impact: "Medium"
  },
  {
    id: 5,
    title: "Claim YouTube revenue streams",
    priority: "High",
    timeframe: "3 days",
    description: "Over $4K in unclaimed royalties detected",
    category: "Revenue",
    effort: "Low",
    impact: "High"
  }
];

export const recentActivity = [
  {
    id: 1,
    type: "podcast",
    title: "Featured on Breakfast Club",
    description: "Mentioned in 'Rising Artists to Watch' segment",
    time: "2 hours ago",
    impact: "High"
  },
  {
    id: 2,
    type: "social",
    title: "Viral clip spreading",
    description: "Late Night Freestyle hit 100K shares on TikTok",
    time: "4 hours ago",
    impact: "Medium"
  },
  {
    id: 3,
    type: "revenue",
    title: "Revenue alert",
    description: "Unclaimed YouTube royalties detected: $1,234",
    time: "6 hours ago",
    impact: "Medium"
  },
  {
    id: 4,
    type: "geo",
    title: "Market momentum",
    description: "Los Angeles market showing early surge indicators",
    time: "8 hours ago",
    impact: "High"
  }
];

// EVENTS DATA
export const upcomingEvents = [
  {
    id: 1,
    name: "LA Underground Showcase",
    venue: "The Novo at LA Live",
    city: "Los Angeles, CA",
    date: "2024-03-25",
    time: "9:00 PM",
    ticketStatus: "On Sale",
    expectedAttendance: 850,
    ticketsSold: 623,
    ticketPrice: "$25",
    presaleBuzz: 127
  },
  {
    id: 2,
    name: "West Coast Rising Stars",
    venue: "The Roxy",
    city: "West Hollywood, CA",
    date: "2024-03-28",
    time: "7:30 PM",
    ticketStatus: "Confirmed",
    expectedAttendance: 500,
    ticketsSold: 412,
    ticketPrice: "$30",
    presaleBuzz: 89
  },
  {
    id: 3,
    name: "Hip-Hop at The Forum",
    venue: "The Forum",
    city: "Inglewood, CA",
    date: "2024-04-02",
    time: "8:00 PM",
    ticketStatus: "Pre-Sale",
    expectedAttendance: 1200,
    ticketsSold: 234,
    ticketPrice: "$35",
    presaleBuzz: 156
  }
];

export const pastEvents = [
  {
    id: 1,
    name: "Crenshaw Block Party",
    venue: "The Wiltern",
    city: "Los Angeles, CA",
    date: "2024-03-10",
    attendance: 780,
    revenue: "$19,500",
    socialMentions: 2340,
    newFollowers: 456,
    merchSales: "$3,200",
    rating: 4.7,
    roi: "+340%"
  },
  {
    id: 2,
    name: "SoCal Nights",
    venue: "House of Blues",
    city: "Anaheim, CA",
    date: "2024-03-05",
    attendance: 1200,
    revenue: "$36,000",
    socialMentions: 4560,
    newFollowers: 892,
    merchSales: "$8,400",
    rating: 4.9,
    roi: "+520%"
  }
];

// STREET BUZZ DATA
export const streetBuzzData = {
  topCities: [
    {
      name: "Los Angeles",
      state: "CA",
      heatLevel: "hot",
      temperature: 97,
      conversations: 3842,
      hashtagUsage: "+410%",
      playlistAdds: 189,
      radioSpins: 34,
      trafficShare: "38.5%"
    },
    {
      name: "Long Beach",
      state: "CA",
      heatLevel: "warm",
      temperature: 82,
      conversations: 1423,
      hashtagUsage: "+220%",
      playlistAdds: 67,
      radioSpins: 14,
      trafficShare: "14.2%"
    },
    {
      name: "Sacramento",
      state: "CA",
      heatLevel: "warm",
      temperature: 76,
      conversations: 1156,
      hashtagUsage: "+175%",
      playlistAdds: 52,
      radioSpins: 11,
      trafficShare: "11.8%"
    },
    {
      name: "Atlanta",
      state: "GA",
      heatLevel: "warm",
      temperature: 74,
      conversations: 1923,
      hashtagUsage: "+180%",
      playlistAdds: 89,
      radioSpins: 15,
      trafficShare: "18.1%"
    },
    {
      name: "New York",
      state: "NY",
      heatLevel: "emerging",
      temperature: 65,
      conversations: 1734,
      hashtagUsage: "+155%",
      playlistAdds: 78,
      radioSpins: 19,
      trafficShare: "15.6%"
    },
    {
      name: "San Francisco",
      state: "CA",
      heatLevel: "emerging",
      temperature: 62,
      conversations: 987,
      hashtagUsage: "+130%",
      playlistAdds: 41,
      radioSpins: 9,
      trafficShare: "9.4%"
    },
    {
      name: "San Diego",
      state: "CA",
      heatLevel: "emerging",
      temperature: 58,
      conversations: 845,
      hashtagUsage: "+110%",
      playlistAdds: 35,
      radioSpins: 7,
      trafficShare: "7.8%"
    },
    {
      name: "Oakland",
      state: "CA",
      heatLevel: "emerging",
      temperature: 55,
      conversations: 723,
      hashtagUsage: "+95%",
      playlistAdds: 29,
      radioSpins: 6,
      trafficShare: "6.5%"
    },
    {
      name: "Chicago",
      state: "IL",
      heatLevel: "cool",
      temperature: 48,
      conversations: 1456,
      hashtagUsage: "+85%",
      playlistAdds: 56,
      radioSpins: 12,
      trafficShare: "12.3%"
    },
    {
      name: "Houston",
      state: "TX",
      heatLevel: "cool",
      temperature: 45,
      conversations: 967,
      hashtagUsage: "+65%",
      playlistAdds: 34,
      radioSpins: 8,
      trafficShare: "8.8%"
    },
    {
      name: "Miami",
      state: "FL",
      heatLevel: "cool",
      temperature: 42,
      conversations: 654,
      hashtagUsage: "+55%",
      playlistAdds: 23,
      radioSpins: 5,
      trafficShare: "5.2%"
    }
  ]
};

// PR & CAMPAIGNS DATA
export const activeCampaigns = [
  {
    id: 1,
    name: "LA Street Campaign",
    type: "PR",
    status: "Active",
    reach: "2.4M",
    impressions: "8.7M",
    progress: 75,
    budget: "$15,000",
    spent: "$11,250",
    startDate: "2024-03-15",
    endDate: "2024-03-30"
  },
  {
    id: 2,
    name: "TikTok Viral Push",
    type: "Social",
    status: "Planning",
    reach: "1.8M",
    impressions: "5.2M",
    progress: 25,
    budget: "$8,000",
    spent: "$2,000",
    startDate: "2024-03-20",
    endDate: "2024-04-05"
  },
  {
    id: 3,
    name: "Radio Tour - West Coast",
    type: "Radio",
    status: "Active",
    reach: "3.1M",
    impressions: "12.4M",
    progress: 60,
    budget: "$25,000",
    spent: "$15,000",
    startDate: "2024-03-10",
    endDate: "2024-04-10"
  }
];

export const reputationData = {
  sentiment: {
    positive: 78,
    negative: 12,
    neutral: 10
  },
  totalMentions: 4521,
  recentMentions: [
    {
      id: 1,
      source: "Complex",
      content: "Kendrick Cole's latest track shows incredible growth...",
      sentiment: "Positive",
      reach: "2.1M",
      date: "2 hours ago"
    },
    {
      id: 2,
      source: "Twitter",
      content: "@kendrickcole going crazy with this new sound 🔥",
      sentiment: "Positive", 
      reach: "45K",
      date: "4 hours ago"
    }
  ]
};

export const viralMoments = [
  {
    id: 1,
    title: "Late Night Freestyle",
    platform: "TikTok",
    views: "2.3M",
    shares: "87K",
    engagement: "12.4%",
    peakDate: "2024-03-18",
    duration: "ongoing"
  },
  {
    id: 2,
    title: "Studio Behind Scenes",
    platform: "Instagram",
    views: "1.8M",
    shares: "62K",
    engagement: "9.7%",
    peakDate: "2024-03-16",
    duration: "3 days"
  }
];

// SUBMISSIONS DATA
export const blogSubmissions = [
  {
    id: 1,
    name: "Complex",
    genre: "Hip-Hop",
    audienceSize: "5.2M",
    submissionType: "Premiere",
    status: "Not Submitted",
    acceptanceRate: "12%",
    lastUpdate: "Never"
  },
  {
    id: 2,
    name: "XXL Magazine",
    genre: "Rap",
    audienceSize: "3.8M", 
    submissionType: "Feature",
    status: "Under Review",
    acceptanceRate: "8%",
    lastUpdate: "2 days ago"
  },
  {
    id: 3,
    name: "Pitchfork",
    genre: "Hip-Hop",
    audienceSize: "4.1M",
    submissionType: "Review",
    status: "Declined",
    acceptanceRate: "3%",
    lastUpdate: "1 week ago"
  },
  {
    id: 4,
    name: "The FADER",
    genre: "Hip-Hop",
    audienceSize: "2.9M",
    submissionType: "Interview",
    status: "Accepted",
    acceptanceRate: "15%",
    lastUpdate: "3 days ago"
  },
  {
    id: 5,
    name: "HotNewHipHop",
    genre: "Rap",
    audienceSize: "6.7M",
    submissionType: "Premiere",
    status: "Scheduled",
    acceptanceRate: "25%",
    lastUpdate: "1 day ago"
  },
  {
    id: 6,
    name: "Hypebeast",
    genre: "Culture",
    audienceSize: "8.1M",
    submissionType: "Feature",
    status: "Not Submitted", 
    acceptanceRate: "5%",
    lastUpdate: "Never"
  }
];

export const podcastSubmissions = [
  {
    id: 1,
    name: "Drink Champs",
    host: "N.O.R.E. & DJ EFN",
    audienceSize: "2.1M",
    genre: "Hip-Hop",
    status: "Not Submitted",
    bookingRate: "5%"
  },
  {
    id: 2,
    name: "The Breakfast Club",
    host: "Charlamagne & DJ Envy",
    audienceSize: "8.5M",
    genre: "Hip-Hop",
    status: "Submitted",
    bookingRate: "2%"
  },
  {
    id: 3,
    name: "Joe Budden Podcast",
    host: "Joe Budden",
    audienceSize: "1.8M",
    genre: "Hip-Hop",
    status: "Under Review",
    bookingRate: "8%"
  },
  {
    id: 4,
    name: "Brilliant Idiots",
    host: "Charlamagne & Andrew Schulz",
    audienceSize: "1.2M",
    genre: "Comedy/Hip-Hop",
    status: "Not Submitted",
    bookingRate: "12%"
  },
  {
    id: 5,
    name: "Million Dollaz Worth of Game",
    host: "Gillie & Wallo",
    audienceSize: "950K",
    genre: "Hip-Hop",
    status: "Declined",
    bookingRate: "15%"
  }
];

// RANK ASSASSIN DATA
export const competitorData = {
  drake: {
    name: "Drake",
    trendingCities: ["Toronto", "Los Angeles", "New York", "Houston"],
    demographics: {
      age: { "18-24": 35, "25-34": 40, "35-44": 20, "45+": 5 },
      gender: { male: 45, female: 55 },
      platforms: { spotify: 45, apple: 25, tiktok: 20, other: 10 }
    },
    contentTypes: ["Studio Sessions", "Collaborations", "Lifestyle", "Behind Scenes"],
    playlistPlacements: 847,
    engagementRate: 8.7,
    monthlyStreams: "2.1B"
  },
  "j.cole": {
    name: "J. Cole",
    trendingCities: ["Charlotte", "Los Angeles", "Chicago", "Detroit"],
    demographics: {
      age: { "18-24": 45, "25-34": 35, "35-44": 15, "45+": 5 },
      gender: { male: 60, female: 40 },
      platforms: { spotify: 50, apple: 30, tiktok: 10, other: 10 }
    },
    contentTypes: ["Freestyles", "Social Commentary", "Studio Work", "Live Performance"],
    playlistPlacements: 523,
    engagementRate: 12.3,
    monthlyStreams: "1.8B"
  },
  kendricklamar: {
    name: "Kendrick Lamar",
    trendingCities: ["Los Angeles", "Compton", "New York", "Chicago"],
    demographics: {
      age: { "18-24": 38, "25-34": 40, "35-44": 17, "45+": 5 },
      gender: { male: 58, female: 42 },
      platforms: { spotify: 48, apple: 28, tiktok: 14, other: 10 }
    },
    contentTypes: ["Music Videos", "Live Performance", "Social Commentary", "Collaborations"],
    playlistPlacements: 712,
    engagementRate: 11.2,
    monthlyStreams: "1.9B"
  },
  roddyricch: {
    name: "Roddy Ricch",
    trendingCities: ["Los Angeles", "Compton", "Atlanta", "Houston"],
    demographics: {
      age: { "18-24": 48, "25-34": 32, "35-44": 14, "45+": 6 },
      gender: { male: 52, female: 48 },
      platforms: { spotify: 44, apple: 26, tiktok: 22, other: 8 }
    },
    contentTypes: ["Music Videos", "Freestyles", "Behind Scenes", "Lifestyle"],
    playlistPlacements: 389,
    engagementRate: 9.4,
    monthlyStreams: "890M"
  },
  blxst: {
    name: "Blxst",
    trendingCities: ["Los Angeles", "Long Beach", "San Diego", "Oakland"],
    demographics: {
      age: { "18-24": 42, "25-34": 38, "35-44": 15, "45+": 5 },
      gender: { male: 48, female: 52 },
      platforms: { spotify: 46, apple: 30, tiktok: 16, other: 8 }
    },
    contentTypes: ["Music Videos", "Acoustic Sessions", "Behind Scenes", "Collaborations"],
    playlistPlacements: 245,
    engagementRate: 10.8,
    monthlyStreams: "420M"
  },
  metroboomin: {
    name: "Metro Boomin",
    trendingCities: ["Atlanta", "Los Angeles", "New York", "Chicago"],
    demographics: {
      age: { "18-24": 44, "25-34": 36, "35-44": 15, "45+": 5 },
      gender: { male: 55, female: 45 },
      platforms: { spotify: 47, apple: 27, tiktok: 18, other: 8 }
    },
    contentTypes: ["Production Credits", "Music Videos", "Collaborations", "Live Sets"],
    playlistPlacements: 634,
    engagementRate: 9.1,
    monthlyStreams: "1.5B"
  },
  "21savage": {
    name: "21 Savage",
    trendingCities: ["Atlanta", "Los Angeles", "Houston", "New York"],
    demographics: {
      age: { "18-24": 42, "25-34": 37, "35-44": 16, "45+": 5 },
      gender: { male: 56, female: 44 },
      platforms: { spotify: 46, apple: 26, tiktok: 19, other: 9 }
    },
    contentTypes: ["Music Videos", "Freestyles", "Interviews", "Collaborations"],
    playlistPlacements: 478,
    engagementRate: 8.9,
    monthlyStreams: "1.2B"
  },
  future: {
    name: "Future",
    trendingCities: ["Atlanta", "Miami", "Los Angeles", "Houston"],
    demographics: {
      age: { "18-24": 40, "25-34": 38, "35-44": 17, "45+": 5 },
      gender: { male: 54, female: 46 },
      platforms: { spotify: 44, apple: 28, tiktok: 18, other: 10 }
    },
    contentTypes: ["Music Videos", "Lifestyle", "Collaborations", "Studio Sessions"],
    playlistPlacements: 567,
    engagementRate: 8.5,
    monthlyStreams: "1.6B"
  }
};

// CONNECT DATA
export const connectedPlatforms = [
  {
    name: "TikTok",
    connected: true,
    followers: "234K",
    engagementRate: "12.4%",
    lastPost: "2 hours ago",
    growth: "+23%"
  },
  {
    name: "Instagram",
    connected: true,
    followers: "567K", 
    engagementRate: "8.7%",
    lastPost: "1 day ago",
    growth: "+18%"
  },
  {
    name: "Facebook",
    connected: false,
    followers: "0",
    engagementRate: "0%",
    lastPost: "Never",
    growth: "0%"
  },
  {
    name: "Twitter/X",
    connected: true,
    followers: "89K",
    engagementRate: "6.2%",
    lastPost: "6 hours ago",
    growth: "+45%"
  },
  {
    name: "Spotify",
    connected: true,
    followers: "847K",
    engagementRate: "N/A",
    lastPost: "3 days ago",
    growth: "+67%"
  },
  {
    name: "Twitch",
    connected: false,
    followers: "0",
    engagementRate: "0%", 
    lastPost: "Never",
    growth: "0%"
  },
  {
    name: "YouTube",
    connected: true,
    followers: "456K",
    engagementRate: "15.2%",
    lastPost: "5 days ago",
    growth: "+89%"
  }
];

export const twitchStreamers = [
  { name: "xQc", platform: "Twitch", followers: "11.2M", genre: "Variety", handle: "@xqcow" },
  { name: "Kai Cenat", platform: "Twitch", followers: "4.8M", genre: "Entertainment", handle: "@kaicenat" },
  { name: "Adin Ross", platform: "Twitch", followers: "3.2M", genre: "Just Chatting", handle: "@adinross" },
  { name: "IShowSpeed", platform: "YouTube", followers: "18.9M", genre: "Gaming", handle: "@ishowspeed" },
  { name: "Pokimane", platform: "Twitch", followers: "9.3M", genre: "Variety", handle: "@pokimane" },
  { name: "HasanAbi", platform: "Twitch", followers: "2.1M", genre: "Just Chatting", handle: "@hasanabi" },
  { name: "Myth", platform: "Twitch", followers: "7.4M", genre: "Gaming", handle: "@myth" },
  { name: "Summit1g", platform: "Twitch", followers: "6.1M", genre: "Gaming", handle: "@summit1g" },
  { name: "Shroud", platform: "Twitch", followers: "10.1M", genre: "FPS", handle: "@shroud" },
  { name: "TimTheTatman", platform: "Twitch", followers: "4.2M", genre: "Variety", handle: "@timthetatman" },
  { name: "DrLupo", platform: "Twitch", followers: "4.5M", genre: "Gaming", handle: "@drlupo" },
  { name: "NICKMERCS", platform: "Twitch", followers: "6.7M", genre: "FPS", handle: "@nickmercs" },
  { name: "Sykkuno", platform: "Twitch", followers: "4.0M", genre: "Variety", handle: "@sykkuno" },
  { name: "Valkyrae", platform: "YouTube", followers: "3.9M", genre: "Gaming", handle: "@valkyrae" },
  { name: "CouRage", platform: "YouTube", followers: "3.5M", genre: "Gaming", handle: "@courage" }
];

// DASHBOARD MINI-WIDGETS DATA
export const dashboardWidgets = {
  streetBuzz: {
    topCities: ["Los Angeles", "Long Beach", "Sacramento"]
  },
  upcomingEvents: [
    { name: "LA Underground Showcase", date: "Mar 25", venue: "The Novo at LA Live" },
    { name: "West Coast Rising Stars", date: "Mar 28", venue: "The Roxy" }
  ],
  submissionStatus: {
    pending: 3,
    accepted: 2, 
    published: 1
  }
};