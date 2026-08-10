import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-[#030616]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <ChatSidebar />
        <div className="min-w-0 flex-1">
          <ChatWindow />
        </div>

      </div>
    </main>
  );
}