import { useState, useEffect, JSX } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card1 from "../cards/Card1";
import Card2 from "../cards/Card2";
import Card3 from "../cards/Card3";
import { useTheme } from "../../contexts/ThemeContext";
import { toPng } from "html-to-image";
import QRCode from "qrcode";

interface CardOptions {
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
}

const ResultScreen = () => {
  const { username } = useParams<{ username: string }>();
  const [userData, setUserData] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<JSX.Element | null>(null);
  const [selectedCardType, setSelectedCardType] = useState<string>("Card1");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [cardOptions, setCardOptions] = useState<CardOptions>({
    showQR: true,
    showStats: true,
    showBio: true,
    showFollowers: true,
    // Extended profile data
    showEmail: false,
    showTwitter: false,
    showHireable: false,
    showGists: false,
    showJoinDate: false,
    showLocation: false,
    showCompany: false,
    showBlog: false,
    // Advanced statistics
    showTotalForks: false,
    showTotalIssues: false,
    showTotalPRs: false,
    showContributionYears: false,
    showMostStarredRepo: false,
    showRecentActivity: false,
    showOrganizations: false,
    showTopRepositories: false,
  });
  const { theme } = useTheme();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get GitHub token from environment
        const token = import.meta.env.VITE_GITHUB_TOKEN;

        const headers: HeadersInit = {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "GitHub-Card-Maker",
        };

        // Add authorization header if token is available
        if (token) {
          headers["Authorization"] = `token ${token}`;
        }

        const response = await fetch(
          `https://api.github.com/users/${username}`,
          { headers }
        );
        if (!response.ok) {
          throw new Error("User not found");
        }
        const data = await response.json();
        setUserData(data);

        // Generate QR code for GitHub profile (only if needed)
        let qrUrl = "";
        if (cardOptions.showQR) {
          qrUrl = await QRCode.toDataURL(data.html_url);
        }
        setQrCodeUrl(qrUrl);

        // Fetch additional stats (only if needed)
        let userStatsData: any = { totalStars: 0, topLanguages: [], totalRepos: 0 };
        
        if (cardOptions.showStats) {
          const reposResponse = await fetch(
            `https://api.github.com/users/${username}/repos?per_page=100`,
            { headers }
          );
          const repos = await reposResponse.json();

          const languages: { [key: string]: number } = {};
          let totalStars = 0;

          repos.forEach((repo: any) => {
            totalStars += repo.stargazers_count;
            if (repo.language) {
              languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
          });

          const topLanguages = Object.entries(languages)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 5);

          userStatsData = {
            totalStars,
            topLanguages,
            totalRepos: repos.length,
          };
        }

        setUserStats(userStatsData);

        setSelectedCard(
          <Card1
            userData={data}
            userStats={userStatsData}
            qrCode={qrUrl}
            options={cardOptions}
          />
        );
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  useEffect(() => {
    if (userData && userStats) {
      updateSelectedCard();
    }
  }, [cardOptions, selectedCardType, userData, userStats, qrCodeUrl]);

  const updateSelectedCard = () => {
    const cardProps = {
      userData,
      userStats,
      qrCode: qrCodeUrl,
      options: cardOptions,
    };

    switch (selectedCardType) {
      case "Card1":
        setSelectedCard(<Card1 {...cardProps} />);
        break;
      case "Card2":
        setSelectedCard(<Card2 {...cardProps} />);
        break;
      case "Card3":
        setSelectedCard(<Card3 {...cardProps} />);
        break;
      default:
        setSelectedCard(<Card1 {...cardProps} />);
    }
  };

  const handleNavigate = () => {
    navigate("/");
  };

  const handleDownload = () => {
    const cardElement = document.getElementById("selected-card");
    if (cardElement) {
      toPng(cardElement, {
        quality: 1.0,
        pixelRatio: 2,
      })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `${username}-github-card.png`;
          link.click();
        })
        .catch((error) => console.error("Error generating image:", error));
    }
  };

  const handleCardSelection = (cardType: string) => {
    setSelectedCardType(cardType);
  };

  const toggleOption = (option: keyof CardOptions) => {
    setCardOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const generateShareableLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/card/${username}`;
  };

  const generateAPILink = () => {
    const apiBaseUrl =
      import.meta.env.VITE_API_BASE_URL ||
      (import.meta.env.DEV
        ? "https://github-id-card-maker-5yl1i8yog-nishansrs-projects.vercel.app"
        : window.location.origin);
    const cardTypeMap = { Card1: "1", Card2: "2", Card3: "3" };
    const type =
      cardTypeMap[selectedCardType as keyof typeof cardTypeMap] || "1";

    const params = new URLSearchParams({
      user: username || "",
      type,
      theme: theme,
      mode: theme,
      qr: cardOptions.showQR.toString(),
      stats: cardOptions.showStats.toString(),
      bio: cardOptions.showBio.toString(),
      followers: cardOptions.showFollowers.toString(),
      showEmail: cardOptions.showEmail.toString(),
      showTwitter: cardOptions.showTwitter.toString(),
      showHireable: cardOptions.showHireable.toString(),
      showGists: cardOptions.showGists.toString(),
      showJoinDate: cardOptions.showJoinDate.toString(),
      showLocation: cardOptions.showLocation.toString(),
      showCompany: cardOptions.showCompany.toString(),
      showBlog: cardOptions.showBlog.toString(),
      showTotalForks: cardOptions.showTotalForks.toString(),
      showTotalIssues: cardOptions.showTotalIssues.toString(),
      showTotalPRs: cardOptions.showTotalPRs.toString(),
      showContributionYears: cardOptions.showContributionYears.toString(),
      showMostStarredRepo: cardOptions.showMostStarredRepo.toString(),
      showRecentActivity: cardOptions.showRecentActivity.toString(),
      showOrganizations: cardOptions.showOrganizations.toString(),
      showTopRepositories: cardOptions.showTopRepositories.toString(),
    });

    return `${apiBaseUrl}/api/card?${params.toString()}`;
  };

  const copyShareableLink = () => {
    const link = generateShareableLink();
    navigator.clipboard.writeText(link);
    // You could add a toast notification here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold gradient-text">
            Loading your awesome card...
          </p>
        </div>
      </div>
    );
  }

  if (error === "User not found") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center glass-effect p-8 rounded-2xl">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            User not Found!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The GitHub user you're looking for doesn't exist.
          </p>
          <button
            onClick={handleNavigate}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Customization Panel - Left Side */}
          <div className="lg:col-span-3">
            <div className="glass-effect p-6 rounded-2xl sticky top-8">
              <h3 className="text-xl font-bold gradient-text mb-6">
                Customize Your Card
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Show QR Code
                  </label>
                  <button
                    onClick={() => toggleOption("showQR")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      cardOptions.showQR
                        ? "bg-indigo-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        cardOptions.showQR ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Show Stats
                  </label>
                  <button
                    onClick={() => toggleOption("showStats")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      cardOptions.showStats
                        ? "bg-indigo-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        cardOptions.showStats
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Show Bio
                  </label>
                  <button
                    onClick={() => toggleOption("showBio")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      cardOptions.showBio
                        ? "bg-indigo-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        cardOptions.showBio ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Show Followers
                  </label>
                  <button
                    onClick={() => toggleOption("showFollowers")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      cardOptions.showFollowers
                        ? "bg-indigo-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        cardOptions.showFollowers
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold gradient-text mb-4">
                  Share Your Card
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={copyShareableLink}
                    className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 text-sm font-medium"
                  >
                    📋 Copy Shareable Link
                  </button>
                  <button
                    onClick={() => {
                      const apiLink = generateAPILink();
                      navigator.clipboard.writeText(apiLink);
                      alert("API link copied to clipboard!");
                    }}
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm font-medium"
                  >
                    🔗 Copy API Image Link
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Use the API link to embed your card as an image anywhere
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Center */}
          <div className="lg:col-span-9">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4 font-display">
                Select Your ID Card Template
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Choose from our beautiful, modern card designs
              </p>
            </div>

            {/* Selected Card Display */}
            <div className="flex justify-center mb-12">
              <div
                id="selected-card"
                className="transform hover:scale-105 transition-transform duration-300"
              >
                {selectedCard}
              </div>
            </div>

            {/* Template Selection with Previews */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-center mb-6 gradient-text">
                Choose Your Style
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Card1",
                    component: Card1,
                    title: "Dark Professional",
                    desc: "Sleek dark theme with purple accents",
                  },
                  {
                    name: "Card2",
                    component: Card2,
                    title: "Clean Modern",
                    desc: "Minimalist design with colorful header",
                  },
                  {
                    name: "Card3",
                    component: Card3,
                    title: "Nature Inspired",
                    desc: "Elegant emerald theme",
                  },
                ].map((template) => (
                  <div
                    key={template.name}
                    onClick={() => handleCardSelection(template.name)}
                    className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      selectedCardType === template.name
                        ? "ring-4 ring-indigo-500 ring-opacity-50"
                        : ""
                    }`}
                  >
                    <div className="glass-effect p-4 rounded-2xl">
                      <div className="mb-4 transform scale-50 origin-top">
                        <template.component
                          userData={userData}
                          userStats={userStats}
                          qrCode={qrCodeUrl}
                          options={cardOptions}
                        />
                      </div>
                      <div className="text-center">
                        <h4 className="font-bold text-lg gradient-text">
                          {template.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {template.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a
                href={userData.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 glass-effect rounded-lg hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105 text-gray-700 dark:text-gray-300 font-medium"
              >
                🔗 View GitHub Profile
              </a>
              <button
                onClick={handleDownload}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
              >
                📥 Download Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
