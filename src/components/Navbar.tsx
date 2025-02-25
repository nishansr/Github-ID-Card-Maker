import { useNavigate } from "react-router-dom";
import "../index.css";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigateTo = (path: string) => {
    navigate(path);
    setDropdownOpen(false);
  };

  return (
    <nav className=" top-0 w-full z-40 border-b border-gray-200 bg-white fixed">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <a
            onClick={() => navigate(`/`)}
            className="font-mono text-xl font-bold "
          >
            <span className="hidden sm:inline">
              Github <span className="text-[#4337C9]">ID Card</span> Maker
            </span>
            <span className="sm:hidden text-[#4337C9]">GICM</span>
          </a>

          <div className="hidden sm:flex">
            <a
              onClick={() => navigateTo("/")}
              className="hover:text-[#4337C9] px-4"
            >
              Home
            </a>
            <a
              onClick={() => navigateTo("/about")}
              className="cursor-pointer hover:text-[#4337C9] px-4"
            >
              About
            </a>
            <a
              onClick={() => navigateTo("/contact")}
              className="hover:text-[#4337C9] px-4"
            >
              Contact
            </a>
          </div>

          <div className="sm:hidden">
            <button
              className="text-gray-500 hover:text-[#4337C9] focus:outline-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <svg
                className="w-6 h-6 m-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg">
                <a
                  onClick={() => navigateTo("/")}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Home
                </a>
                <a
                  onClick={() => navigateTo("/about")}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  About
                </a>
                <a
                  onClick={() => navigateTo("/contact")}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Contact
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
