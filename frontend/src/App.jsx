import { useState, useRef, useEffect } from 'react';
import io from "socket.io-client";
import { Send, Flame } from 'lucide-react';
import './ChatBox.css';

const socket = io("http://localhost:5001");

// temporary fake IDs until auth implemented
const FAKE_USER_ID = "6731a9121234567890abcd10";
const FAKE_ROOM_ID = "6731a9121234567890abcd20";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sendToAI, setSendToAI] = useState(true);
  const [userName, setUserName] = useState('Traveler');
  const messagesEnd = useRef(null);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      senderId: FAKE_USER_ID,
      senderName: userName,
      roomId: FAKE_ROOM_ID,
      message: input,
      isAI: false
    };

    socket.emit("sendMessage", newMessage);
    setInput('');

    if (sendToAI) {
      setTimeout(() => {
        const responses = [
          "Those who forged our own destiny and future.",
          "We are the inheritors of memory and legend.",
          "That is Natlan's fire, the lifeblood of our nation.",
          "Those who grew alongside sun and wind!"
        ];

        const aiResponse = {
          senderId: "AI_SYSTEM",
          senderName: "Tumaini",
          roomId: FAKE_ROOM_ID,
          message: responses[Math.floor(Math.random() * responses.length)],
          isAI: true
        };

        socket.emit("sendMessage", aiResponse);
      }, 700);
    }
  };

  return (
    <div className="chat-container">
      <div className="background-glow">
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
      </div>

      <div className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="status-dot"></div>
            <div className="header-title">
              <h1>
                <Flame size={24} style={{ color: '#f59e0b' }} />
                Natlan Expedition
              </h1>
              <p className="header-subtitle">Land of Fire & Spirit</p>
            </div>
          </div>
          <div className="header-room">Base Camp</div>
        </div>
      </div>

      <div className="chat-area">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.isAI ? 'ai' : 'user'}`}>
            <div className={`message-content ${msg.isAI ? 'ai' : 'user'}`}>
              <div className="message-header">
                {msg.isAI ? (
                  <>
                    <Flame size={16} style={{ color: '#1f2937' }} />
                    <span className="message-author">{msg.senderName}</span>
                  </>
                ) : (
                  <span className="message-author">{msg.senderName}</span>
                )}
              </div>
              <p className="message-text">{msg.message}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEnd} />
      </div>

      <div className="input-area">
        <div className="input-controls">
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="name-input"
          />
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={sendToAI}
              onChange={(e) => setSendToAI(e.target.checked)}
            />
            Ask Guide
          </label>
        </div>

        <div className="message-input-group">
          <input
            type="text"
            placeholder="Share your discoveries..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="message-input"
          />
          <button onClick={handleSend} className="send-button">
            <Send size={16} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}