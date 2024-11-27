import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import UserModel from "../models/user.js";
import bcryptjs from "bcryptjs";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  const { token } = req.body; // Receive the token from frontend
  // console.log(token)

  try {
    // Verify the ID token with Google's OAuth2 client
    const ticket = await client.verifyIdToken({
      idToken: req.body.token, // Token received from frontend
      audience: process.env.GOOGLE_CLIENT_ID, // Ensure the token is for your app
    });

    const payload = ticket.getPayload(); // Contains user's Google profile info

    const { email, name } = payload; // Extract email and name from the payload
    console.log(payload);
    // Check if user exists in database
    let user = await UserModel.findOne({ email });

    const password = "Test@123";
    const hashpassword = await bcryptjs.hash(password, 10);
    if (!user) {
      // Create new user with default role ('user')
      user = await UserModel.create({
        name,
        email,
        role: "user",
        password: hashpassword,
      });
    }

    // Generate JWT token for your app
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.cookie('token', token, {
      httpOnly: true, // Prevent access via JavaScript
      secure: true,   // Ensure cookies are sent only over HTTPS
      sameSite: 'None', // Required for cross-origin cookies
      maxAge: 24 * 60 * 60 * 1000, // Optional: cookie expiration (1 day)
  });


    res.status(200).json({
      message: "success",
      user,
    });
  } catch (err) {
    console.error("Error during Google Auth:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
