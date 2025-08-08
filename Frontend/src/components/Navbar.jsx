import React from 'react';
import { Link } from 'react-router-dom';
import logo4 from '../assets/logo4.png';
import logo3 from '../assets/logo3.png';

function Navbar({ isDarkBackground = true }) {
  const textColor = isDarkBackground ? 'text-white' : 'text-gray-800';
  const hoverColor = isDarkBackground ? 'hover:text-gray-200' : 'hover:text-green-600';
  const bgColor = isDarkBackground ? 'bg-transparent' : 'bg-white';
  
  // Check if user is logged in by checking for token in localStorage
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    // You might want to redirect to home page or refresh the component
    window.location.href = '/';
  };

  return (
    <nav className={`flex justify-between items-center px-5 py-2.5 absolute top-0 w-full ${bgColor} z-[999] ${!isDarkBackground ? 'shadow-md' : ''}`}>
      {/* Logo Section */}
      <Link to="/" className="flex items-center space-x-2 no-underline">
        <img 
          src={logo3} 
          alt="AgriIQ Icon" 
          className="w-10 h-10 object-contain flex-shrink-0"
        />
        <img 
          src={logo4} 
          alt="AgriIQ" 
          className="h-8 object-contain flex-shrink-0"
        />
      </Link>

      {/* Navigation Links */}
      <ul className="list-none flex m-0 p-0 ml-7 gap-3 ">
        <li className="mx-4 relative">
          <Link 
            className={`${textColor} no-underline ${hoverColor} transition-colors duration-200`}
            to="/"
          >
            Home
          </Link>
        </li>
        <li className="mx-4 relative">
          <Link 
            className={`${textColor} no-underline ${hoverColor} transition-colors duration-200`}
            to="/about"
          >
            About
          </Link>
        </li>
        <li className="mx-4 relative">
          <Link 
            className={`${textColor} no-underline ${hoverColor} transition-colors duration-200`}
            to="/services"
          >
            Services
          </Link>
        </li>
        <li className="mx-4 relative">
          <Link 
            className={`${textColor} no-underline ${hoverColor} transition-colors duration-200`}
            to="/contact"
          >
            Contact
          </Link>
        </li>
      </ul>

      {/* Right Side Links */}
      <div className="flex items-center space-x-4 mr-4 gap-1">
        {isLoggedIn ? (
          // Show these links only when user is logged in
          <>
            <Link 
              className={`${textColor} no-underline ${hoverColor} transition-colors duration-200`}
              to="/history"
            >
              History
            </Link>
            <Link 
              className={`${textColor} no-underline ${hoverColor} transition-colors duration-200`}
              to="/my-profile"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className={`${textColor} no-underline ${hoverColor} transition-colors duration-200 bg-transparent border border-white rounded-md px-3 py-1 cursor-pointer`}
            >
              Logout
            </button>
          </>
        ) : (
          // Show this link only when user is not logged in
          <Link 
            className={`${textColor} no-underline ${hoverColor} transition-colors duration-200 border border-white rounded-md px-3 py-1 mr-4`}
            to="/login"
          >
            Create Account
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;