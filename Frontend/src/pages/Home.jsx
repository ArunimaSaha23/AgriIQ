import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import ServicesSection from '../components/Services';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';


const Home = () => {
  return (
    <div className="relative">

      <Hero />

      <div id="about">
        <About />
      </div>

      <div id="services">
        <ServicesSection />
      </div>

      <div id="contact">
        <FAQSection />
      </div>

      <Footer />

    </div>
  );
};

export default Home;

