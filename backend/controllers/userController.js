import User from "../models/user.js"; 
import { emailVerificationTemplate, sendEmail, passwordResetTemplate } from "../utils/mail.js";
import generateToken from "../utils/generateToken.js";
import Token from "../models/token.js";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";


// Register a new user
const registerUser = asyncHandler(async (req, res) => {
    const { name,   email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        throw new Error("Passwords does not match");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists with this email");
    }

    const newUser = await new User({ name, email, password }).save();

    // Create a verification token for the user
    const token = await new Token({
        userId: newUser._id,
        token: uuidv4(),
        type: 'verification',
    }).save();

    // Generate an email verification link
    const link = `${process.env.BASE_URL}/verify/${newUser._id}/${token.token}`;

    // Send the email verification link
    const htmlContent = emailVerificationTemplate(link, newUser);
    await sendEmail(newUser.email, "Email Verification", htmlContent);

    return res.status(201).json({ message: "User registered successfully. Please check your email to verify your account." });
});




// Verify user's email
const verifyToken = asyncHandler(async (req, res) => {
    const { id, token } = req.params;
    console.log(token)
  
    const user = await User.findById(id);
  
    if (!user) {
        return res.status(400).redirect(`http://localhost:3000/?error=${encodeURIComponent('User not found')}`);
    }
  
    const userToken = await Token.findOne({
      userId: user._id,
      token: token,
      type: "verification",
    });
  
    if (!userToken) {
        return res.status(400).redirect(`http://localhost:3000/?error=${encodeURIComponent('Expired or invalid token.')}`);
    }
  
    // Token is valid, update the user and delete the token
    await User.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true }
    );
  
    await Token.findByIdAndDelete(userToken._id);
    res.status(200).redirect(`http://localhost:3000/login?message=${encodeURIComponent("Email verified successfully. you can login")}`);
  });


// Login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try{
        // Find the user by email
    const user = await User.findOne({ email }).populate('myPosts');
    

    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }

    // Check if the password matches
    const isMatch = await user.isPasswordMatch(password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if the user is verified
    if (!user.isVerified) {
        const tokenUser = await Token.findOne({ userId: user._id, type: 'verification' });

        if (tokenUser) {
            throw new Error("User is not verified. Check your email for the verification link.");
        } else {
            // Create a new token for the user
            const token = await new Token({
                userId: user._id,
                token: uuidv4(),
                type: 'verification',
            }).save();

            const link = `${process.env.BASE_URL}/verify/${user._id}/${token.token}`;
            const htmlContent = emailVerificationTemplate(link, user);

            // Send the verification email
            await sendEmail(user.email, 'Account Verification', htmlContent);

            console.log('Verification email sent');
            throw new Error("User is not verified. Check your email for the verification link.");
        }
    }

    // Generate and send JWT token
    generateToken(res, user._id);

    // Prepare user response object
    const userRes = {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
        myPosts: user.myPosts,
    };
    

    // Send success response
    return res.status(200).json({ message: "User logged in successfully", user: userRes });

    }catch(error){
        console.log(error.message)
        return res.status(401).json({ error: error.message });
    }
   

    
});


// Request password reset
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new Error("Email is required");
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("No user found with this email");
    }

    // Check if user is verified
    if (!user.isVerified) {
        let tokenUser = await Token.findOne({ userId: user._id, type: 'verification' });

        if (tokenUser) {
            throw new Error("User is not verified. Check your email for the verification link.");
        }

        // Create a new verification token for the user if not verified
        const verificationToken = await new Token({
            userId: user._id,
            token: uuidv4(),
            type:'verification',
        }).save();

        const verificationLink = `${process.env.BASE_URL}/${user._id}/verify/${verificationToken.token}`;
        const htmlContent = emailVerificationTemplate(verificationLink, user);

        // Send the verification email
        await sendEmail(user.email, 'Account Verification', htmlContent);
        console.log('Verification email sent');
        throw new Error("User is not verified. Check your email for the verification link.");
    }

    // Check if there is an existing password reset token for the user
    let tokenUser = await Token.findOne({ userId: user._id, type: 'passwordReset' });

    if (tokenUser) {
        throw new Error("A password reset link has already been sent. Please check your email.");
    }

    // Create a new password reset token for the user
    const passwordResetToken = await new Token({
        userId: user._id,
        token: uuidv4(),
        type: 'passwordReset',
    }).save();

    // Construct the password reset link
    const resetLink = `${process.env.BASE_URL}/resetpassword/${user._id}/${passwordResetToken.token}`;
    const htmlContent = passwordResetTemplate(resetLink, user);

    // Send the password reset email
    await sendEmail(user.email, 'Password Reset', htmlContent);
    console.log('Password reset email sent');
    return res.status(200).json({ message: 'Password reset email sent. Check your email for the reset link.' });

});


// Reset user's password
const resetPassword = asyncHandler(async (req, res) => {
    const { id, token } = req.params;
    const user = await User.findById(id);
  
    if (!user) {
        return res.status(400).redirect(`http://localhost:3000/login?error=${encodeURIComponent('User not found')}`);
    }
  
    const userToken = await Token.findOne({
        userId: user._id,
        token: token,
        type: 'passwordReset',
    });
  
    if (!userToken) {
        return res.status(400).redirect(`http://localhost:3000/login?error=${encodeURIComponent('Invalid or expired token')}`);
    }

    // The TTL index will automatically remove expired tokens, but you can manually remove it after use
    await userToken.deleteOne();

    // Redirect to the password update page
    return res.status(200).redirect(`http://localhost:3000/update/?id=${user._id}&message=${encodeURIComponent('Please update your password')}`);
});


// Update user's password
const updatePassword = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { password, confirmPassword } = req.body;

    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
        return res.status(400).json({ error: "No user found with this ID" });
    }
    

    // Validate and compare passwords
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashPw = await bcrypt.hash(password, salt);

    // Update the user's password
    await User.findByIdAndUpdate(
        id,
        { password: hashPw },
        { new: true }
    );


    // Return success response
    return res.status(200).json({
        message: "Password reset successful",
    });
});

// Logout user
const logOut = asyncHandler(async (req, res) => {
   
    const token = req.cookies.jwtBlogToken || "";

    if (token) {
        // Clear the JWT token
        res.cookie('jwtBlogToken', '', {
            httpOnly: true,
            expires: new Date(0), // Expire the token immediately
            secure: process.env.NODE_ENV === 'production', // Only set secure flag in production
            sameSite: 'Strict' // Helps mitigate CSRF attacks
        });
        console.log('JWT token cleared');
        return res.status(200).json({ message: "Logged out successfully" });
    } else {
        return res.status(400).json({ message: "User not logged in" });
    }
});


//get user profile

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
 
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const userObj = user.toObject();
    const { password, ...userWithoutPassword } = userObj;

    res.status(200).json({
        message: "User profile fetched successfully",
        user: userWithoutPassword,
    });
});



export { loginUser,  verifyToken, registerUser, forgotPassword, resetPassword, updatePassword, getUserProfile, logOut };


  
  
