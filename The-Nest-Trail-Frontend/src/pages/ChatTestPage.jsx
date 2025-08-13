import { useState } from 'react';
import { sendMessage } from '../api/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ChatTestPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

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

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div style={{ 
            maxWidth: '900px', 
            margin: '0 auto', 
            padding: '20px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            <h1 style={{ 
                textAlign: 'center', 
                color: '#333', 
                marginBottom: '30px',
                fontSize: '2rem'
            }}>
                Chat with LLM
            </h1>
            
            <div style={{ 
                border: '1px solid #e1e5e9', 
                borderRadius: '12px',
                height: '500px', 
                overflowY: 'auto', 
                padding: '20px', 
                marginBottom: '20px',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                {messages.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        color: '#666',
                        fontStyle: 'italic',
                        marginTop: '50px'
                    }}>
                        Start a conversation with the LLM...
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        marginBottom: '8px'
                    }}>
                        <div style={{
                            maxWidth: '70%',
                            padding: '12px 16px',
                            backgroundColor: msg.sender === 'user' ? '#007bff' : '#f1f3f5',
                            color: msg.sender === 'user' ? 'white' : '#333',
                            borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            wordBreak: 'break-word',
                            lineHeight: '1.4'
                        }}>
                            <div style={{ 
                                fontSize: '12px', 
                                opacity: 0.8, 
                                marginBottom: '4px',
                                fontWeight: '500'
                            }}>
                                {msg.sender === 'user' ? 'You' : 'LLM'}
                            </div>
                            <div>
                                {msg.sender === 'bot' ? (
                                    <ReactMarkdown 
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            // Style code blocks
                                            code: ({inline, children, ...props}) => {
                                                return inline ? (
                                                    <code style={{
                                                        backgroundColor: 'rgba(0,0,0,0.1)',
                                                        padding: '2px 4px',
                                                        borderRadius: '3px',
                                                        fontSize: '0.9em'
                                                    }} {...props}>
                                                        {children}
                                                    </code>
                                                ) : (
                                                    <pre style={{
                                                        backgroundColor: 'rgba(0,0,0,0.1)',
                                                        padding: '12px',
                                                        borderRadius: '6px',
                                                        overflow: 'auto',
                                                        margin: '8px 0'
                                                    }}>
                                                        <code {...props}>{children}</code>
                                                    </pre>
                                                );
                                            },
                                            // Style headings
                                            h1: ({children}) => <h1 style={{fontSize: '1.3em', margin: '12px 0 8px 0'}}>{children}</h1>,
                                            h2: ({children}) => <h2 style={{fontSize: '1.2em', margin: '10px 0 6px 0'}}>{children}</h2>,
                                            h3: ({children}) => <h3 style={{fontSize: '1.1em', margin: '8px 0 4px 0'}}>{children}</h3>,
                                            // Style lists
                                            ul: ({children}) => <ul style={{margin: '8px 0', paddingLeft: '20px'}}>{children}</ul>,
                                            ol: ({children}) => <ol style={{margin: '8px 0', paddingLeft: '20px'}}>{children}</ol>,
                                            // Style paragraphs
                                            p: ({children}) => <p style={{margin: '8px 0', lineHeight: '1.5'}}>{children}</p>,
                                            // Style blockquotes
                                            blockquote: ({children}) => (
                                                <blockquote style={{
                                                    borderLeft: '3px solid #ddd',
                                                    paddingLeft: '12px',
                                                    margin: '8px 0',
                                                    fontStyle: 'italic',
                                                    color: '#666'
                                                }}>
                                                    {children}
                                                </blockquote>
                                            ),
                                            // Style tables
                                            table: ({children}) => (
                                                <table style={{
                                                    borderCollapse: 'collapse',
                                                    width: '100%',
                                                    margin: '8px 0'
                                                }}>
                                                    {children}
                                                </table>
                                            ),
                                            th: ({children}) => (
                                                <th style={{
                                                    border: '1px solid #ddd',
                                                    padding: '8px',
                                                    backgroundColor: 'rgba(0,0,0,0.05)',
                                                    textAlign: 'left'
                                                }}>
                                                    {children}
                                                </th>
                                            ),
                                            td: ({children}) => (
                                                <td style={{
                                                    border: '1px solid #ddd',
                                                    padding: '8px'
                                                }}>
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
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        marginBottom: '8px'
                    }}>
                        <div style={{
                            padding: '12px 16px',
                            backgroundColor: '#f1f3f5',
                            borderRadius: '20px 20px 20px 4px',
                            color: '#666',
                            fontStyle: 'italic',
                            animation: 'pulse 1.5s ease-in-out infinite'
                        }}>
                            <div style={{ 
                                fontSize: '12px', 
                                opacity: 0.8, 
                                marginBottom: '4px',
                                fontWeight: '500'
                            }}>
                                LLM
                            </div>
                            <div>Typing...</div>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ 
                display: 'flex', 
                gap: '12px',
                backgroundColor: '#ffffff',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #e1e5e9',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    style={{
                        flex: 1,
                        padding: '12px 16px',
                        border: '1px solid #e1e5e9',
                        borderRadius: '8px',
                        resize: 'none',
                        minHeight: '20px',
                        maxHeight: '120px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        outline: 'none',
                        transition: 'border-color 0.2s ease',
                        backgroundColor: '#fafbfc',
                        color: 'black'
                    }}
                    disabled={loading}
                    onFocus={(e) => e.target.style.borderColor = '#007bff'}
                    onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                />
                <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: loading || !input.trim() ? '#6c757d' : '#007bff',
                        color: 'black',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'background-color 0.2s ease',
                        minWidth: '80px',
                        height: '44px'
                    }}
                    onMouseEnter={(e) => {
                        if (!loading && input.trim()) {
                            e.target.style.backgroundColor = '#0056b3';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!loading && input.trim()) {
                            e.target.style.backgroundColor = '#007bff';
                        }
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatTestPage;
