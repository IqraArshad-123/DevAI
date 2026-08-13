import { Request, Response } from "express";
import Note from "../models/Note";

// GET LOGGED-IN USER ID

const getUserId = (req: Request): string | null => {
  return (req as any).user?.userId || null;
};

// CREATE NOTE

export const createNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const {
      title,
      content,
      tags,
      pinned,
    } = req.body;

    // VALIDATION

    if (!title || typeof title !== "string") {
      res.status(400).json({
        success: false,
        message: "Title is required",
      });
      return;
    }

    if (
      content !== undefined &&
      typeof content !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "Content must be a string",
      });
      return;
    }

    // CREATE

    const note = await Note.create({
      user: userId,
      title: title.trim(),
      content:
        typeof content === "string"
          ? content
          : "",
      tags: Array.isArray(tags) ? tags : [],
      pinned:
        typeof pinned === "boolean"
          ? pinned
          : false,
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    console.error(
      "Create Note Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Something went wrong while creating note",
    });
  }
};

// GET ALL NOTES

export const getNotes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    // BASE QUERY

    const query: any = {
      user: userId,
    };

    // SEARCH

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          content: {
            $regex: search,
            $options: "i",
          },
        },
        {
          tags: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // FETCH NOTES

    const notes = await Note.find(query).sort({
      pinned: -1,
      updatedAt: -1,
    });

    res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    console.error(
      "Get Notes Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching notes",
    });
  }
};

// GET SINGLE NOTE

export const getNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    // FIND NOTE

    const note = await Note.findOne({
      _id: id,
      user: userId,
    });

    if (!note) {
      res.status(404).json({
        success: false,
        message: "Note not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    console.error(
      "Get Note Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching note",
    });
  }
};

// UPDATE NOTE

export const updateNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const {
      title,
      content,
      tags,
      pinned,
    } = req.body;

    // FIND NOTE

    const note = await Note.findOne({
      _id: id,
      user: userId,
    });

    if (!note) {
      res.status(404).json({
        success: false,
        message: "Note not found",
      });
      return;
    }

    // UPDATE ONLY PROVIDED FIELDS

    if (title !== undefined) {
      if (
        typeof title !== "string" ||
        !title.trim()
      ) {
        res.status(400).json({
          success: false,
          message: "Title cannot be empty",
        });
        return;
      }

      note.title = title.trim();
    }

    if (content !== undefined) {
      if (typeof content !== "string") {
        res.status(400).json({
          success: false,
          message:
            "Content must be a string",
        });
        return;
      }

      note.content = content;
    }

    if (tags !== undefined) {
      if (!Array.isArray(tags)) {
        res.status(400).json({
          success: false,
          message:
            "Tags must be an array",
        });
        return;
      }

      note.tags = tags;
    }

    if (pinned !== undefined) {
      if (typeof pinned !== "boolean") {
        res.status(400).json({
          success: false,
          message:
            "Pinned must be a boolean",
        });
        return;
      }

      note.pinned = pinned;
    }


    // SAVE

    await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    console.error(
      "Update Note Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Something went wrong while updating note",
    });
  }
};

// DELETE NOTE

export const deleteNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    // DELETE ONLY USER'S NOTE

    const note =
      await Note.findOneAndDelete({
        _id: id,
        user: userId,
      });

    if (!note) {
      res.status(404).json({
        success: false,
        message: "Note not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Note Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Something went wrong while deleting note",
    });
  }
};

// TOGGLE PIN

export const toggleNotePin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    // FIND NOTE

    const note = await Note.findOne({
      _id: id,
      user: userId,
    });

    if (!note) {
      res.status(404).json({
        success: false,
        message: "Note not found",
      });
      return;
    }

    // TOGGLE

    note.pinned = !note.pinned;

    await note.save();

    res.status(200).json({
      success: true,
      message: note.pinned
        ? "Note pinned successfully"
        : "Note unpinned successfully",
      note,
    });
  } catch (error) {
    console.error(
      "Toggle Note Pin Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Something went wrong while updating note",
    });
  }
};