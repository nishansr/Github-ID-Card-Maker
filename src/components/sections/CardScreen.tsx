import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card1 from "../cards/Card1";
import Card2 from "../cards/Card2";
import Card3 from "../cards/Card3";
import QRCode from "qrcode";

const CardScreen = () => {
  const { username } = useParams<{ username: string }>();
  const [userData, setUserData] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

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

        // Generate QR code for GitHub profile
        const qrUrl = await QRCode.toDataURL(data.html_url);
        setQrCodeUrl(qrUrl);

        // Fetch additional stats
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

        setUserStats({
          totalStars,
          topLanguages,
          totalRepos: repos.length,
        });
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold gradient-text">
            Loading GitHub card...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center glass-effect p-8 rounded-2xl">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            User not Found!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The GitHub user you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const cardOptions = {
    showQR: true,
    showStats: true,
    showBio: true,
    showFollowers: true,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4 font-display">
            {userData.name || userData.login}'s GitHub Card
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Professional GitHub profile showcase
          </p>
        </div>

        {/* Display all three card styles */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold gradient-text mb-4">
              Dark Professional
            </h3>
            <Card1
              userData={userData}
              userStats={userStats}
              qrCode={qrCodeUrl}
              options={cardOptions}
            />
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold gradient-text mb-4">
              Clean Modern
            </h3>
            <Card2
              userData={userData}
              userStats={userStats}
              qrCode={qrCodeUrl}
              options={cardOptions}
            />
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold gradient-text mb-4">
              Nature Inspired
            </h3>
            <Card3
              userData={userData}
              userStats={userStats}
              qrCode={qrCodeUrl}
              options={cardOptions}
            />
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
          <a
            href={`/result/${username}`}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
          >
            🎨 Customize & Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default CardScreen;
