// Vercel serverless function for generating GitHub profile cards
export default async function handler(req, res) {
  try {
    const { user, type = '1', theme = 'light', qr = 'true', stats = 'true', bio = 'true', followers = 'true' } = req.query;

    if (!user) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Get GitHub token from environment
    const token = process.env.GICM_TOKEN_KEY;
    
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Card-Maker'
    };
    
    // Add authorization header if token is available
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    // Fetch user data from GitHub API
    const userResponse = await fetch(`https://api.github.com/users/${user}`, {
      headers
    });
    if (!userResponse.ok) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userData = await userResponse.json();

    // Fetch user repositories for stats
    const reposResponse = await fetch(`https://api.github.com/users/${user}/repos?per_page=100`, {
      headers
    });
    const repos = reposResponse.ok ? await reposResponse.json() : [];

    // Calculate stats
    const userStats = {
      totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      totalRepos: userData.public_repos,
      topLanguages: calculateTopLanguages(repos).slice(0, 5)
    };

    // Generate SVG card
    const svgCard = generateSVGCard(userData, userStats, {
      cardType: type,
      theme,
      showQR: qr,
      showStats: stats,
      showBio: bio,
      showFollowers: followers
    });

    // Set headers for SVG response
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    return res.send(svgCard);

  } catch (error) {
    console.error('Error generating card:', error);
    return res.status(500).json({ error: 'Failed to generate card' });
  }
}

// Generate SVG card (no canvas dependency needed)
function generateSVGCard(userData, userStats, options = {}) {
  const {
    cardType = '1',
    theme = 'light',
    showQR = 'true',
    showStats = 'true',
    showBio = 'true',
    showFollowers = 'true'
  } = options;

  // Color schemes based on theme and card type
  const colorSchemes = {
    light: {
      '1': { bg1: '#667eea', bg2: '#764ba2', text: '#1a202c', secondary: '#4a5568', glass: 'rgba(255,255,255,0.2)' },
      '2': { bg1: '#f093fb', bg2: '#f5576c', text: '#1a202c', secondary: '#4a5568', glass: 'rgba(255,255,255,0.2)' },
      '3': { bg1: '#4facfe', bg2: '#00f2fe', text: '#1a202c', secondary: '#4a5568', glass: 'rgba(255,255,255,0.2)' }
    },
    dark: {
      '1': { bg1: '#2d1b69', bg2: '#11998e', text: '#ffffff', secondary: '#a0aec0', glass: 'rgba(255,255,255,0.1)' },
      '2': { bg1: '#8360c3', bg2: '#2ebf91', text: '#ffffff', secondary: '#a0aec0', glass: 'rgba(255,255,255,0.1)' },
      '3': { bg1: '#0f3460', bg2: '#e94560', text: '#ffffff', secondary: '#a0aec0', glass: 'rgba(255,255,255,0.1)' }
    }
  };

  const colors = colorSchemes[theme][cardType] || colorSchemes.light['1'];
  
  // Truncate bio if too long
  const bio = userData.bio ? (userData.bio.length > 100 ? userData.bio.substring(0, 97) + '...' : userData.bio) : '';
  
  const svg = `
    <svg width="800" height="500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.bg1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.bg2};stop-opacity:1" />
        </linearGradient>
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="800" height="500" fill="url(#bgGradient)" rx="20"/>
      
      <!-- Glass morphism overlay -->
      <rect x="40" y="40" width="720" height="420" fill="${colors.glass}" rx="15" stroke="${colors.glass}" stroke-width="1"/>
      
      <!-- Avatar circle -->
      <circle cx="140" cy="140" r="60" fill="${colors.secondary}" opacity="0.3"/>
      <circle cx="140" cy="140" r="55" fill="none" stroke="${colors.text}" stroke-width="2"/>
      <image x="85" y="85" width="110" height="110" href="${userData.avatar_url}" clip-path="circle(55px at 55px 55px)"/>
      
      <!-- Name -->
      <text x="220" y="120" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="${colors.text}">
        ${userData.name || userData.login}
      </text>
      
      <!-- Username -->
      <text x="220" y="150" font-family="Arial, sans-serif" font-size="20" fill="${colors.secondary}">
        @${userData.login}
      </text>
      
      ${showBio === 'true' && bio ? `
      <!-- Bio -->
      <text x="220" y="180" font-family="Arial, sans-serif" font-size="16" fill="${colors.text}">
        ${bio.split(' ').slice(0, 12).join(' ')}
      </text>
      ${bio.split(' ').length > 12 ? `
      <text x="220" y="200" font-family="Arial, sans-serif" font-size="16" fill="${colors.text}">
        ${bio.split(' ').slice(12, 24).join(' ')}
      </text>
      ` : ''}
      ` : ''}
      
      ${showStats === 'true' && userStats ? `
      <!-- Stats Section -->
      <text x="80" y="${showBio === 'true' && bio ? '250' : '210'}" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="${colors.text}">GitHub Stats</text>
      
      <text x="80" y="${showBio === 'true' && bio ? '280' : '240'}" font-family="Arial, sans-serif" font-size="14" fill="${colors.secondary}">
        ⭐ ${userStats.totalStars} stars
      </text>
      <text x="80" y="${showBio === 'true' && bio ? '300' : '260'}" font-family="Arial, sans-serif" font-size="14" fill="${colors.secondary}">
        📚 ${userStats.totalRepos} repos
      </text>
      ${showFollowers === 'true' ? `
      <text x="80" y="${showBio === 'true' && bio ? '320' : '280'}" font-family="Arial, sans-serif" font-size="14" fill="${colors.secondary}">
        👥 ${userData.followers} followers
      </text>
      ` : ''}
      
      ${userStats.topLanguages && userStats.topLanguages.length > 0 ? `
      <!-- Top Languages -->
      <text x="400" y="${showBio === 'true' && bio ? '250' : '210'}" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${colors.text}">Top Languages</text>
      ${userStats.topLanguages.slice(0, 3).map((lang, index) => `
        <text x="400" y="${(showBio === 'true' && bio ? 280 : 240) + (index * 20)}" font-family="Arial, sans-serif" font-size="14" fill="${colors.secondary}">
          ${lang.name}: ${lang.percentage}%
        </text>
      `).join('')}
      ` : ''}
      ` : ''}
      
      ${showQR === 'true' ? `
      <!-- QR Code placeholder -->
      <rect x="650" y="350" width="100" height="100" fill="${colors.text}" rx="5"/>
      <rect x="660" y="360" width="80" height="80" fill="${theme === 'dark' ? '#000000' : '#ffffff'}" rx="3"/>
      <text x="700" y="405" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="${colors.text}">QR</text>
      ` : ''}
      
      <!-- GitHub link -->
      <text x="80" y="470" font-family="Arial, sans-serif" font-size="12" fill="${colors.secondary}">
        github.com/${userData.login}
      </text>
      
      <!-- Decorative elements -->
      <circle cx="750" cy="80" r="30" fill="${colors.glass}" opacity="0.5"/>
      <circle cx="50" cy="450" r="20" fill="${colors.glass}" opacity="0.3"/>
    </svg>
  `;

  return svg;
}

// Helper function to calculate top languages
function calculateTopLanguages(repos) {
  const languages = {};
  let totalSize = 0;

  repos.forEach(repo => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + repo.size;
      totalSize += repo.size;
    }
  });

  return Object.entries(languages)
    .map(([name, size]) => ({
      name,
      percentage: Math.round((size / totalSize) * 100)
    }))
    .sort((a, b) => b.percentage - a.percentage);
}