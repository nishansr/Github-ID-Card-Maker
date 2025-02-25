import React from "react";
import githubLogo from "../../assets/logo/github.png";

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

const Card1: React.FC<CardProps> = ({ userData }) => {
  let bio = "";
  if (userData.bio != null) {
    bio = userData.bio.length > 150 ? userData.bio + "..." : userData.bio;
  } else {
    bio = "No bio available";
  }

  return (
    <div className="relative bg-white shadow-md rounded-lg p-6 flex flex-col items-center mx-5">
      <div className="absolute inset-0 bg-[#222222] h-35 rounded-t-lg"></div>
      <div className="absolute top-4 right-4">
        <img src={githubLogo} alt="Github Logo" className="w-10 h-10" />
      </div>
      <div className="flex items-center mt-16 z-10 w-full mb-5">
        <img
          src={userData.avatar_url}
          alt={userData.name}
          className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
        />
        <div className="flex flex-col items-start ml-4 mt-5">
          <p className="text-white mb-1">@{userData.login}</p>
          <h3 className="text-[#222222] text-lg font-bold mb-2 z-10">
            {userData.name}
          </h3>
        </div>
      </div>
      <div className="flex justify-around w-full mb-4 z-10 border border-[#222] rounded-lg p-2">
        <div className="text-center">
          <p className="font-bold">{userData.public_repos}</p>
          <p className="text-[#222222]">Repos</p>
        </div>
        <div className="border-l border-[#222] mx-2"></div>
        <div className="text-center">
          <p className="font-bold">{userData.followers}</p>
          <p className="text-[#222222]">Followers</p>
        </div>
        <div className="border-l border-[#222] mx-2"></div>
        <div className="text-center">
          <p className="font-bold">{userData.following}</p>
          <p className="text-[#222222]">Following</p>
        </div>
      </div>
      <p className="text-[#222222] z-10 text-justify">{bio}</p>
    </div>
  );
};

export default Card1;