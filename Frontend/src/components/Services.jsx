import React from "react";
import services_icon1 from '../assets/services_icon1.png'
import services_icon2 from '../assets/services_icon2.png'
import service_img3 from '../assets/service_img3.jpg'
import service_img4 from '../assets/service_img4.jpg'

export default function ServicesSection() {
  return (
    <section className="w-full bg-[#FAF8EF] py-10 px-4">
      <div className="text-center mb-16">
        <p className="text-yellow-600 font-grace text-lg">Our Services</p>
        <h2 className="text-4xl font-bold mt-2">What We Offer</h2>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10  -mt-6">
        {/* Card 1 */}
        <div className="relative bg-white shadow-xl rounded-xl overflow-hidden hover:scale-[1.02] transition-transform">
          <img
            src={service_img3}
            alt="AI Detection"
            className="w-full h-80 object-cover"
          />

          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">AI-Powered Disease Detection</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Upload or snap a photo of your plant — our AI instantly detects diseases,
              pests, and nutrient deficiencies with high accuracy.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="relative bg-white shadow-xl rounded-xl overflow-hidden hover:scale-[1.02] transition-transform">
          <img
            src={service_img4}
            alt="Crop Health"
            className="w-full h-80 object-cover"
          />

          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">Crop Health History</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Track your crop’s health over time with a personal dashboard that logs
              images, diagnoses, and actions taken.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
