import React from "react";
import githubLogo from "../../assets/logo/github-mark.png";

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
}

const Card2: React.FC<CardProps> = ({ userData }) => {
  let bio = "";
  if (userData.bio != null) {
    bio = userData.bio.length > 150 ? userData.bio + "..." : userData.bio;
  } else {
    bio = "No bio available";
  }

  return (
    <div className="relative bg-gray-100 shadow-md rounded-lg p-6 flex flex-col items-center mx-5">
      <div className="absolute top-4 right-4">
        <img src={githubLogo} alt="Github Logo" className="w-10 h-10" />
      </div>
      <div className="flex items-center justify-center mt-4 z-10 w-full mb-5">
        <img
          src={userData.avatar_url}
          alt={userData.name}
          className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
        />
      </div>
      <h3 className="text-2xl font-bold mb-2">{userData.name}</h3>
      <p className="text-gray-600 mb-4">@{userData.login}</p>
      <p className="text-gray-800 text-center mb-4">{bio}</p>

      <div className="flex justify-around w-full mt-4">
        <div className="text-center">
          <p className="font-bold text-xl">{userData.public_repos}</p>
          <p className="text-gray-600">Repos</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-xl">{userData.followers}</p>
          <p className="text-gray-600">Followers</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-xl">{userData.following}</p>
          <p className="text-gray-600">Following</p>
        </div>
      </div>
    </div>
  );
};

export default Card2;
