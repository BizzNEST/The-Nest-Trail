// base backend url
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';


// test api call to backend
export const testConnection = async () => {
    try {
        const response = await fetch(`${API_URL}/`);
        const data = await response.text();
        return data;
    } catch (error) {
        console.error('Error testing connection:', error);
        return null;
    }
}

// send message to LLM
export const sendMessage = async (message) => {
    try {
        const response = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

// similar request but no parameter to start game
export const startGame = async () => {
    const message = "I joined the game";
    try {
        const response = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

// fetch game stats
export const fetchStats = async () => {
    try {
        const response = await fetch(`${API_URL}/api/stats`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching stats:', error);
        throw error;
    }
}

// api call to get inventory items
export const getInventory = async () => {
    try {
        const response = await fetch(`${API_URL}/api/items`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching inventory:', error);
        throw error;
    }
}

// poll for new tool calls
export const getToolCalls = async (lastId = 0) => {
    try {
        const response = await fetch(`${API_URL}/api/tool-calls?lastId=${lastId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.toolCalls;
    } catch (error) {
        console.error('Error fetching tool calls:', error);
        throw error;
    }
}