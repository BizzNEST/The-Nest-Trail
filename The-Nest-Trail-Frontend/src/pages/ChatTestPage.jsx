import { useState, useEffect, useRef } from 'react';
import { sendMessage, startGame } from '../api/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ChatTestPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    // if we prompted make sure we use a flag to prevent double invoking due to React.StrictMode
    const didStart = useRef(false);

    // when we land on this page we'll prompt the LLM to start the game
    useEffect(() => {
        if (didStart.current) return;
        didStart.current = true;
        setLoading(true);
        async function start() {
            try {
                const response = await startGame();
                const botMessage = { text: response, sender: 'bot' };
                setMessages(prev => [...prev, botMessage]);
            } catch (error) {
                console.error('Error sending message:', error);
                const errorMessage = { text: 'Error: Failed to get response', sender: 'bot' };
                setMessages(prev => [...prev, errorMessage]);
            } finally {
                setLoading(false);
            }
        }
        start();
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await sendMessage(input);
            const botMessage = { text: response, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = { text: 'Error: Failed to get response', sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };



    return (
        <div className="chat-page">
            <div className="chat-layout">
                {/* Left Column - Map and Inventory */}
                <div className="map-column">
                    <div className="map-container">
                        <h3 className="map-title">Your Location</h3>
                        <div className="map-placeholder">
                            <div className="placeholder-content">
                                <div className="placeholder-icon">📍</div>
                                <p>Map placeholder</p>
                                <p className="placeholder-subtitle">Location tracking will appear here</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="inventory-container">
                        <h3 className="inventory-title">Inventory</h3>
                        <div className="inventory-list">
                            <div className="inventory-item">
                                <span className="item-emoji">💻</span>
                                <span className="item-name">laptop</span>
                            </div>
                            <div className="inventory-item">
                                <span className="item-emoji">☕</span>
                                <span className="item-name">coffee</span>
                            </div>
                            <div className="inventory-item">
                                <span className="item-emoji">⛽</span>
                                <span className="item-name">gas</span>
                            </div>
                            <div className="inventory-item">
                                <span className="item-emoji">💰</span>
                                <span className="item-name">money</span>
                            </div>
                            <div className="inventory-item">
                                <span className="item-emoji">🔮</span>
                                <span className="item-name">macguffins</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Chat */}
                <div className="chat-container">
                    <h1 className="chat-title">
                        The NEST Trail
                    </h1>
                    
                    <div className="chat-messages-container">
                        {messages.length === 0 && (
                            <div className="empty-state">
                                Starting your journey through The NEST Trail...
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div key={index} className={`message-wrapper ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                                <div className={`message-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                                    <div className="message-sender">
                                        {msg.sender === 'user' ? 'You' : 'NEST AI'}
                                    </div>
                                    <div className="message-content">
                                        {msg.sender === 'bot' ? (
                                            <ReactMarkdown 
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    // Style code blocks
                                                    code: ({inline, children, ...props}) => {
                                                        return inline ? (
                                                            <code className="inline-code" {...props}>
                                                                {children}
                                                            </code>
                                                        ) : (
                                                            <pre className="code-block">
                                                                <code {...props}>{children}</code>
                                                            </pre>
                                                        );
                                                    },
                                                    // Style headings
                                                    h1: ({children}) => <h1 className="markdown-h1">{children}</h1>,
                                                    h2: ({children}) => <h2 className="markdown-h2">{children}</h2>,
                                                    h3: ({children}) => <h3 className="markdown-h3">{children}</h3>,
                                                    // Style lists
                                                    ul: ({children}) => <ul className="markdown-ul">{children}</ul>,
                                                    ol: ({children}) => <ol className="markdown-ol">{children}</ol>,
                                                    // Style paragraphs
                                                    p: ({children}) => <p className="markdown-p">{children}</p>,
                                                    // Style blockquotes
                                                    blockquote: ({children}) => (
                                                        <blockquote className="markdown-blockquote">
                                                            {children}
                                                        </blockquote>
                                                    ),
                                                    // Style tables
                                                    table: ({children}) => (
                                                        <table className="markdown-table">
                                                            {children}
                                                        </table>
                                                    ),
                                                    th: ({children}) => (
                                                        <th className="markdown-th">
                                                            {children}
                                                        </th>
                                                    ),
                                                    td: ({children}) => (
                                                        <td className="markdown-td">
                                                            {children}
                                                        </td>
                                                    ),
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        ) : (
                                            msg.text
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="message-wrapper bot-message">
                                <div className="message-bubble bot-bubble loading-bubble">
                                    <div className="message-sender">
                                        NEST AI
                                    </div>
                                    <div className="message-content">
                                        <div className="typing-indicator">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-container">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your response..."
                            className="chat-input"
                            disabled={loading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            className="send-button"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatTestPage;
