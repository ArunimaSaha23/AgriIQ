import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import logo4 from '../assets/logo4.png';
import logo3 from '../assets/logo3.png';
import login_background from '../assets/login_background.jpg';

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', {
          name,
          password,
          email,
        });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', {
          password,
          email,
        });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#c7f0a8] via-[#7dc788] to-[#275d4f] p-4">
      <div className="flex w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-green-200/50 backdrop-blur-sm bg-white/90">
        
        {/* Left pane - Form */}
        <div className="flex-1 p-8 flex flex-row justify-center bg-white rounded-l-3xl">
          <form
            className="flex flex-col items-center gap-6 w-full max-w-md"
            onSubmit={onSubmitHandler}
          >
            {/* Logo Section */}
            <div className="flex items-center space-x-3 mb-2">
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
            </div>
            
            <p className="text-sm text-gray-600 text-center mb-4">
              Please {state === 'Sign Up' ? 'sign up' : 'log in'} to use all our features
            </p>

            {/* Form Fields Container - Fixed Height */}
            <div className="w-full space-y-5 min-h-[280px] flex flex-col justify-start">
              
              {/* Full Name Field - Animated */}
              <div className={`w-full transition-all duration-500 ease-in-out ${
                state === 'Sign Up' 
                  ? 'opacity-100 transform translate-y-0 max-h-20' 
                  : 'opacity-0 transform -translate-y-4 max-h-0 overflow-hidden'
              }`}>
                <label className="text-green-800 text-sm font-semibold block mb-2">
                  Full Name
                </label>
                <input
                  className="border-2 border-gray-200 rounded-xl w-full p-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="Enter your full name"
                  required={state === 'Sign Up'}
                />
              </div>

              {/* Email Field */}
              <div className="w-full">
                <label className="text-green-800 text-sm font-semibold block mb-2">
                  Email Address
                </label>
                <input
                  className="border-2 border-gray-200 rounded-xl w-full p-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="w-full">
                <label className="text-green-800 text-sm font-semibold block mb-2">
                  Password
                </label>
                <input
                  className="border-2 border-gray-200 rounded-xl w-full p-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white w-full py-4 rounded-xl text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {state === 'Sign Up' ? 'Create Account' : 'Login'}
            </button>

            {/* Toggle Link */}
            <p className="text-center text-sm text-gray-600 mt-4">
              {state === 'Sign Up' ? (
                <>
                  Already have an account?{' '}
                  <span
                    onClick={() => setState('Login')}
                    className="text-green-600 font-semibold cursor-pointer hover:text-green-700 underline decoration-2 underline-offset-2 transition-colors duration-200"
                  >
                    Login here
                  </span>
                </>
              ) : (
                <>
                  New to the platform?{' '}
                  <span
                    onClick={() => setState('Sign Up')}
                    className="text-green-600 font-semibold cursor-pointer hover:text-green-700 underline decoration-2 underline-offset-2 transition-colors duration-200"
                  >
                    Sign up
                  </span>
                </>
              )}
            </p>
          </form>
        </div>

        {/* Right pane - Welcome Section */}
        <div
          className="hidden md:flex flex-1 flex-col justify-center items-center bg-cover bg-center text-white px-8 py-12 rounded-r-3xl relative overflow-hidden"
          style={{ backgroundImage: `url(${login_background})` }}
        >
          
          
          {/* Content */}
          <div className="relative z-10 text-center max-w-sm">
            <div className="text-6xl mb-6">🌾</div>
            <h2 className="text-3xl font-bold mb-4 leading-tight">
              Welcome back!
            </h2>
            <p className="text-green-100 text-lg leading-relaxed mb-8">
              We're happy to have you again. Detect diseases early, protect your crops, and farm smarter with us!
            </p>
            
            {/* Call to Action */}
            <div className="border-t border-green-400/30 pt-6">
              <p 
                onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}
                className="text-green-200 hover:text-white cursor-pointer transition-colors duration-200 font-medium"
              >
                {state === 'Sign Up' ? 'Already have an account?' : 'No account yet? Sign up!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Login;

