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
    // Extended profile data
    email?: string;
    twitter_username?: string;
    hireable?: boolean;
    public_gists: number;
    created_at: string;
    location?: string;
    company?: string;
    blog?: string;
    updated_at: string;
    type: string;
  };
  userStats?: {
    totalStars: number;
    topLanguages: [string, number][];
    totalRepos: number;
    totalForks: number;
    totalIssues: number;
    totalPullRequests: number;
    contributionYears: number[];
    mostStarredRepo?: {
      name: string;
      stars: number;
      language: string;
    };
    recentActivity: {
      type: string;
      repo: string;
      date: string;
    }[];
  };
  userOrganizations?: {
    login: string;
    avatar_url: string;
    description: string;
  }[];
  userRepositories?: {
    name: string;
    description: string;
    language: string;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    html_url: string;
    topics: string[];
  }[];
  qrCode?: string;
  cardTheme?: string;
  options?: {
    showQR: boolean;
    showStats: boolean;
    showBio: boolean;
    showFollowers: boolean;
    // Extended profile data
    showEmail?: boolean;
    showTwitter?: boolean;
    showHireable?: boolean;
    showGists?: boolean;
    showJoinDate?: boolean;
    showLocation?: boolean;
    showCompany?: boolean;
    showBlog?: boolean;
    // Advanced statistics
    showTotalForks?: boolean;
    showTotalIssues?: boolean;
    showTotalPRs?: boolean;
    showContributionYears?: boolean;
    showMostStarredRepo?: boolean;
    showRecentActivity?: boolean;
    showOrganizations?: boolean;
    showTopRepositories?: boolean;
  };
}

const Card2: React.FC<CardProps> = ({
  userData,
  userOrganizations = [],
  userRepositories = [],
  options,
}) => {
  const { getCardThemeData } = useTheme();

  // Get the theme data based on the selected card theme
  const themeData = getCardThemeData();
  
  // Enhanced bio handling with better error checking
  let bio = "";
  if (userData?.bio && typeof userData.bio === 'string') {
    bio = userData.bio.trim();
    if (bio.length > 120) {
      bio = bio.substring(0, 120) + "...";
    }
  } else {
    bio = "No bio available";
  }

  return (
    <div
      className="relative w-full max-w-md mx-auto rounded-3xl shadow-2xl overflow-hidden"
      style={{
        background: themeData.background,
        border: `1px solid ${themeData.border}`,
      }}
    >
      {/* Header with gradient */}
      <div
        className="relative h-32 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${themeData.ring}, ${themeData.fire})`,
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
          <img src={githubLogo} alt="Github Logo" className="w-6 h-6" />
        </div>

        {/* Extended Profile Information */}
        {(options?.showLocation ||
          options?.showCompany ||
          options?.showEmail ||
          options?.showTwitter ||
          options?.showBlog ||
          options?.showHireable ||
          options?.showJoinDate) && (
          <div className="mb-6">
            <div
              className="rounded-2xl p-4 border"
              style={{
                background: `linear-gradient(135deg, ${themeData.ring}10, ${themeData.fire}10)`,
                borderColor: themeData.border,
              }}
            >
              <h4
                className="text-sm font-semibold mb-3"
                style={{ color: themeData.sideNums }}
              >
                Profile Details
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {options?.showLocation && userData.location && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs">📍</span>
                    <span
                      className="text-xs truncate"
                      style={{ color: themeData.dates }}
                    >
                      {userData.location}
                    </span>
                  </div>
                )}
                {options?.showCompany && userData.company && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs">🏢</span>
                    <span
                      className="text-xs truncate"
                      style={{ color: themeData.dates }}
                    >
                      {userData.company}
                    </span>
                  </div>
                )}
                {options?.showEmail && userData.email && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs">📧</span>
                    <span
                      className="text-xs truncate"
                      style={{ color: themeData.dates }}
                    >
                      {userData.email}
                    </span>
                  </div>
                )}
                {options?.showTwitter && userData.twitter_username && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs">🐦</span>
                    <span
                      className="text-xs truncate"
                      style={{ color: themeData.dates }}
                    >
                      @{userData.twitter_username}
                    </span>
                  </div>
                )}
                {options?.showBlog && userData.blog && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs">🌐</span>
                    <span
                      className="text-xs truncate"
                      style={{ color: themeData.dates }}
                    >
                      {userData.blog}
                    </span>
                  </div>
                )}
                {options?.showHireable && userData.hireable !== null && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs">
                      {userData.hireable ? "✅" : "❌"}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: themeData.dates }}
                    >
                      {userData.hireable ? "Available" : "Not available"}
                    </span>
                  </div>
                )}
                {options?.showJoinDate && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs">📅</span>
                    <span
                      className="text-xs"
                      style={{ color: themeData.dates }}
                    >
                      {new Date(userData.created_at).getFullYear()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Organizations */}
        {options?.showOrganizations && userOrganizations.length > 0 && (
          <div className="mb-6">
            <div
              className="rounded-2xl p-4 border"
              style={{
                background: `linear-gradient(135deg, ${themeData.ring}10, ${themeData.fire}10)`,
                borderColor: themeData.border,
              }}
            >
              <h4
                className="text-sm font-semibold mb-3"
                style={{ color: themeData.sideNums }}
              >
                Organizations
              </h4>
              <div className="flex flex-wrap gap-2">
                {userOrganizations.slice(0, 4).map((org, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-1 px-2 py-1 rounded-full border"
                    style={{
                      backgroundColor: `${themeData.ring}20`,
                      borderColor: themeData.border,
                    }}
                  >
                    <img
                      src={org.avatar_url}
                      alt={org.login}
                      className="w-3 h-3 rounded-full"
                    />
                    <span
                      className="text-xs"
                      style={{ color: themeData.dates }}
                    >
                      {org.login}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Top Repositories */}
        {options?.showTopRepositories && userRepositories.length > 0 && (
          <div className="mb-6">
            <div
              className="rounded-2xl p-4 border"
              style={{
                background: `linear-gradient(135deg, ${themeData.ring}10, ${themeData.fire}10)`,
                borderColor: themeData.border,
              }}
            >
              <h4
                className="text-sm font-semibold mb-3"
                style={{ color: themeData.sideNums }}
              >
                Top Repositories
              </h4>
              <div className="space-y-2">
                {userRepositories.slice(0, 3).map((repo, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-medium truncate"
                        style={{ color: themeData.sideNums }}
                      >
                        {repo.name}
                      </p>
                      {repo.language && (
                        <p
                          className="text-xs"
                          style={{ color: themeData.dates }}
                        >
                          {repo.language}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs">⭐</span>
                      <span
                        className="text-xs"
                        style={{ color: themeData.dates }}
                      >
                        {repo.stargazers_count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>

      {/* Profile Image */}
      <div className="relative -mt-16 flex justify-center">
        <div className="relative">
          <img
            src={userData.avatar_url}
            alt={userData.name}
            className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-xl"
          />
          <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-3 border-white dark:border-gray-800 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 pt-4">
        {/* Name and Username */}
        <div className="text-center mb-6">
          <h3
            className="text-2xl font-bold mb-1"
            style={{ color: themeData.currStreakNum }}
          >
            {userData.name || userData.login}
          </h3>
          <p className="mb-3" style={{ color: themeData.dates }}>
            @{userData.login}
          </p>

          {/* Badge */}
          <div
            className="inline-flex items-center px-3 py-1 rounded-full border"
            style={{
              background: `linear-gradient(135deg, ${themeData.ring}20, ${themeData.fire}20)`,
              borderColor: themeData.ring,
            }}
          >
            <div
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: themeData.ring }}
            ></div>
            <span
              className="text-sm font-medium"
              style={{ color: themeData.ring }}
            >
              GitHub Developer
            </span>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <div
            className="rounded-2xl p-4 border"
            style={{
              backgroundColor: themeData.background,
              borderColor: themeData.border,
            }}
          >
            <p
              className="text-sm leading-relaxed text-center"
              style={{ color: themeData.dates }}
            >
              {bio}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div
              className="rounded-2xl p-4 border"
              style={{
                background: `linear-gradient(135deg, ${themeData.ring}10, ${themeData.fire}10)`,
                borderColor: themeData.border,
              }}
            >
              <p
                className="text-2xl font-bold"
                style={{ color: themeData.sideNums }}
              >
                {userData.public_repos}
              </p>
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: themeData.sideLabels }}
              >
                Repositories
              </p>
            </div>
          </div>
          <div className="text-center">
            <div
              className="rounded-2xl p-4 border"
              style={{
                background: `linear-gradient(135deg, ${themeData.ring}10, ${themeData.fire}10)`,
                borderColor: themeData.border,
              }}
            >
              <p
                className="text-2xl font-bold"
                style={{ color: themeData.sideNums }}
              >
                {userData.followers}
              </p>
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: themeData.sideLabels }}
              >
                Followers
              </p>
            </div>
          </div>
          <div className="text-center">
            <div
              className="rounded-2xl p-4 border"
              style={{
                background: `linear-gradient(135deg, ${themeData.ring}10, ${themeData.fire}10)`,
                borderColor: themeData.border,
              }}
            >
              <p
                className="text-2xl font-bold"
                style={{ color: themeData.sideNums }}
              >
                {userData.following}
              </p>
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: themeData.sideLabels }}
              >
                Following
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-4 border-t"
          style={{ borderColor: themeData.border }}
        >
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: themeData.ring }}
              ></div>
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: themeData.fire,
                  animationDelay: "0.2s",
                }}
              ></div>
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: themeData.currStreakLabel,
                  animationDelay: "0.4s",
                }}
              ></div>
            </div>
            <span className="text-xs" style={{ color: themeData.dates }}>
              Active Developer
            </span>
          </div>
          <div
            className="text-xs font-mono"
            style={{ color: themeData.excludeDaysLabel }}
          >
            #{userData.login.slice(0, 6).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card2;
