// //here we can create the user we can allow the user to login

// import cloudinary from "../lib/cloudinary.js";
// import { generateToken } from "../lib/utils.js";
// import User from "../models/user.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// // //user sign new user
// // export const signup = async (req, res) => {
// //   const { fullName, email, password, bio } = req.body;
// //   try {
// //     if (!fullName || !email || !password || !bio) {
// //       return res.json({ success: false, message: "Missing details" });
// //     }
// //     const user = await User.findOne({ email });

// //     if (user) {
// //       return res.json({ success: false, message: "Account already exits" });
// //     }

// //     const salt = await bcrypt.genSalt(10);
// //     const hashPassword = await bcrypt.hash(password, salt);

// //     const newUser = await User.create({
// //       fullName,
// //       email,
// //       password: hashPassword,
// //       bio,
// //     });

// //     //we can authanciate the user using the token
// //     const token = generateToken(newUser._id);
// //     res.json({
// //       success: true,
// //       userData: newUser,
// //       token,
// //       message: "Account created successfully",
// //     });
// //   } catch (err) {
// //     //
// //     console.log(err.message);
// //     res.json({ success: false, message: err.message });
// //   }
// // };

// export const signup = async (req, res) => {
//   const { fullName, email, password, bio } = req.body;
//   try {
//     if (!fullName || !email || !password || !bio) {
//       return res.json({ success: false, message: "Missing details" });
//     }

//     const normalizedEmail = email.toLowerCase(); // normalize for consistency

//     const user = await User.findOne({ email: normalizedEmail });

//     if (user) {
//       return res.json({ success: false, message: "Account already exists" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashPassword = await bcrypt.hash(password, salt);

//     const newUser = await User.create({
//       fullName,
//       email: normalizedEmail,
//       password: hashPassword,
//       bio,
//     });

//     const token = generateToken(newUser._id);
//     res.json({
//       success: true,
//       userData: newUser,
//       token,
//       message: "Account created successfully",
//     });
//   } catch (err) {
//     console.log(err.message);
//     res.json({ success: false, message: err.message });
//   }
// };


// //controller to login a user

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const userData = await User.findOne({ email });
//     const isPasswordCorrect = await bcrypt.compare(password, userData.password);
//     if (!isPasswordCorrect) {
//       return res.json({ success: false, message: "Invalid credentials" });
//     }

//     //if the user exits then we have to generate the token for authentication pusrpose

//     const token = generateToken(userData._id);
//     res.json({ success: true, userData, token, message: "Login successful" });
//   } catch (err) {
//     console.log(err.message);
//     res.json({ success: false, message: err.message });
//   }
// };

// //Controller to check if user is authenticated or not

// export const checkAuth = (req, res) => {
//   res.json({ success: true, user: req.user });
// };

// //controller to update the user profile details
// export const updateProfile = async (req, res) => {
//   try {
//     const { profilePic, bio, fullName } = req.body;
//     //here we got the id of the user
//     const userId = req.user._id;
//     let updatedUser;
//     if (!profilePic) {
//       // await User.findByIdAndUpdate(userId,{bio,fullName},{new: true})
//       updatedUser = await User.findByIdAndUpdate(
//         userId,
//         { bio, fullName },
//         { new: true }
//       );
//     } else {
//       const upload = await cloudinary.uploader.upload(profilePic);
//       updatedUser = await User.findByIdAndUpdate(
//         userId,
//         { profilePic: upload.secure_url, bio, fullName },
//         { new: true }
//       );
//     }

//     res.json({ success: true, user: updatedUser });
//   } catch (err) {
//     console.log("error while profile update", err.message);
//     res.json({ success: false, message: err.message });
//   }
// };


import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// SIGNUP
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;
  try {
    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing details" });
    }

    const normalizedEmail = email.toLowerCase(); // normalize for consistency
    const user = await User.findOne({ email: normalizedEmail });

    if (user) {
      return res.json({ success: false, message: "Account already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email: normalizedEmail,
      password: hashPassword,
      bio,
    });

    const token = generateToken(newUser._id);
    res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(userData._id);
    res.json({ success: true, userData, token, message: "Login successful" });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

// CHECK AUTH
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    let updatedUser;
    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    }

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.log("error while profile update", err.message);
    res.json({ success: false, message: err.message });
  }
};
