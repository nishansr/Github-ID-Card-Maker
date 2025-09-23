import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeNames } from "../themes/card_theme";
import Card1 from "./cards/Card1";
import Card2 from "./cards/Card2";
import Card3 from "./cards/Card3";

interface UserData {
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
}

interface UserStats {
  totalStars: number;
  topLanguages: [string, number][];
  totalRepos: number;
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
  const [qrCode, setQrCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

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

      setUserStats({
        totalStars,
        totalRepos: data.public_repos,
        topLanguages,
      });
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
      qrCode,
      cardTheme, // Pass the selected card theme
      options: {
        showQR,
        showStats,
        showBio,
        showFollowers,
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
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setter(e.target.checked)}
                    className={`w-4 h-4 rounded border ${
                      websiteTheme === "dark"
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    } text-blue-500 focus:ring-blue-500`}
                  />
                  <label htmlFor={key} className="text-sm">
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
