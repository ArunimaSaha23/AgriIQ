import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';

const Home = () => {
  return (
    <div className="relative">
      <Hero />
      <About />
    </div>
  );
};

export default Home;
