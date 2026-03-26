import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import Card1 from "../cards/Card1";
import Card2 from "../cards/Card2";
import Card3 from "../cards/Card3";

interface UserData {
  avatar_url: string;
  name: string;
  login: string;
  bio: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  location?: string;
  company?: string;
  blog?: string;
  email?: string;
  twitter_username?: string;
  hireable?: boolean;
  public_gists: number;
  updated_at: string;
  type: string;
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

const CardRenderScreen = () => {
  const [searchParams] = useSearchParams();
  const { setCardTheme, setWebsiteTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userOrganizations, setUserOrganizations] = useState<UserOrganizations[]>([]);
  const [userRepositories, setUserRepositories] = useState<UserRepositories[]>([]);

  const username = searchParams.get("user") || "";
  const type = Number(searchParams.get("type") || "1");
  const theme = searchParams.get("theme") || "default";
  const mode = searchParams.get("mode") || "light";

  const options = useMemo(
    () => ({
      showQR: searchParams.get("qr") !== "false",
      showStats: searchParams.get("stats") !== "false",
      showBio: searchParams.get("bio") !== "false",
      showFollowers: searchParams.get("followers") !== "false",
      showEmail: searchParams.get("showEmail") !== "false",
      showTwitter: searchParams.get("showTwitter") !== "false",
      showHireable: searchParams.get("showHireable") !== "false",
      showGists: searchParams.get("showGists") !== "false",
      showJoinDate: searchParams.get("showJoinDate") !== "false",
      showLocation: searchParams.get("showLocation") !== "false",
      showCompany: searchParams.get("showCompany") !== "false",
      showBlog: searchParams.get("showBlog") !== "false",
      showTotalForks: searchParams.get("showTotalForks") !== "false",
      showTotalIssues: searchParams.get("showTotalIssues") !== "false",
      showTotalPRs: searchParams.get("showTotalPRs") !== "false",
      showContributionYears: searchParams.get("showContributionYears") !== "false",
      showMostStarredRepo: searchParams.get("showMostStarredRepo") !== "false",
      showRecentActivity: searchParams.get("showRecentActivity") !== "false",
      showOrganizations: searchParams.get("showOrganizations") !== "false",
      showTopRepositories: searchParams.get("showTopRepositories") !== "false",
    }),
    [searchParams]
  );

  useEffect(() => {
    setCardTheme(theme);
    setWebsiteTheme(mode === "dark" ? "dark" : "light");
  }, [mode, setCardTheme, setWebsiteTheme, theme]);

  useEffect(() => {
    if (!username) {
      setError("Username is required");
      setLoading(false);
      return;
    }

    let isActive = true;

    const fetchData = async () => {
      try {
        const headers: HeadersInit = {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "GitHub-Card-Maker",
        };

        const userResponse = await fetch(
          `https://api.github.com/users/${username}`,
          { headers }
        );
        if (!userResponse.ok) {
          throw new Error("User not found");
        }
        const user = await userResponse.json();

        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100`,
          { headers }
        );
        const repos = reposResponse.ok ? await reposResponse.json() : [];

        const topRepos = Array.isArray(repos)
          ? repos
              .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
              .slice(0, 10)
              .map((repo: any) => ({
                name: repo.name,
                description: repo.description || "",
                language: repo.language || "Unknown",
                stargazers_count: repo.stargazers_count || 0,
                forks_count: repo.forks_count || 0,
                updated_at: repo.updated_at,
                html_url: repo.html_url,
                topics: repo.topics || [],
              }))
          : [];

        let orgs: UserOrganizations[] = [];
        try {
          const orgsResponse = await fetch(
            `https://api.github.com/users/${username}/orgs`,
            { headers }
          );
          if (orgsResponse.ok) {
            const orgData = await orgsResponse.json();
            orgs = orgData.slice(0, 10).map((org: any) => ({
              login: org.login,
              avatar_url: org.avatar_url,
              description: org.description || "",
            }));
          }
        } catch (orgError) {
          console.warn("Could not fetch organizations:", orgError);
        }

        if (!isActive) return;

        setUserData(user);
        setUserRepositories(topRepos);
        setUserOrganizations(orgs);
        setError(null);
      } catch (fetchError: any) {
        if (!isActive) return;
        setError(fetchError?.message || "Failed to load card data");
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isActive = false;
    };
  }, [username]);

  const renderCard = () => {
    if (!userData) return null;

    const cardProps = {
      userData,
      userOrganizations,
      userRepositories,
      cardTheme: theme,
      options,
    };

    switch (type) {
      case 2:
        return <Card2 {...cardProps} />;
      case 3:
        return <Card3 {...cardProps} />;
      case 1:
      default:
        return <Card1 {...cardProps} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-gray-500">Loading card...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" id="card-ready">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-lg">
          <h2 className="text-lg font-semibold text-gray-800">Failed to load GitHub card</h2>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" id="card-ready">
      <div id="render-card" className="p-6">
        {renderCard()}
      </div>
    </div>
  );
};

export default CardRenderScreen;
