import mongoose, { Document, Schema } from "mongoose";

// =====================================================
// MESSAGE INTERFACE
// =====================================================

export interface IMessage {
  _id?: mongoose.Types.ObjectId;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

// =====================================================
// CONVERSATION INTERFACE
// =====================================================

export interface IConversation extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// =====================================================
// MESSAGE SCHEMA
// =====================================================

const messageSchema = new Schema<IMessage>(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,

    // IMPORTANT:
    // Har message ko apna unique _id milega.
    _id: true,
  }
);

// =====================================================
// CONVERSATION SCHEMA
// =====================================================

const conversationSchema = new Schema<IConversation>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      default: "New Conversation",
    },

    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// MODEL
// =====================================================

export default mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);