import { Suspense } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-[#030616]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Suspense fallback={null}>
          <ChatSidebar />
        </Suspense>

        <div className="min-w-0 flex-1">
          <Suspense fallback={null}>
            <ChatWindow />
          </Suspense>
        </div>
      </div>
    </main>
  );
}