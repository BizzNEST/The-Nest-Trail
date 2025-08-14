import { useState, useEffect, useRef } from 'react';
import { sendMessage, startGame } from '../api/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ChatTestPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const didStart = useRef(false);
    const [inventory, setInventory] = useState([]); // State to hold inventory items
    const [inventoryLoading, setInventoryLoading] = useState(false); // Loading state for inventory

    // Fetch inventory and start the game on initial component load
    useEffect(() => {
        // Fetch inventory items
        const fetchInventory = async () => {
            setInventoryLoading(true);
            try {
                const response = await fetch('/items');
                if (!response.ok) {
                    throw new Error('Failed to fetch inventory');
                }
                const items = await response.json();
                setInventory(items);
            } catch (error) {
                console.error('Error fetching inventory:', error);
            } finally {
                setInventoryLoading(false);
            }
        };

        fetchInventory();

        // Start the game by prompting the LLM
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
                            {/* Display a loading message while fetching */}
                            {inventoryLoading ? (
                                <div className="loading-message">Loading inventory...</div>
                            ) : inventory.length > 0 ? (
                                // Map over the inventory array and render each item
                                inventory.map((item, index) => (
                                    <div key={index} className="inventory-item">
                                        <span className="item-emoji">{item.emoji}</span>
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-amount">{item.amount}</span>
                                    </div>
                                ))
                            ) : (
                                // Display a message if no items are found
                                <div className="inventory-empty">Your inventory is empty.</div>
                            )}
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