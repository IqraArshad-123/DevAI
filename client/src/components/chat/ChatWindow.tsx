"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// =====================================================
// MESSAGE TYPE
// =====================================================

type Message = {
  _id?: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
};

// =====================================================
// COMPONENT
// =====================================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function ChatWindowContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ===================================================
  // STATE
  // ===================================================

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Edit state
  const [editingMessageId, setEditingMessageId] =
    useState<string | null>(null);

  const [editingText, setEditingText] =
    useState("");

  const [editLoading, setEditLoading] =
    useState(false);

  // Regenerate state
  const [regenerating, setRegenerating] =
    useState(false);

  // Copy state
  const [copiedCode, setCopiedCode] =
    useState<string | null>(null);

  // ===================================================
  // CONVERSATION ID
  // ===================================================

  const conversationId =
    searchParams.get("conversationId");

  // ===================================================
  // PROMPT PAGE SE AANE WALA PROMPT
  // ===================================================

  useEffect(() => {
    const prompt = searchParams.get("prompt");

    if (prompt && !conversationId) {
      setMessage(prompt);
    }
  }, [searchParams, conversationId]);

  // ===================================================
  // LOAD SAVED CONVERSATION
  // ===================================================

  useEffect(() => {
    const loadConversation = async () => {
      // New chat
      if (!conversationId) {
        setMessages([]);
        return;
      }

      try {
        const token =
          localStorage.getItem("token");

        if (!token) {
          console.error(
            "No authentication token found"
          );
          return;
        }

        const response = await fetch(
          `${API_URL}/api/ai/conversations/${conversationId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load conversation"
          );
        }

        const savedMessages: Message[] =
          data.conversation.messages.map(
            (msg: {
              _id?: string;
              role:
                | "user"
                | "assistant";
              content: string;
              createdAt?: string;
            }) => ({
              _id: msg._id,
              role: msg.role,
              content: msg.content,
              createdAt: msg.createdAt,
            })
          );

        setMessages(savedMessages);
      } catch (error) {
        console.error(
          "Load Conversation Error:",
          error
        );
      }
    };

    loadConversation();
  }, [conversationId]);

  // ===================================================
  // SEND MESSAGE
  // ===================================================

  const sendMessage = async () => {
    if (!message.trim() || loading) {
      return;
    }

    const userMessage =
      message.trim();

    // Immediately UI mein user message show
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token not found"
        );
      }

      const response = await fetch(
        `${API_URL}/api/ai/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: userMessage,
            conversationId:
              conversationId ||
              undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Something went wrong"
        );
      }

      // AI response UI mein add
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);

      // =================================================
      // NEW CONVERSATION CREATED
      // =================================================

      if (
        !conversationId &&
        data.conversationId
      ) {
        const newConversationId =
          data.conversationId.toString();

        router.replace(
          `/chat?conversationId=${newConversationId}`
        );
      }
    } catch (error) {
      console.error(
        "Chat Error:",
        error
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // START EDITING USER MESSAGE
  // ===================================================

  const startEditing = (
    msg: Message
  ) => {
    if (!msg._id) {
      console.warn(
        "This message does not have an ID"
      );
      return;
    }

    setEditingMessageId(msg._id);
    setEditingText(msg.content);
  };

  // ===================================================
  // CANCEL EDIT
  // ===================================================

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditingText("");
  };

  // ===================================================
  // SAVE EDITED MESSAGE
  // ===================================================

  const saveEditedMessage = async () => {
    if (
      !editingMessageId ||
      !editingText.trim() ||
      !conversationId ||
      editLoading
    ) {
      return;
    }

    setEditLoading(true);

    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token not found"
        );
      }

      const response = await fetch(
        `${API_URL}/api/ai/edit-message`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            conversationId,
            messageId:
              editingMessageId,
            message:
              editingText.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to edit message"
        );
      }

      // =================================================
      // BACKEND UPDATED CONVERSATION
      // =================================================

      if (data.conversation) {
        const updatedMessages: Message[] =
          data.conversation.messages.map(
            (msg: {
              _id?: string;
              role:
                | "user"
                | "assistant";
              content: string;
              createdAt?: string;
            }) => ({
              _id: msg._id,
              role: msg.role,
              content: msg.content,
              createdAt:
                msg.createdAt,
            })
          );

        setMessages(updatedMessages);
      } else if (data.answer) {
        // Fallback agar backend sirf answer bheje
        setMessages((prev) => {
          const updated = [...prev];

          const index =
            updated.findIndex(
              (msg) =>
                msg._id ===
                editingMessageId
            );

          if (index !== -1) {
            updated[index] = {
              ...updated[index],
              content:
                editingText.trim(),
            };

            // Agar next message assistant hai
            if (
              updated[index + 1]
                ?.role ===
              "assistant"
            ) {
              updated[
                index + 1
              ] = {
                ...updated[index + 1],
                content: data.answer,
              };
            }
          }

          return updated;
        });
      }

      // Exit edit mode
      setEditingMessageId(null);
      setEditingText("");
    } catch (error) {
      console.error(
        "Edit Message Error:",
        error
      );

      alert(
        "Failed to edit message. Please try again."
      );
    } finally {
      setEditLoading(false);
    }
  };

  // ===================================================
  // REGENERATE AI RESPONSE
  // ===================================================

  const regenerateResponse =
    async () => {
      if (
        !conversationId ||
        regenerating ||
        loading
      ) {
        return;
      }

      setRegenerating(true);

      try {
        const token =
          localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "Authentication token not found"
          );
        }

        const response = await fetch(
          `${API_URL}/api/ai/regenerate`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              conversationId,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to regenerate response"
          );
        }

        // =================================================
        // UPDATE LAST ASSISTANT MESSAGE
        // =================================================

        if (data.answer) {
          setMessages((prev) => {
            const updated = [...prev];

            // Last assistant message find karo
            for (
              let i =
                updated.length - 1;
              i >= 0;
              i--
            ) {
              if (
                updated[i].role ===
                "assistant"
              ) {
                updated[i] = {
                  ...updated[i],
                  content:
                    data.answer,
                };

                break;
              }
            }

            return updated;
          });
        }

        // Agar backend complete conversation return kare
        if (data.conversation) {
          const updatedMessages: Message[] =
            data.conversation.messages.map(
              (msg: {
                _id?: string;
                role:
                  | "user"
                  | "assistant";
                content: string;
                createdAt?: string;
              }) => ({
                _id: msg._id,
                role: msg.role,
                content: msg.content,
                createdAt:
                  msg.createdAt,
              })
            );

          setMessages(
            updatedMessages
          );
        }
      } catch (error) {
        console.error(
          "Regenerate Error:",
          error
        );

        alert(
          "Failed to regenerate response. Please try again."
        );
      } finally {
        setRegenerating(false);
      }
    };

  // ===================================================
  // COPY CODE
  // ===================================================

  const copyCode = async (
    code: string
  ) => {
    try {
      await navigator.clipboard.writeText(
        code
      );

      setCopiedCode(code);

      setTimeout(() => {
        setCopiedCode(null);
      }, 2000);
    } catch (error) {
      console.error(
        "Copy Error:",
        error
      );
    }
  };

  // ===================================================
  // CHECK LAST ASSISTANT MESSAGE
  // ===================================================

  const lastAssistantIndex =
    [...messages]
      .map((msg, index) => ({
        msg,
        index,
      }))
      .reverse()
      .find(
        ({ msg }) =>
          msg.role === "assistant"
      )?.index;

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col overflow-hidden bg-[#080b18] sm:min-h-[calc(100vh-2rem)] sm:rounded-3xl sm:border sm:border-white/10 sm:shadow-2xl sm:shadow-black/30">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-[#0b0f24]/95 px-3 py-3 backdrop-blur sm:px-7 sm:py-5">

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">

          <button
            type="button"
            aria-label="Open chat menu"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("devai:toggle-sidebar"))
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg text-slate-300 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white md:hidden"
          >
            ☰
          </button>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-blue-500 text-xl text-white shadow-lg shadow-violet-600/30 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-2xl">
            ✦
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
              Dev AI
            </h1>

            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400 sm:gap-2 sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/70" />

              AI Assistant
            </div>
          </div>

        </div>

        <div className="hidden rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300 sm:block">
          AI Powered
        </div>

      </div>

      {/* =====================================================
          MESSAGES
      ===================================================== */}

      <div className="min-w-0 flex-1 overflow-y-auto px-3 py-5 sm:px-8 sm:py-8">

        <div className="mx-auto max-w-5xl space-y-7">

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {messages.length === 0 && (
            <div className="flex min-h-full items-center justify-center px-1 py-12 text-center sm:px-0 sm:py-20">

              <div className="w-full max-w-2xl">

                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl border border-violet-500/20 bg-linear-to-br from-violet-600/20 to-blue-500/10 text-3xl text-violet-300 shadow-xl shadow-violet-950/30 sm:h-20 sm:w-20 sm:rounded-3xl sm:text-4xl">
                  ✦
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
                  How can I help you?
                </h2>

                <p className="mx-auto mt-3 max-w-xl px-2 text-sm leading-6 text-slate-400 sm:mt-4 sm:px-0 sm:text-lg sm:leading-7">
                  Ask Dev AI anything
                  about coding,
                  learning, debugging
                  or development.
                </p>

                <div className="mt-7 grid gap-3 sm:mt-9 sm:grid-cols-3">

                  <button
                    onClick={() =>
                      setMessage(
                        "Explain JavaScript in simple words"
                      )
                    }
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-medium text-slate-300 transition hover:-translate-y-0.5 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white"
                  >
                    Explain JavaScript
                  </button>

                  <button
                    onClick={() =>
                      setMessage(
                        "Help me debug my code"
                      )
                    }
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-medium text-slate-300 transition hover:-translate-y-0.5 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white"
                  >
                    Debug my code
                  </button>

                  <button
                    onClick={() =>
                      setMessage(
                        "Teach me React step by step"
                      )
                    }
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-medium text-slate-300 transition hover:-translate-y-0.5 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white"
                  >
                    Learn React
                  </button>

                </div>

              </div>

            </div>
          )}

          {/* =================================================
              CHAT MESSAGES
          ================================================= */}

          {messages.map(
            (msg, index) => {

              const isEditing =
                editingMessageId ===
                msg._id;

              const isLastAssistant =
                index ===
                  lastAssistantIndex &&
                msg.role ===
                  "assistant";

              return (
                <div
                  key={
                    msg._id ||
                    `${msg.role}-${index}`
                  }
                  className={`group flex ${
                    msg.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`flex w-full min-w-0 items-start gap-2 sm:gap-3 ${
                      msg.role ===
                      "user"
                        ? "max-w-3xl flex-row-reverse"
                        : "max-w-4xl"
                    }`}
                  >

                    {/* =================================================
                        AVATAR
                    ================================================= */}

                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-semibold sm:h-10 sm:w-10 sm:text-sm ${
                        msg.role ===
                        "user"
                          ? "bg-linear-to-br from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-900/30"
                          : "border border-violet-500/20 bg-violet-500/10 text-violet-300"
                      }`}
                    >
                      {msg.role ===
                      "user"
                        ? "U"
                        : "✦"}
                    </div>

                    {/* =================================================
                        MESSAGE AREA
                    ================================================= */}

                    <div className="min-w-0">

                      {/* =================================================
                          USER MESSAGE
                      ================================================= */}

                      {msg.role ===
                      "user" ? (
                        <>

                          {isEditing ? (
                            <div className="w-full max-w-full rounded-2xl bg-linear-to-r from-violet-600 to-purple-600 p-4 shadow-xl shadow-violet-950/30 sm:min-w-112.5">

                              <textarea
                                value={
                                  editingText
                                }
                                onChange={(
                                  e
                                ) =>
                                  setEditingText(
                                    e
                                      .target
                                      .value
                                  )
                                }
                                autoFocus
                                rows={4}
                                className="w-full resize-none rounded-xl border border-white/20 bg-black/20 p-4 text-[16px] leading-7 text-white outline-none placeholder:text-white/50"
                                placeholder="Edit your message..."
                              />

                              <div className="mt-3 flex justify-end gap-2">

                                <button
                                  onClick={
                                    cancelEditing
                                  }
                                  disabled={
                                    editLoading
                                  }
                                  className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 disabled:opacity-50"
                                >
                                  Cancel
                                </button>

                                <button
                                  onClick={
                                    saveEditedMessage
                                  }
                                  disabled={
                                    editLoading ||
                                    !editingText.trim()
                                  }
                                  className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {editLoading
                                    ? "Saving..."
                                    : "Save & Ask"}
                                </button>

                              </div>

                            </div>
                          ) : (
                            <div className="relative">

                              <div className="max-w-full wrap-break-word rounded-2xl bg-linear-to-r from-violet-600 to-purple-600 px-4 py-3 text-white shadow-xl shadow-violet-950/30 sm:px-6 sm:py-5">

                                <p className="wrap-break-word text-[15px] leading-6 sm:text-[17px] sm:leading-8">
                                  {
                                    msg.content
                                  }
                                </p>

                              </div>

                              {/* EDIT BUTTON */}

                              {msg._id && (
                                <div className="mt-2 flex justify-end opacity-0 transition group-hover:opacity-100">

                                  <button
                                    onClick={() =>
                                      startEditing(
                                        msg
                                      )
                                    }
                                    disabled={
                                      loading ||
                                      editLoading ||
                                      regenerating
                                    }
                                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
                                  >
                                    <span>
                                      ✏️
                                    </span>

                                    Edit
                                  </button>

                                </div>
                              )}

                            </div>
                          )}

                        </>
                      ) : (

                        /* =================================================
                           ASSISTANT MESSAGE
                        ================================================= */

                        <>

                          <div className="min-w-0 max-w-full rounded-2xl border border-white/10 bg-[#111528] px-4 py-3 text-slate-200 shadow-xl shadow-black/20 sm:px-6 sm:py-5">

                            <div className="prose prose-invert max-w-none wrap-break-word text-[15px] leading-7 sm:text-[17px] sm:leading-8">

                              <ReactMarkdown
                                remarkPlugins={[
                                  remarkGfm,
                                ]}
                                components={{
                                  h1: ({
                                    children,
                                  }) => (
                                    <h1 className="mb-5 mt-2 text-2xl font-bold text-white sm:text-3xl">
                                      {
                                        children
                                      }
                                    </h1>
                                  ),

                                  h2: ({
                                    children,
                                  }) => (
                                    <h2 className="mb-4 mt-7 text-xl font-bold text-white sm:text-2xl">
                                      {
                                        children
                                      }
                                    </h2>
                                  ),

                                  h3: ({
                                    children,
                                  }) => (
                                    <h3 className="mb-3 mt-6 text-lg font-semibold text-violet-200 sm:text-xl">
                                      {
                                        children
                                      }
                                    </h3>
                                  ),

                                  p: ({
                                    children,
                                  }) => (
                                    <p className="mb-5 text-[16px] leading-8 text-slate-200 sm:text-[17px] sm:leading-8">
                                      {
                                        children
                                      }
                                    </p>
                                  ),

                                  ul: ({
                                    children,
                                  }) => (
                                    <ul className="mb-5 ml-6 list-disc space-y-2 text-[16px] leading-8 text-slate-200 sm:text-[17px]">
                                      {
                                        children
                                      }
                                    </ul>
                                  ),

                                  ol: ({
                                    children,
                                  }) => (
                                    <ol className="mb-5 ml-6 list-decimal space-y-2 text-[16px] leading-8 text-slate-200 sm:text-[17px]">
                                      {
                                        children
                                      }
                                    </ol>
                                  ),

                                  li: ({
                                    children,
                                  }) => (
                                    <li className="pl-1">
                                      {
                                        children
                                      }
                                    </li>
                                  ),

                                  strong: ({
                                    children,
                                  }) => (
                                    <strong className="font-bold text-white">
                                      {
                                        children
                                      }
                                    </strong>
                                  ),

                                  em: ({
                                    children,
                                  }) => (
                                    <em className="text-violet-200">
                                      {
                                        children
                                      }
                                    </em>
                                  ),

                                  blockquote: ({
                                    children,
                                  }) => (
                                    <blockquote className="my-5 border-l-4 border-violet-500 bg-violet-500/5 px-5 py-3 text-slate-300">
                                      {
                                        children
                                      }
                                    </blockquote>
                                  ),

                                  hr: () => (
                                    <hr className="my-7 border-white/10" />
                                  ),

                                  code: ({
                                    children,
                                    className,
                                  }) => {
                                    const code =
                                      String(
                                        children
                                      ).replace(
                                        /\n$/,
                                        ""
                                      );

                                    const match =
                                      /language-(\w+)/.exec(
                                        className ||
                                          ""
                                      );

                                    // Inline code
                                    if (
                                      !className
                                    ) {
                                      return (
                                        <code className="rounded-md bg-violet-500/10 px-1.5 py-0.5 font-mono text-[14px] text-violet-300">
                                          {
                                            children
                                          }
                                        </code>
                                      );
                                    }

                                    // Code language
                                    const language =
                                      match?.[1] ||
                                      "text";

                                    return (
                                      <div className="my-5 min-w-0 max-w-full overflow-hidden rounded-xl border border-white/10 bg-[#070914] shadow-inner sm:my-6">

                                        {/* CODE HEADER */}

                                        <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-white/5 px-3 py-2 sm:px-4">

                                          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                            {
                                              language
                                            }
                                          </span>

                                          <button
                                            onClick={() =>
                                              copyCode(
                                                code
                                              )
                                            }
                                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                                          >
                                            {copiedCode ===
                                            code
                                              ? "✓ Copied"
                                              : "Copy"}
                                          </button>

                                        </div>

                                        <SyntaxHighlighter
                                          style={
                                            oneDark
                                          }
                                          language={
                                            language
                                          }
                                          PreTag="div"
                                          customStyle={{
                                            margin:
                                              0,
                                            padding:
                                              "20px",
                                            background:
                                              "#070914",
                                            fontSize:
                                              "14px",
                                            lineHeight:
                                              "1.75",
                                            overflowX:
                                              "auto",
                                          }}
                                        >
                                          {
                                            code
                                          }
                                        </SyntaxHighlighter>

                                      </div>
                                    );
                                  },

                                  pre: ({
                                    children,
                                  }) => (
                                    <pre className="my-5 max-w-full overflow-x-auto rounded-xl border border-white/10 bg-[#070914] p-0 shadow-inner">
                                      {
                                        children
                                      }
                                    </pre>
                                  ),

                                  a: ({
                                    children,
                                    href,
                                  }) => (
                                    <a
                                      href={
                                        href
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-violet-400 underline underline-offset-4 hover:text-violet-300"
                                    >
                                      {
                                        children
                                      }
                                    </a>
                                  ),

                                  table: ({
                                    children,
                                  }) => (
                                    <div className="my-5 max-w-full overflow-x-auto rounded-xl border border-white/10 sm:my-6">
                                      <table className="w-full border-collapse text-left text-sm">
                                        {
                                          children
                                        }
                                      </table>
                                    </div>
                                  ),

                                  th: ({
                                    children,
                                  }) => (
                                    <th className="border-b border-white/10 bg-white/5 px-4 py-3 font-semibold text-white">
                                      {
                                        children
                                      }
                                    </th>
                                  ),

                                  td: ({
                                    children,
                                  }) => (
                                    <td className="border-b border-white/5 px-4 py-3 text-slate-300">
                                      {
                                        children
                                      }
                                    </td>
                                  ),
                                }}
                              >
                                {
                                  msg.content
                                }
                              </ReactMarkdown>

                            </div>

                          </div>

                          {/* =================================================
                              REGENERATE BUTTON
                          ================================================= */}

                          {isLastAssistant && (
                            <div className="mt-2 flex justify-start opacity-0 transition group-hover:opacity-100">

                              <button
                                onClick={
                                  regenerateResponse
                                }
                                disabled={
                                  regenerating ||
                                  loading ||
                                  editLoading
                                }
                                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <span
                                  className={
                                    regenerating
                                      ? "animate-spin"
                                      : ""
                                  }
                                >
                                  🔄
                                </span>

                                {regenerating
                                  ? "Regenerating..."
                                  : "Regenerate"}
                              </button>

                            </div>
                          )}

                        </>
                      )}

                    </div>

                  </div>

                </div>
              );
            }
          )}

          {/* =================================================
              LOADING
          ================================================= */}

          {(loading ||
            regenerating ||
            editLoading) && (
            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-300">
                ✦
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#111528] px-5 py-4 shadow-xl">

                <div className="flex items-center gap-2">

                  <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-violet-400" />

                  <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-purple-400 [animation-delay:150ms]" />

                  <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-blue-400 [animation-delay:300ms]" />

                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* =====================================================
          INPUT
      ===================================================== */}

      <div className="shrink-0 border-t border-white/10 bg-[#0b0f24]/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:p-5">

        <div className="mx-auto flex max-w-5xl items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 transition focus-within:border-violet-500/50 focus-within:bg-white/7">

          <input
            type="text"
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter"
              ) {
                sendMessage();
              }
            }}
            disabled={
              loading ||
              regenerating ||
              editLoading
            }
            placeholder="Ask Dev AI anything..."
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-[16px] text-white outline-none placeholder:text-slate-500 disabled:opacity-50 sm:text-[17px]"
          />

          <button
            onClick={sendMessage}
            disabled={
              loading ||
              regenerating ||
              editLoading ||
              !message.trim()
            }
            className="shrink-0 rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-4 py-3 text-[14px] sm:px-6 sm:text-[15px] font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:scale-[1.02] hover:from-violet-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            {loading
              ? "..."
              : "Send"}
          </button>

        </div>

        <p className="mt-2 text-center text-xs text-slate-500">
          Dev AI can make mistakes.
          Verify important
          information.
        </p>

      </div>

    </div>
  );
}

// =====================================================
// SUSPENSE BOUNDARY
// =====================================================

export default function ChatWindow() {
  return (
    <Suspense fallback={null}>
      <ChatWindowContent />
    </Suspense>
  );
}