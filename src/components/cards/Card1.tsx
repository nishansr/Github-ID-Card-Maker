import React from "react";
import githubLogo from "../../assets/logo/github.png";
import { useTheme } from "../../contexts/ThemeContext";

interface CardProps {
  userData: {
    avatar_url: string;
    name: string;
    login: string;
    bio: string;
    html_url: string;
    public_repos: number;
    followers: number;
    following: number;
  };
  userStats?: {
    totalStars: number;
    topLanguages: [string, number][];
    totalRepos: number;
  };
  qrCode?: string;
  cardTheme?: string; // Add cardTheme prop
  options?: {
    showQR: boolean;
    showStats: boolean;
    showBio: boolean;
    showFollowers: boolean;
  };
}

const Card1: React.FC<CardProps> = ({ userData, userStats: _userStats, qrCode: _qrCode, cardTheme: _cardTheme, options: _options }) => {
  const { getCardThemeData } = useTheme();
  
  // Get the theme data based on the selected card theme
  const themeData = getCardThemeData();
  let bio = "";
  if (userData.bio != null) {
    bio =
      userData.bio.length > 120
        ? userData.bio.substring(0, 120) + "..."
        : userData.bio;
  } else {
    bio = "No bio available";
  }

  return (
    <div 
      className="relative w-full max-w-md mx-auto rounded-2xl shadow-2xl overflow-hidden"
      style={{ 
        background: themeData.background,
        border: `2px solid ${themeData.border}`
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{ background: `linear-gradient(135deg, ${themeData.ring}, ${themeData.fire})` }}
        ></div>
        <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full opacity-5"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full opacity-5"></div>
      </div>

      {/* Header Section */}
      <div className="relative p-6 pb-0">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <img
            src={githubLogo}
            alt="Github Logo"
            className="w-8 h-8 opacity-80"
          />
        </div>

        {/* Profile Section */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <img
              src={userData.avatar_url}
              alt={userData.name}
              className="w-20 h-20 rounded-2xl border-3 border-white/20 shadow-xl"
            />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-900"></div>
          </div>
          <div className="flex-1">
            <h3 
              className="text-xl font-bold mb-1 truncate"
              style={{ color: themeData.currStreakNum }}
            >
              {userData.name || userData.login}
            </h3>
            <p 
              className="text-sm mb-2"
              style={{ color: themeData.sideLabels }}
            >
              @{userData.login}
            </p>
            <div className="flex items-center space-x-2">
              <div 
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: `${themeData.ring}30` }}
              >
                <span 
                  className="text-xs"
                  style={{ color: themeData.currStreakLabel }}
                >
                  Developer
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div 
              className="backdrop-blur-sm rounded-xl p-3"
              style={{ 
                backgroundColor: `${themeData.background}40`,
                border: `1px solid ${themeData.stroke}`
              }}
            >
              <p 
                className="text-2xl font-bold"
                style={{ color: themeData.currStreakNum }}
              >
                {userData.public_repos}
              </p>
              <p 
                className="text-xs uppercase tracking-wide"
                style={{ color: themeData.sideLabels }}
              >
                Repos
              </p>
            </div>
          </div>
          <div className="text-center">
            <div 
              className="backdrop-blur-sm rounded-xl p-3"
              style={{ 
                backgroundColor: `${themeData.background}40`,
                border: `1px solid ${themeData.stroke}`
              }}
            >
              <p 
                className="text-2xl font-bold"
                style={{ color: themeData.currStreakNum }}
              >
                {userData.followers}
              </p>
              <p 
                className="text-xs uppercase tracking-wide"
                style={{ color: themeData.sideLabels }}
              >
                Followers
              </p>
            </div>
          </div>
          <div className="text-center">
            <div 
              className="backdrop-blur-sm rounded-xl p-3"
              style={{ 
                backgroundColor: `${themeData.background}40`,
                border: `1px solid ${themeData.stroke}`
              }}
            >
              <p 
                className="text-2xl font-bold"
                style={{ color: themeData.currStreakNum }}
              >
                {userData.following}
              </p>
              <p 
                className="text-xs uppercase tracking-wide"
                style={{ color: themeData.sideLabels }}
              >
                Following
              </p>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div 
          className="backdrop-blur-sm rounded-xl p-4"
          style={{ 
            backgroundColor: `${themeData.background}20`,
            border: `1px solid ${themeData.stroke}`
          }}
        >
          <p 
            className="text-sm leading-relaxed"
            style={{ color: themeData.dates }}
          >
            {bio}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Active on GitHub</span>
            </div>
            <div className="text-xs text-gray-500">ID Card</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card1;
