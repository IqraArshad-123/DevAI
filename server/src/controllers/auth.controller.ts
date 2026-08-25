import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

// =====================================================
// REGISTER
// =====================================================

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
      return;
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        theme: user.theme,
        notifications: user.notifications,
        autoSave: user.autoSave,
        responseStyle: user.responseStyle,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while registering user",
    });
  }
};

// =====================================================
// LOGIN
// =====================================================

export const loginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      res.status(500).json({
        success: false,
        message: "JWT secret is not configured",
      });
      return;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      jwtSecret,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        theme: user.theme,
        notifications: user.notifications,
        autoSave: user.autoSave,
        responseStyle: user.responseStyle,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while logging in",
    });
  }
};

// =====================================================
// GET CURRENT USER
// =====================================================

export const getMe = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(
      req.user.userId
    ).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Me Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// =====================================================
// UPDATE PROFILE
// =====================================================

export const updateProfile = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { name, avatar } = req.body;

    if (
      name !== undefined &&
      (
        typeof name !== "string" ||
        name.trim().length < 2 ||
        name.trim().length > 50
      )
    ) {
      res.status(400).json({
        success: false,
        message: "Name must be between 2 and 50 characters",
      });
      return;
    }

    if (
      avatar !== undefined &&
      typeof avatar !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "Avatar must be a valid string",
      });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (name !== undefined) {
      user.name = name.trim();
    }

    if (avatar !== undefined) {
      user.avatar = avatar.trim();
    }

    await user.save();

    const updatedUser = await User.findById(userId).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      success: false,
      message:
        "Something went wrong while updating profile",
    });
  }
};

// =====================================================
// UPDATE SETTINGS
// =====================================================

export const updateSettings = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const {
      theme,
      notifications,
      autoSave,
      responseStyle,
    } = req.body;

    // =================================================
    // VALIDATE THEME
    // =================================================

    if (
      theme !== undefined &&
      !["dark", "light", "system"].includes(theme)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid theme",
      });
      return;
    }

    // =================================================
    // VALIDATE NOTIFICATIONS
    // =================================================

    if (
      notifications !== undefined &&
      typeof notifications !== "boolean"
    ) {
      res.status(400).json({
        success: false,
        message:
          "Notifications must be a boolean",
      });
      return;
    }

    // =================================================
    // VALIDATE AUTOSAVE
    // =================================================

    if (
      autoSave !== undefined &&
      typeof autoSave !== "boolean"
    ) {
      res.status(400).json({
        success: false,
        message:
          "Auto-save must be a boolean",
      });
      return;
    }

    // =================================================
    // VALIDATE RESPONSE STYLE
    // =================================================

    if (
      responseStyle !== undefined &&
      !["concise", "balanced", "detailed"].includes(
        responseStyle
      )
    ) {
      res.status(400).json({
        success: false,
        message:
          "Invalid response style",
      });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // =================================================
    // UPDATE PROVIDED SETTINGS
    // =================================================

    if (theme !== undefined) {
      user.theme = theme;
    }

    if (notifications !== undefined) {
      user.notifications = notifications;
    }

    if (autoSave !== undefined) {
      user.autoSave = autoSave;
    }

    if (responseStyle !== undefined) {
      user.responseStyle = responseStyle;
    }

    await user.save();

    const updatedUser = await User.findById(userId).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Settings Error:", error);

    res.status(500).json({
      success: false,
      message:
        "Something went wrong while updating settings",
    });
  }
};

// =====================================================
// CHANGE PASSWORD
// =====================================================

export const changePassword = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    // =================================================
    // REQUIRED FIELDS
    // =================================================

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      res.status(400).json({
        success: false,
        message:
          "Current password, new password and confirmation are required",
      });
      return;
    }

    // =================================================
    // PASSWORD MATCH
    // =================================================

    if (newPassword !== confirmPassword) {
      res.status(400).json({
        success: false,
        message:
          "New password and confirmation do not match",
      });
      return;
    }

    // =================================================
    // PASSWORD LENGTH
    // =================================================

    if (newPassword.length < 6) {
      res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters",
      });
      return;
    }

    // =================================================
    // GET USER
    // =================================================

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // =================================================
    // VERIFY CURRENT PASSWORD
    // =================================================

    const passwordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordCorrect) {
      res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
      return;
    }

    // =================================================
    // HASH NEW PASSWORD
    // =================================================

    user.password = await bcrypt.hash(
      newPassword,
      10
    );

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);

    res.status(500).json({
      success: false,
      message:
        "Something went wrong while changing password",
    });
  }
};