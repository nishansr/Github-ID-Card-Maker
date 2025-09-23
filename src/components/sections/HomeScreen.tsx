import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../CustomAlert";
import { useTheme } from "../../contexts/ThemeContext";

const HomeScreen = () => {
  const [username, setUsername] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  const navigate = useNavigate();

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // Get GitHub token from environment
      const token = import.meta.env.VITE_GITHUB_TOKEN || process.env.GICM_TOKEN_KEY;
      
      const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Card-Maker'
      };
      
      // Add authorization header if token is available
      if (token) {
        headers['Authorization'] = `token ${token}`;
      }

      const response = await fetch(`https://api.github.com/users/${username}`, {
        headers
      });
      if (response.status === 404) {
        setError("💀  User not found");
        setShowAlert(true);
      } else {
        navigate(`/result/${username}`);
      }
    } catch (error: any) {
      setError(error.message);
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    if (username.trim() === "") {
      setError("💀  Please enter a valid username.");
      setShowAlert(true);
    } else {
      fetchUserData();
    }
  };

  const features = [
    {
      icon: "🚀",
      title: "AI-Powered Generation",
      description:
        "Upload your username and let our AI create perfect ID Card to your needs.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: "🎨",
      title: "Customizable Templates",
      description:
        "Choose from a variety of templates to create your unique ID card.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: "⚡",
      title: "Instant Preview",
      description:
        "Get an instant preview of your ID card as you make changes.",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {showAlert && (
        <CustomAlert
          message={error ?? "💀  Please enter a valid username."}
          onClose={() => setShowAlert(false)}
        />
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-yellow-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8">
              <span className="gradient-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                <span className="hidden sm:inline">Effortlessly </span>Create
                Your
              </span>
              <br />
              <span className="gradient-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-600">
                GitHub ID Card
              </span>
            </h1>

            <p className="mt-8 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Transform your GitHub profile with a stunning, customized ID card.
              Our AI-powered tool makes it easy to generate a professional and
              unique ID card that showcases your GitHub identity.
            </p>

            {/* Input Section */}
            <div className="mt-12 max-w-md mx-auto">
              <div className="glass-effect p-6 rounded-2xl backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/20">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Enter your GitHub username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleCreate();
                        }
                      }}
                      className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    onClick={handleCreate}
                    disabled={isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </div>
                    ) : (
                      "Create Card"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover the powerful features that make creating your GitHub ID
              card effortless and enjoyable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl glass-effect bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 p-8 hover:transform hover:scale-105 transition-all duration-300 card-hover"
              >
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                ></div>

                <div className="relative z-10">
                  <div className="text-4xl mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
