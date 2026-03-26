// Vercel serverless function for generating GitHub profile cards
import chromium from '@sparticuz/chromium';
import { chromium as playwrightChromium } from 'playwright';

export default async function handler(req, res) {
  try {
    const {
      user,
      type,
      card,
      theme = 'light',
      mode = 'light',
      qr = 'true',
      stats = 'true',
      bio = 'true',
      followers = 'true'
    } = req.query;
    const cardType = String(type || card || '1');

    if (!user) {
      return sendErrorCard(res, 'Username is required', 400);
    }

    const forwardedProto = req.headers['x-forwarded-proto'];
    const forwardedHost = req.headers['x-forwarded-host'];
    const host = forwardedHost || req.headers.host;
    const protocol = forwardedProto || 'https';
    const baseUrl = process.env.RENDER_BASE_URL || `${protocol}://${host}`;

    const params = new URLSearchParams({
      user,
      type: cardType,
      theme,
      mode,
      qr,
      stats,
      bio,
      followers,
      showEmail: req.query.showEmail || 'true',
      showTwitter: req.query.showTwitter || 'true',
      showHireable: req.query.showHireable || 'true',
      showGists: req.query.showGists || 'true',
      showJoinDate: req.query.showJoinDate || 'true',
      showLocation: req.query.showLocation || 'true',
      showCompany: req.query.showCompany || 'true',
      showBlog: req.query.showBlog || 'true',
      showTotalForks: req.query.showTotalForks || 'true',
      showTotalIssues: req.query.showTotalIssues || 'true',
      showTotalPRs: req.query.showTotalPRs || 'true',
      showContributionYears: req.query.showContributionYears || 'true',
      showMostStarredRepo: req.query.showMostStarredRepo || 'true',
      showRecentActivity: req.query.showRecentActivity || 'true',
      showOrganizations: req.query.showOrganizations || 'true',
      showTopRepositories: req.query.showTopRepositories || 'true'
    });
    const renderUrl = `${baseUrl}/render/card?${params.toString()}`;

    const isVercel = !!process.env.VERCEL;
    const launchOptions = isVercel
      ? {
          args: chromium.args,
          executablePath: await chromium.executablePath(),
          headless: true
        }
      : {
          headless: true
        };

    const browser = await playwrightChromium.launch(launchOptions);
    try {
      const page = await browser.newPage({
        viewport: { width: 600, height: 800 },
        deviceScaleFactor: 2
      });

      await page.goto(renderUrl, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForSelector('#render-card', { timeout: 20000 });
      await page.waitForFunction(
        () => Array.from(document.images).every((img) => img.complete),
        { timeout: 20000 }
      );

      const cardElement = await page.$('#render-card');
      if (!cardElement) {
        throw new Error('Card render container not found');
      }

      const image = await cardElement.screenshot({ type: 'png' });

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.send(image);
    } finally {
      await browser.close();
    }

  } catch (error) {
    console.error('Error generating card:', error);
    return sendErrorCard(res, error?.message || 'Failed to generate card', 500);
  }
}

function sendErrorCard(res, message, statusCode) {
  const svg = `
    <svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#1f2937;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#374151;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="200" fill="url(#bg)" rx="16" />
      <text x="40" y="90" font-family="Arial, sans-serif" font-size="24" fill="#f9fafb" font-weight="bold">
        GitHub Card Error
      </text>
      <text x="40" y="130" font-family="Arial, sans-serif" font-size="16" fill="#e5e7eb">
        ${message}
      </text>
    </svg>
  `;

  res.status(statusCode || 500);
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.send(svg);
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

  const safeUser = userData || {};
  const safeStats = userStats || {};
  const topLanguages = safeStats?.topLanguages || [];
  const recentActivity = safeStats?.recentActivity || [];
  const mostStarredRepo = safeStats?.mostStarredRepo || null;
  const login = safeUser?.login || 'N/A';
  const name = safeUser?.name || login || 'N/A';
  const followers = safeUser?.followers || 0;
  const avatarUrl = safeUser?.avatar_url || '';
  const totalStars = safeStats?.totalStars || 0;
  const totalRepos = safeStats?.totalRepos || 0;

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

  const themeKey = colorSchemes[theme] ? theme : 'light';
  const typeKey = String(cardType || '1');
  const colors = colorSchemes[themeKey][typeKey] || colorSchemes[themeKey]['1'];
  
  // Truncate bio if too long
  const bio = safeUser?.bio
    ? safeUser.bio.length > 100
      ? safeUser.bio.substring(0, 97) + '...'
      : safeUser.bio
    : '';
  
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
      <image x="85" y="85" width="110" height="110" href="${avatarUrl}" clip-path="circle(55px at 55px 55px)"/>
      
      <!-- Name -->
      <text x="220" y="120" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="${colors.text}">
        ${name}
      </text>
      
      <!-- Username -->
      <text x="220" y="150" font-family="Arial, sans-serif" font-size="20" fill="${colors.secondary}">
        @${login}
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
        ⭐ ${totalStars} stars
      </text>
      <text x="80" y="${showBio === 'true' && bio ? '300' : '260'}" font-family="Arial, sans-serif" font-size="14" fill="${colors.secondary}">
        📚 ${totalRepos} repos
      </text>
      ${showFollowers === 'true' ? `
      <text x="80" y="${showBio === 'true' && bio ? '320' : '280'}" font-family="Arial, sans-serif" font-size="14" fill="${colors.secondary}">
        👥 ${followers} followers
      </text>
      ` : ''}
      
      ${Array.isArray(topLanguages) && topLanguages.length > 0 ? `
      <!-- Top Languages -->
      <text x="400" y="${showBio === 'true' && bio ? '250' : '210'}" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${colors.text}">Top Languages</text>
      ${topLanguages.slice(0, 3).map((lang, index) => `
        <text x="400" y="${(showBio === 'true' && bio ? 280 : 240) + (index * 20)}" font-family="Arial, sans-serif" font-size="14" fill="${colors.secondary}">
          ${lang?.name || 'N/A'}: ${lang?.percentage || 0}%
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
        github.com/${login}
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
    if (repo?.language) {
      languages[repo.language] = (languages[repo.language] || 0) + (repo?.size || 0);
      totalSize += repo?.size || 0;
    }
  });

  if (totalSize === 0) {
    return [];
  }

  return Object.entries(languages)
    .map(([name, size]) => ({
      name: name || 'N/A',
      percentage: Math.round(((size || 0) / totalSize) * 100)
    }))
    .sort((a, b) => b.percentage - a.percentage);
}// Environment variable configured
