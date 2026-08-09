import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-[#030616] p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <ChatWindow />
      </div>
    </main>
  );
}