"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { FaReply, FaTrash } from "react-icons/fa";

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("user_logged_in");
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const allMessages = JSON.parse(localStorage.getItem("messages") || "[]");
    const userEmail = localStorage.getItem("user_email");
    const userMessages = allMessages.filter((m: any) => m.to === userEmail);
    setMessages(userMessages);
  }, [router]);

  const sendReply = (originalMessage: any) => {
    const allMessages = JSON.parse(localStorage.getItem("messages") || "[]");
    const newMessage = {
      id: Date.now(),
      from: localStorage.getItem("user_email"),
      to: originalMessage.from,
      content: replyText,
      read: false,
      timestamp: new Date().toISOString(),
      subject: `Re: ${originalMessage.subject}`
    };
    allMessages.push(newMessage);
    localStorage.setItem("messages", JSON.stringify(allMessages));
    setReplyingTo(null);
    setReplyText("");
    alert("Reply sent!");
  };

  const markAsRead = (messageId: number) => {
    const allMessages = JSON.parse(localStorage.getItem("messages") || "[]");
    const updated = allMessages.map((m: any) => 
      m.id === messageId ? { ...m, read: true } : m
    );
    localStorage.setItem("messages", JSON.stringify(updated));
    setMessages(messages.map((m: any) => 
      m.id === messageId ? { ...m, read: true } : m
    ));
  };

  return (
    <main>
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">Messages</h1>
        
        {messages.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-gray-500">No messages yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message: any) => (
              <div key={message.id} className={`bg-white rounded-2xl shadow-lg p-6 ${!message.read ? "border-l-4 border-amber-500" : ""}`} onClick={() => markAsRead(message.id)}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-blue-900">From: {message.from}</p>
                    <p className="text-sm text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
                  </div>
                  {!message.read && <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded">New</span>}
                </div>
                <p className="font-semibold text-gray-800 mb-2">{message.subject}</p>
                <p className="text-gray-600 mb-4">{message.content}</p>
                
                {replyingTo === message.id ? (
                  <div className="mt-4">
                    <textarea
                      rows={3}
                      className="w-full p-3 border rounded-lg"
                      placeholder="Write your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => sendReply(message)} className="bg-amber-500 text-white px-4 py-2 rounded-lg">Send Reply</button>
                      <button onClick={() => setReplyingTo(null)} className="bg-gray-300 px-4 py-2 rounded-lg">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setReplyingTo(message.id)} className="text-amber-500 hover:text-amber-600 flex items-center gap-2">
                    <FaReply /> Reply
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
