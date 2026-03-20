"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
// ArrowLeft ko yahan add kiya hai
import { Send, User, Search, Settings, MoreVertical, Phone, Video, MessageSquare, ArrowLeft } from 'lucide-react'
import axios from 'axios'
import { io, Socket } from 'socket.io-client';
import Link from 'next/link'

const ChatPage = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState<{ [key: string]: number }>({});

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setNotifications((prev) => ({ ...prev, [user._id]: 0 }));
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!selectedUser || !token) return;
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/${selectedUser._id}`, 
          { headers: { Authorization: `${token}` } }
        );
        setMessages(res.data);
      } catch (error) {
        console.error("History load nahi hui:", error);
      }
    };
    fetchChatHistory();
  }, [selectedUser, token]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.replace("/login");
    } else {
      setToken(storedToken);
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUserName(userData.name);
      }
    }
  }, [router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/allusers`, {
          headers: { Authorization: `${token}` }
        }); 
        if (res.data.success) {
          setAllUsers(res.data.users);
        }
      } catch (error) {
        console.error("Users load nahi huay:", error);
      }
    };
    if (token) fetchUsers();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL as string, {
      extraHeaders: { authorization: token }
    });
    setSocket(newSocket);

    const handleMessage = (newMessage: any) => {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const myId = String(userData._id);
      const senderId = String(newMessage.senderId);

      setSelectedUser((currentSelected: any) => {
        const isChatOpenWithSender = currentSelected && String(currentSelected._id) === senderId;
        if (isChatOpenWithSender) {
          setMessages((prev: any) => {
            const exists = prev.some((m: any) => m._id === newMessage._id || (m.message === newMessage.message && m.isTemp));
            if (exists) return prev;
            return [...prev, newMessage];
          });
        } else if (senderId !== myId) {
          setNotifications((prev) => ({
            ...prev,
            [senderId]: (prev[senderId] || 0) + 1,
          }));
        }
        return currentSelected;
      });
    };

    newSocket.on("receive-private-message", handleMessage);
    return () => {
      newSocket.off("receive-private-message", handleMessage);
      newSocket.disconnect();
    };
  }, [token]);

const handleSendMessage = (e: React.FormEvent) => {
  e.preventDefault();
  if (socket && message.trim() && selectedUser) {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    
    const newMessage = {
      senderId: userData._id,
      recipientId: selectedUser._id,
      message: message,
      timestamp: new Date().toISOString(), // Local time for instant show
    };

    // 1. Server ko bhejo
    socket.emit("send-private-message", newMessage);

    // 2. Apni screen par foran dikhao (Refresh ki zaroorat nahi paregi)
    setMessages((prev): any => [...prev, newMessage]);

    // 3. Input clear karo
    setMessage("");
  }
};
// Messages ke end par automatic scroll ke liye
useEffect(() => {
  const chatContainer = document.querySelector('.overflow-y-auto');
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}, [messages]);
  if (!token) return null;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* 1. Left Sidebar (Contacts) - Mobile par hidden ho jayega agar user select hai */}
      <aside className={`w-full md:w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-5 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-1">
           <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">SwiftChat</h1>
           </Link> 
          <Settings className="text-slate-400 cursor-pointer hover:text-blue-500" size={20} />
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
            <input 
              placeholder="Search chats..."
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {allUsers
            .filter((user: any) => {
              const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
              return user._id !== loggedInUser._id;
            })
            .map((user: any) => {
              const isSelected = selectedUser?._id === user._id;
              const unreadCount = notifications[user._id] || 0;
              return (
                <div
                  key={user._id}
                  onClick={() => handleSelectUser(user)}
                  className={`group relative mx-2 my-1.5 flex items-center gap-3.5 p-3 rounded-2xl cursor-pointer transition-all duration-300 ease-out border-2 ${
                    isSelected 
                      ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-200/50 scale-[1.02]" 
                      : "bg-white dark:bg-slate-900 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-100 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className={`w-13 h-13 rounded-full flex items-center justify-center text-base font-semibold shadow-sm overflow-hidden transition-transform duration-300 group-hover:scale-105 ${
                      isSelected ? "bg-white/20 text-white backdrop-blur-md" : "bg-gradient-to-tr from-blue-50 to-blue-100 text-blue-600 dark:from-slate-800 dark:to-slate-700 dark:text-blue-400"
                    }`}>
                      {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-[3px] ${isSelected ? "bg-green-400 border-blue-600" : "bg-green-500 border-white dark:border-slate-900"}`}></span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className={`text-[15px] font-semibold truncate ${isSelected ? "text-white" : "text-slate-900 dark:text-slate-100"}`}>
                        {user.name}
                      </h3>
                      <span className={`text-[10px] ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className={`text-[13px] truncate ${unreadCount > 0 && !isSelected ? "text-blue-600 dark:text-blue-400 font-bold" : isSelected ? "text-blue-100/90" : "text-slate-500 dark:text-slate-400"}`}>
                        {unreadCount > 0 && !isSelected ? "New message received" : "Tap to chat..."}
                      </p>
                      {unreadCount > 0 && !isSelected && (
                        <div className="flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-blue-600 rounded-full shadow-sm ring-2 ring-white dark:ring-slate-900">
                          <span className="text-[10px] text-white font-bold leading-none">{unreadCount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </aside>

      {/* 2. Main Chat Area - Mobile par hidden ho jayega agar user select NAHI hai */}
      <main className={`flex-1 flex flex-col bg-white dark:bg-slate-900 transition-all duration-500 ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
        {selectedUser ? (
          <>
            <header className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                {/* Mobile Back Button */}
                <button 
                  onClick={() => setSelectedUser(null)} 
                  className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-200 dark:shadow-none">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800 dark:text-white capitalize leading-tight">{selectedUser.name}</h2>
                  <span className="text-[10px] text-green-500 font-medium">Online</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
                <button className="hover:text-blue-600 transition-colors"><Phone size={18} /></button>
                <button className="hover:text-blue-600 transition-colors"><Video size={18} /></button>
                <button className="hover:text-blue-600 transition-colors"><MoreVertical size={18} /></button>
              </div>
            </header>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/50 custom-scrollbar">
              {messages.length > 0 ? (
                messages.map((msg: any, index: number) => {
                  const userData = JSON.parse(localStorage.getItem("user") || "{}");
                  const isMe = msg.senderId === userData._id;
                  return (
                    <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                      <div className={`p-3.5 rounded-2xl max-w-[80%] md:max-w-md shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-800'}`}>
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                        <span className={`text-[9px] mt-1.5 block font-medium ${isMe ? 'text-blue-100 text-right' : 'text-slate-400'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-50">
                  <p className="text-sm text-slate-500">No messages yet. Start the conversation!</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 rounded-2xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                <input 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Message ${selectedUser.name}...`}
                  className="flex-1 bg-transparent border-none outline-none text-sm py-1.5 dark:text-white placeholder:text-slate-400"
                />
                <button type="submit" className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-200 dark:shadow-none">
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/30 dark:bg-slate-950/30 text-center p-8">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center mb-6 animate-bounce duration-[2000ms]">
              <MessageSquare className="text-blue-600 dark:text-blue-400" size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Your Messages</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs text-sm">Select a contact to start chatting.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default ChatPage