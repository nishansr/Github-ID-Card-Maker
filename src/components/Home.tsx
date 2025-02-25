import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomAlert from "./CustomAlert";

const Home = () => {
  const [username, setUsername] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleCreate = () => {
    if (username.trim() === "") {
      setShowAlert(true);
    } else {
      navigate(`/result/${username}`);
    }
  };

  const features = [
    {
      image: "https://img.icons8.com/ios/452/github.png",
      title: "AI-Powered Generation",
      description:
        "Upload your username and let our AI create perfect ID Card to your needs.",
    },
    {
      image: "https://img.icons8.com/ios/452/github.png",
      title: "Customizable Templates",
      description:
        "Choose from a variety of templates to create your unique ID card.",
    },
    {
      image: "https://img.icons8.com/ios/452/github.png",
      title: "Instant Preview",
      description:
        "Get an instant preview of your ID card as you make changes.",
    },
  ];

  return (
    <div>
      {showAlert && (
        <CustomAlert
          message="💀  Please enter a valid username."
          onClose={() => setShowAlert(false)}
        />
      )}
      <div className="flex items-center pt-30 pb-10">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-center text-[#4337C9]">
            <span className="hidden sm:inline">Effortlessly </span>Create Your
            Personalized GitHub ID Card
          </h1>
          <p className="mt-10 text-lg text-center">
            Transform your GitHub profile with a stunning, customized ID card.
            Our AI-powered tool makes it easy to generate a professional and
            unique ID card that showcases your GitHub identity. Simply enter
            your GitHub username and let our system do the rest!
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center mx-5">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Enter your Github ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onSubmit={handleCreate}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreate();
              }
            }}
            className="px-4 pr-15 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreate}
            className="px-5 py-2 bg-[#4337C9] text-white rounded-md hover:bg-[#3c3495]"
          >
            Create
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 mt-20 sm:grid-cols-3 mb-20 mx-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-start p-8 space-y-5 bg-white shadow-md border border-gray-300 rounded-md"
          >
            <img src={feature.image} alt="feature" className="w-12 h-12" />
            <h2 className="font-bold text-[#4337C9] h-3">{feature.title}</h2>
            <p className="text-start">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
