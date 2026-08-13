import { Router } from "express";

import {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  toggleNotePin,
} from "../controllers/note.controller";

import { protect } from "../middleware/auth.middleware";

const router = Router();

// NOTES

// CREATE NOTE
router.post("/", protect, createNote);

// GET ALL NOTES
router.get("/", protect, getNotes);

// GET SINGLE NOTE
router.get("/:id", protect, getNote);

// UPDATE NOTE
router.put("/:id", protect, updateNote);

// DELETE NOTE
router.delete("/:id", protect, deleteNote);

// TOGGLE PIN
router.patch("/:id/pin", protect, toggleNotePin);

export default router;