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

const Card3: React.FC<CardProps> = ({
  userData,
  userOrganizations = [],
  userRepositories = [],
  options,
}) => {
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
      className="relative w-full max-w-md mx-auto rounded-3xl shadow-2xl overflow-hidden border"
      style={{
        background: `linear-gradient(135deg, ${themeData.background}, ${themeData.ring}10)`,
        borderColor: themeData.border,
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-full"
          style={{
            background: `linear-gradient(to bottom left, ${themeData.ring}50, transparent)`,
          }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-32 h-32 rounded-full"
          style={{
            background: `linear-gradient(to top right, ${themeData.fire}50, transparent)`,
          }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-20"
          style={{
            background: `linear-gradient(to right, ${themeData.ring}30, ${themeData.fire}30)`,
          }}
        ></div>
      </div>

      {/* Header */}
      <div className="relative p-6 pb-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(to right, ${themeData.ring}, ${themeData.fire})`,
              }}
            >
              <img
                src={githubLogo}
                alt="Github Logo"
                className="w-6 h-6 filter brightness-0 invert"
              />
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
                  className="backdrop-blur-sm rounded-2xl p-4 border"
                  style={{
                    backgroundColor: `${themeData.background}70`,
                    borderColor: `${themeData.border}50`,
                  }}
                >
                  <h4
                    className="text-sm font-semibold mb-3"
                    style={{ color: themeData.sideNums }}
                  >
                    Profile Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {options?.showLocation && userData.location && (
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{
                            background: `linear-gradient(to right, ${themeData.ring}, ${themeData.fire})`,
                          }}
                        >
                          <span className="text-xs text-white">📍</span>
                        </div>
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
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{
                            background: `linear-gradient(to right, ${themeData.ring}, ${themeData.fire})`,
                          }}
                        >
                          <span className="text-xs text-white">🏢</span>
                        </div>
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
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{
                            background: `linear-gradient(to right, ${themeData.ring}, ${themeData.fire})`,
                          }}
                        >
                          <span className="text-xs text-white">📧</span>
                        </div>
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
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{
                            background: `linear-gradient(to right, ${themeData.ring}, ${themeData.fire})`,
                          }}
                        >
                          <span className="text-xs text-white">🐦</span>
                        </div>
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
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{
                            background: `linear-gradient(to right, ${themeData.ring}, ${themeData.fire})`,
                          }}
                        >
                          <span className="text-xs text-white">🌐</span>
                        </div>
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
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{
                            background: `linear-gradient(to right, ${themeData.ring}, ${themeData.fire})`,
                          }}
                        >
                          <span className="text-xs text-white">
                            {userData.hireable ? "✅" : "❌"}
                          </span>
                        </div>
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
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{
                            background: `linear-gradient(to right, ${themeData.ring}, ${themeData.fire})`,
                          }}
                        >
                          <span className="text-xs text-white">📅</span>
                        </div>
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
                  className="backdrop-blur-sm rounded-2xl p-4 border"
                  style={{
                    backgroundColor: `${themeData.background}70`,
                    borderColor: `${themeData.border}50`,
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
                        className="flex items-center space-x-2 px-3 py-2 rounded-xl border"
                        style={{
                          backgroundColor: `${themeData.background}50`,
                          borderColor: `${themeData.border}30`,
                        }}
                      >
                        <img
                          src={org.avatar_url}
                          alt={org.login}
                          className="w-4 h-4 rounded-full"
                        />
                        <span
                          className="text-xs font-medium"
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
                  className="backdrop-blur-sm rounded-2xl p-4 border"
                  style={{
                    backgroundColor: `${themeData.background}70`,
                    borderColor: `${themeData.border}50`,
                  }}
                >
                  <h4
                    className="text-sm font-semibold mb-3"
                    style={{ color: themeData.sideNums }}
                  >
                    Top Repositories
                  </h4>
                  <div className="space-y-3">
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
                            <div className="flex items-center space-x-1 mt-1">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: themeData.ring }}
                              ></div>
                              <span
                                className="text-xs"
                                style={{ color: themeData.dates }}
                              >
                                {repo.language}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            style={{ color: themeData.fire }}
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span
                            className="text-xs font-medium"
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
            <div>
              <h4
                className="text-sm font-semibold"
                style={{ color: themeData.currStreakLabel }}
              >
                GitHub Profile
              </h4>
              <p className="text-xs" style={{ color: themeData.sideLabels }}>
                Developer Card
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: themeData.ring }}
            ></div>
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: themeData.fire }}
            ></div>
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: themeData.currStreakLabel }}
            ></div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="flex items-start space-x-4 mb-6">
          <div className="relative flex-shrink-0">
            <div
              className="w-20 h-20 rounded-2xl p-1"
              style={{
                background: `linear-gradient(to right, ${themeData.ring}, ${themeData.fire})`,
              }}
            >
              <img
                src={userData.avatar_url}
                alt={userData.name}
                className="w-full h-full rounded-xl object-cover"
              />
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 flex items-center justify-center"
              style={{
                backgroundColor: themeData.ring,
                borderColor: themeData.background,
              }}
            >
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className="text-xl font-bold mb-1 truncate"
              style={{ color: themeData.currStreakNum }}
            >
              {userData.name || userData.login}
            </h3>
            <p className="text-sm mb-2" style={{ color: themeData.dates }}>
              @{userData.login}
            </p>

            {/* Skills/Tags */}
            <div className="flex flex-wrap gap-2">
              <span
                className="px-2 py-1 text-xs rounded-full font-medium"
                style={{
                  backgroundColor: `${themeData.ring}20`,
                  color: themeData.currStreakLabel,
                }}
              >
                Developer
              </span>
              <span
                className="px-2 py-1 text-xs rounded-full font-medium"
                style={{
                  backgroundColor: `${themeData.fire}20`,
                  color: themeData.sideLabels,
                }}
              >
                Open Source
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="px-6 mb-6">
        <div
          className="backdrop-blur-sm rounded-2xl p-4 border"
          style={{
            backgroundColor: `${themeData.background}60`,
            borderColor: `${themeData.border}50`,
          }}
        >
          <p
            className="text-sm leading-relaxed"
            style={{ color: themeData.dates }}
          >
            {bio}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div
            className="backdrop-blur-sm rounded-2xl p-4 text-center border"
            style={{
              backgroundColor: `${themeData.background}70`,
              borderColor: `${themeData.border}50`,
            }}
          >
            <div
              className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center"
              style={{
                background: `linear-gradient(to right, ${themeData.ring}, ${themeData.fire})`,
              }}
            >
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <p
              className="text-lg font-bold"
              style={{ color: themeData.sideNums }}
            >
              {userData.public_repos}
            </p>
            <p
              className="text-xs font-medium"
              style={{ color: themeData.sideLabels }}
            >
              Repos
            </p>
          </div>

          <div
            className="backdrop-blur-sm rounded-2xl p-4 text-center border"
            style={{
              backgroundColor: `${themeData.background}70`,
              borderColor: `${themeData.border}50`,
            }}
          >
            <div
              className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center"
              style={{
                background: `linear-gradient(to right, ${themeData.ring}, ${themeData.fire})`,
              }}
            >
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p
              className="text-lg font-bold"
              style={{ color: themeData.sideNums }}
            >
              {userData.followers}
            </p>
            <p
              className="text-xs font-medium"
              style={{ color: themeData.sideLabels }}
            >
              Followers
            </p>
          </div>

          <div
            className="backdrop-blur-sm rounded-2xl p-4 text-center border"
            style={{
              backgroundColor: `${themeData.background}70`,
              borderColor: `${themeData.border}50`,
            }}
          >
            <div
              className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center"
              style={{
                background: `linear-gradient(to right, ${themeData.ring}, ${themeData.fire})`,
              }}
            >
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p
              className="text-lg font-bold"
              style={{ color: themeData.sideNums }}
            >
              {userData.following}
            </p>
            <p
              className="text-xs font-medium"
              style={{ color: themeData.sideLabels }}
            >
              Following
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-emerald-200 dark:border-emerald-700">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Active Now
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ID:
            </span>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
              {userData.login.slice(0, 8).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card3;
