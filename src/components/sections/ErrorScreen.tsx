import { useNavigate } from "react-router-dom";

const ErrorScreen = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-3xl font-bold">
      <div className="mb-30">
        <h1>Page not Found!</h1>
      </div>
      <button
        onClick={handleNavigate}
        className="mt-4 px-5 py-2 bg-[#4337C9] text-white rounded-md hover:bg-[#3c3495]"
      >
        Move to Home
      </button>
    </div>
  );
};

export default ErrorScreen;
