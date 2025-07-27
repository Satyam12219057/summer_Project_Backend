import User from "../models/user.js";
import jwt from "jsonwebtoken";

// Middleware to protect routes
export const protectRoutes = async (req, res, next) => {
  try {
    // 1. Get token from request headers
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // 2. Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find the user by ID, exclude password
    const user = await User.findById(decoded.id).select("-password");


    // 4. If user doesn't exist
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 5. Attach user to request
    req.user = user;
    next(); // continue to the next middleware/controller
  } catch (err) {
    console.log(err.message);
    return res.status(401).json({ success: false, message: "Unauthorized: " + err.message });
  }
};
