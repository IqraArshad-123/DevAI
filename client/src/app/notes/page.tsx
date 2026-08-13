"use client";

import { useEffect, useState } from "react";

type Note = {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [showEditor, setShowEditor] = useState(false);

  const [editingNote, setEditingNote] =
    useState<Note | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] =
    useState<string | null>(null);
  const [pinningId, setPinningId] =
    useState<string | null>(null);

  // =====================================================
  // API BASE URL
  // =====================================================

  const API_URL = "http://localhost:5000/api/notes";

  // =====================================================
  // LOAD NOTES
  // =====================================================

  const loadNotes = async (searchValue = "") => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError(
          "Authentication token not found. Please login again."
        );
        return;
      }

      const url = searchValue.trim()
        ? `${API_URL}?search=${encodeURIComponent(
            searchValue.trim()
          )}`
        : API_URL;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load notes"
        );
      }

      setNotes(data.notes || []);
    } catch (error) {
      console.error("Load Notes Error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load notes"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadNotes();
  }, []);

  // =====================================================
  // OPEN CREATE EDITOR
  // =====================================================

  const openCreateEditor = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setTags("");
    setShowEditor(true);
  };

  // =====================================================
  // OPEN EDITOR
  // =====================================================

  const openEditEditor = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags.join(", "));
    setShowEditor(true);
  };

  // =====================================================
  // CLOSE EDITOR
  // =====================================================

  const closeEditor = () => {
    if (saving) return;

    setShowEditor(false);
    setEditingNote(null);
    setTitle("");
    setContent("");
    setTags("");
  };

  // =====================================================
  // SAVE NOTE
  // =====================================================

  const saveNote = async () => {
    if (!title.trim()) {
      setError("Please enter a note title.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      const parsedTags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const body = {
        title: title.trim(),
        content,
        tags: parsedTags,
        pinned: editingNote?.pinned || false,
      };

      const response = await fetch(
        editingNote
          ? `${API_URL}/${editingNote._id}`
          : API_URL,
        {
          method: editingNote ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save note"
        );
      }

      // Reload notes so sorting/search stays accurate
      await loadNotes(search);

      closeEditor();
    } catch (error) {
      console.error("Save Note Error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to save note"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE NOTE
  // =====================================================

  const deleteNote = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete note"
        );
      }

      setNotes((prev) =>
        prev.filter((note) => note._id !== id)
      );
    } catch (error) {
      console.error("Delete Note Error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete note"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // TOGGLE PIN
  // =====================================================

  const togglePin = async (id: string) => {
    try {
      setPinningId(id);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      const response = await fetch(
        `${API_URL}/${id}/pin`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update note"
        );
      }

      setNotes((prev) =>
        prev
          .map((note) =>
            note._id === id
              ? {
                  ...note,
                  pinned: data.note.pinned,
                  updatedAt:
                    data.note.updatedAt,
                }
              : note
          )
          .sort((a, b) => {
            if (a.pinned !== b.pinned) {
              return a.pinned ? -1 : 1;
            }

            return (
              new Date(b.updatedAt).getTime() -
              new Date(a.updatedAt).getTime()
            );
          })
      );
    } catch (error) {
      console.error("Toggle Pin Error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update note"
      );
    } finally {
      setPinningId(null);
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = async (
    value: string
  ) => {
    setSearch(value);
    await loadNotes(value);
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  return (
    <main className="min-h-screen bg-[#030616] px-4 py-6 text-white sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 to-blue-500 text-2xl shadow-lg shadow-violet-900/30">
                📝
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  My Notes
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Save ideas, code snippets and important
                  development notes.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openCreateEditor}
            className="rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:scale-[1.02] hover:from-violet-500 hover:to-purple-500"
          >
            + New Note
          </button>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="ml-4 text-red-300 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="mb-8 flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 transition focus-within:border-violet-500/50 focus-within:bg-white/[0.07]">

          <span className="mr-3 text-lg text-slate-500">
            🔎
          </span>

          <input
            type="text"
            value={search}
            onChange={(e) =>
              handleSearch(e.target.value)
            }
            placeholder="Search your notes..."
            className="min-w-0 flex-1 bg-transparent py-4 text-white outline-none placeholder:text-slate-500"
          />

          {search && (
            <button
              onClick={() => {
                setSearch("");
                loadNotes("");
              }}
              className="ml-3 text-slate-500 transition hover:text-white"
            >
              ✕
            </button>
          )}

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-white/10 bg-[#0b0f24] p-6"
              >
                <div className="mb-4 h-5 w-2/3 rounded bg-white/10" />
                <div className="mb-2 h-3 w-full rounded bg-white/10" />
                <div className="mb-2 h-3 w-5/6 rounded bg-white/10" />
                <div className="h-3 w-1/2 rounded bg-white/10" />
              </div>
            ))}

          </div>
        )}

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {!loading && notes.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-[#0b0f24]/80 px-6 py-20 text-center">

            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-500/20 bg-violet-500/10 text-4xl">
              📝
            </div>

            <h2 className="text-2xl font-bold text-white">
              {search
                ? "No notes found"
                : "No notes yet"}
            </h2>

            <p className="mx-auto mt-3 max-w-md text-slate-400">
              {search
                ? "Try a different search term."
                : "Create your first note and keep your development ideas organized."}
            </p>

            {!search && (
              <button
                onClick={openCreateEditor}
                className="mt-6 rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-5 py-3 font-semibold text-white transition hover:from-violet-500 hover:to-purple-500"
              >
                Create Your First Note
              </button>
            )}

          </div>
        )}

        {/* =================================================
            NOTES GRID
        ================================================= */}

        {!loading && notes.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {notes.map((note) => (
              <article
                key={note._id}
                className="group flex min-h-62.5 flex-col rounded-2xl border border-white/10 bg-[#0b0f24] p-5 shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-violet-950/20"
              >

                {/* NOTE TOP */}

                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0 flex-1">

                    <div className="mb-2 flex items-center gap-2">
                      {note.pinned && (
                        <span
                          title="Pinned"
                          className="text-sm"
                        >
                          📌
                        </span>
                      )}

                      <h2 className="truncate text-lg font-bold text-white">
                        {note.title}
                      </h2>
                    </div>

                    <p className="text-xs text-slate-500">
                      Updated {formatDate(note.updatedAt)}
                    </p>

                  </div>

                  {/* PIN */}

                  <button
                    onClick={() =>
                      togglePin(note._id)
                    }
                    disabled={
                      pinningId === note._id
                    }
                    title={
                      note.pinned
                        ? "Unpin note"
                        : "Pin note"
                    }
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-sm transition hover:border-violet-500/30 hover:bg-violet-500/10 disabled:opacity-50"
                  >
                    {pinningId === note._id
                      ? "..."
                      : note.pinned
                      ? "📌"
                      : "📍"}
                  </button>

                </div>

                {/* CONTENT */}

                <div className="mt-5 flex-1">

                  <p className="line-clamp-6 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                    {note.content ||
                      "No content in this note."}
                  </p>

                </div>

                {/* TAGS */}

                {note.tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">

                    {note.tags.map(
                      (tag, index) => (
                        <span
                          key={`${tag}-${index}`}
                          className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-xs text-violet-300"
                        >
                          #{tag}
                        </span>
                      )
                    )}

                  </div>
                )}

                {/* ACTIONS */}

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">

                  <button
                    onClick={() =>
                      openEditEditor(note)
                    }
                    className="rounded-lg px-3 py-2 text-sm font-medium text-violet-300 transition hover:bg-violet-500/10 hover:text-violet-200"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteNote(note._id)
                    }
                    disabled={
                      deletingId === note._id
                    }
                    className="rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
                  >
                    {deletingId === note._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </article>
            ))}

          </div>
        )}

      </div>

      {/* ===================================================
          NOTE EDITOR MODAL
      =================================================== */}

      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0b0f24] shadow-2xl shadow-black/50">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-7">

              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingNote
                    ? "Edit Note"
                    : "Create Note"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Keep your development thoughts organized.
                </p>
              </div>

              <button
                onClick={closeEditor}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="space-y-5 p-5 sm:p-7">

              {/* TITLE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="e.g. React Hooks Notes"
                  maxLength={200}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/50 focus:bg-white/[0.07]"
                />
              </div>

              {/* CONTENT */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Content
                </label>

                <textarea
                  value={content}
                  onChange={(e) =>
                    setContent(e.target.value)
                  }
                  placeholder="Write your note here..."
                  rows={10}
                  className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/50 focus:bg-white/[0.07]"
                />
              </div>

              {/* TAGS */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Tags
                </label>

                <input
                  type="text"
                  value={tags}
                  onChange={(e) =>
                    setTags(e.target.value)
                  }
                  placeholder="react, javascript, frontend"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/50 focus:bg-white/[0.07]"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Separate multiple tags with commas.
                </p>
              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="flex items-center justify-end gap-3 border-t border-white/10 px-5 py-5 sm:px-7">

              <button
                onClick={closeEditor}
                disabled={saving}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={saveNote}
                disabled={
                  saving || !title.trim()
                }
                className="rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:from-violet-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving
                  ? "Saving..."
                  : editingNote
                  ? "Save Changes"
                  : "Create Note"}
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}