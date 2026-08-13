import mongoose, { Document, Schema } from "mongoose";

// NOTE TYPE

export interface INote extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// NOTE SCHEMA

const noteSchema = new Schema<INote>(
  {
    // OWNER

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // TITLE

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    // CONTENT

    content: {
      type: String,
      required: true,
      default: "",
    },

    // TAGS

    tags: {
      type: [String],
      default: [],
    },

    // PINNED

    pinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// INDEXES

noteSchema.index({
  user: 1,
  updatedAt: -1,
});

noteSchema.index({
  user: 1,
  pinned: -1,
  updatedAt: -1,
});

// MODEL

const Note = mongoose.model<INote>("Note", noteSchema);

export default Note;