import { useState } from "react";

const AboutScreen = () => {
  const faqs = [
    {
      question: "What is GitHub ID Card Maker?",
      answer:
        "GitHub ID Card Maker is a tool that allows you to create a personalized ID card for your GitHub profile. It uses AI to generate a professional and unique ID card based on your GitHub username.",
    },
    {
      question: "How do I create my GitHub ID card?",
      answer:
        "Simply enter your GitHub username on the home page and click 'Create'. You will be taken to a page where you can select from different ID card templates and download your personalized ID card.",
    },
    {
      question: "Is my GitHub data safe?",
      answer:
        "Yes, your GitHub data is safe. We only fetch public information from your GitHub profile to generate the ID card. No personal or sensitive information is stored.",
    },
    {
      question: "Can I customize my ID card?",
      answer:
        "Yes, you can choose from a variety of templates to create your unique ID card. Each template offers a different design and layout.",
    },
    {
      question: "How can I contact support?",
      answer:
        "If you have any questions or need support, you can contact us at support@githubidcardmaker.com.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 mt-25">
      <h1 className="text-4xl font-bold text-center text-[#4337C9] mb-8">
        About GitHub ID Card Maker
      </h1>
      <p className="text-lg text-center mb-8">
        GitHub ID Card Maker is a tool designed to help you create a
        personalized ID card for your GitHub profile. Our AI-powered tool makes
        it easy to generate a professional and unique ID card that showcases
        your GitHub identity.
      </p>
      <h2 className="text-3xl font-bold text-center text-[#4337C9] mb-6 mt-15">
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-300 bg-white shadow-md rounded-lg"
          >
            <button
              className="w-full text-left pt-5 pb-3 px-6 focus:outline-none flex justify-between items-center"
              onClick={() => toggleFAQ(index)}
            >
              <h5 className="font-mono font-medium mb-2">{faq.question}</h5>
              <span className="ml-4">{openIndex === index ? "▲" : "▼"}</span>
            </button>
            {openIndex === index && (
              <div className="p-6 pt-0">
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutScreen;
