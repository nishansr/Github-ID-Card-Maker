import { useState, useEffect, JSX } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card1 from "../cards/Card1";
import Card2 from "../cards/Card2";
import Card3 from "../cards/Card3";
import prachar1 from "../../assets/prachar/prachar1.jpg";
import prachar2 from "../../assets/prachar/prachar2.jpg";
import prachar3 from "../../assets/prachar/prachar3.jpg";
import template1 from "../../assets/template/template1.png";
import template2 from "../../assets/template/template2.png";
import template3 from "../../assets/template/template3.png";
import { toPng } from "html-to-image";

const ResultScreen = () => {
  const { username } = useParams<{ username: string }>();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<JSX.Element | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${username}`
        );
        if (!response.ok) {
          throw new Error("User not found");
        }
        const data = await response.json();
        setUserData(data);
        setSelectedCard(<Card1 userData={data} />);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  const handleNavigate = () => {
    navigate("/");
  };

  const handleDownload = () => {
    const cardElement = document.getElementById("selected-card");
    if (cardElement) {
      toPng(cardElement)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "github-id-card.png";
          link.click();
        })
        .catch((error) => console.error("Error generating image:", error));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-3xl font-bold">
        Loading...
      </div>
    );
  }

  if (error === "User not found") {
    return (
      <div className="flex items-center justify-center h-screen text-3xl font-bold">
        {error}
        <button
          onClick={handleNavigate}
          className="px-5 py-2 bg-[#4337C9] text-white rounded-md hover:bg-[#3c3495]"
        >
          Create
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-10 lg:px-20">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        <div className="lg:col-span-8 flex flex-col items-center mt-20 ">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Select Your ID Card Template
          </h1>
          <div
            id="selected-card"
            className="w-full max-w-md sm:max-w-lg md:max-w-xl mb-8"
          >
            {selectedCard}
          </div>
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { img: template1, card: Card1 },
              { img: template2, card: Card2 },
              { img: template3, card: Card3 },
            ].map((item, index) => (
              <div
                key={index}
                onClick={() =>
                  setSelectedCard(<item.card userData={userData} />)
                }
                className={`shadow-md rounded-lg p-2 flex flex-col items-center cursor-pointer transition transform hover:scale-105 ${
                  selectedCard?.type === item.card ? "bg-gray-300" : "bg-white"
                }`}
              >
                <img
                  src={item.img}
                  alt="Template"
                  style={{ objectFit: "cover" }}
                  className="w-24 h-24 md:w-32 md:h-32"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a href={userData.html_url} className="text-[#222] z-10">
              <div className="rounded-lg px-4 py-2 border bg-gray-100">
                View Profile
              </div>
            </a>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-[#4337C9] text-white rounded-md hover:bg-blue-600 transition"
            >
              Download Now
            </button>
          </div>
        </div>
        <div className="lg:col-span-2  flex-col items-center lg:block hidden">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
            Advertisement
          </h1>
          <div className="grid grid-cols-1 gap-4 w-full max-w-3xl">
            {[prachar1, prachar2, prachar3].map((prachar, index) => (
              <img
                key={index}
                src={prachar}
                alt="Prachar"
                className="w-full rounded-lg shadow-md"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="block lg:hidden mt-10">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Advertisement
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
          {[prachar1, prachar2, prachar3].map((ad, index) => (
            <img
              key={index}
              src={ad}
              alt="Ad"
              className="w-full rounded-lg shadow-md"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
