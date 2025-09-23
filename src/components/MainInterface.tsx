import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeNames } from "../themes/card_theme";
import Card1 from "./cards/Card1";
import Card2 from "./cards/Card2";
import Card3 from "./cards/Card3";

interface UserData {
  // Basic profile info
  login: string;
  name: string;
  bio: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  location: string;
  company: string;
  blog: string;

  // Extended profile info
  email?: string;
  twitter_username?: string;
  hireable?: boolean;
  public_gists: number;
  updated_at: string;
  type: string;
  site_admin: boolean;

  // Private info (if authenticated)
  private_gists?: number;
  total_private_repos?: number;
  owned_private_repos?: number;
  disk_usage?: number;
  collaborators?: number;
  two_factor_authentication?: boolean;
  plan?: {
    name: string;
    space: number;
    private_repos: number;
    collaborators: number;
  };
}

interface UserStats {
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
}

interface UserOrganizations {
  login: string;
  avatar_url: string;
  description: string;
}

interface UserRepositories {
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
  topics: string[];
}

const MainInterface: React.FC = () => {
  const { websiteTheme, toggleWebsiteTheme, cardTheme, setCardTheme } =
    useTheme();
  const [username, setUsername] = useState("nishansr");
  const [cardType, setCardType] = useState(1);
  const [showQR, setShowQR] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [showBio, setShowBio] = useState(true);
  const [showFollowers, setShowFollowers] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userOrganizations, setUserOrganizations] = useState<
    UserOrganizations[]
  >([]);
  const [userRepositories, setUserRepositories] = useState<UserRepositories[]>(
    []
  );
  const [qrCode, setQrCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Data field visibility controls
  const [showEmail, setShowEmail] = useState(true);
  const [showTwitter, setShowTwitter] = useState(true);
  const [showHireable, setShowHireable] = useState(true);
  const [showGists, setShowGists] = useState(true);
  const [showJoinDate, setShowJoinDate] = useState(true);
  const [showLocation, setShowLocation] = useState(true);
  const [showCompany, setShowCompany] = useState(true);
  const [showBlog, setShowBlog] = useState(true);
  const [showTotalForks, setShowTotalForks] = useState(true);
  const [showTotalIssues, setShowTotalIssues] = useState(true);
  const [showTotalPRs, setShowTotalPRs] = useState(true);
  const [showContributionYears, setShowContributionYears] = useState(true);
  const [showMostStarredRepo, setShowMostStarredRepo] = useState(true);
  const [showRecentActivity, setShowRecentActivity] = useState(true);
  const [showOrganizations, setShowOrganizations] = useState(true);
  const [showTopRepositories, setShowTopRepositories] = useState(true);

  // Get available theme names
  const availableThemes = getThemeNames();

  // Debounced search function
  const debouncedFetchUserData = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (user: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          fetchUserData(user);
        }, 500); // 500ms delay
      };
    })(),
    [websiteTheme] // Include websiteTheme in dependencies since fetchUserData uses it
  );

  const fetchUserData = async (user: string) => {
    if (!user.trim()) return;

    setLoading(true);
    setError("");

    try {
      // Get GitHub token from environment
      const token =
        import.meta.env.VITE_GITHUB_TOKEN || process.env.GICM_TOKEN_KEY;

      const headers: HeadersInit = {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "GitHub-Card-Maker",
      };

      // Add authorization header if token is available
      if (token) {
        headers["Authorization"] = `token ${token}`;
      }

      const response = await fetch(`https://api.github.com/users/${user}`, {
        headers,
      });
      if (!response.ok) {
        throw new Error("User not found");
      }
      const data = await response.json();
      setUserData(data);

      // Generate QR code
      const QRCode = (await import("qrcode")).default;
      const qrDataURL = await QRCode.toDataURL(data.html_url, {
        width: 100,
        margin: 1,
        color: {
          dark: websiteTheme === "dark" ? "#ffffff" : "#000000",
          light: "#0000",
        },
      });
      setQrCode(qrDataURL);

      // Fetch user stats
      const reposResponse = await fetch(
        `https://api.github.com/users/${user}/repos?per_page=100`,
        { headers }
      );
      const repos = await reposResponse.json();

      const totalStars = repos.reduce(
        (sum: number, repo: any) => sum + repo.stargazers_count,
        0
      );

      // Get top languages
      const languageStats: { [key: string]: number } = {};
      repos.forEach((repo: any) => {
        if (repo.language) {
          languageStats[repo.language] =
            (languageStats[repo.language] || 0) + 1;
        }
      });

      const topLanguages: [string, number][] = Object.entries(languageStats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5) as [string, number][];

      // Calculate additional stats
      const totalForks = repos.reduce(
        (sum: number, repo: any) => sum + repo.forks_count,
        0
      );

      // Find most starred repository
      const mostStarredRepo = repos.reduce(
        (max: any, repo: any) =>
          repo.stargazers_count > (max?.stargazers_count || 0) ? repo : max,
        null
      );

      // Get contribution years (approximate from account creation)
      const createdYear = new Date(data.created_at).getFullYear();
      const currentYear = new Date().getFullYear();
      const contributionYears = Array.from(
        { length: currentYear - createdYear + 1 },
        (_, i) => createdYear + i
      );

      // Fetch recent activity (public events)
      let recentActivity: any[] = [];
      try {
        const eventsResponse = await fetch(
          `https://api.github.com/users/${user}/events/public?per_page=10`,
          { headers }
        );
        if (eventsResponse.ok) {
          const events = await eventsResponse.json();
          recentActivity = events.slice(0, 5).map((event: any) => ({
            type: event.type,
            repo: event.repo?.name || "Unknown",
            date: event.created_at,
          }));
        }
      } catch (error) {
        console.warn("Could not fetch recent activity:", error);
      }

      // Fetch issues and pull requests count (approximate)
      let totalIssues = 0;
      let totalPullRequests = 0;
      try {
        const issuesResponse = await fetch(
          `https://api.github.com/search/issues?q=author:${user}+type:issue`,
          { headers }
        );
        if (issuesResponse.ok) {
          const issuesData = await issuesResponse.json();
          totalIssues = issuesData.total_count || 0;
        }

        const prsResponse = await fetch(
          `https://api.github.com/search/issues?q=author:${user}+type:pr`,
          { headers }
        );
        if (prsResponse.ok) {
          const prsData = await prsResponse.json();
          totalPullRequests = prsData.total_count || 0;
        }
      } catch (error) {
        console.warn("Could not fetch issues/PRs count:", error);
      }

      setUserStats({
        totalStars,
        totalRepos: data.public_repos,
        topLanguages,
        totalForks,
        totalIssues,
        totalPullRequests,
        contributionYears,
        mostStarredRepo: mostStarredRepo
          ? {
              name: mostStarredRepo.name,
              stars: mostStarredRepo.stargazers_count,
              language: mostStarredRepo.language || "Unknown",
            }
          : undefined,
        recentActivity,
      });

      // Fetch user organizations
      try {
        const orgsResponse = await fetch(
          `https://api.github.com/users/${user}/orgs`,
          { headers }
        );
        if (orgsResponse.ok) {
          const orgs = await orgsResponse.json();
          setUserOrganizations(
            orgs.slice(0, 10).map((org: any) => ({
              login: org.login,
              avatar_url: org.avatar_url,
              description: org.description || "",
            }))
          );
        }
      } catch (error) {
        console.warn("Could not fetch organizations:", error);
        setUserOrganizations([]);
      }

      // Store top repositories (already fetched)
      const topRepos = repos
        .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
        .slice(0, 10)
        .map((repo: any) => ({
          name: repo.name,
          description: repo.description || "",
          language: repo.language || "Unknown",
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          updated_at: repo.updated_at,
          html_url: repo.html_url,
          topics: repo.topics || [],
        }));
      setUserRepositories(topRepos);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch user data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username.trim()) {
      debouncedFetchUserData(username);
    }
  }, [username, debouncedFetchUserData]);

  const generateAPILink = () => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      user: username,
      card: cardType.toString(),
      theme: cardTheme,
      qr: showQR.toString(),
      stats: showStats.toString(),
      bio: showBio.toString(),
      followers: showFollowers.toString(),
    });
    return `${baseUrl}/api/card?${params.toString()}`;
  };

  const generateMarkdown = () => {
    const apiLink = generateAPILink();
    return `[![GitHub Card](${apiLink})](https://github.com/${username})`;
  };

  const generateHTML = () => {
    const apiLink = generateAPILink();
    return `<a href="https://github.com/${username}"><img src="${apiLink}" alt="GitHub Card" /></a>`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderCard = () => {
    if (!userData || !userStats) return null;

    const cardProps = {
      userData,
      userStats,
      userOrganizations,
      userRepositories,
      qrCode,
      cardTheme, // Pass the selected card theme
      options: {
        showQR,
        showStats,
        showBio,
        showFollowers,
        // Extended profile data
        showEmail,
        showTwitter,
        showHireable,
        showGists,
        showJoinDate,
        showLocation,
        showCompany,
        showBlog,
        // Advanced statistics
        showTotalForks,
        showTotalIssues,
        showTotalPRs,
        showContributionYears,
        showMostStarredRepo,
        showRecentActivity,
        showOrganizations,
        showTopRepositories,
      },
    };

    switch (cardType) {
      case 1:
        return <Card1 {...cardProps} />;
      case 2:
        return <Card2 {...cardProps} />;
      case 3:
        return <Card3 {...cardProps} />;
      default:
        return <Card1 {...cardProps} />;
    }
  };

  return (
    <div
      className={`min-h-screen ${
        websiteTheme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`${
          websiteTheme === "dark" ? "bg-gray-800" : "bg-white"
        } border-b ${
          websiteTheme === "dark" ? "border-gray-700" : "border-gray-200"
        } px-6 py-4`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🔥</div>
            <h1 className="text-xl font-semibold">GitHub ID Card Maker</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleWebsiteTheme}
              className={`p-2 rounded-lg ${
                websiteTheme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {websiteTheme === "dark" ? "☀️" : "🌙"}
            </button>
            <a
              href="https://github.com"
              className="flex items-center space-x-2 text-sm text-blue-500 hover:text-blue-600"
            >
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Properties Panel */}
        <div
          className={`w-96 ${
            websiteTheme === "dark" ? "bg-gray-800" : "bg-white"
          } border-r ${
            websiteTheme === "dark" ? "border-gray-700" : "border-gray-200"
          } p-6 h-screen overflow-y-auto`}
        >
          <h2 className="text-lg font-semibold mb-6">Properties</h2>

          {/* Username */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Username*</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${
                websiteTheme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter GitHub username"
            />
          </div>

          {/* Theme */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Card Theme</label>
            <select
              value={cardTheme}
              onChange={(e) => setCardTheme(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${
                websiteTheme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {availableThemes.map((themeName) => (
                <option key={themeName} value={themeName}>
                  {themeName}
                </option>
              ))}
            </select>
          </div>

          {/* Card Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Card Type</label>
            <select
              value={cardType}
              onChange={(e) => setCardType(Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg ${
                websiteTheme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value={1}>Card 1</option>
              <option value={2}>Card 2</option>
              <option value={3}>Card 3</option>
            </select>
          </div>

          {/* Show Sections */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">
              Show Sections
            </label>
            <div className="space-y-3">
              {[
                {
                  key: "qr",
                  label: "QR Code",
                  value: showQR,
                  setter: setShowQR,
                },
                {
                  key: "stats",
                  label: "GitHub Stats",
                  value: showStats,
                  setter: setShowStats,
                },
                {
                  key: "bio",
                  label: "Bio",
                  value: showBio,
                  setter: setShowBio,
                },
                {
                  key: "followers",
                  label: "Followers",
                  value: showFollowers,
                  setter: setShowFollowers,
                },
              ].map(({ key, label, value, setter }) => (
                <div key={key} className="flex items-center space-x-3">
                  <input
                    id={key}
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setter(e.target.checked)}
                    className={`w-4 h-4 rounded border ${
                      websiteTheme === "dark"
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    } text-blue-500 focus:ring-blue-500`}
                  />
                  <label htmlFor={key} className="text-sm cursor-pointer">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Extended Profile Data */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">
              Extended Profile Data
            </label>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {[
                {
                  key: "email",
                  label: "Email",
                  value: showEmail,
                  setter: setShowEmail,
                },
                {
                  key: "twitter",
                  label: "Twitter Username",
                  value: showTwitter,
                  setter: setShowTwitter,
                },
                {
                  key: "hireable",
                  label: "Hireable Status",
                  value: showHireable,
                  setter: setShowHireable,
                },
                {
                  key: "gists",
                  label: "Public Gists",
                  value: showGists,
                  setter: setShowGists,
                },
                {
                  key: "joinDate",
                  label: "Join Date",
                  value: showJoinDate,
                  setter: setShowJoinDate,
                },
                {
                  key: "location",
                  label: "Location",
                  value: showLocation,
                  setter: setShowLocation,
                },
                {
                  key: "company",
                  label: "Company",
                  value: showCompany,
                  setter: setShowCompany,
                },
                {
                  key: "blog",
                  label: "Blog/Website",
                  value: showBlog,
                  setter: setShowBlog,
                },
              ].map(({ key, label, value, setter }) => (
                <div key={key} className="flex items-center space-x-3">
                  <input
                    id={`extended-${key}`}
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setter(e.target.checked)}
                    className={`w-4 h-4 rounded border ${
                      websiteTheme === "dark"
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    } text-blue-500 focus:ring-blue-500`}
                  />
                  <label
                    htmlFor={`extended-${key}`}
                    className="text-sm cursor-pointer"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Statistics */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">
              Advanced Statistics
            </label>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {[
                {
                  key: "totalForks",
                  label: "Total Forks",
                  value: showTotalForks,
                  setter: setShowTotalForks,
                },
                {
                  key: "totalIssues",
                  label: "Total Issues",
                  value: showTotalIssues,
                  setter: setShowTotalIssues,
                },
                {
                  key: "totalPRs",
                  label: "Total Pull Requests",
                  value: showTotalPRs,
                  setter: setShowTotalPRs,
                },
                {
                  key: "contributionYears",
                  label: "Contribution Years",
                  value: showContributionYears,
                  setter: setShowContributionYears,
                },
                {
                  key: "mostStarredRepo",
                  label: "Most Starred Repository",
                  value: showMostStarredRepo,
                  setter: setShowMostStarredRepo,
                },
                {
                  key: "recentActivity",
                  label: "Recent Activity",
                  value: showRecentActivity,
                  setter: setShowRecentActivity,
                },
                {
                  key: "organizations",
                  label: "Organizations",
                  value: showOrganizations,
                  setter: setShowOrganizations,
                },
                {
                  key: "topRepositories",
                  label: "Top Repositories",
                  value: showTopRepositories,
                  setter: setShowTopRepositories,
                },
              ].map(({ key, label, value, setter }) => (
                <div key={key} className="flex items-center space-x-3">
                  <input
                    id={`advanced-${key}`}
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setter(e.target.checked)}
                    className={`w-4 h-4 rounded border ${
                      websiteTheme === "dark"
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    } text-blue-500 focus:ring-blue-500`}
                  />
                  <label
                    htmlFor={`advanced-${key}`}
                    className="text-sm cursor-pointer"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 p-6">
          <h2 className="text-lg font-semibold mb-6">Preview</h2>

          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div
              className={`p-4 rounded-lg ${
                websiteTheme === "dark"
                  ? "bg-red-900 text-red-200"
                  : "bg-red-100 text-red-800"
              } mb-6`}
            >
              {error}
            </div>
          )}

          {!loading && !error && userData && (
            <div className="space-y-6">
              {/* Card Preview */}
              <div className="flex justify-center">{renderCard()}</div>

              {/* Code Sections */}
              <div className="space-y-4">
                {/* Markdown */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Markdown</h3>
                  <div
                    className={`p-4 rounded-lg ${
                      websiteTheme === "dark" ? "bg-gray-800" : "bg-gray-100"
                    } relative`}
                  >
                    <code className="text-sm font-mono break-all">
                      {generateMarkdown()}
                    </code>
                    <button
                      onClick={() => copyToClipboard(generateMarkdown())}
                      className="absolute top-2 right-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                </div>

                {/* HTML */}
                <div>
                  <h3 className="text-sm font-medium mb-2">HTML</h3>
                  <div
                    className={`p-4 rounded-lg ${
                      websiteTheme === "dark" ? "bg-gray-800" : "bg-gray-100"
                    } relative`}
                  >
                    <code className="text-sm font-mono break-all">
                      {generateHTML()}
                    </code>
                    <button
                      onClick={() => copyToClipboard(generateHTML())}
                      className="absolute top-2 right-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainInterface;
