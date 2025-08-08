import React, { useState, useContext, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Edit3, Save, Globe } from 'lucide-react';
import { Camera, X, Check } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import profile_background from '../assets/profile_background.jpg';

export default function MyProfile() {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);

  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    loadUserProfileData();
  }, []);

  // Initialize userData with default values if missing
  useEffect(() => {
    if (userData && (!userData.gender || !userData.language)) {
      setUserData(prev => ({
        ...prev,
        gender: prev.gender || 'Male', // Default value
        language: prev.language || 'English', // Default value
        address: prev.address || { line1: '', line2: '' }
      }));
    }
  }, [userData, setUserData]);

  const handleInputChange = (field, value) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (line, value) => {
    setUserData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [line]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name || '');
      formData.append('email', userData.email || '');
      formData.append('phone', userData.phone || '');
      formData.append('gender', userData.gender || 'Male');
      formData.append('language', userData.language || 'English');
      formData.append('address', JSON.stringify(userData.address || {}));
      if (image) formData.append('image', image);

      // Debug: Log what's being sent
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: { token },
      });

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEditing(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  // Helper function to get image URL
  const getImageUrl = () => {
    if (image) {
      return URL.createObjectURL(image);
    }
    if (userData.image) {
      // If image path starts with /uploads, prepend backend URL
      if (userData.image.startsWith('/uploads')) {
        return `${backendUrl}${userData.image}`;
      }
      // If it's already a full URL or base64, use as is
      return userData.image;
    }
    return null;
  };

  return userData && (
    <div className="min-h-screen bg-gradient-to-br from-[#c7f0a8] via-[#7dc788] to-[#275d4f] pt-20">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header with improved gradient */}
          <div
            className="h-40 relative overflow-hidden bg-cover bg-center "
            style={{ backgroundImage: `url(${profile_background})` }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10  blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10  blur-2xl"></div>
          </div>

          <div className="relative px-8 pb-8">
            {/* Enhanced Profile Image */}
            <div className="absolute -top-20 left-8">
              <label htmlFor="profileImage" className={`cursor-pointer relative group ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}>
                <div className="w-40 h-40 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center overflow-hidden transition-all duration-300 hover:shadow-2xl">
                  {getImageUrl() ? (
                    <img src={getImageUrl()} className="w-full h-full object-cover" alt="profile" />
                  ) : (
                    <User className="w-20 h-20 text-blue-500" />
                  )}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-white mx-auto mb-2" />
                        <span className="text-white text-sm font-medium">Change Photo</span>
                      </div>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <input
                    type="file"
                    id="profileImage"
                    hidden
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                )}
              </label>
            </div>

            {/* Profile Header with improved spacing */}
            <div className="pt-24">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                    {userData.name || 'User Name'}
                  </h1>
                  <p className="text-gray-500 text-lg">Profile Settings</p>
                </div>

                <div className="flex space-x-3">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
                    >
                      <Edit3 className="w-5 h-5" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                      >
                        <X className="w-5 h-5" />
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                      >
                        <Check className="w-5 h-5" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Contact Information */}
              <div className="border-t border-gray-200 pt-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="flex items-center mb-8">
                      <div className="w-2 h-8 bg-gradient-to-b from-[#7dc788] to-[#275d4f] rounded-full mr-4"></div>
                      <h3 className="text-2xl font-bold text-gray-800">Contact Information</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Email */}
                      <div className="group">
                        <div className="flex items-start space-x-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300">
                          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Mail className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Email Address</label>
                            {isEditing ? (
                              <input
                                type="email"
                                value={userData.email || ''}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 font-medium"
                                placeholder="Enter email address"
                              />
                            ) : (
                              <p className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium text-lg">
                                {userData.email || 'No email provided'}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="group">
                        <div className="flex items-start space-x-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:shadow-lg transition-all duration-300">
                          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Phone className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Phone Number</label>
                            {isEditing ? (
                              <input
                                type="tel"
                                value={userData.phone || ''}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 font-medium"
                                placeholder="Enter phone number"
                              />
                            ) : (
                              <p className="text-green-600 hover:text-green-700 cursor-pointer font-medium text-lg">
                                {userData.phone || 'No phone provided'}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="mt-8">
                      <div className="flex items-start space-x-4 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:shadow-lg transition-all duration-300">
                        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Address</label>
                          {isEditing ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={userData.address?.line1 || ''}
                                onChange={(e) => handleAddressChange('line1', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 font-medium"
                                placeholder="Street Address"
                              />
                              <input
                                type="text"
                                value={userData.address?.line2 || ''}
                                onChange={(e) => handleAddressChange('line2', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 font-medium"
                                placeholder="City, State, ZIP Code"
                              />
                            </div>
                          ) : (
                            <div className="text-gray-700 font-medium text-lg">
                              <p>{userData.address?.line1 || 'No address provided'}</p>
                              {userData.address?.line2 && <p className="text-gray-600">{userData.address.line2}</p>}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Basic Information */}
                <div className="mt-12">
                  <div className="flex items-center mb-8">
                    <div className="w-2 h-8 bg-gradient-to-b from-[#7dc788] to-[#275d4f] rounded-full mr-4"></div>
                    <h3 className="text-2xl font-bold text-gray-800">Basic Information</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-100 hover:shadow-lg transition-all duration-300">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Gender</label>
                      {isEditing ? (
                        <select
                          value={userData.gender || 'Male'}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 font-medium bg-white"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <p className="text-gray-800 font-medium text-lg">{userData.gender || 'Not specified'}</p>
                      )}
                    </div>

                    <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-100 hover:shadow-lg transition-all duration-300">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Language</label>
                      {isEditing ? (
                        <select
                          value={userData.language || 'English'}
                          onChange={(e) => handleInputChange('language', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 font-medium bg-white"
                        >
                          <option value="">Select Language</option>
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                          <option value="Hindi">Hindi</option>
                        </select>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <Globe className="w-5 h-5 text-teal-500" />
                          <span className="text-gray-800 font-medium text-lg">{userData.language || 'Not specified'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}