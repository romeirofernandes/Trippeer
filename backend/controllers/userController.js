const User = require("../models/user");

exports.registerOrLogin = async (req, res) => {
  try {
    const { name, email, firebaseUID, profilePic } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      user.lastLogin = new Date();

      // Update firebaseUID if it has changed (e.g., if user previously used email and now uses Google)
      if (user.firebaseUID !== firebaseUID) {
        user.firebaseUID = firebaseUID;
      }

      // Update profile picture if provided
      if (profilePic) {
        user.profilePic = profilePic;
      }

      await user.save();
    } else {
      user = new User({
        name,
        email,
        firebaseUID,
        profilePic: profilePic || "",
        lastLogin: new Date(),
      });
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "User authenticated successfully",
      user,
    });
  } catch (error) {
    console.error("Error in user authentication:", error);
    res.status(500).json({
      success: false,
      message: "Server error during authentication",
      error: error.message,
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const firebaseUID = req.params.firebaseUID;
    const user = await User.findOne({ firebaseUID });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
