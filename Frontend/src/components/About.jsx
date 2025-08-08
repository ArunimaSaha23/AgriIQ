import React from 'react'
import aboutImg from '../assets/aboutImg.png';
import contactImg from '../assets/contactImg.png';
import servicesImg from '../assets/servicesImg.png';
import footer from '../assets/footer.png';

const About = () => {
  return (
    <div className='mt-24'>
      <img src={ aboutImg } alt="about" />
      <img src={ servicesImg }alt="services" />
      <img src={ contactImg } alt="contact" />
      <img src={ footer } alt="footer" />
    </div>
  )
}

export default About