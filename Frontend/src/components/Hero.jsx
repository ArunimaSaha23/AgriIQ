import React from 'react';
import backgroundHero from '../assets/backgroundHero.png';
import FeatureCard from './FeatureCard';

function Hero() {
  return (
    <div className="relative w-full h-[90vh] overflow-visible">
      <img
        src={backgroundHero}
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover brightness-[1.2] -z-10"
      />
      <div className="-ml-12">
        <FeatureCard />
      </div>
    </div>
  );
}

export default Hero;