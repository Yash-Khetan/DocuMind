import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, UploadCloud, FileText, LogOut, Loader2, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'DocuMind Initialization complete. Please upload a document to proceed.' }
  ]);
  const [input, setInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [activeDocumentId, setActiveDocumentId] = useState(null);
  const [docName, setDocName] = useState(null);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  const getToken = () => localStorage.getItem("token");

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    const loadHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/api/history`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.status === 401 || response.status === 403) {
          // Token expired or invalid — force re-login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate('/login');
          return;
        }

        if (response.ok) {
          const data = await response.json();
          if (data.activeDocument) {
            setActiveDocumentId(data.activeDocument.id);
            setDocName(data.activeDocument.name);
            if (data.chats && data.chats.length > 0) {
              const historyMessages = data.chats.flatMap(c => [
                { role: 'user', content: c.question },
                { role: 'ai', content: c.response }
              ]);
              setMessages([
                { role: 'ai', content: `Session restored. Connected to: ${data.activeDocument.name}` },
                ...historyMessages
              ]);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load history", err);
      }
    };

    loadHistory();
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith('.pdf')) {
      alert("Please upload a valid PDF document.");
      return;
    }

    setIsUploading(true);
    setMessages(prev => [...prev, { role: 'ai', content: `Processing upload for "${file.name}"...` }]);

    try {
      const token = getToken();
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setActiveDocumentId(data.documentId);
        setDocName(file.name);
        setMessages(prev => [...prev, { role: 'ai', content: `Document verified. You may now query "${file.name}".` }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: `Upload rejected: ${data.message || data.error}` }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Network error during upload." }]);
    }
    setIsUploading(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (!activeDocumentId) {
       alert("Document context is required!");
       return;
    }
    
    const currentInput = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: currentInput }]);
    
    const streamingId = Date.now().toString();
    setMessages(prev => [...prev, { role: 'ai', content: '', id: streamingId, isStreaming: true }]);

    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/api/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ question: currentInput, documentId: activeDocumentId })
      });

      if (!response.ok) throw new Error("Query Failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunkText = decoder.decode(value, { stream: true });
        
        setMessages(prev => prev.map(msg => {
          if (msg.id === streamingId) {
             return { ...msg, content: msg.content + chunkText };
          }
          return msg;
        }));
      }
      
      setMessages(prev => prev.map(msg => msg.id === streamingId ? { ...msg, isStreaming: false } : msg));
      
    } catch (err) {
      setMessages(prev => prev.map(msg => {
          if (msg.id === streamingId) {
             return { ...msg, content: "Error accessing backend...", isStreaming: false };
          }
          return msg;
      }));
    }
  };

  return (
    <div className="app-container">
      
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles className="text-gradient" size={24} />
            DocuMind
          </h2>
        </div>
        
        <div className="sidebar-content">
          <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' }}>
            Active Context
          </h3>
          
          <div 
            className="base-panel upload-zone" 
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            <input 
               type="file" 
               ref={fileInputRef} 
               style={{ display: 'none' }} 
               accept="application/pdf"
               onChange={handleFileUpload}
               disabled={isUploading}
            />
            {isUploading ? (
              <Loader2 size={36} className="mx-auto mb-4" style={{ animation: "spin 1s linear infinite" }} />
            ) : activeDocumentId ? (
              <FileText size={36} className="mx-auto mb-4" color="var(--accent-primary)" />
            ) : (
              <UploadCloud size={36} className="mx-auto mb-4" color="var(--text-secondary)" />
            )}
            
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>
              {isUploading ? "Uploading..." : "Upload PDF"}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              {docName ? docName : "Click or drop file"}
            </p>
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="btn-secondary" onClick={handleSignOut} style={{ width: '100%' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      <div className="chat-core">
        <div className="chat-history">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`message-bubble ${msg.role === 'user' ? 'bubble-user' : 'bubble-ai'}`}
            >
              {msg.content}
              {msg.isStreaming && <span className="cursor-blink">▍</span>}
            </div>
          ))}
          {isUploading && (
             <div className="message-bubble bubble-ai">
                Uploading...
             </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="input-dock">
          <form className="input-pill" onSubmit={handleSend}>
            <input 
              className="input-field"
              type="text" 
              placeholder={activeDocumentId ? "Type your question..." : "Please upload a document..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!activeDocumentId || isUploading}
            />
            <button type="submit" className="btn-send" disabled={!activeDocumentId || !input.trim() || isUploading}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Chat;
