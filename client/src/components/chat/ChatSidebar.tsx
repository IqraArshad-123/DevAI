"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Conversation = {
  _id: string;
  title: string;
  updatedAt: string;
};

export default function ChatSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentConversationId =
    searchParams.get("conversationId");

  const [conversations, setConversations] = useState<
    Conversation[]
  >([]);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD CONVERSATIONS
  // =====================================================

  const loadConversations = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/ai/conversations",
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
          data.message || "Failed to load conversations"
        );
      }

      setConversations(data.conversations || []);
    } catch (error) {
      console.error(
        "Load Conversations Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadConversations();
  }, []);

  // =====================================================
  // NEW CHAT
  // =====================================================

  const handleNewChat = () => {
    router.push("/chat");
  };

  // =====================================================
  // OPEN CONVERSATION
  // =====================================================

  const handleOpenConversation = (
    conversationId: string
  ) => {
    router.push(
      `/chat?conversationId=${conversationId}`
    );
  };

  // =====================================================
  // DELETE CONVERSATION
  // =====================================================

  const handleDeleteConversation = async (
    conversationId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this conversation?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await fetch(
        `http://localhost:5000/api/ai/conversations/${conversationId}`,
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
          data.message || "Failed to delete conversation"
        );
      }

      setConversations((prev) =>
        prev.filter(
          (conversation) =>
            conversation._id !== conversationId
        )
      );

      // Agar current chat delete hui hai
      // to new empty chat open karo
      if (
        currentConversationId === conversationId
      ) {
        router.push("/chat");
      }
    } catch (error) {
      console.error(
        "Delete Conversation Error:",
        error
      );
    }
  };

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-white/10 bg-[#080c1d]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-white/10 p-4">

        <div className="mb-4 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-blue-500 text-xl text-white shadow-lg shadow-violet-900/30">
            ✦
          </div>

          <div>
            <h2 className="font-bold text-white">
              Dev AI
            </h2>

            <p className="text-xs text-slate-500">
              AI Developer Assistant
            </p>
          </div>

        </div>

        {/* NEW CHAT BUTTON */}

        <button
          onClick={handleNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-sm font-semibold text-violet-300 transition hover:border-violet-500/50 hover:bg-violet-500/20 hover:text-white"
        >
          <span className="text-lg">+</span>

          New Chat
        </button>

      </div>

      {/* =====================================================
          CONVERSATIONS
      ===================================================== */}

      <div className="flex-1 overflow-y-auto p-3">

        <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Your Chats
        </div>

        {loading ? (
          <div className="space-y-2">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-12 animate-pulse rounded-xl bg-white/5"
              />
            ))}

          </div>
        ) : conversations.length === 0 ? (

          <div className="px-3 py-10 text-center">

            <div className="mb-3 text-3xl opacity-50">
              💬
            </div>

            <p className="text-sm text-slate-500">
              No conversations yet
            </p>

          </div>

        ) : (

          <div className="space-y-1">

            {conversations.map(
              (conversation) => {

                const isActive =
                  currentConversationId ===
                  conversation._id;

                return (
                  <div
                    key={conversation._id}
                    className={`group flex items-center gap-2 rounded-xl transition ${
                      isActive
                        ? "bg-violet-500/15"
                        : "hover:bg-white/5"
                    }`}
                  >

                    {/* CHAT */}

                    <button
                      onClick={() =>
                        handleOpenConversation(
                          conversation._id
                        )
                      }
                      className="min-w-0 flex-1 px-3 py-3 text-left"
                    >

                      <div
                        className={`truncate text-sm font-medium ${
                          isActive
                            ? "text-violet-200"
                            : "text-slate-300"
                        }`}
                      >
                        {conversation.title}
                      </div>

                      <div className="mt-1 text-[11px] text-slate-600">
                        {new Date(
                          conversation.updatedAt
                        ).toLocaleDateString()}
                      </div>

                    </button>

                    {/* DELETE */}

                    <button
                      onClick={() =>
                        handleDeleteConversation(
                          conversation._id
                        )
                      }
                      className="mr-2 rounded-lg p-2 text-slate-600 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                      title="Delete conversation"
                    >
                      🗑
                    </button>

                  </div>
                );
              }
            )}

          </div>

        )}

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="border-t border-white/10 p-4">

        <div className="rounded-xl border border-white/5 bg-white/3 px-3 py-3">

          <p className="text-xs text-slate-500">
            Dev AI
          </p>

          <p className="mt-1 text-[11px] text-slate-600">
            Your conversations are saved securely.
          </p>

        </div>

      </div>

    </aside>
  );
}