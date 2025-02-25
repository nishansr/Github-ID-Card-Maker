import React from "react";

interface FeatureCardProps {
  image: string;
  title: string;
  subtitle: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  image,
  title,
  subtitle,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
      <img src={image} alt={title} className="w-16 h-16 mb-4" />
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
};

export default FeatureCard;
