
export const mockTextSearchResults = [
  {
    id: 1,
    title: "Google Search Engine",
    url: "https://www.google.com",
    description: "Search the world's information, including webpages, images, videos and more.",
    favicon: "https://www.google.com/favicon.ico"
  },
  {
    id: 2,
    title: "Google Images",
    url: "https://images.google.com",
    description: "Google Images. The most comprehensive image search on the web.",
    favicon: "https://www.google.com/favicon.ico"
  },
  {
    id: 3,
    title: "Google Lens",
    url: "https://lens.google.com",
    description: "Search what you see with Google Lens",
    favicon: "https://www.google.com/favicon.ico"
  },
  {
    id: 4,
    title: "Google Photos",
    url: "https://photos.google.com",
    description: "Google Photos is the home for all your photos and videos, automatically organized and easy to share.",
    favicon: "https://www.google.com/favicon.ico"
  },
  {
    id: 5,
    title: "Google Maps",
    url: "https://maps.google.com",
    description: "Find local businesses, view maps and get driving directions in Google Maps.",
    favicon: "https://www.google.com/favicon.ico"
  }
];

export const mockImageSearchResults = {
  visualMatches: [
    {
      id: 1,
      title: "Smartphone Device",
      imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02ff9?q=80&w=300",
      source: "Wikipedia",
      description: "Modern smartphone with touchscreen display"
    },
    {
      id: 2,
      title: "Latest Mobile Phone",
      imageUrl: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=300",
      source: "TechRadar",
      description: "Latest generation smartphone with advanced camera system"
    },
    {
      id: 3,
      title: "Android Device",
      imageUrl: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=300",
      source: "Android Central",
      description: "Android smartphone with professional camera setup"
    }
  ],
  searchResults: [
    {
      title: "What is this object?",
      answer: "Smartphone",
      additionalInfo: "A smartphone is a portable device that combines mobile telephone and computing functions into one unit."
    },
    {
      title: "Popular brands",
      items: ["Apple", "Samsung", "Google", "Xiaomi", "Huawei"]
    },
    {
      title: "Related searches",
      items: ["smartphone reviews", "best smartphones 2025", "smartphone camera comparison", "budget smartphones"]
    }
  ],
  shoppingResults: [
    {
      id: 1,
      title: "iPhone 15 Pro",
      price: "$999",
      imageUrl: "https://images.unsplash.com/photo-1696459196853-04d0587b9c4b?q=80&w=200",
      store: "Apple Store"
    },
    {
      id: 2,
      title: "Samsung Galaxy S24",
      price: "$899",
      imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=200",
      store: "Samsung"
    },
    {
      id: 3,
      title: "Google Pixel 8",
      price: "$799",
      imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=200",
      store: "Google Store"
    }
  ]
};

export const newsArticles = [
  {
    id: 1,
    title: "Google announces new features for Search",
    source: "TechCrunch",
    timeAgo: "2 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200"
  },
  {
    id: 2,
    title: "How AI is transforming image search technology",
    source: "Wired",
    timeAgo: "5 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200"
  },
  {
    id: 3,
    title: "The future of visual search and augmented reality",
    source: "The Verge",
    timeAgo: "1 day ago",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200"
  },
  {
    id: 4,
    title: "New smartphone cameras pushing the boundaries of mobile photography",
    source: "CNET",
    timeAgo: "2 days ago",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200"
  }
];

export const discoverCards = [
  {
    id: 1,
    title: "Top Stories",
    subtitle: "News from around the world",
    color: "bg-google-blue",
    icon: "📰"
  },
  {
    id: 2,
    title: "Weather",
    subtitle: "64°F - Sunny with clouds",
    color: "bg-google-yellow",
    icon: "🌤️"
  },
  {
    id: 3,
    title: "Stocks",
    subtitle: "NASDAQ: +1.2%",
    color: "bg-google-green",
    icon: "📈"
  },
  {
    id: 4,
    title: "Sports",
    subtitle: "NBA Finals tonight",
    color: "bg-google-red",
    icon: "🏀"
  }
];
