import { useState, useRef, useEffect } from 'react';
import { Send, Flame } from 'lucide-react';
import './ChatBox.css';

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { id: 1, user: 'Mavuika', text: 'Hey everyone!', isAI: false },
    { id: 2, user: 'Mualani', text: 'Welcome, travelers!', isAI: true },
    { id: 3, user: 'Kinich', text: 'Tell us about this place!', isAI: false },
    { id: 4, user: 'Chasca', text: 'Natlan is a land of war!', isAI: true },
    { id: 5, user: 'Skirk', text: 'Ode of Ressurection Protects All!', isAI: false },
  ]);
  const [input, setInput] = useState('');
  const [sendToAI, setSendToAI] = useState(true);
  const [userName, setUserName] = useState('Traveler');
  const messagesEnd = useRef(null);

  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      user: userName,
      text: input,
      isAI: false,
    };

    setMessages([...messages, newMessage]);
    setInput('');

    if (sendToAI) {
      setTimeout(() => {
        const responses = [
          `Those who forged our own destiny and future.`,
          `We are the inheritors of memory and legend.`,
          `That is Natlan's fire, the lifeblood of our nation.`,
          `Those who grew alongside sun and wind.!`,
        ];
        const aiResponse = {
          id: messages.length + 2,
          user: 'Tumaini',
          text: responses[Math.floor(Math.random() * responses.length)],
          isAI: true,
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 800);
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
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.isAI ? 'ai' : 'user'}`}>
            <div className={`message-content ${msg.isAI ? 'ai' : 'user'}`}>
              <div className="message-header">
                {msg.isAI ? (
                  <>
                    <Flame size={16} style={{ color: '#1f2937' }} />
                    <span className="message-author">Yohuateclin</span>
                  </>
                ) : (
                  <span className="message-author">{msg.user}</span>
                )}
              </div>
              <p className="message-text">{msg.text}</p>
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