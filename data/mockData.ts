export const artistProfile = {
  name: "Kendrick Cole",
  genre: "Hip-Hop",
  location: "Atlanta, GA",
  followers: 847000,
  monthlyListeners: 2400000,
  avatar: "/api/placeholder/100/100"
};

export const momentumData = {
  score: 78,
  change: 12,
  topRegion: "Atlanta, GA",
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
    episode: "Atlanta's Next Generation",
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
    episode: "ATL Scene Check",
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
    title: "10 Atlanta Artists Breaking Through",
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
    city: "Atlanta",
    country: "USA",
    status: "Early Surge",
    growth: "+127%",
    listeners: "45.2K",
    playlistAdds: 23,
    color: "success"
  },
  {
    city: "Houston",
    country: "USA",
    status: "Growing",
    growth: "+67%",
    listeners: "32.1K",
    playlistAdds: 15,
    color: "warning"
  },
  {
    city: "London",
    country: "UK",
    status: "Dormant",
    growth: "-12%",
    listeners: "8.7K",
    playlistAdds: 3,
    color: "secondary"
  },
  {
    city: "Lagos",
    country: "Nigeria",
    status: "Emerging",
    growth: "+234%",
    listeners: "28.9K",
    playlistAdds: 18,
    color: "blue"
  },
  {
    city: "Los Angeles",
    country: "USA",
    status: "Stable",
    growth: "+8%",
    listeners: "51.3K",
    playlistAdds: 12,
    color: "primary"
  },
  {
    city: "Toronto",
    country: "Canada",
    status: "Rising",
    growth: "+89%",
    listeners: "19.4K",
    playlistAdds: 9,
    color: "blue"
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
    title: "Run Atlanta geo-campaign - window closing in 48hrs",
    priority: "Urgent",
    timeframe: "48 hours",
    description: "Peak momentum detected in Atlanta market",
    category: "Marketing",
    effort: "High",
    impact: "Very High"
  },
  {
    id: 4,
    title: "Collaborate with emerging Lagos artists",
    priority: "Medium",
    timeframe: "2 weeks",
    description: "Strong signal in Nigerian market - local collaboration opportunity",
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
    description: "Atlanta market showing early surge indicators",
    time: "8 hours ago",
    impact: "High"
  }
];