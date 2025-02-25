import React, { useEffect } from "react";

interface CustomAlertProps {
  message: string;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className="fixed bottom-10 right-4 items-center justify-center ">
      <div className="border border-gray-300 text-white font-mono bg-[#fa0000] px-4 py-3 rounded grid grid-cols-1 gap-10 mt-20 ">
        {message}
      </div>
    </div>
  );
};

export default CustomAlert;
