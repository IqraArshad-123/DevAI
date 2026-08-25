import mongoose, { Document, Schema } from "mongoose";

export type UserTheme = "dark" | "light" | "system";
export type ResponseStyle =
  | "concise"
  | "balanced"
  | "detailed";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  plan: "free" | "pro";

  // SETTINGS
  theme: UserTheme;
  notifications: boolean;
  autoSave: boolean;
  responseStyle: ResponseStyle;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    // =====================================================
    // BASIC PROFILE
    // =====================================================

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    avatar: {
      type: String,
      default: "",
    },

    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },

    // =====================================================
    // SETTINGS
    // =====================================================

    theme: {
      type: String,
      enum: ["dark", "light", "system"],
      default: "dark",
    },

    notifications: {
      type: Boolean,
      default: true,
    },

    autoSave: {
      type: Boolean,
      default: true,
    },

    responseStyle: {
      type: String,
      enum: ["concise", "balanced", "detailed"],
      default: "balanced",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;