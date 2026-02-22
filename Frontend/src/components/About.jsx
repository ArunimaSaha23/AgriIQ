import React from 'react'
import aboutImg from '../assets/aboutImg.png';
import contactImg from '../assets/contactImg.png';
import servicesImg from '../assets/servicesImg.png';
import footer from '../assets/footer.png';
import ServicesSection from './Services';
import FAQSection from './FAQSection';
import Footer from './Footer';

const About = () => {
  return (
    <div className='mt-24'>
      <img src={ aboutImg } alt="about" />
    </div>
  )
}

export default About