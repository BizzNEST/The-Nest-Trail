// base backend url
const API_URL = 'http://localhost:5050'


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