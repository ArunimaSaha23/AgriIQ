import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import path from 'path';
import fs from 'fs';

//Api to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check for missing fields
        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid email" });
        }

        // Check password strength
        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a strong password" });
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({ success: true, token })



    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: error.message });
    }

}
export { registerUser };

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User does not exist' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid Credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.json({ success: true, token });

  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

export { loginUser };

// //Api to get user profile data
// Get user profile data
const getProfile = async (req, res) => {
    try {
        // Get userId from req.user (set by auth middleware) instead of req.body
        const userId = req.user.id;
        
        const userData = await userModel.findById(userId).select('-password');
        
        if (!userData) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        res.json({ success: true, userData });

    } catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}

export { getProfile };

// //Api to update user profile

// const updateProfile = async (req, res) => {
//     try {
//         // Get userId from authenticated user, not from req.body
//         const userId = req.user.id;
//         const { name, phone, address, dob, gender } = req.body;
//         const imageFile = req.file;

//          console.log('Image file received:', imageFile);

//         if (!name || !phone || !dob || !gender) {
//             return res.status(400).json({ success: false, message: "Data Missing" });
//         }

//         // Parse address if it's a string
//         let parsedAddress = address;
//         if (typeof address === 'string') {
//             try {
//                 parsedAddress = JSON.parse(address);
//             } catch (parseError) {
//                 return res.status(400).json({ success: false, message: "Invalid address format" });
//             }
//         }

//         // Update base profile data
//         const updateData = {
//             name,
//             phone,
//             address: parsedAddress,
//             dob,
//             gender,
//             updatedAt: new Date()
//         };

//         // If new image is uploaded
//         if (imageFile) {
//             const imagePath = `/uploads/${imageFile.filename}`; // URL-style path
//             console.log('Image path to save:', imagePath);
//             // Get current user to check for existing image
//             const user = await userModel.findById(userId);
            
//             // Delete old image if exists
//             if (user && user.profileImage) {
//                 const oldImagePath = path.join('public', user.profileImage);
//                 if (fs.existsSync(oldImagePath)) {
//                     try {
//                         fs.unlinkSync(oldImagePath);
//                         console.log('Old image deleted:', oldImagePath);
//                     } catch (deleteError) {
//                         console.error('Error deleting old image:', deleteError);
//                         // Continue execution - don't fail the update
//                     }
//                 }
//             }
            
//             // Add image path to update data
//             updateData.profileImage = imagePath;
//         }
//          console.log('Update data:', updateData);

//         // Update user profile
//         const updatedUser = await userModel.findByIdAndUpdate(
//             userId, 
//             updateData,
//             { new: true, select: '-password' }
//         );
//         console.log('Updated user from DB:', updatedUser);

//         if (!updatedUser) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         res.json({ 
//             success: true, 
//             message: "Profile Updated",
//             userData: updatedUser
//         });

//     } catch (error) {
//         console.error('Update profile error:', error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

// export { updateProfile };
// const updateProfile = async (req, res) => {
//     try {
//         // Get userId from authenticated user, not from req.body
//         const userId = req.user.id;
//         const { name, phone, address, dob, gender } = req.body;
//         const imageFile = req.file;
        
//         console.log('Image file received:', imageFile);
        
//         if (!name || !phone || !dob || !gender) {
//             return res.status(400).json({ success: false, message: "Data Missing" });
//         }
        
//         // Parse address if it's a string
//         let parsedAddress = address;
//         if (typeof address === 'string') {
//             try {
//                 parsedAddress = JSON.parse(address);
//             } catch (parseError) {
//                 return res.status(400).json({ success: false, message: "Invalid address format" });
//             }
//         }
        
//         // Update base profile data
//         const updateData = {
//             name,
//             phone,
//             address: parsedAddress,
//             dob,
//             gender,
//             updatedAt: new Date()
//         };
        
//         // If new image is uploaded
//         if (imageFile) {
//             const imagePath = `/uploads/${imageFile.filename}`; // URL-style path
//             console.log('Image path to save:', imagePath);
            
//             // Get current user to check for existing image
//             const user = await userModel.findById(userId);
            
//             // Delete old image if exists - check for both possible field names
//             if (user && (user.image || user.profileImage)) {
//                 // Check if the existing image is a file path (not base64)
//                 const existingImagePath = user.image || user.profileImage;
                
//                 // Only delete if it's a file path (starts with /uploads) not base64
//                 if (existingImagePath && existingImagePath.startsWith('/uploads')) {
//                     const oldImagePath = path.join('public', existingImagePath);
//                     if (fs.existsSync(oldImagePath)) {
//                         try {
//                             fs.unlinkSync(oldImagePath);
//                             console.log('Old image deleted:', oldImagePath);
//                         } catch (deleteError) {
//                             console.error('Error deleting old image:', deleteError);
//                             // Continue execution - don't fail the update
//                         }
//                     }
//                 }
//             }
            
//             // Add image path to update data - using 'image' field instead of 'profileImage'
//             updateData.image = imagePath;
//         }
        
//         console.log('Update data:', updateData);
        
//         // Update user profile
//         const updatedUser = await userModel.findByIdAndUpdate(
//             userId, 
//             updateData,
//             { new: true, select: '-password' }
//         );
        
//         console.log('Updated user from DB:', updatedUser);
        
//         if (!updatedUser) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }
        
//         res.json({ 
//             success: true, 
//             message: "Profile Updated",
//             userData: updatedUser
//         });
        
//     } catch (error) {
//         console.error('Update profile error:', error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

// export { updateProfile };
const updateProfile = async (req, res) => {
    try {
        // Get userId from authenticated user, not from req.body
        const userId = req.user.id;
        const { name, email, phone, address, dob, gender, language } = req.body;
        const imageFile = req.file;
        
        console.log('Image file received:', imageFile);
        console.log('Request body:', req.body);
        
        // Make dob optional if not provided
        if (!name || !phone || !gender) {
            return res.status(400).json({ success: false, message: "Required fields missing: name, phone, gender" });
        }
        
        // Parse address if it's a string
        let parsedAddress = address;
        if (typeof address === 'string') {
            try {
                parsedAddress = JSON.parse(address);
            } catch (parseError) {
                return res.status(400).json({ success: false, message: "Invalid address format" });
            }
        }
        
        // Update base profile data
        const updateData = {
            name,
            phone,
            address: parsedAddress,
            gender,
            updatedAt: new Date()
        };
        
        // Add optional fields if provided
        if (email) updateData.email = email;
        if (dob) updateData.dob = dob;
        if (language) updateData.language = language;
        
        // If new image is uploaded
        if (imageFile) {
            const imagePath = `/uploads/${imageFile.filename}`; // URL-style path
            console.log('Image path to save:', imagePath);
            
            // Get current user to check for existing image
            const user = await userModel.findById(userId);
            
            // Delete old image if exists - check for both possible field names
            if (user && (user.image || user.profileImage)) {
                // Check if the existing image is a file path (not base64)
                const existingImagePath = user.image || user.profileImage;
                
                // Only delete if it's a file path (starts with /uploads) not base64
                if (existingImagePath && existingImagePath.startsWith('/uploads')) {
                    const oldImagePath = path.join('public', existingImagePath);
                    if (fs.existsSync(oldImagePath)) {
                        try {
                            fs.unlinkSync(oldImagePath);
                            console.log('Old image deleted:', oldImagePath);
                        } catch (deleteError) {
                            console.error('Error deleting old image:', deleteError);
                            // Continue execution - don't fail the update
                        }
                    }
                }
            }
            
            // Add image path to update data - using 'image' field instead of 'profileImage'
            updateData.image = imagePath;
        }
        
        console.log('Update data:', updateData);
        
        // Update user profile
        const updatedUser = await userModel.findByIdAndUpdate(
            userId, 
            updateData,
            { new: true, select: '-password' }
        );
        
        console.log('Updated user from DB:', updatedUser);
        
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        res.json({ 
            success: true,
            message: "Profile Updated",
            userData: updatedUser
        });
        
    } catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
export { updateProfile };