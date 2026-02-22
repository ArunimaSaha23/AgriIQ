import React, { useState } from "react";
import faq_img from '../assets/faq_img.jpg'
import faq_img1 from '../assets/faq_img1.jpg'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How does the plant disease detection work?",
      answer: "Our AI analyzes your uploaded plant photo using ONNX deep learning models to detect diseases, pests, and nutrient deficiencies instantly."
    },
    {
      question: "Which crops are supported by the app?",
      answer: "We currently support major crops like rice, wheat, maize, tomato, potato, and over 30 others. More crops are added regularly!"
    },
    {
      question: "Is this service free?",
      answer: "Yes! The basic disease detection and crop history features are completely free to use."
    },
  ];

  return (
    <section className="w-full relative grid grid-cols-1 lg:grid-cols-[35%_65%] overflow-visible">

      {/* LEFT SIDE — green bg, image anchored to its right edge */}
      <div className="bg-[#b0a94c] relative flex justify-center items-center py-20 px-6 overflow-visible">
        <div>
          <img src={faq_img1} className="absolute inset-0 w-full h-full object-cover z-0" alt="" />
        </div>

        {/* Floating image — straddles the green/white boundary */}
        <div className="hidden lg:block absolute right-0 translate-x-1/2 z-20">
          <div className="relative">
            <img
              src={faq_img}
              className="rounded-2xl w-[320px] h-[400px] object-cover shadow-xl"
              alt="FAQ illustration"
            />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#F4C542] text-white px-10 py-4 rounded-xl shadow-lg text-center whitespace-nowrap">
              <p className="text-sm font-medium">Call us Anytime</p>
              <p className="text-2xl font-bold">9999888222</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE — FAQ content, padded left to make room for image */}
      <div className="bg-white py-20 px-8 lg:pl-52 lg:pr-16 z-10">
        <p className="text-yellow-600 font-grace text-lg">Frequently Asked Questions</p>
        <h2 className="text-4xl font-bold mt-1 mb-10">You've Any Questions</h2>

        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-[#F8F8F8] rounded-xl p-5 mb-5 shadow-sm cursor-pointer"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-lg">{faq.question}</p>
              <div
                className={`bg-[#C6D446] p-3 rounded-xl transition-transform duration-300 ${
                  openIndex === index ? "rotate-90" : ""
                }`}
              >
                ➜
              </div>
            </div>

            <div
              className={`overflow-hidden transition-all duration-500 ${
                openIndex === index ? "max-h-40 mt-4" : "max-h-0"
              }`}
            >
              <p className="text-gray-600 text-sm">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}